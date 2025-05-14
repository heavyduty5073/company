'use server'
import { ERROR_CODES } from "@/utils/ErrorMessage";
import {createClient} from "@/utils/supabase/server";
import {Posts} from "@/utils/supabase/types";

/**
 * 단일 정비 사례 상세 조회
 * @param id 정비 사례 ID
 * @returns 정비 사례 객체 또는 에러 객체
 */
export async function getRepairCaseDetail(id: string) {
    const supabase = await createClient();

    if (!id) {
        return {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: '유효한 ID가 필요합니다.'
        };
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .eq('tag', 'repaircase')
            .single();

        if (error) {
            console.error('Error fetching repair case detail:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '정비 사례를 찾을 수 없습니다.'
            };
        }

        return data as Posts;
    } catch (error) {
        console.error('Unexpected error fetching repair case detail:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.'
        };
    }
}