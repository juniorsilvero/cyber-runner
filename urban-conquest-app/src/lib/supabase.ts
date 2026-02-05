// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://hipicwchcnynhmlufwja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcGljd2NoY255bmhtbHVmd2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDQwNDIsImV4cCI6MjA4NTcyMDA0Mn0.FcD2d7GKzv11feVb1xqGikv_lgS6gHUtkqfYkGJm5Cs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storageKey: 'cyber-runner-auth',
        storage: window.localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });
    return { data, error };
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
};

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Profile helpers
export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<{
    username: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    city: string;
    state_code: string;
}>) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    return { data, error };
};

// Upload avatar
export const uploadAvatar = async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

    if (uploadError) return { error: uploadError };

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    await updateProfile(userId, { avatar_url: publicUrl });

    return { publicUrl, error: null };
};

// Get user stats
export const getUserStats = async (userId: string, period: 'day' | 'week' | 'month' = 'week') => {
    const { data, error } = await supabase
        .rpc('get_user_stats', { p_user_id: userId, p_period: period });
    return { data, error };
};

// Get city leaderboard
export const getCityLeaderboard = async (city: string, distanceKm: number) => {
    const { data, error } = await supabase
        .rpc('get_city_leaderboard', { p_city: city, p_distance_km: distanceKm });
    return { data, error };
};

// Get state ranking
export const getStateRanking = async (stateCode: string) => {
    const { data, error } = await supabase
        .rpc('get_state_ranking', { p_state_code: stateCode });
    return { data, error };
};
