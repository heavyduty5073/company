'use server'
import { createClient } from "@/utils/supabase/server";
import {Inquiry, InquiryWithUser, Posts} from "@/utils/supabase/types";
import { revalidatePath } from "next/cache";
import { ERROR_CODES } from "@/utils/ErrorMessage";
import {FormState} from "@/components/ui/form";
import {AdminClient} from "@/utils/supabase/admin";


/**
 * 지정된 태그에 해당하는 게시물 목록을 가져옵니다.
 * @param type 게시물 태그 (notice, faq, qna 등)
 * @returns 게시물 배열 또는 에러 발생 시 빈 배열
 */
export async function getSupportList(type: string): Promise<Posts[]> {
    const supabase = await createClient();
    try {
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

/**
 * 게시물을 삭제합니다.
 * @param id 삭제할 게시물 ID
 * @returns 성공 여부
 */
export async function deletePost(id:string): Promise<FormState> {
    const supabase = await createClient();

    // ID 검증
    if (!id) {
        return {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: '게시물 ID가 필요합니다.'
        };
    }

    try {
        // 게시물 삭제
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('게시물 삭제 오류:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '게시물 삭제 중 오류가 발생했습니다.'
            };
        }

        // 페이지 갱신
        revalidatePath('/support');
        revalidatePath('/admin/support');

        return {
            code: ERROR_CODES.SUCCESS,
            message: '게시물이 성공적으로 삭제되었습니다.'
        };
    } catch (error) {
        console.error('서버 오류:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.'
        };
    }
}

/**
 * 게시물을 생성합니다.
 * @param formData 게시물 폼 데이터
 * @returns 생성 결과
 */
export async function createPost(formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const title = formData.get('title') as string;
    const contents = formData.get('contents') as string;
    const tag = formData.get('tag') as string;
    const category = formData.get('category') as string;

    // 필수값 확인
    if (!title || !contents || !tag || !category) {
        return {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: '필수 값이 누락되었습니다.'
        };
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert({
                title,
                contents,
                tag,
                category,
            })
            .select('id')
            .single();

        if (error) {
            console.error('게시물 생성 오류:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '게시물 생성 중 에러가 발생하였습니다.'
            };
        }

        // 페이지 갱신
        revalidatePath('/support');

        return {
            code: ERROR_CODES.SUCCESS,
            message: '게시물이 성공적으로 생성되었습니다.',
        };
    } catch (error) {
        console.error('서버 오류:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '게시물 생성 중 서버 에러가 발생하였습니다.'
        };
    }
}

/**
 * 게시물을 수정합니다.
 * @param formData 게시물 폼 데이터
 * @returns 수정 결과
 */
export async function updatePost(formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const contents = formData.get('contents') as string;
    const tag = formData.get('tag') as string;
    const category = formData.get('category') as string;

    if (!id || !title || !contents || !tag || !category) {
        return {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: '필수 값이 누락되었습니다.'
        };
    }

    try {
        const { error } = await supabase
            .from('posts')
            .update({
                title,
                contents,
                tag,
                category,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('게시물 수정 오류:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '게시물 수정 중 에러가 발생하였습니다.'
            };
        }

        // 페이지 갱신
        revalidatePath(`/support/${id}`);
        revalidatePath('/support');

        return {
            code: ERROR_CODES.SUCCESS,
            message: '게시물이 성공적으로 수정되었습니다.'
        };
    } catch (error) {
        console.error('서버 오류:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '게시물 수정 중 서버 에러가 발생하였습니다.'
        };
    }
}

export async function getAdminInquiry(): Promise<InquiryWithUser[]> {
    const supabase = AdminClient();

    try {
        const { data, error } = await supabase
            .rpc('get_admin_inquiries');

        if (error) {
            console.error('문의 내역 조회 오류:', error);
            return [];
        }

        // 명시적인 타입 변환
        return (data as unknown as InquiryWithUser[]) || [];
    } catch (error) {
        console.error('서버 오류:', error);
        return [];
    }
}

export async function getSearchAdminInquiry(searchTerm: string): Promise<InquiryWithUser[]> {
    const supabase = AdminClient();

    try {
        const { data, error } = await supabase
            .rpc('search_admin_inquiries', { search_term: searchTerm });

        if (error) {
            console.error('문의 내역 검색 오류:', error);
            return [];
        }

        // 명시적인 타입 변환
        return (data as unknown as InquiryWithUser[]) || [];
    } catch (error) {
        console.error('서버 오류:', error);
        return [];
    }
}

export async function getUnansweredInquiryCount(): Promise<number> {
    const supabase = AdminClient();

    try {
        const { count, error } = await supabase
            .from('inquiry')
            .select('id', { count: 'exact', head: true })
            .is('answer', null)
            .is('admin_id', null);

        if (error) {
            console.error('미답변 문의 내역 조회 오류:', error);
            return 0;
        }

        return count || 0;
    } catch (error) {
        console.error('서버 오류:', error);
        return 0;
    }
}