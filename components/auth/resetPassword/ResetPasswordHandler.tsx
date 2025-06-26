'use client'

import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResetPasswordForm from "@/app/(main)/reset-password/form";

export default function ResetPasswordHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handlePasswordReset = async () => {
            const supabase = createClient();

            // URL에서 토큰 파라미터들 추출
            const access_token = searchParams.get('access_token');
            const refresh_token = searchParams.get('refresh_token');
            const type = searchParams.get('type');

            if (type === 'recovery' && access_token && refresh_token) {
                try {
                    // 세션 설정
                    const { error } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });

                    if (error) {
                        console.error('세션 설정 오류:', error);
                        setError('비밀번호 재설정 링크가 유효하지 않습니다.');
                    }
                } catch (err) {
                    console.error('비밀번호 재설정 처리 오류:', err);
                    setError('비밀번호 재설정 중 오류가 발생했습니다.');
                }
            } else if (type === 'recovery') {
                setError('비밀번호 재설정 링크가 유효하지 않습니다.');
            }

            setIsLoading(false);
        };

        handlePasswordReset();
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p>비밀번호 재설정 준비중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center text-white">
                    <h3 className="font-semibold mb-2">오류가 발생했습니다</h3>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="bg-white/10 hover:bg-white/20 border border-white px-4 py-2 rounded transition-colors"
                    >
                        다시 요청하기
                    </button>
                </div>
            </div>
        );
    }

    return <ResetPasswordForm />;
}
