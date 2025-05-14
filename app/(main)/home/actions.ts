'use server'

import { createClient } from "@/utils/supabase/server";
import { ERROR_CODES } from "@/utils/ErrorMessage";
import { Posts } from "@/utils/supabase/types";

/**
 * 최신 정비 사례 8개를 조회하는 함수
 * @returns 최신 정비 사례 8개 또는 빈 배열
 */
export async function getLatestRepairCases() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('tag', 'repaircase')
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
            console.error('Error fetching repair cases:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data as Posts[];
    } catch (error) {
        console.error('Unexpected error fetching repair cases:', error);
        return [];
    }
}