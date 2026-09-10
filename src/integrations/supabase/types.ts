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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string
          guests: number
          hotel_id: string | null
          hotel_location: string
          hotel_name: string
          id: string
          nights: number
          notes: string
          reference: string
          room_name: string
          rooms: number
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          guests?: number
          hotel_id?: string | null
          hotel_location?: string
          hotel_name?: string
          id?: string
          nights?: number
          notes?: string
          reference: string
          room_name?: string
          rooms?: number
          status?: string
          total?: number
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          guests?: number
          hotel_id?: string | null
          hotel_location?: string
          hotel_name?: string
          id?: string
          nights?: number
          notes?: string
          reference?: string
          room_name?: string
          rooms?: number
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_info: {
        Row: {
          address: string
          description: string
          email: string
          hours: string
          id: string
          image: string | null
          intro: string
          map_embed_url: string
          office: string
          page_title: string
          phone: string
          show_map: boolean
          socials: Json
          updated_at: string
        }
        Insert: {
          address?: string
          description?: string
          email?: string
          hours?: string
          id?: string
          image?: string | null
          intro?: string
          map_embed_url?: string
          office?: string
          page_title?: string
          phone?: string
          show_map?: boolean
          socials?: Json
          updated_at?: string
        }
        Update: {
          address?: string
          description?: string
          email?: string
          hours?: string
          id?: string
          image?: string | null
          intro?: string
          map_embed_url?: string
          office?: string
          page_title?: string
          phone?: string
          show_map?: boolean
          socials?: Json
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          blurb: string
          country: string
          created_at: string
          id: string
          image: string | null
          name: string
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          blurb?: string
          country?: string
          created_at?: string
          id?: string
          image?: string | null
          name: string
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          blurb?: string
          country?: string
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          amenities: string[]
          breakfast: boolean
          cancellation: string
          check_in: string
          check_out: string
          city: string
          created_at: string
          description: string
          destination: string
          facilities: string[]
          featured: boolean
          gallery: string[]
          id: string
          location: string
          main_image: string | null
          name: string
          parking: boolean
          price_deluxe: number
          price_normal: number
          price_suite: number
          published: boolean
          rating: number
          reviews: number
          short_description: string
          stars: number
          tags: string[]
          updated_at: string
          view_label: string
        }
        Insert: {
          amenities?: string[]
          breakfast?: boolean
          cancellation?: string
          check_in?: string
          check_out?: string
          city?: string
          created_at?: string
          description?: string
          destination?: string
          facilities?: string[]
          featured?: boolean
          gallery?: string[]
          id?: string
          location?: string
          main_image?: string | null
          name: string
          parking?: boolean
          price_deluxe?: number
          price_normal?: number
          price_suite?: number
          published?: boolean
          rating?: number
          reviews?: number
          short_description?: string
          stars?: number
          tags?: string[]
          updated_at?: string
          view_label?: string
        }
        Update: {
          amenities?: string[]
          breakfast?: boolean
          cancellation?: string
          check_in?: string
          check_out?: string
          city?: string
          created_at?: string
          description?: string
          destination?: string
          facilities?: string[]
          featured?: boolean
          gallery?: string[]
          id?: string
          location?: string
          main_image?: string | null
          name?: string
          parking?: boolean
          price_deluxe?: number
          price_normal?: number
          price_suite?: number
          published?: boolean
          rating?: number
          reviews?: number
          short_description?: string
          stars?: number
          tags?: string[]
          updated_at?: string
          view_label?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          active: boolean
          created_at: string
          description: string
          discount: string
          ends_on: string | null
          id: string
          image: string | null
          price_from: number | null
          sort_order: number
          starts_on: string | null
          tag: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          discount?: string
          ends_on?: string | null
          id?: string
          image?: string | null
          price_from?: number | null
          sort_order?: number
          starts_on?: string | null
          tag?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          discount?: string
          ends_on?: string | null
          id?: string
          image?: string | null
          price_from?: number | null
          sort_order?: number
          starts_on?: string | null
          tag?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          body: string
          id: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          id: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          id?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          bed: string
          category: string
          created_at: string
          description: string
          facilities: string[]
          hotel_id: string
          id: string
          image: string | null
          max_guests: number
          name: string
          price: number
          published: boolean
          size: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bed?: string
          category?: string
          created_at?: string
          description?: string
          facilities?: string[]
          hotel_id: string
          id?: string
          image?: string | null
          max_guests?: number
          name?: string
          price?: number
          published?: boolean
          size?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bed?: string
          category?: string
          created_at?: string
          description?: string
          facilities?: string[]
          hotel_id?: string
          id?: string
          image?: string | null
          max_guests?: number
          name?: string
          price?: number
          published?: boolean
          size?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data?: Json
          id: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          description: string
          id: string
          name: string
          photo_url: string | null
          published: boolean
          sort_order: number
          storage_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          description?: string
          id: string
          name: string
          photo_url?: string | null
          published?: boolean
          sort_order?: number
          storage_path?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
          photo_url?: string | null
          published?: boolean
          sort_order?: number
          storage_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
