import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

// 서버 컴포넌트 버전
function page() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-600 p-6 flex justify-center">
                    <AlertTriangle className="h-16 w-16 text-white" />
                </div>

                <div className="p-6 sm:p-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">접근 권한이 없습니다</h1>

                    <div className="text-gray-600 text-center space-y-4 mb-8">
                        <p>요청하신 페이지에 접근할 수 있는 권한이 없습니다.</p>
                        <p>관리자 계정으로 로그인하거나 필요한 권한을 요청하세요.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/home"
                            className="rounded-xl flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            홈으로
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
                <p>관리자에게 문의하세요.</p>
            </div>
        </div>
    );
}

export default page;