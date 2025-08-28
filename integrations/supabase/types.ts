export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_tools: {
        Row: {
          created_at: string
          id: string
          name: string
          prompt_template: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          prompt_template: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          prompt_template?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          alert_type: string
          condition: string
          created_at: string
          id: string
          is_active: boolean
          message: string | null
          portfolio_id: string | null
          threshold: number | null
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          condition?: string
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string | null
          portfolio_id?: string | null
          threshold?: number | null
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          condition?: string
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string | null
          portfolio_id?: string | null
          threshold?: number | null
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          created_at: string
          email: string
          id: number
          status: string
          updated_at: string
          wallet: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          status?: string
          updated_at?: string
          wallet: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          status?: string
          updated_at?: string
          wallet?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          cid: string
          id: string
          signed_status: number | null
          viewkey: string
        }
        Insert: {
          cid: string
          id?: string
          signed_status?: number | null
          viewkey: string
        }
        Update: {
          cid?: string
          id?: string
          signed_status?: number | null
          viewkey?: string
        }
        Relationships: []
      }
      game_trackit: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          move_wallet: string
          nft_metadata: Json | null
          score: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          move_wallet: string
          nft_metadata?: Json | null
          score?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          move_wallet?: string
          nft_metadata?: Json | null
          score?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_sessions: {
        Row: {
          created_at: string
          id: string
          link: string | null
          mentor_id: string
          mode: string
          scheduled_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          mentor_id: string
          mode: string
          scheduled_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          mentor_id?: string
          mode?: string
          scheduled_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      nft_mints: {
        Row: {
          id: string
          mint_transaction: string
          minted_at: string | null
          nft_id: string
          user_id: string | null
        }
        Insert: {
          id?: string
          mint_transaction: string
          minted_at?: string | null
          nft_id: string
          user_id?: string | null
        }
        Update: {
          id?: string
          mint_transaction?: string
          minted_at?: string | null
          nft_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_mints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          allocations: Json
          created_at: string
          deployed_txs: Json | null
          id: string
          name: string
          risk_score: number
          status: string
          template_type: string
          total_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allocations?: Json
          created_at?: string
          deployed_txs?: Json | null
          id?: string
          name: string
          risk_score?: number
          status?: string
          template_type?: string
          total_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allocations?: Json
          created_at?: string
          deployed_txs?: Json | null
          id?: string
          name?: string
          risk_score?: number
          status?: string
          template_type?: string
          total_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prediction_markets: {
        Row: {
          asset_name: string
          contract_address: string | null
          creation_timestamp: string
          creator_address: string | null
          description: string | null
          expiry_timestamp: string
          id: string
          no_pool: number
          on_chain_id: string | null
          settled_price: number | null
          status: string
          strike_price: number
          yes_pool: number
        }
        Insert: {
          asset_name: string
          contract_address?: string | null
          creation_timestamp?: string
          creator_address?: string | null
          description?: string | null
          expiry_timestamp: string
          id?: string
          no_pool?: number
          on_chain_id?: string | null
          settled_price?: number | null
          status?: string
          strike_price: number
          yes_pool?: number
        }
        Update: {
          asset_name?: string
          contract_address?: string | null
          creation_timestamp?: string
          creator_address?: string | null
          description?: string | null
          expiry_timestamp?: string
          id?: string
          no_pool?: number
          on_chain_id?: string | null
          settled_price?: number | null
          status?: string
          strike_price?: number
          yes_pool?: number
        }
        Relationships: []
      }
      price_feeds: {
        Row: {
          asset_name: string
          id: string
          price: number
          timestamp: string
        }
        Insert: {
          asset_name: string
          id?: string
          price: number
          timestamp?: string
        }
        Update: {
          asset_name?: string
          id?: string
          price?: number
          timestamp?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          goal: string | null
          name: string
          stage: number
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          goal?: string | null
          name: string
          stage?: number
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          goal?: string | null
          name?: string
          stage?: number
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      protocols: {
        Row: {
          apy_current: number | null
          chain: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          name: string
          protocol_type: string
          risk_rating: number | null
          tvl: number | null
          updated_at: string
        }
        Insert: {
          apy_current?: number | null
          chain: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name: string
          protocol_type: string
          risk_rating?: number | null
          tvl?: number | null
          updated_at?: string
        }
        Update: {
          apy_current?: number | null
          chain?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name?: string
          protocol_type?: string
          risk_rating?: number | null
          tvl?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      quests: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          requirements: string
          stage: number
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          requirements: string
          stage: number
          title: string
          xp_reward: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          requirements?: string
          stage?: number
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "quests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          data: Json
          generated_at: string
          id: string
          report_type: string
          user_id: string
        }
        Insert: {
          data?: Json
          generated_at?: string
          id?: string
          report_type?: string
          user_id: string
        }
        Update: {
          data?: Json
          generated_at?: string
          id?: string
          report_type?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_profiles: {
        Row: {
          assessment_data: Json | null
          created_at: string
          experience_level: string
          id: string
          investment_timeline: string
          jurisdiction: string | null
          kyc_status: string
          risk_tolerance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_data?: Json | null
          created_at?: string
          experience_level?: string
          id?: string
          investment_timeline?: string
          jurisdiction?: string | null
          kyc_status?: string
          risk_tolerance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_data?: Json | null
          created_at?: string
          experience_level?: string
          id?: string
          investment_timeline?: string
          jurisdiction?: string | null
          kyc_status?: string
          risk_tolerance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          summary: string
          title: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary: string
          title: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      stakers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          lp_amount: number | null
          tier: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          lp_amount?: number | null
          tier?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          lp_amount?: number | null
          tier?: string | null
        }
        Relationships: []
      }
      user_positions: {
        Row: {
          amount: number
          claimed: boolean
          id: string
          market_id: string
          position_type: string
          timestamp: string
          user_wallet_address: string
        }
        Insert: {
          amount: number
          claimed?: boolean
          id?: string
          market_id: string
          position_type: string
          timestamp?: string
          user_wallet_address: string
        }
        Update: {
          amount?: number
          claimed?: boolean
          id?: string
          market_id?: string
          position_type?: string
          timestamp?: string
          user_wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_positions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "prediction_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quests: {
        Row: {
          id: string
          proof_url: string | null
          quest_id: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          id?: string
          proof_url?: string | null
          quest_id: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          id?: string
          proof_url?: string | null
          quest_id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quests_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trackit: {
        Row: {
          created_at: string | null
          email: string
          id: string
          move_wallet: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          move_wallet: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          move_wallet?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          market_id: string | null
          position_type: string | null
          status: string
          tx_hash: string
          tx_type: string
          user_wallet_address: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          market_id?: string | null
          position_type?: string | null
          status?: string
          tx_hash: string
          tx_type: string
          user_wallet_address: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          market_id?: string | null
          position_type?: string | null
          status?: string
          tx_hash?: string
          tx_type?: string
          user_wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_transactions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "prediction_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          role?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_latest_price: {
        Args: { asset: string }
        Returns: number
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_site_pages: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          url: string
          chunk_number: number
          title: string
          summary: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
