'use server';
import { createClient } from "@/utils/supabase/server";
import { FormState } from "@/components/ui/form";
import { ERROR_CODES } from "@/utils/ErrorMessage";
import {Inquiry} from "@/utils/supabase/types";

export async function getAdminInquiry(id: string) {
    if (!id) return { code: ERROR_CODES.VALIDATION_ERROR, message: "ID가 필요합니다." };

    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('inquiry')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return { code: ERROR_CODES.DB_ERROR, message: "데이터를 찾을 수 없습니다." };

        return {
            code: ERROR_CODES.SUCCESS,
            message: "조회 성공",
            data: data as Inquiry
        };
    } catch (error) {
        return { code: ERROR_CODES.SERVER_ERROR, message: "서버 오류가 발생했습니다." };
    }
}

// 문의 답변 등록 함수 추가
export async function submitInquiryAnswer(formData: FormData): Promise<FormState> {
    const supabase = await createClient();

    // 폼 데이터 추출
    const id = formData.get('id') as string;
    const admin_id = formData.get('admin_id') as string;
    const answer = formData.get('answer') as string;

    // 유효성 검사
    if (!id || !admin_id || !answer) {
        return {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: "필수값이 누락되었습니다."
        };
    }

    try {
        // 답변 업데이트
        const { error } = await supabase
            .from('inquiry')
            .update({
                answer,
                admin_id,
            })
            .eq('id', id);

        if (error) {
            console.error("답변 등록 오류:", error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: "답변 등록 중 오류가 발생했습니다."
            };
        }

        return {
            code: ERROR_CODES.SUCCESS,
            message: "답변이 성공적으로 등록되었습니다."
        };
    } catch (error) {
        console.error("서버 오류:", error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생하였습니다."
        };
    }
}