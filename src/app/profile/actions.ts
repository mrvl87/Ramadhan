'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserHistory(page: number = 1, limit: number = 10) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from('generated_images')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching history:", error);
        throw new Error("Failed to fetch history");
    }

    return {
        data,
        totalPages: count ? Math.ceil(count / limit) : 0,
        currentPage: page,
        totalItems: count || 0
    };
}

export async function deleteHistoryItem(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // 1. Get the image URL first to delete from storage (Optional cleanup)
    const { data: item } = await supabase
        .from('generated_images')
        .select('image_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    // Note: Deleting from storage is good practice but can be complex if logic varies. 
    // For now, we mainly delete the record. Cleanup script can handle storage later.

    // 2. Delete Record
    const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Security: Ensure ownership

    if (error) {
        console.error("Error deleting item:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/profile');
    return { success: true };
}

export async function getUserStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    try {
        const { data, error } = await supabase.rpc('get_user_entitlement', {
            target_user_id: user.id
        });

        if (error) {
            console.error("Error fetching stats:", error);
            return null;
        }

        // Map remaining_credits to credits for UI consistency
        return {
            ...data,
            credits: data.remaining_credits ?? data.credits ?? 0
        };
    } catch (e) {
        console.error("Error in getUserStats:", e);
        return null;
    }
}
