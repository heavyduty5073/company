'use server'

import { createClient } from "@/utils/supabase/server";
import { ERROR_CODES } from "@/utils/ErrorMessage";
import { revalidatePath } from "next/cache";
import {companyOptions} from "@/lib/store/company";

export async function createPost(formData: FormData) {
    try {
        const supabase = await createClient();

        // 세션 체크하여 로그인 상태 확인
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: "로그인이 필요합니다."
            };
        }

        // 관리자 권한 체크 (선택적)
        const isAdmin = session.user?.user_metadata?.role === 'admin';
        if (!isAdmin) {
            return {
                code: ERROR_CODES.UNAUTHORIZED,
                message: "관리자 권한이 필요합니다."
            };
        }

        // 폼 데이터 추출
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const tag = formData.get('tag') as string;
        const company = formData.get('company') as string;
        const contents = formData.get('contents') as string;

        console.log(contents)
        // 필수값 검증
        if (!title || !category || !tag || !company) {
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


        const isValidCompany = companyOptions[category as keyof typeof companyOptions].includes(company);
        if (!isValidCompany) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "유효하지 않은 제조사입니다."
            };
        }

        // DB에 저장
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title,
                    category,
                    tag,
                    company,
                    contents
                }
            ])
            .select();

        if (error) {
            console.error('Error creating post:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: "정비 사례 등록 중 오류가 발생했습니다."
            };
        }

        // 캐시 무효화
        revalidatePath('/admin/posts');
        revalidatePath('/home');

        return {
            code: ERROR_CODES.SUCCESS,
            message: "정비 사례가 성공적으로 등록되었습니다.",
            redirect: "/admin/posts",
            data
        };
    } catch (error) {
        console.error('Unexpected error creating post:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}