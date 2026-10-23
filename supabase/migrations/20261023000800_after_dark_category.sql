-- After Dark: an opt-in, 18+ category for dating, sex and relationship
-- questions and thoughts (suggestive, never explicit). Added on its own because
-- new enum values can't be used in the same transaction that adds them.
alter type public.thought_category add value if not exists 'after_dark';
alter type public.question_category add value if not exists 'after_dark';
