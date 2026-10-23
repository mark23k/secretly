export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      activity: {
        Row: {
          created_at: string;
          id: number;
          kind: Database["public"]["Enums"]["activity_kind"];
          user_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: never;
          kind: Database["public"]["Enums"]["activity_kind"];
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: never;
          kind?: Database["public"]["Enums"]["activity_kind"];
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_sessions: {
        Row: {
          active_seconds: number;
          device_id: string;
          id: string;
          last_seen_at: string;
          page_views: number;
          started_at: string;
          user_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          active_seconds?: number;
          device_id: string;
          id: string;
          last_seen_at?: string;
          page_views?: number;
          started_at?: string;
          user_id?: string | null;
        };
        Update: {
          active_seconds?: number;
          device_id?: string;
          id?: string;
          last_seen_at?: string;
          page_views?: number;
          started_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      answer_votes: {
        Row: {
          answer_id: string;
          created_at: string;
          visitor_id: string;
        };
        ComputedFields: never;
        Insert: {
          answer_id: string;
          created_at?: string;
          visitor_id: string;
        };
        Update: {
          answer_id?: string;
          created_at?: string;
          visitor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "answer_votes_answer_id_fkey";
            columns: ["answer_id"];
            isOneToOne: false;
            referencedRelation: "answers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answer_votes_visitor_id_fkey";
            columns: ["visitor_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      answers: {
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          helpful_count: number;
          id: string;
          question_id: string;
          report_count: number;
          seed_helpful: number;
          status: Database["public"]["Enums"]["content_status"];
        };
        ComputedFields: never;
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          helpful_count?: number;
          id?: string;
          question_id: string;
          report_count?: number;
          seed_helpful?: number;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          helpful_count?: number;
          id?: string;
          question_id?: string;
          report_count?: number;
          seed_helpful?: number;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Relationships: [
          {
            foreignKeyName: "answers_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      moderation_events: {
        Row: {
          actor: string;
          created_at: string;
          decision: string;
          id: number;
          reasons: string[];
          target_id: string;
          target_kind: Database["public"]["Enums"]["content_kind"];
          visitor_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          actor: string;
          created_at?: string;
          decision: string;
          id?: never;
          reasons?: string[];
          target_id: string;
          target_kind: Database["public"]["Enums"]["content_kind"];
          visitor_id?: string | null;
        };
        Update: {
          actor?: string;
          created_at?: string;
          decision?: string;
          id?: never;
          reasons?: string[];
          target_id?: string;
          target_kind?: Database["public"]["Enums"]["content_kind"];
          visitor_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "moderation_events_visitor_id_fkey";
            columns: ["visitor_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          answer_count: number;
          author_id: string;
          body: string;
          category: Database["public"]["Enums"]["question_category"];
          created_at: string;
          featured_rank: number | null;
          helped_answer_id: string | null;
          id: string;
          report_count: number;
          search: unknown;
          status: Database["public"]["Enums"]["content_status"];
          title: string;
        };
        ComputedFields: never;
        Insert: {
          answer_count?: number;
          author_id: string;
          body?: string;
          category?: Database["public"]["Enums"]["question_category"];
          created_at?: string;
          featured_rank?: number | null;
          helped_answer_id?: string | null;
          id?: string;
          report_count?: number;
          search?: never;
          status?: Database["public"]["Enums"]["content_status"];
          title: string;
        };
        Update: {
          answer_count?: number;
          author_id?: string;
          body?: string;
          category?: Database["public"]["Enums"]["question_category"];
          created_at?: string;
          featured_rank?: number | null;
          helped_answer_id?: string | null;
          id?: string;
          report_count?: number;
          search?: never;
          status?: Database["public"]["Enums"]["content_status"];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "questions_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "questions_helped_answer_fkey";
            columns: ["helped_answer_id"];
            isOneToOne: false;
            referencedRelation: "answers";
            referencedColumns: ["id"];
          },
        ];
      };
      rate_limits: {
        Row: {
          hits: number;
          key: string;
          window_start: string;
        };
        ComputedFields: never;
        Insert: {
          hits?: number;
          key: string;
          window_start: string;
        };
        Update: {
          hits?: number;
          key?: string;
          window_start?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          reason: string;
          reporter_id: string;
          resolved: boolean;
          target_id: string;
          target_kind: Database["public"]["Enums"]["content_kind"];
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          reason: string;
          reporter_id: string;
          resolved?: boolean;
          target_id: string;
          target_kind: Database["public"]["Enums"]["content_kind"];
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          reason?: string;
          reporter_id?: string;
          resolved?: boolean;
          target_id?: string;
          target_kind?: Database["public"]["Enums"]["content_kind"];
        };
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      secret_deliveries: {
        Row: {
          created_at: string;
          given_secret_id: string | null;
          id: string;
          recipient_id: string;
          secret_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          given_secret_id?: string | null;
          id?: string;
          recipient_id: string;
          secret_id: string;
        };
        Update: {
          created_at?: string;
          given_secret_id?: string | null;
          id?: string;
          recipient_id?: string;
          secret_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "secret_deliveries_given_secret_id_fkey";
            columns: ["given_secret_id"];
            isOneToOne: true;
            referencedRelation: "secrets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "secret_deliveries_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "secret_deliveries_secret_id_fkey";
            columns: ["secret_id"];
            isOneToOne: false;
            referencedRelation: "secrets";
            referencedColumns: ["id"];
          },
        ];
      };
      secret_replies: {
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          delivery_id: string;
          id: string;
          read_at: string | null;
          report_count: number;
          secret_id: string;
          status: Database["public"]["Enums"]["content_status"];
        };
        ComputedFields: never;
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          delivery_id: string;
          id?: string;
          read_at?: string | null;
          report_count?: number;
          secret_id: string;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          delivery_id?: string;
          id?: string;
          read_at?: string | null;
          report_count?: number;
          secret_id?: string;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Relationships: [
          {
            foreignKeyName: "secret_replies_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "secret_replies_delivery_id_fkey";
            columns: ["delivery_id"];
            isOneToOne: true;
            referencedRelation: "secret_deliveries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "secret_replies_secret_id_fkey";
            columns: ["secret_id"];
            isOneToOne: false;
            referencedRelation: "secrets";
            referencedColumns: ["id"];
          },
        ];
      };
      secrets: {
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          id: string;
          local_day: string;
          report_count: number;
          status: Database["public"]["Enums"]["content_status"];
          times_delivered: number;
        };
        ComputedFields: never;
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          id?: string;
          local_day: string;
          report_count?: number;
          status?: Database["public"]["Enums"]["content_status"];
          times_delivered?: number;
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          id?: string;
          local_day?: string;
          report_count?: number;
          status?: Database["public"]["Enums"]["content_status"];
          times_delivered?: number;
        };
        Relationships: [
          {
            foreignKeyName: "secrets_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      thought_comments: {
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          id: string;
          report_count: number;
          status: Database["public"]["Enums"]["content_status"];
          thought_id: string;
        };
        ComputedFields: never;
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          id?: string;
          report_count?: number;
          status?: Database["public"]["Enums"]["content_status"];
          thought_id: string;
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          id?: string;
          report_count?: number;
          status?: Database["public"]["Enums"]["content_status"];
          thought_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thought_comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thought_comments_thought_id_fkey";
            columns: ["thought_id"];
            isOneToOne: false;
            referencedRelation: "thoughts";
            referencedColumns: ["id"];
          },
        ];
      };
      thought_reactions: {
        Row: {
          created_at: string;
          reaction: string;
          thought_id: string;
          visitor_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          reaction: string;
          thought_id: string;
          visitor_id: string;
        };
        Update: {
          created_at?: string;
          reaction?: string;
          thought_id?: string;
          visitor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thought_reactions_thought_id_fkey";
            columns: ["thought_id"];
            isOneToOne: false;
            referencedRelation: "thoughts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thought_reactions_visitor_id_fkey";
            columns: ["visitor_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      thought_tallies: {
        Row: {
          me_too: number;
          not_me: number;
          opt3: number;
          opt4: number;
          thought_id: string;
        };
        ComputedFields: never;
        Insert: {
          me_too?: number;
          not_me?: number;
          opt3?: number;
          opt4?: number;
          thought_id: string;
        };
        Update: {
          me_too?: number;
          not_me?: number;
          opt3?: number;
          opt4?: number;
          thought_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thought_tallies_thought_id_fkey";
            columns: ["thought_id"];
            isOneToOne: true;
            referencedRelation: "thoughts";
            referencedColumns: ["id"];
          },
        ];
      };
      thought_votes: {
        Row: {
          choice: number;
          created_at: string;
          thought_id: string;
          visitor_id: string;
        };
        ComputedFields: never;
        Insert: {
          choice: number;
          created_at?: string;
          thought_id: string;
          visitor_id: string;
        };
        Update: {
          choice?: number;
          created_at?: string;
          thought_id?: string;
          visitor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thought_votes_thought_id_fkey";
            columns: ["thought_id"];
            isOneToOne: false;
            referencedRelation: "thoughts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thought_votes_visitor_id_fkey";
            columns: ["visitor_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      thoughts: {
        Row: {
          author_id: string;
          body: string;
          category: Database["public"]["Enums"]["thought_category"];
          comment_count: number;
          created_at: string;
          featured_rank: number | null;
          id: string;
          options: string[] | null;
          reaction_counts: NonNullable<Json>;
          reaction_total: number;
          report_count: number;
          seed_reactions: NonNullable<Json>;
          status: Database["public"]["Enums"]["content_status"];
          thought_options: string[] | null;
        };
        ComputedFields: "thought_options";
        Insert: {
          author_id: string;
          body: string;
          category?: Database["public"]["Enums"]["thought_category"];
          comment_count?: number;
          created_at?: string;
          featured_rank?: number | null;
          id?: string;
          options?: string[] | null;
          reaction_counts?: NonNullable<Json>;
          reaction_total?: number;
          report_count?: number;
          seed_reactions?: NonNullable<Json>;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Update: {
          author_id?: string;
          body?: string;
          category?: Database["public"]["Enums"]["thought_category"];
          comment_count?: number;
          created_at?: string;
          featured_rank?: number | null;
          id?: string;
          options?: string[] | null;
          reaction_counts?: NonNullable<Json>;
          reaction_total?: number;
          report_count?: number;
          seed_reactions?: NonNullable<Json>;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Relationships: [
          {
            foreignKeyName: "thoughts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "visitors";
            referencedColumns: ["id"];
          },
        ];
      };
      visitors: {
        Row: {
          ban_reason: string | null;
          banned: boolean;
          banned_at: string | null;
          created_at: string;
          id: string;
          ip_hash: string | null;
          time_zone: string;
        };
        ComputedFields: never;
        Insert: {
          ban_reason?: string | null;
          banned?: boolean;
          banned_at?: string | null;
          created_at?: string;
          id: string;
          ip_hash?: string | null;
          time_zone?: string;
        };
        Update: {
          ban_reason?: string | null;
          banned?: boolean;
          banned_at?: string | null;
          created_at?: string;
          id?: string;
          ip_hash?: string | null;
          time_zone?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      moderation_content: {
        Row: {
          author_id: string | null;
          context: string | null;
          created_at: string | null;
          id: string | null;
          kind: Database["public"]["Enums"]["content_kind"] | null;
          report_count: number | null;
          status: Database["public"]["Enums"]["content_status"] | null;
          text: string | null;
        };
        ComputedFields: never;
        Relationships: [];
      };
    };
    Functions: {
      activity_group: {
        Args: { p_kind: Database["public"]["Enums"]["activity_kind"] };
        Returns: string;
      };
      admin_ban_author: {
        Args: {
          p_admin: string;
          p_id: string;
          p_kind: Database["public"]["Enums"]["content_kind"];
          p_reason: string;
        };
        Returns: undefined;
      };
      admin_live_stats: { Args: Record<PropertyKey, never>; Returns: Json };
      admin_moderate: {
        Args: {
          p_action: string;
          p_admin: string;
          p_id: string;
          p_kind: Database["public"]["Enums"]["content_kind"];
        };
        Returns: undefined;
      };
      admin_moderation_queue: { Args: { p_limit?: number }; Returns: Json };
      admin_stats: { Args: { p_days: number; p_tz: string }; Returns: Json };
      admin_unban: { Args: { p_visitor: string }; Returns: undefined };
      author_code: { Args: { p_id: string }; Returns: string };
      cast_thought_vote: {
        Args: { p_choice: number; p_thought: string; p_visitor: string };
        Returns: Database["public"]["CompositeTypes"]["thought_view"];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      check_secret_reply: { Args: { p_delivery: string; p_visitor: string }; Returns: string };
      content_table: {
        Args: { p_kind: Database["public"]["Enums"]["content_kind"] };
        Returns: string;
      };
      deliver_secret: { Args: { p_given: string; p_visitor: string }; Returns: string };
      exchange_secret: {
        Args: {
          p_body: string;
          p_daily_limit: number;
          p_status: Database["public"]["Enums"]["content_status"];
          p_visitor: string;
        };
        Returns: Json;
      };
      get_answers: {
        Args: { p_question: string };
        Returns: Database["public"]["CompositeTypes"]["answer_view"][];
        SetofOptions: {
          from: "*";
          to: "answer_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_exchange_state: { Args: { p_daily_limit: number; p_visitor: string }; Returns: Json };
      get_featured_thoughts: {
        Args: { p_limit?: number };
        Returns: Database["public"]["CompositeTypes"]["thought_view"][];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_home_teasers: {
        Args: Record<PropertyKey, never>;
        Returns: {
          body: string;
          id: string;
          kind: string;
        }[];
      };
      get_my_questions: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["CompositeTypes"]["question_view"][];
        SetofOptions: {
          from: "*";
          to: "question_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_my_secrets: { Args: { p_visitor: string }; Returns: Json };
      get_my_thoughts: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["CompositeTypes"]["thought_view"][];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_next_thoughts: {
        Args: {
          p_category?: Database["public"]["Enums"]["thought_category"];
          p_exclude?: string[];
          p_limit?: number;
        };
        Returns: Database["public"]["CompositeTypes"]["thought_view"][];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_question: {
        Args: { p_id: string };
        Returns: Database["public"]["CompositeTypes"]["question_view"][];
        SetofOptions: {
          from: "*";
          to: "question_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_question_feed: {
        Args: {
          p_category?: Database["public"]["Enums"]["question_category"];
          p_limit?: number;
          p_offset?: number;
          p_query?: string;
          p_sort?: string;
        };
        Returns: Database["public"]["CompositeTypes"]["question_view"][];
        SetofOptions: {
          from: "*";
          to: "question_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_received_secrets: { Args: { p_visitor: string }; Returns: Json };
      get_thought: {
        Args: { p_id: string };
        Returns: Database["public"]["CompositeTypes"]["thought_view"][];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_thought_feed: {
        Args: {
          p_category?: Database["public"]["Enums"]["thought_category"];
          p_limit?: number;
          p_offset?: number;
          p_sort?: string;
        };
        Returns: Database["public"]["CompositeTypes"]["thought_view"][];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      hit_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number };
        Returns: boolean;
      };
      loose_tsquery: { Args: { p_text: string }; Returns: unknown };
      peek_thought: {
        Args: { p_id: string };
        Returns: Database["public"]["CompositeTypes"]["thought_view"];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      question_relevance: {
        Args: {
          p_text: string;
          q: Omit<
            Database["public"]["Tables"]["questions"]["Row"],
            Database["public"]["Tables"]["questions"]["ComputedFields"]
          >;
        };
        Returns: number;
      };
      register_report: {
        Args: {
          p_id: string;
          p_kind: Database["public"]["Enums"]["content_kind"];
          p_threshold?: number;
        };
        Returns: number;
      };
      search_similar_questions: {
        Args: { p_limit?: number; p_text: string };
        Returns: {
          answer_count: number;
          helped: boolean;
          id: string;
          score: number;
          title: string;
        }[];
      };
      settle_owed_secrets: { Args: { p_visitor: string }; Returns: undefined };
      thought_options: {
        Args: {
          t: Omit<
            Database["public"]["Tables"]["thoughts"]["Row"],
            Database["public"]["Tables"]["thoughts"]["ComputedFields"]
          >;
        };
        Returns: string[];
      };
      to_question_view: {
        Args: {
          p_viewer: string;
          q: Omit<
            Database["public"]["Tables"]["questions"]["Row"],
            Database["public"]["Tables"]["questions"]["ComputedFields"]
          >;
        };
        Returns: Database["public"]["CompositeTypes"]["question_view"];
        SetofOptions: {
          from: "*";
          to: "question_view";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      to_thought_view: {
        Args: {
          p_viewer: string;
          t: Omit<
            Database["public"]["Tables"]["thoughts"]["Row"],
            Database["public"]["Tables"]["thoughts"]["ComputedFields"]
          >;
        };
        Returns: Database["public"]["CompositeTypes"]["thought_view"];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      track_visit: {
        Args: { p_device: string; p_event: string; p_session: string; p_user: string };
        Returns: undefined;
      };
      valid_thought_options: { Args: { p: string[] }; Returns: boolean };
      wilson_lower_bound: { Args: { p_pos: number; p_total: number }; Returns: number };
    };
    Enums: {
      activity_kind:
        | "thought"
        | "thought_comment"
        | "thought_vote"
        | "thought_reaction"
        | "question"
        | "answer"
        | "answer_vote"
        | "secret"
        | "secret_reply";
      content_kind:
        | "thought"
        | "thought_comment"
        | "question"
        | "answer"
        | "secret"
        | "secret_reply";
      content_status: "pending" | "published" | "hidden" | "removed";
      question_category:
        | "relationships"
        | "money"
        | "body"
        | "social"
        | "behavior"
        | "religion"
        | "work"
        | "family"
        | "other"
        | "after_dark";
      thought_category:
        | "relationships"
        | "work"
        | "social"
        | "habits"
        | "feelings"
        | "body"
        | "other"
        | "after_dark";
    };
    CompositeTypes: {
      answer_view: {
        id: string | null;
        body: string | null;
        created_at: string | null;
        helpful_count: number | null;
        voted: boolean | null;
        is_mine: boolean | null;
        helped_asker: boolean | null;
      };
      question_view: {
        id: string | null;
        title: string | null;
        body: string | null;
        category: Database["public"]["Enums"]["question_category"] | null;
        status: Database["public"]["Enums"]["content_status"] | null;
        created_at: string | null;
        answer_count: number | null;
        helped_answer_id: string | null;
        is_mine: boolean | null;
      };
      thought_view: {
        id: string | null;
        body: string | null;
        category: Database["public"]["Enums"]["thought_category"] | null;
        status: Database["public"]["Enums"]["content_status"] | null;
        created_at: string | null;
        comment_count: number | null;
        reaction_counts: Json | null;
        my_reactions: string[] | null;
        is_mine: boolean | null;
        options: string[] | null;
        my_choice: number | null;
        counts: number[] | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      activity_kind: [
        "thought",
        "thought_comment",
        "thought_vote",
        "thought_reaction",
        "question",
        "answer",
        "answer_vote",
        "secret",
        "secret_reply",
      ],
      content_kind: ["thought", "thought_comment", "question", "answer", "secret", "secret_reply"],
      content_status: ["pending", "published", "hidden", "removed"],
      question_category: [
        "relationships",
        "money",
        "body",
        "social",
        "behavior",
        "religion",
        "work",
        "family",
        "other",
        "after_dark",
      ],
      thought_category: [
        "relationships",
        "work",
        "social",
        "habits",
        "feelings",
        "body",
        "other",
        "after_dark",
      ],
    },
  },
} as const;
