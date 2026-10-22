export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      activity: {
        Row: {
          created_at: string;
          id: number;
          kind: Database["public"]["Enums"]["activity_kind"];
          user_id: string | null;
        };
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
      rate_limits: {
        Row: {
          hits: number;
          key: string;
          window_start: string;
        };
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
          thought_id: string;
        };
        Insert: {
          me_too?: number;
          not_me?: number;
          thought_id: string;
        };
        Update: {
          me_too?: number;
          not_me?: number;
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
          created_at: string;
          me_too: boolean;
          thought_id: string;
          visitor_id: string;
        };
        Insert: {
          created_at?: string;
          me_too: boolean;
          thought_id: string;
          visitor_id: string;
        };
        Update: {
          created_at?: string;
          me_too?: boolean;
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
          id: string;
          reaction_counts: Json;
          reaction_total: number;
          report_count: number;
          status: Database["public"]["Enums"]["content_status"];
        };
        Insert: {
          author_id: string;
          body: string;
          category?: Database["public"]["Enums"]["thought_category"];
          comment_count?: number;
          created_at?: string;
          id?: string;
          reaction_counts?: Json;
          reaction_total?: number;
          report_count?: number;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Update: {
          author_id?: string;
          body?: string;
          category?: Database["public"]["Enums"]["thought_category"];
          comment_count?: number;
          created_at?: string;
          id?: string;
          reaction_counts?: Json;
          reaction_total?: number;
          report_count?: number;
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
      [_ in never]: never;
    };
    Functions: {
      activity_group: {
        Args: { p_kind: Database["public"]["Enums"]["activity_kind"] };
        Returns: string;
      };
      admin_live_stats: { Args: never; Returns: Json };
      admin_stats: { Args: { p_days: number; p_tz: string }; Returns: Json };
      cast_thought_vote: {
        Args: { p_me_too: boolean; p_thought: string; p_visitor: string };
        Returns: Database["public"]["CompositeTypes"]["thought_view"];
        SetofOptions: {
          from: "*";
          to: "thought_view";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      content_table: {
        Args: { p_kind: Database["public"]["Enums"]["content_kind"] };
        Returns: string;
      };
      get_my_thoughts: {
        Args: never;
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
      register_report: {
        Args: {
          p_id: string;
          p_kind: Database["public"]["Enums"]["content_kind"];
          p_threshold?: number;
        };
        Returns: number;
      };
      to_thought_view: {
        Args: {
          p_viewer: string;
          t: Database["public"]["Tables"]["thoughts"]["Row"];
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
        Args: {
          p_device: string;
          p_event: string;
          p_session: string;
          p_user: string;
        };
        Returns: undefined;
      };
      wilson_lower_bound: {
        Args: { p_pos: number; p_total: number };
        Returns: number;
      };
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
      thought_category:
        | "relationships"
        | "work"
        | "social"
        | "habits"
        | "feelings"
        | "body"
        | "other";
    };
    CompositeTypes: {
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
        my_vote: boolean | null;
        me_too: number | null;
        not_me: number | null;
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
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
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
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
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
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
      thought_category: ["relationships", "work", "social", "habits", "feelings", "body", "other"],
    },
  },
} as const;
