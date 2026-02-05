// Activity service for Supabase runs table
import { supabase } from '../lib/supabase';

export interface Activity {
    id: string;
    user_id: string;
    type: 'ranked' | 'phase' | 'free';
    distance_km: number;
    duration_seconds: number;
    pace: string;
    gps_path: [number, number][];
    city?: string;
    state_code?: string;
    created_at: string;
    start_time: string;
    end_time: string;
    name?: string;
    stars?: number;
    ranked_distance_km?: number;
    phase_id?: string;
}

// Save a new run to Supabase
export async function saveRun(userId: string, activity: {
    type: 'ranked' | 'phase' | 'free';
    distance: number;
    duration: number;
    pace: string;
    route: [number, number][];
    name?: string;
    city?: string;
    stateCode?: string;
    rankedDistanceKm?: number;
    phaseId?: string;
    stars?: number;
}) {
    const now = new Date().toISOString();
    const startTime = new Date(Date.now() - activity.duration * 1000).toISOString();

    // Get start/end coordinates
    const startLat = activity.route.length > 0 ? activity.route[0][0] : null;
    const startLng = activity.route.length > 0 ? activity.route[0][1] : null;
    const endLat = activity.route.length > 0 ? activity.route[activity.route.length - 1][0] : null;
    const endLng = activity.route.length > 0 ? activity.route[activity.route.length - 1][1] : null;

    const { data, error } = await supabase
        .from('runs')
        .insert({
            user_id: userId,
            type: activity.type === 'free' ? 'phase' : activity.type, // 'free' maps to 'phase' since DB only has ranked/phase
            distance_km: activity.distance,
            duration_seconds: activity.duration,
            pace: activity.pace,
            gps_path: activity.route,
            city: activity.city,
            state_code: activity.stateCode,
            start_time: startTime,
            end_time: now,
            start_lat: startLat,
            start_lng: startLng,
            end_lat: endLat,
            end_lng: endLng,
            ranked_distance_km: activity.rankedDistanceKm,
            phase_id: activity.phaseId,
            stars: activity.stars
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving run:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

// Get user's runs from Supabase
export async function getUserRuns(userId: string, limit: number = 50) {
    const { data, error } = await supabase
        .from('runs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching runs:', error);
        return { data: [], error };
    }

    // Transform to local format
    const activities: Activity[] = (data || []).map(run => ({
        id: run.id,
        user_id: run.user_id,
        type: run.type as 'ranked' | 'phase' | 'free',
        distance_km: run.distance_km,
        duration_seconds: run.duration_seconds,
        pace: run.pace || '--:--',
        gps_path: (run.gps_path as [number, number][]) || [],
        city: run.city || undefined,
        state_code: run.state_code || undefined,
        created_at: run.created_at || run.end_time,
        start_time: run.start_time,
        end_time: run.end_time,
        stars: run.stars || undefined,
        ranked_distance_km: run.ranked_distance_km || undefined,
        phase_id: run.phase_id || undefined
    }));

    return { data: activities, error: null };
}

// Get single run details
export async function getRun(runId: string) {
    const { data, error } = await supabase
        .from('runs')
        .select('*')
        .eq('id', runId)
        .single();

    if (error) {
        console.error('Error fetching run:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

// Share activity to feed (create post)
export async function shareToFeed(userId: string, runId: string, content?: string) {
    const { data, error } = await supabase
        .from('posts')
        .insert({
            user_id: userId,
            run_id: runId,
            content: content || 'Acabei de completar uma corrida! 🏃‍♂️',
            likes_count: 0,
            comments_count: 0
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating post:', error);
        return { data: null, error };
    }

    return { data, error: null };
}
