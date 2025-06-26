'use server'

import { FormState } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/server";
import { ERROR_CODES } from "@/utils/ErrorMessage";

export async function sendPasswordResetEmail(formData: FormData): Promise<FormState> {
    const supabase = await createClient()

    try {
        const email = formData.get('email') as string;

        if (!email) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "이메일을 입력해주세요."
            };
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "올바른 이메일 형식을 입력해주세요."
            };
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
        });

        if (error) {
            // Supabase는 보안상 이메일이 존재하지 않아도 에러를 반환하지 않을 수 있습니다.
            // 하지만 다른 에러가 발생할 수 있으므로 확인합니다.
            console.error("비밀번호 재설정 이메일 전송 오류:", error);

            // 일반적인 오류 메시지를 반환 (보안상 구체적인 오류 내용을 노출하지 않음)
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: "이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            };
        }

        return {
            code: ERROR_CODES.SUCCESS,
            message: "비밀번호 재설정 이메일이 전송되었습니다. 이메일을 확인해주세요.",
        };

    } catch (error) {
        console.error("비밀번호 재설정 처리 중 오류 발생:", error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}
