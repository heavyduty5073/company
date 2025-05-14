'use server';

import { createClient } from '@/utils/supabase/server';
import { ERROR_CODES } from '@/utils/ErrorMessage';
import { Posts } from '@/utils/supabase/types';

/**
 * 모든 정비 사례를 가져오는 함수
 * @returns 정비 사례 배열 또는 에러 객체
 */
export async function getRepairCases() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('tag', 'repaircase')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching repair cases:', error);
            return [];
        }

        return data as Posts[];
    } catch (error) {
        console.error('Unexpected error fetching repair cases:', error);
        return [];
    }
}

/**
 * 카테고리별로 정비 사례 필터링하는 함수
 * @param category 필터링할 카테고리
 * @returns 필터링된 정비 사례 배열
 */
export async function getRepairCasesByCategory(category: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('tag', 'repaircase')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching repair cases by category:', error);
            return [];
        }

        return data as Posts[];
    } catch (error) {
        console.error('Unexpected error fetching repair cases by category:', error);
        return [];
    }
}

/**
 * 제조사별로 정비 사례 필터링하는 함수
 * @param company 필터링할 제조사
 * @returns 필터링된 정비 사례 배열
 */
export async function getRepairCasesByCompany(company: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('tag', 'repaircase')
            .eq('company', company)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching repair cases by company:', error);
            return [];
        }

        return data as Posts[];
    } catch (error) {
        console.error('Unexpected error fetching repair cases by company:', error);
        return [];
    }
}
