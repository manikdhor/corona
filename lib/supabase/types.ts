export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: string;
          display_name: string;
          description: string | null;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_name: string;
          description?: string | null;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          display_name?: string;
          description?: string | null;
          is_system?: boolean;
          updated_at?: string;
        };
      };
      permissions: {
        Row: {
          id: string;
          module: string;
          action: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          module: string;
          action: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          module?: string;
          action?: string;
          description?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          role_id: string;
          avatar_url: string | null;
          status: string;
          two_factor_enabled: boolean;
          two_factor_secret: string | null;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          role_id: string;
          avatar_url?: string | null;
          status?: string;
          two_factor_enabled?: boolean;
          two_factor_secret?: string | null;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          role_id?: string;
          avatar_url?: string | null;
          status?: string;
          two_factor_enabled?: boolean;
          two_factor_secret?: string | null;
          last_login_at?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      properties: {
        Row: {
          id: string;
          slug: string;
          title: string;
          title_bn: string | null;
          tagline: string | null;
          tagline_bn: string | null;
          location: string;
          area: string;
          price: string;
          price_value: number;
          type: string;
          status: string;
          approval_status: string;
          size: string;
          featured_image: string;
          overview: string | null;
          overview_bn: string | null;
          genesis: string | null;
          highlights: string[];
          features: string[];
          specs: Json | null;
          plot_types: Json | null;
          total_plots: number | null;
          total_area: string | null;
          road_primary: string | null;
          road_secondary: string | null;
          coordinates: Json;
          is_flagship: boolean;
          is_featured: boolean;
          assigned_agent_id: string | null;
          custom_field_values: Json | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          title_bn?: string | null;
          tagline?: string | null;
          tagline_bn?: string | null;
          location: string;
          area: string;
          price: string;
          price_value?: number;
          type?: string;
          status?: string;
          approval_status?: string;
          size: string;
          featured_image: string;
          overview?: string | null;
          overview_bn?: string | null;
          genesis?: string | null;
          highlights?: string[];
          features?: string[];
          specs?: Json | null;
          plot_types?: Json | null;
          total_plots?: number | null;
          total_area?: string | null;
          road_primary?: string | null;
          road_secondary?: string | null;
          coordinates?: Json;
          is_flagship?: boolean;
          is_featured?: boolean;
          assigned_agent_id?: string | null;
          custom_field_values?: Json | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          title_bn?: string | null;
          tagline?: string | null;
          tagline_bn?: string | null;
          location?: string;
          area?: string;
          price?: string;
          price_value?: number;
          type?: string;
          status?: string;
          approval_status?: string;
          size?: string;
          featured_image?: string;
          overview?: string | null;
          overview_bn?: string | null;
          genesis?: string | null;
          highlights?: string[];
          features?: string[];
          specs?: Json | null;
          plot_types?: Json | null;
          total_plots?: number | null;
          total_area?: string | null;
          road_primary?: string | null;
          road_secondary?: string | null;
          coordinates?: Json;
          is_flagship?: boolean;
          is_featured?: boolean;
          assigned_agent_id?: string | null;
          custom_field_values?: Json | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          url: string;
          alt_text: string;
          caption: string | null;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          url: string;
          alt_text?: string;
          caption?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          alt_text?: string;
          caption?: string | null;
          is_featured?: boolean;
          sort_order?: number;
        };
      };
      lead_stages: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string;
          sort_order: number;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string;
          sort_order?: number;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          color?: string;
          sort_order?: number;
          is_system?: boolean;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          source: string;
          property_id: string | null;
          property_title: string | null;
          stage_id: string;
          assigned_agent_id: string | null;
          priority: string;
          budget: string | null;
          budget_min: number | null;
          budget_max: number | null;
          preferred_location: string | null;
          message: string | null;
          score: number;
          tags: string[];
          next_follow_up: string | null;
          is_duplicate: boolean;
          status: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          source?: string;
          property_id?: string | null;
          property_title?: string | null;
          stage_id: string;
          assigned_agent_id?: string | null;
          priority?: string;
          budget?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_location?: string | null;
          message?: string | null;
          score?: number;
          tags?: string[];
          next_follow_up?: string | null;
          is_duplicate?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          source?: string;
          property_id?: string | null;
          property_title?: string | null;
          stage_id?: string;
          assigned_agent_id?: string | null;
          priority?: string;
          budget?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_location?: string | null;
          message?: string | null;
          score?: number;
          tags?: string[];
          next_follow_up?: string | null;
          is_duplicate?: boolean;
          status?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      lead_activities: {
        Row: {
          id: string;
          lead_id: string;
          actor_id: string | null;
          actor_name: string | null;
          type: string;
          title: string;
          description: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          actor_id?: string | null;
          actor_name?: string | null;
          type?: string;
          title: string;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          description?: string | null;
          metadata?: Json | null;
        };
      };
      media_library: {
        Row: {
          id: string;
          filename: string;
          file_path: string;
          url: string;
          thumbnail_url: string | null;
          mime_type: string;
          size_bytes: number;
          width: number | null;
          height: number | null;
          alt_text: string;
          usage_count: number;
          usage_references: Json;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          file_path: string;
          url: string;
          thumbnail_url?: string | null;
          mime_type: string;
          size_bytes?: number;
          width?: number | null;
          height?: number | null;
          alt_text?: string;
          usage_count?: number;
          usage_references?: Json;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          url?: string;
          thumbnail_url?: string | null;
          alt_text?: string;
          usage_count?: number;
          usage_references?: Json;
          updated_at?: string;
        };
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          label: string;
          url: string;
          icon_name: string | null;
          custom_svg_id: string | null;
          open_new_tab: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          label: string;
          url: string;
          icon_name?: string | null;
          custom_svg_id?: string | null;
          open_new_tab?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          label?: string;
          url?: string;
          icon_name?: string | null;
          custom_svg_id?: string | null;
          open_new_tab?: boolean;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      seo_meta: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          meta_title: string | null;
          meta_description: string | null;
          canonical_url: string | null;
          og_title: string | null;
          og_description: string | null;
          og_image: string | null;
          twitter_card: string | null;
          focus_keyword: string | null;
          robots_index: boolean;
          robots_follow: boolean;
          custom_json_ld: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          meta_title?: string | null;
          meta_description?: string | null;
          canonical_url?: string | null;
          og_title?: string | null;
          og_description?: string | null;
          og_image?: string | null;
          twitter_card?: string | null;
          focus_keyword?: string | null;
          robots_index?: boolean;
          robots_follow?: boolean;
          custom_json_ld?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          canonical_url?: string | null;
          og_title?: string | null;
          og_description?: string | null;
          og_image?: string | null;
          twitter_card?: string | null;
          focus_keyword?: string | null;
          robots_index?: boolean;
          robots_follow?: boolean;
          custom_json_ld?: string | null;
          updated_at?: string;
        };
      };
      redirects: {
        Row: {
          id: string;
          source_path: string;
          target_path: string;
          status_code: number;
          is_active: boolean;
          hit_count: number;
          last_accessed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_path: string;
          target_path: string;
          status_code?: number;
          is_active?: boolean;
          hit_count?: number;
          last_accessed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_path?: string;
          target_path?: string;
          status_code?: number;
          is_active?: boolean;
          hit_count?: number;
          last_accessed_at?: string | null;
          updated_at?: string;
        };
      };
      custom_scripts: {
        Row: {
          id: string;
          name: string;
          placement: string;
          code: string;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          placement?: string;
          code: string;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          placement?: string;
          code?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      custom_icons: {
        Row: {
          id: string;
          name: string;
          svg_content: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          svg_content: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          svg_content?: string;
          category?: string;
          updated_at?: string;
        };
      };
      saved_views: {
        Row: {
          id: string;
          user_id: string;
          module: string;
          name: string;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          module: string;
          name: string;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          config?: Json;
          updated_at?: string;
        };
      };
      custom_fields: {
        Row: {
          id: string;
          entity_type: string;
          field_name: string;
          field_label: string;
          field_type: string;
          options: string[] | null;
          is_required: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type?: string;
          field_name: string;
          field_label: string;
          field_type?: string;
          options?: string[] | null;
          is_required?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          field_name?: string;
          field_label?: string;
          field_type?: string;
          options?: string[] | null;
          is_required?: boolean;
          sort_order?: number;
        };
      };
    };
  };
}
