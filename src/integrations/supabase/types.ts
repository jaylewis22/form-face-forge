export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      competitions: {
        Row: {
          competition_type: string | null
          country_code: string | null
          created_at: string
          id: number
          name: string
          short_name: string | null
          updated_at: string
        }
        Insert: {
          competition_type?: string | null
          country_code?: string | null
          created_at?: string
          id?: number
          name: string
          short_name?: string | null
          updated_at?: string
        }
        Update: {
          competition_type?: string | null
          country_code?: string | null
          created_at?: string
          id?: number
          name?: string
          short_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kits: {
        Row: {
          created_at: string
          id: number
          kit_type: string
          pattern: string | null
          primary_color: string | null
          secondary_color: string | null
          team_id: number | null
          third_color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          kit_type: string
          pattern?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          team_id?: number | null
          third_color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          kit_type?: string
          pattern?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          team_id?: number | null
          third_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kits_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          country_code: string | null
          created_at: string
          id: number
          level: number | null
          name: string
          short_name: string | null
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          id?: number
          level?: number | null
          name: string
          short_name?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          id?: number
          level?: number | null
          name?: string
          short_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          acceleration: number | null
          age: number | null
          aggression: number | null
          agility: number | null
          balance: number | null
          ball_control: number | null
          composure: number | null
          contract_end: string | null
          created_at: string
          crossing: number | null
          curve: number | null
          def_awareness: number | null
          defending: number | null
          dribbling: number | null
          finishing: number | null
          free_kick_accuracy: number | null
          gk_diving: number | null
          gk_handling: number | null
          gk_kicking: number | null
          gk_positioning: number | null
          gk_reflexes: number | null
          heading_accuracy: number | null
          height: number | null
          id: number
          interceptions: number | null
          jersey_number: number | null
          jumping: number | null
          long_passing: number | null
          long_shots: number | null
          name: string
          nationality: string | null
          nationality_code: string | null
          overall_rating: number | null
          pace: number | null
          passing: number | null
          penalties: number | null
          physical: number | null
          position: string | null
          positioning: number | null
          potential_rating: number | null
          preferred_foot: string | null
          reactions: number | null
          secondary_position: string | null
          shooting: number | null
          short_name: string | null
          short_passing: number | null
          shot_power: number | null
          skill_moves: number | null
          sliding_tackle: number | null
          sprint_speed: number | null
          stamina: number | null
          standing_tackle: number | null
          strength: number | null
          team_id: number | null
          updated_at: string
          vision: number | null
          volleys: number | null
          wage: number | null
          weak_foot: number | null
          weight: number | null
        }
        Insert: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ball_control?: number | null
          composure?: number | null
          contract_end?: string | null
          created_at?: string
          crossing?: number | null
          curve?: number | null
          def_awareness?: number | null
          defending?: number | null
          dribbling?: number | null
          finishing?: number | null
          free_kick_accuracy?: number | null
          gk_diving?: number | null
          gk_handling?: number | null
          gk_kicking?: number | null
          gk_positioning?: number | null
          gk_reflexes?: number | null
          heading_accuracy?: number | null
          height?: number | null
          id?: number
          interceptions?: number | null
          jersey_number?: number | null
          jumping?: number | null
          long_passing?: number | null
          long_shots?: number | null
          name: string
          nationality?: string | null
          nationality_code?: string | null
          overall_rating?: number | null
          pace?: number | null
          passing?: number | null
          penalties?: number | null
          physical?: number | null
          position?: string | null
          positioning?: number | null
          potential_rating?: number | null
          preferred_foot?: string | null
          reactions?: number | null
          secondary_position?: string | null
          shooting?: number | null
          short_name?: string | null
          short_passing?: number | null
          shot_power?: number | null
          skill_moves?: number | null
          sliding_tackle?: number | null
          sprint_speed?: number | null
          stamina?: number | null
          standing_tackle?: number | null
          strength?: number | null
          team_id?: number | null
          updated_at?: string
          vision?: number | null
          volleys?: number | null
          wage?: number | null
          weak_foot?: number | null
          weight?: number | null
        }
        Update: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ball_control?: number | null
          composure?: number | null
          contract_end?: string | null
          created_at?: string
          crossing?: number | null
          curve?: number | null
          def_awareness?: number | null
          defending?: number | null
          dribbling?: number | null
          finishing?: number | null
          free_kick_accuracy?: number | null
          gk_diving?: number | null
          gk_handling?: number | null
          gk_kicking?: number | null
          gk_positioning?: number | null
          gk_reflexes?: number | null
          heading_accuracy?: number | null
          height?: number | null
          id?: number
          interceptions?: number | null
          jersey_number?: number | null
          jumping?: number | null
          long_passing?: number | null
          long_shots?: number | null
          name?: string
          nationality?: string | null
          nationality_code?: string | null
          overall_rating?: number | null
          pace?: number | null
          passing?: number | null
          penalties?: number | null
          physical?: number | null
          position?: string | null
          positioning?: number | null
          potential_rating?: number | null
          preferred_foot?: string | null
          reactions?: number | null
          secondary_position?: string | null
          shooting?: number | null
          short_name?: string | null
          short_passing?: number | null
          shot_power?: number | null
          skill_moves?: number | null
          sliding_tackle?: number | null
          sprint_speed?: number | null
          stamina?: number | null
          standing_tackle?: number | null
          strength?: number | null
          team_id?: number | null
          updated_at?: string
          vision?: number | null
          volleys?: number | null
          wage?: number | null
          weak_foot?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          budget: number | null
          country_code: string | null
          created_at: string
          id: number
          league_id: number | null
          name: string
          overall_rating: number | null
          short_name: string | null
          stadium: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          country_code?: string | null
          created_at?: string
          id?: number
          league_id?: number | null
          name: string
          overall_rating?: number | null
          short_name?: string | null
          stadium?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          country_code?: string | null
          created_at?: string
          id?: number
          league_id?: number | null
          name?: string
          overall_rating?: number | null
          short_name?: string | null
          stadium?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
