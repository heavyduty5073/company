'use server'

import { FormState } from "@/components/ui/form";
import {createClient} from "@/utils/supabase/server";
import {ERROR_CODES} from "@/utils/ErrorMessage";
import {AdminClient} from "@/utils/supabase/admin";

export async function signIn(formData: FormData): Promise<FormState> {
    const supabase = await createClient()
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "이메일과 비밀번호를 모두 입력해주세요."
            };
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: "이메일 또는 비밀번호가 올바르지 않습니다."
            };
        }

        return {
            code: ERROR_CODES.SUCCESS,
            message: "로그인에 성공했습니다.",
            redirect: '/home',

        };
    } catch (error) {
        console.error("로그인 처리 중 오류 발생:", error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}

export async function signInWithGoogle(): Promise<FormState> {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                skipBrowserRedirect:false,
                queryParams:{
                    response_type: 'code',
                }
            }
        });

        if (error) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: error.message
            };
        }

        // 구글 로그인은 리다이렉션을 통해 처리되므로 URL 반환
        return {
            code: ERROR_CODES.SUCCESS,
            message: "구글 로그인으로 리다이렉션됩니다.",
            data: { url: data.url }
        };
    } catch (error) {
        console.error("구글 로그인 처리 중 오류 발생:", error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}

// 카카오 로그인
export async function signInWithKakao(): Promise<FormState> {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                skipBrowserRedirect:false,
                queryParams:{
                    response_type: 'code',
                }
            }
        });

        if (error) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: error.message
            };
        }

        // 카카오 로그인은 리다이렉션을 통해 처리되므로 URL 반환
        return {
            code: ERROR_CODES.SUCCESS,
            message: "",
            data: { url: data.url }
        };
    } catch (error) {
        console.error("카카오 로그인 처리 중 오류 발생:", error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        };
    }
}
export async function handleUpdateSocialLogin() {
    const supabase = await createClient()

    // 현재 로그인된 유저 가져오기
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const adminSupabase = AdminClient()
    if (userError || !user) {
        console.error('유저 없음 또는 인증 오류:', userError)
        return
    }

    // user_metadata에 role이 없는 경우 기본값으로 설정
    if (!user.user_metadata?.role) {
        const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
                ...user.user_metadata,
                role: 'user'
            }
        })

        if (updateError) {
            console.error('소셜 로그인 사용자 role 업데이트 실패:', updateError)
        }
    }
}
// 로그아웃
export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut();
    return { error };
}