'use server'

import { createClient } from "@/utils/supabase/server";
import {FormState} from "@/components/ui/form";
import {ERROR_CODES} from "@/utils/ErrorMessage";
import {revalidatePath} from "next/cache";

export async function createInquiry(formData: FormData): Promise<FormState> {
    const supabase = await createClient();

    try {
        // 세션 확인
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { code: ERROR_CODES.AUTH_ERROR, message: '로그인이 필요합니다.' };
        }

        // 폼 데이터 추출
        const title = formData.get('title') as string;
        const question = formData.get('question') as string;
        const userId = formData.get('userId') as string;

        // 유효성 검사
        if (!title || !question) {
            return { code: ERROR_CODES.VALIDATION_ERROR, message: '제목 또는 내용을 입력해주세요.' };
        }

        // 문의 저장
        const { error } = await supabase
            .from('inquiry')
            .insert([
                {
                    title,
                    question,
                    user_id:userId,
                }
            ])
            .select()
            .single();

        if (error) {
            return { code: ERROR_CODES.DB_ERROR, message: '제목 또는 내용을 입력해주세요.' };
        }

        revalidatePath('/support');
        return {
            code: ERROR_CODES.SUCCESS,
            message: '문의가 성공적으로 작성되었습니다.'
        }

    } catch (error) {
        return { code: ERROR_CODES.SERVER_ERROR, message: '작성중 서버 에러가 발생하였습니다.' };
    }
}