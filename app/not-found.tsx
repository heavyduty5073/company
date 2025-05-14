import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, Home, Truck, Construction, Phone, Wrench } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
            {/* 배경 효과 - 엔지니어링 도면 스타일 */}
            <div className="absolute inset-0 bg-slate-800 z-0">
                <div className="absolute inset-0 opacity-5 bg-[url('/images/blueprint.svg')] bg-repeat bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-lg w-full">
                {/* 상단 메인 카드 */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border-t-4 border-yellow-500">
                    {/* 헤더 섹션 - 404와 파워 숫자 디자인 */}
                    <div className="bg-gradient-to-r from-[#003247] to-slate-900 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Construction className="h-10 w-10 text-yellow-400" />
                                <div>
                                    <h3 className="text-white font-bold text-xl">DS 건설기계</h3>
                                    <p className="text-gray-300 text-sm">중장비 전문 업체</p>
                                </div>
                            </div>
                            <div className="relative">
                                <AlertTriangle className="absolute -top-4 -right-4 h-6 w-6 text-yellow-400" />
                                <div className="text-6xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(255, 209, 0, 0.5)' }}>404</div>
                            </div>
                        </div>
                    </div>

                    {/* 중앙 콘텐츠 섹션 */}
                    <div className="p-8">
                        <div className="flex justify-center">
                            <div className="bg-yellow-100 p-4 rounded-full mb-6 relative">
                                <Truck className="h-16 w-16 text-yellow-600" />
                                <div className="absolute -top-2 -right-2 bg-red-500 h-6 w-6 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">!</span>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
                            현재 페이지를 찾을 수 없습니다
                        </h2>

                        <div className="text-gray-600 text-center space-y-3 mb-8">
                            <p>요청하신 페이지는 준비 중이거나 이동되었을 수 있습니다.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-3 border-y border-dashed border-slate-200">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">ERROR CODE:</span>
                                </div>
                                <div className="font-mono bg-slate-100 px-3 py-1 rounded text-slate-700">PAGE_NOT_FOUND</div>
                            </div>
                            <p>정비소 직원이 문제를 해결하는 동안 아래 링크를 통해 이동하세요.</p>
                        </div>

                        <div className="flex gap-4 justify-center items-center">
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-2 text-center py-3 px-6 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-md hover:from-yellow-600 hover:to-amber-700 transition-all shadow-md"
                            >
                                <Home className="h-5 w-5" />
                                <span className="font-jalnan">홈으로</span>
                            </Link>
                        </div>
                    </div>

                    {/* 하단 연락처 섹션 */}
                    <div className="bg-slate-50 p-4 border-t border-slate-200">
                        <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 text-slate-600 text-sm">
                            <div className="flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-slate-500" />
                                <span>전문 수리 서비스</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-500" />
                                <Link href="tel:010-2036-5073" className="hover:text-blue-600">010-2036-5073</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 바닥 안내 메시지 */}
            <div className="relative z-10 mt-10 text-sm text-gray-300 text-center">
                <p>기술 지원이 필요하시면 <Link href="mailto:heavyduty5073@gmail.com" className="text-yellow-400 hover:underline">기술지원팀</Link>에 문의하세요.</p>
                <p className="mt-2 text-xs">&copy; {new Date().getFullYear()} DS 건설기계. 모든 권리 보유.</p>
            </div>
        </div>
    );
}