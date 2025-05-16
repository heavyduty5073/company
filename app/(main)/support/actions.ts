'use server'
import {createClient} from "@/utils/supabase/server";
import {Inquiry, Posts} from "@/utils/supabase/types";

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
            .or(`title.ilike.%${searchTerm}%,contents.ilike.%${searchTerm}%`)
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

export async function getInquiry(userId: string): Promise<Inquiry[]> {
    const supabase = await createClient();

    try {
        // inquiry 테이블에서 특정 사용자의 문의 내역만 조회
        const { data, error } = await supabase
            .from('inquiry')
            .select('*')
            .eq('user_id', userId)  // 사용자 ID로 필터링
            .order('created_at', { ascending: false });

        if (error) {
            console.error('문의 내역 조회 오류:', error);
            return [];
        }

        return data as Inquiry[];
    } catch (error) {
        console.error('서버 오류:', error);
        return [];
    }
}

export async function searchInquiry(userId: string, searchTerm: string): Promise<Inquiry[]> {
    const supabase = await createClient();

    try {
        // inquiry 테이블에서 특정 사용자의 문의 중 검색어가 포함된 항목 조회
        const { data, error } = await supabase
            .from('inquiry')
            .select('*')
            .eq('user_id', userId)  // 사용자 ID로 필터링
            .or(`title.ilike.%${searchTerm}%,question.ilike.%${searchTerm}%`)  // title과 question에서 검색
            .order('created_at', { ascending: false });

        if (error) {
            console.error('문의 내역 검색 오류:', error);
            return [];
        }

        return data as Inquiry[];
    } catch (error) {
        console.error('서버 오류:', error);
        return [];
    }
}