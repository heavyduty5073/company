'use server'

import { createClient } from "@/utils/supabase/server";
import { ERROR_CODES } from "@/utils/ErrorMessage";
import { revalidatePath } from "next/cache";
import { companyOptions } from "@/lib/store/company";
import { Posts } from "@/utils/supabase/types";

// 단일 정비 사례 조회 함수
export async function getOneRepairCase(id: string) {
    const supabase = await createClient();

    const {data:{user}} = await supabase.auth.getUser()

    if (!user) {
        return {
            code: ERROR_CODES.AUTH_ERROR,
            message: "로그인이 필요합니다."
        };
    }

    // 관리자 권한 체크
    const isAdmin = user.user_metadata?.role === 'admin';
    if (!isAdmin) {
        return {
            code: ERROR_CODES.UNAUTHORIZED,
            message: "관리자 권한이 필요합니다."
        };
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .eq('tag', 'repaircase')
            .single();

        if (error || !data) {
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '데이터를 찾을 수 없습니다.'
            };
        }

        return data as Posts;
    } catch (error) {
        console.error('Error fetching repair case:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.'
        };
    }
}

// 정비 사례 수정 함수
export async function updatePost(formData: FormData) {
    try {
        const supabase = await createClient();

        // 세션 체크하여 로그인 상태 확인
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: "로그인이 필요합니다."
            };
        }

        // 관리자 권한 체크
        const isAdmin = user.user_metadata?.role === 'admin';
        if (!isAdmin) {
            return {
                code: ERROR_CODES.UNAUTHORIZED,
                message: "관리자 권한이 필요합니다."
            };
        }

        // 폼 데이터 추출
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const tag = formData.get('tag') as string;
        const company = formData.get('company') as string;
        const contents = formData.get('contents') as string;

        // 필수값 검증
        if (!id || !title || !category || !tag || !company) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "필수 항목을 모두 입력해주세요."
            };
        }

        // 카테고리 검증
        const validCategories = ['excavator', 'loader', 'truck'];
        if (!validCategories.includes(category)) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "유효하지 않은 작업 종류입니다."
            };
        }

        // 회사명 검증
        const isValidCompany = companyOptions[category as keyof typeof companyOptions]?.includes(company);
        if (!isValidCompany) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "유효하지 않은 제조사입니다."
            };
        }

        // 해당 게시물이 존재하는지 확인
        const { data: existingPost, error: fetchError } = await supabase
            .from('posts')
            .select('id')
            .eq('id', id)
            .single();

        if (fetchError || !existingPost) {
            return {
                code: ERROR_CODES.DB_ERROR,
                message: "수정할 정비 사례를 찾을 수 없습니다."
            };
        }

        // DB 업데이트
        const { data, error } = await supabase
            .from('posts')
            .update({
                title,
                category,
                company,
                contents,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating post:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: "정비 사례 수정 중 오류가 발생했습니다."
            };
        }

        // 캐시 무효화
        revalidatePath('/admin/posts');
        revalidatePath(`/admin/posts/edit/${id}`);
        revalidatePath('/home');

        return {
            code: ERROR_CODES.SUCCESS,
            message: "정비 사례가 성공적으로 수정되었습니다.",
            redirect: "/admin/posts",
            data
        };
    } catch (error) {
        console.error('Unexpected error updating post:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}

export async function deleteRepairCase(id: string) {
    try {
        const supabase = await createClient();

        // 세션 체크하여 로그인 상태 확인
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: "로그인이 필요합니다."
            };
        }

        // 관리자 권한 체크
        const isAdmin = user.user_metadata?.role === 'admin';
        if (!isAdmin) {
            return {
                code: ERROR_CODES.UNAUTHORIZED,
                message: "관리자 권한이 필요합니다."
            };
        }

        // ID 검증
        if (!id) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "삭제할 게시물 ID가 필요합니다."
            };
        }

        // 해당 게시물이 존재하는지 확인
        const { data: existingPost, error: fetchError } = await supabase
            .from('posts')
            .select('id')
            .eq('id', id)
            .single();

        if (fetchError || !existingPost) {
            return {
                code: ERROR_CODES.DB_ERROR,
                message: "삭제할 정비 사례를 찾을 수 없습니다."
            };
        }

        // DB에서 게시물 삭제
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting post:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: "정비 사례 삭제 중 오류가 발생했습니다."
            };
        }

        // 캐시 무효화
        revalidatePath('/admin/posts');
        revalidatePath('/home');
        revalidatePath('/repair');

        return {
            code: ERROR_CODES.SUCCESS,
            message: "정비 사례가 성공적으로 삭제되었습니다.",
            redirect: "/admin/posts"
        };
    } catch (error) {
        console.error('Unexpected error deleting post:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}