import React, { Suspense } from 'react';
import Image from "next/image";
import ResetPasswordHandler from "@/components/auth/resetPassword/ResetPasswordHandler";

function Page() {
    return (
        <div className="relative min-h-screen flex items-center justify-center py-20">
            {/* 배경 이미지 */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/login/loginBanner3.jpg"
                    alt="Reset Password Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* 오버레이 */}
            <div className="absolute inset-0 z-10"></div>

            {/* 비밀번호 재설정 핸들러 */}
            <div className="relative z-20 w-full max-w-md px-4">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                            <p>로딩중...</p>
                        </div>
                    </div>
                }>
                    <ResetPasswordHandler />
                </Suspense>
            </div>
        </div>
    );
}

export default Page;
