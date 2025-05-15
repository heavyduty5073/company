'use server'
import {createClient} from "@/utils/supabase/server";
import {Posts} from "@/utils/supabase/types";

/**
 * 지정된 태그에 해당하는 게시물 목록을 가져옵니다.
 * @param type 게시물 태그 (notice, faq, qna 등)
 * @returns 게시물 배열 또는 에러 발생 시 빈 배열
 */
export async function getSupportList(type: string): Promise<Posts[]> {
    const supabase = await createClient();
    try {
        // 기본적으로 최신순으로 정렬하고, 중요 공지는 최상단에 배치
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('tag', type)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('데이터 조회 오류:', error);
            return [];
        }

        return data as Posts[];
    } catch (error) {
        console.error('서버 오류:', error);
        return [];
    }
}

/**
 * 지정된 ID에 해당하는 게시물을 가져옵니다.
 * @param id 게시물 ID
 * @returns 게시물 객체 또는 에러 발생 시 null
 */
export async function getSupportDetail(id: string): Promise<Posts | null> {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('데이터 조회 오류:', error);
            return null;
        }

        return data as Posts;
    } catch (error) {
        console.error('서버 오류:', error);
        return null;
    }
}

/**
 * 검색어에 맞는 게시물을 검색합니다.
 * @param type 게시물 태그
 * @param searchTerm 검색어
 * @returns 검색된 게시물 배열 또는 에러 발생 시 빈 배열
 */
export async function searchSupport(type: string, searchTerm: string): Promise<Posts[]> {
    const supabase = await createClient();
    try {
        // 제목과 내용에서 검색어 포함 여부 확인
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('tag', type)
            .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('검색 오류:', error);
            return [];
        }

        return data as Posts[];
    } catch (error) {
        console.error('서버 오류:', error);
        return [];
    }
}