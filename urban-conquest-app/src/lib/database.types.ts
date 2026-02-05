export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            phases: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    name: string
                    phase_number: number
                    target_distance_km: number
                    time_1_star: number
                    time_2_stars: number
                    time_3_stars: number
                    unlock_level: number | null
                    world_id: number
                    xp_reward: number | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name: string
                    phase_number: number
                    target_distance_km: number
                    time_1_star: number
                    time_2_stars: number
                    time_3_stars: number
                    unlock_level?: number | null
                    world_id: number
                    xp_reward?: number | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name?: string
                    phase_number?: number
                    target_distance_km?: number
                    time_1_star?: number
                    time_2_stars?: number
                    time_3_stars?: number
                    unlock_level?: number | null
                    world_id?: number
                    xp_reward?: number | null
                }
                Relationships: []
            }
            post_comments: {
                Row: {
                    content: string
                    created_at: string | null
                    id: string
                    post_id: string
                    user_id: string
                }
                Insert: {
                    content: string
                    created_at?: string | null
                    id?: string
                    post_id: string
                    user_id: string
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    id?: string
                    post_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "post_comments_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "post_comments_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            post_likes: {
                Row: {
                    created_at: string | null
                    id: string
                    post_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    post_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    post_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "post_likes_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "post_likes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            posts: {
                Row: {
                    comments_count: number | null
                    content: string | null
                    created_at: string | null
                    id: string
                    image_url: string | null
                    likes_count: number | null
                    run_id: string | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    comments_count?: number | null
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    image_url?: string | null
                    likes_count?: number | null
                    run_id?: string | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    comments_count?: number | null
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    image_url?: string | null
                    likes_count?: number | null
                    run_id?: string | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_run_id_fkey"
                        columns: ["run_id"]
                        isOneToOne: false
                        referencedRelation: "runs"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "posts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    bio: string | null
                    city: string | null
                    created_at: string | null
                    display_name: string | null
                    id: string
                    level: number | null
                    state_code: string | null
                    total_distance_km: number | null
                    total_runs: number | null
                    updated_at: string | null
                    username: string | null
                    xp: number | null
                }
                Insert: {
                    avatar_url?: string | null
                    bio?: string | null
                    city?: string | null
                    created_at?: string | null
                    display_name?: string | null
                    id: string
                    level?: number | null
                    state_code?: string | null
                    total_distance_km?: number | null
                    total_runs?: number | null
                    updated_at?: string | null
                    username?: string | null
                    xp?: number | null
                }
                Update: {
                    avatar_url?: string | null
                    bio?: string | null
                    city?: string | null
                    created_at?: string | null
                    display_name?: string | null
                    id?: string
                    level?: number | null
                    state_code?: string | null
                    total_distance_km?: number | null
                    total_runs?: number | null
                    updated_at?: string | null
                    username?: string | null
                    xp?: number | null
                }
                Relationships: []
            }
            runs: {
                Row: {
                    city: string | null
                    created_at: string | null
                    distance_km: number
                    duration_seconds: number
                    end_lat: number | null
                    end_lng: number | null
                    end_time: string
                    gps_path: Json | null
                    id: string
                    is_first_place: boolean | null
                    pace: string | null
                    phase_id: string | null
                    ranked_distance_km: number | null
                    start_lat: number | null
                    start_lng: number | null
                    start_time: string
                    stars: number | null
                    state_code: string | null
                    type: Database["public"]["Enums"]["run_type"]
                    user_id: string
                }
                Insert: {
                    city?: string | null
                    created_at?: string | null
                    distance_km: number
                    duration_seconds: number
                    end_lat?: number | null
                    end_lng?: number | null
                    end_time: string
                    gps_path?: Json | null
                    id?: string
                    is_first_place?: boolean | null
                    pace?: string | null
                    phase_id?: string | null
                    ranked_distance_km?: number | null
                    start_lat?: number | null
                    start_lng?: number | null
                    start_time: string
                    stars?: number | null
                    state_code?: string | null
                    type: Database["public"]["Enums"]["run_type"]
                    user_id: string
                }
                Update: {
                    city?: string | null
                    created_at?: string | null
                    distance_km?: number
                    duration_seconds?: number
                    end_lat?: number | null
                    end_lng?: number | null
                    end_time?: string
                    gps_path?: Json | null
                    id?: string
                    is_first_place?: boolean | null
                    pace?: string | null
                    phase_id?: string | null
                    ranked_distance_km?: number | null
                    start_lat?: number | null
                    start_lng?: number | null
                    start_time?: string
                    stars?: number | null
                    state_code?: string | null
                    type?: Database["public"]["Enums"]["run_type"]
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "runs_phase_id_fkey"
                        columns: ["phase_id"]
                        isOneToOne: false
                        referencedRelation: "phases"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "runs_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            user_phase_progress: {
                Row: {
                    attempts: number | null
                    best_time_seconds: number
                    completed_at: string | null
                    id: string
                    phase_id: string
                    stars: number
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    attempts?: number | null
                    best_time_seconds: number
                    completed_at?: string | null
                    id?: string
                    phase_id: string
                    stars: number
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    attempts?: number | null
                    best_time_seconds?: number
                    completed_at?: string | null
                    id?: string
                    phase_id?: string
                    stars?: number
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_phase_progress_phase_id_fkey"
                        columns: ["phase_id"]
                        isOneToOne: false
                        referencedRelation: "phases"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_phase_progress_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            add_user_xp: {
                Args: {
                    p_user_id: string
                    p_xp: number
                }
                Returns: Json
            }
            get_city_leaderboard: {
                Args: {
                    p_city: string
                    p_distance_km: number
                }
                Returns: {
                    rank: number
                    user_id: string
                    username: string
                    display_name: string
                    avatar_url: string
                    best_time: number
                    pace: string
                }[]
            }
            get_state_ranking: {
                Args: {
                    p_state_code: string
                }
                Returns: {
                    rank: number
                    user_id: string
                    username: string
                    display_name: string
                    avatar_url: string
                    first_places: number
                }[]
            }
            get_user_stats: {
                Args: {
                    p_user_id: string
                    p_period?: string
                }
                Returns: Json
            }
        }
        Enums: {
            run_type: "ranked" | "phase"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
