'use server'

import { FormState } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/server";
import { ERROR_CODES } from "@/utils/ErrorMessage";

export async function updatePassword(formData: FormData): Promise<FormState> {
    const supabase = await createClient()

    try {
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!password || !confirmPassword) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "새 비밀번호와 비밀번호 확인을 모두 입력해주세요."
            };
        }

        if (password !== confirmPassword) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "비밀번호가 일치하지 않습니다."
            };
        }

        // 비밀번호 강도 검증
        if (password.length < 8) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "비밀번호는 최소 8자 이상이어야 합니다."
            };
        }

        // 비밀번호 업데이트 (세션이 있는 상태에서만 가능)
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.error("비밀번호 업데이트 오류:", error);

            // 세션이 없거나 만료된 경우
            if (error.message.includes('session') || error.message.includes('expired')) {
                return {
                    code: ERROR_CODES.AUTH_ERROR,
                    message: "비밀번호 재설정 링크가 만료되었습니다. 다시 요청해주세요."
                };
            }

            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: "비밀번호 변경에 실패했습니다. 다시 시도해주세요."
            };
        }

        return {
            code: ERROR_CODES.SUCCESS,
            message: "비밀번호가 성공적으로 변경되었습니다.",
            redirect: '/login'
        };

    } catch (error) {
        console.error("비밀번호 업데이트 처리 중 오류 발생:", error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}
