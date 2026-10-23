-- =============================================================================
-- Moderation tools for the manager dashboard (service role only).
--
-- The queue holds anything held by the automatic checks (pending), hidden by
-- reports, or published with open reports. Managers approve, remove, or ban
-- the author. Authors are shown as a short code, never an email.
-- =============================================================================

-- Every piece of content in one shape: kind, id, author, text, context, status.
create or replace view public.moderation_content as
  select 'thought'::content_kind as kind, t.id, t.author_id, t.body as text,
         null::text as context, t.status, t.report_count, t.created_at
  from thoughts t
  union all
  select 'thought_comment', c.id, c.author_id, c.body,
         'On the thought: ' || th.body, c.status, c.report_count, c.created_at
  from thought_comments c join thoughts th on th.id = c.thought_id
  union all
  select 'question', q.id, q.author_id,
         q.title || case when q.body <> '' then E'\n\n' || q.body else '' end,
         null, q.status, q.report_count, q.created_at
  from questions q
  union all
  select 'answer', a.id, a.author_id, a.body,
         'On the question: ' || q.title, a.status, a.report_count, a.created_at
  from answers a join questions q on q.id = a.question_id
  union all
  select 'secret', s.id, s.author_id, s.body, null, s.status, s.report_count, s.created_at
  from secrets s
  union all
  select 'secret_reply', r.id, r.author_id, r.body,
         'Reply to the secret: ' || s.body, r.status, r.report_count, r.created_at
  from secret_replies r join secrets s on s.id = r.secret_id;

revoke all on public.moderation_content from anon, authenticated;

-- Short, stable, non-reversible label for an account ("#3fa9c1").
create or replace function public.author_code(p_id uuid)
returns text language sql immutable as $$
  select '#' || left(md5(p_id::text), 6);
$$;

create or replace function public.admin_moderation_queue(p_limit integer default 100)
returns jsonb
language sql stable security definer set search_path = public as $$
  with open_reports as (
    select target_kind, target_id, count(*) as n,
           array_agg(distinct reason) as reasons,
           array_remove(array_agg(details), null) as details
    from reports where not resolved
    group by target_kind, target_id
  ),
  auto as (
    select distinct on (target_kind, target_id) target_kind, target_id, reasons
    from moderation_events where actor = 'auto'
    order by target_kind, target_id, created_at desc
  ),
  items as (
    select m.*, r.n as open_reports, r.reasons as report_reasons, r.details as report_details,
           a.reasons as auto_reasons, v.banned as author_banned
    from moderation_content m
    left join open_reports r on r.target_kind = m.kind and r.target_id = m.id
    left join auto a on a.target_kind = m.kind and a.target_id = m.id
    join visitors v on v.id = m.author_id
    where m.status in ('pending', 'hidden') or (m.status = 'published' and r.n is not null)
  )
  select jsonb_build_object(
    'counts', jsonb_build_object(
      'pending', (select count(*) from items where status = 'pending'),
      'hidden',  (select count(*) from items where status = 'hidden'),
      'reported', (select count(*) from items where status = 'published')
    ),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
               'kind', kind, 'id', id, 'text', text, 'context', context, 'status', status,
               'createdAt', created_at, 'openReports', coalesce(open_reports, 0),
               'reportReasons', coalesce(report_reasons, '{}'),
               'reportDetails', coalesce(report_details, '{}'),
               'autoReasons', coalesce(auto_reasons, '{}'),
               'author', author_code(author_id), 'authorBanned', author_banned
             ) order by case status when 'hidden' then 0 when 'pending' then 1 else 2 end, created_at)
      from (select * from items
            order by case status when 'hidden' then 0 when 'pending' then 1 else 2 end, created_at
            limit least(greatest(p_limit, 1), 200)) i
    ), '[]'::jsonb),
    'banned', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', id, 'author', author_code(id), 'bannedAt', banned_at, 'reason', ban_reason
             ) order by banned_at desc)
      from visitors where banned
    ), '[]'::jsonb)
  );
$$;

-- p_action: 'approve' (publish, clear reports) or 'remove'.
create or replace function public.admin_moderate(
  p_kind public.content_kind,
  p_id uuid,
  p_action text,
  p_admin text
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_author uuid;
  v_updated integer;
begin
  if p_action not in ('approve', 'remove') then
    raise exception 'unknown action %', p_action using errcode = '22023';
  end if;

  execute format(
    'update public.%I set status = $1, report_count = case when $2 = ''approve'' then 0 else report_count end
      where id = $3 returning author_id',
    content_table(p_kind)
  ) into v_author
  using (case p_action when 'approve' then 'published' else 'removed' end)::content_status, p_action, p_id;

  get diagnostics v_updated = row_count;
  if v_updated = 0 then
    raise exception 'content not found' using errcode = 'P0002';
  end if;

  update reports set resolved = true where target_kind = p_kind and target_id = p_id and not resolved;
  insert into moderation_events (target_kind, target_id, visitor_id, actor, decision, reasons)
  values (p_kind, p_id, v_author, 'admin', p_action, array['by:' || p_admin]);
end;
$$;

-- Bans the author of a piece of content and removes everything they posted.
create or replace function public.admin_ban_author(
  p_kind public.content_kind,
  p_id uuid,
  p_reason text,
  p_admin text
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_author uuid;
  v_kind content_kind;
begin
  execute format('select author_id from public.%I where id = $1', content_table(p_kind))
    into v_author using p_id;
  if v_author is null then
    raise exception 'content not found' using errcode = 'P0002';
  end if;

  update visitors set banned = true, banned_at = now(), ban_reason = left(p_reason, 300)
  where id = v_author;

  foreach v_kind in array enum_range(null::content_kind) loop
    execute format('update public.%I set status = ''removed'' where author_id = $1 and status <> ''removed''',
                   content_table(v_kind))
    using v_author;
  end loop;

  update reports r set resolved = true
  from moderation_content m
  where m.author_id = v_author and r.target_kind = m.kind and r.target_id = m.id and not r.resolved;

  insert into moderation_events (target_kind, target_id, visitor_id, actor, decision, reasons)
  values (p_kind, p_id, v_author, 'admin', 'ban', array['by:' || p_admin, left(p_reason, 300)]);
end;
$$;

-- Lifts a ban. Their removed posts stay removed.
create or replace function public.admin_unban(p_visitor uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  update visitors set banned = false, banned_at = null, ban_reason = null where id = p_visitor;
  if not found then
    raise exception 'account not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.admin_moderation_queue(integer) from public, anon, authenticated;
revoke all on function public.admin_moderate(public.content_kind, uuid, text, text) from public, anon, authenticated;
revoke all on function public.admin_ban_author(public.content_kind, uuid, text, text) from public, anon, authenticated;
revoke all on function public.admin_unban(uuid) from public, anon, authenticated;
grant execute on function public.admin_moderation_queue(integer) to service_role;
grant execute on function public.admin_moderate(public.content_kind, uuid, text, text) to service_role;
grant execute on function public.admin_ban_author(public.content_kind, uuid, text, text) to service_role;
grant execute on function public.admin_unban(uuid) to service_role;
