// app/auth/auth-code-error/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthErrorPage() {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();

    useEffect(() => {
        // 카운트다운 타이머 설정
        const timer = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1);
        }, 1000);

        // 정리(cleanup) 함수에서 타이머 제거
        return () => clearInterval(timer);
    }, []);

    // 카운트다운이 0이 되면 리디렉션하는 별도의 useEffect
    useEffect(() => {
        if (countdown <= 0) {
            // 타이머가 0에 도달하면 로그인 페이지로 리디렉션
            router.push('/login');
        }
    }, [countdown, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <div className="text-red-500 mb-6">
                    {/* 에러 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">인증 오류</h1>

                <p className="text-gray-600 mb-6">
                    로그인 과정에서 문제가 발생했습니다. <br />
                    잠시 후 다시 시도해 주세요.
                </p>

                <div className="mb-6 text-sm text-gray-500">
                    {countdown > 0 ? `${countdown}초 후 자동으로 로그인 페이지로 이동합니다.` : '로그인 페이지로 이동 중...'}
                </div>

                <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    로그인으로 돌아가기
                </button>
            </div>
        </div>
    );
}