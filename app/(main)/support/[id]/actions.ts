'use server'
import { createClient } from "@/utils/supabase/server";
import { Posts, Inquiry } from "@/utils/supabase/types";
import { redirect } from "next/navigation";

/**
 * 지정된 ID에 해당하는 게시물을 가져옵니다.
 * @param id 게시물 ID
 * @param type 게시물 타입 (inquiry 또는 기타)
 * @returns 게시물 객체 또는 에러 발생 시 null
 */
export async function getSupportDetail(id: string, type: string = 'notice'): Promise<Posts | Inquiry | null> {
    const supabase = await createClient();

    // inquiry 타입인 경우 (문의 내역)
    if (type === 'inquiry') {
        try {
            // 현재 사용자 확인
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
                redirect('/login');
            }

            // 문의 내역 조회
            const { data, error } = await supabase
                .from('inquiry')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                return null;
            }

            return data as Inquiry;
        } catch (error) {
            console.error('서버 오류:', error);
            return null;
        }
    }

    // 일반 게시물 (공지사항, FAQ 등)
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