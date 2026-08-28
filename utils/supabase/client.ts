import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Strict schema mirroring the AGENTS.md relational blueprint.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          organization_name: string;
          role: "department" | "startup" | "evaluator";
          created_at: string;
        };
        Insert: {
          id: string;
          organization_name: string;
          role: "department" | "startup" | "evaluator";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          department_name: string;
          description: string;
          target_metrics: string;
          budget_allocation: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          department_name: string;
          description: string;
          target_metrics: string;
          budget_allocation: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["challenges"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "pilots_challenge_id_fkey";
            columns: ["id"];
            referencedRelation: "pilots";
            referencedColumns: ["challenge_id"];
          }
        ];
      };
      pilots: {
        Row: {
          id: string;
          challenge_id: string | null;
          startup_id: string | null;
          status: "active" | "completed" | "scaled_up";
          current_milestone: number;
          total_milestones: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id?: string | null;
          startup_id?: string | null;
          status?: "active" | "completed" | "scaled_up";
          current_milestone?: number;
          total_milestones?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pilots"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "pilots_challenge_id_fkey";
            columns: ["challenge_id"];
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pilots_startup_id_fkey";
            columns: ["startup_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Lazily-created browser client. Calling this inside components/hooks (not at
// module scope) ensures env vars are available when the client initialises.
let _client: SupabaseClient<Database> | null = null;

export function createSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase client env: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set."
    );
  }

  if (!_client) {
    _client = createClient<Database>(url, key);
  }
  return _client;
}
