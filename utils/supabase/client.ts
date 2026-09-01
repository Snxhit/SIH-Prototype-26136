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
          sandbox_template: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          department_name: string;
          description: string;
          target_metrics: string;
          budget_allocation: number;
          sandbox_template?: string;
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
          tranche_amount: number;
          environment: string;
          data_privacy: string;
          stop_loss: string;
          ip_retainment: string;
          audit_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id?: string | null;
          startup_id?: string | null;
          status?: "active" | "completed" | "scaled_up";
          current_milestone?: number;
          total_milestones?: number;
          tranche_amount?: number;
          environment?: string;
          data_privacy?: string;
          stop_loss?: string;
          ip_retainment?: string;
          audit_score?: number;
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
      templates: {
        Row: {
          id: string;
          template_key: string;
          doc_id: string;
          title: string;
          filename: string;
          hash: string;
          labels: string[];
          default_values: string[];
          body_template: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_key: string;
          doc_id: string;
          title: string;
          filename: string;
          hash: string;
          labels: string[];
          default_values: string[];
          body_template: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["templates"]["Insert"]>;
        Relationships: [];
      };
      evaluations: {
        Row: {
          id: string;
          pilot_id: string;
          technical_merit: number;
          kpi_accuracy: number;
          cybersecurity: number;
          scalability: number;
          dpiit_recognition: number;
          weighted_score: number;
          is_approved: boolean;
          evaluator_notes: string;
          evaluated_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pilot_id: string;
          technical_merit?: number;
          kpi_accuracy?: number;
          cybersecurity?: number;
          scalability?: number;
          dpiit_recognition?: number;
          weighted_score?: number;
          is_approved?: boolean;
          evaluator_notes?: string;
          evaluated_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["evaluations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "evaluations_pilot_id_fkey";
            columns: ["pilot_id"];
            referencedRelation: "pilots";
            referencedColumns: ["id"];
          }
        ];
      };
      escrow_transactions: {
        Row: {
          id: string;
          pilot_id: string | null;
          amount: number;
          tx_hash: string;
          status: "pending" | "disbursed" | "failed";
          disbursed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pilot_id?: string | null;
          amount: number;
          tx_hash: string;
          status?: "pending" | "disbursed" | "failed";
          disbursed_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["escrow_transactions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_pilot_id_fkey";
            columns: ["pilot_id"];
            referencedRelation: "pilots";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      advance_milestone: {
        Args: { pilot_id: string };
        Returns: undefined;
      };
      get_escrow_vault_balance: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
    };
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
