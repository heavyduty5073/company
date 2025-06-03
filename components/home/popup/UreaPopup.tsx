'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface UreaPopupProps {
    className?: string;
}

const UreaPopup: React.FC<UreaPopupProps> = ({ className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 모바일 감지
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // 팝업 표시 여부 확인
        const checkPopupVisibility = () => {
            const today = new Date().toDateString();
            const hideUntil = sessionStorage.getItem('hideUreaPopupUntil');

            if (!hideUntil || hideUntil !== today) {
                // 페이지 로드 후 2초 뒤에 팝업 표시
                setTimeout(() => {
                    setIsVisible(true);
                }, 2000);
            }
        };

        checkPopupVisibility();

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleHideToday = () => {
        const today = new Date().toDateString();
        sessionStorage.setItem('hideUreaPopupUntil', today);
        setIsVisible(false);
    };

    const handleCall = () => {
        window.location.href = 'tel:010-1111-1234';
    };

    const handlePurchase = () => {
        // 여기에 실제 구매 링크 URL을 넣으세요
        window.open('https://smartstore.naver.com/ds_daesung/products/11919704562', '_blank');
    };

    if (!isVisible) return null;

    // 모바일 팝업 (중앙 표시)
    if (isMobile) {
        return (
            <>
                {/* 배경 오버레이 */}
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-700">
                        {/* 헤더 */}
                        <div className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 relative">
                            <button
                                onClick={handleClose}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-lg font-bold text-center">🚛 요소수 첨가제 판매</h3>
                            <p className="text-sm text-center mt-1 text-blue-100">건설기계 전용 고품질 첨가제</p>
                        </div>

                        {/* 메인 콘텐츠 */}
                        <div className="p-4 space-y-4">
                            <div className="text-center">
                                <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-6">
                                    🔥 특가 판매
                                </div>

                                {/* 제품 이미지 */}
                                <div className="mb-3 flex justify-center">
                                    <div className="w-32 h-32 rounded-lg flex items-center justify-center">
                                        <Image
                                            src="/home/dswater.png"
                                            alt="요소수 첨가제"
                                            width={200}
                                            height={200}
                                            className="rounded-lg object-cover rotate-30"
                                            onError={(e) => {
                                                // 이미지 로드 실패시 대체 텍스트 표시
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.innerHTML = '<span class="text-gray-400 text-xs">요소수<br/>첨가제</span>';
                                            }}
                                        />
                                    </div>
                                </div>

                                <h4 className="text-lg font-bold text-white">요소수 첨가제</h4>
                            </div>

                            {/* 특징 */}
                            <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                                <ul className="text-sm space-y-1 text-gray-200">
                                    <li className="flex items-center">
                                        <span className="text-blue-400 mr-2">✓</span>
                                        DPF 막힘 방지 및 청소 효과
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-400 mr-2">✓</span>
                                        연료 효율성 향상 (5-10%)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-400 mr-2">✓</span>
                                        엔진 수명 연장
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-400 mr-2">✓</span>
                                        유지보수 비용 절감
                                    </li>
                                </ul>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="space-y-3">
                                <button
                                    onClick={handlePurchase}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-bold text-sm hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center justify-center shadow-lg"
                                >
                                    <ShoppingCart size={16} className="mr-2" />
                                    지금 바로 구매
                                </button>

                                <button
                                    onClick={handleCall}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    <Phone size={16} className="mr-2" />
                                    전화 문의: 010-2036-5073
                                </button>
                            </div>

                            {/* 하단 버튼 */}
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleHideToday}
                                    className="text-xs text-gray-100 underline hover:text-gray-400 transition-colors px-2 py-1"
                                >
                                    오늘 하루 보지 않기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // 웹 팝업 (왼쪽 고정)
    return (
        <div className="fixed left-20 top-1/2 -translate-y-1/2 z-50 animate-in slide-in-from-left duration-500">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl w-96 overflow-hidden border border-gray-700">
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">🚛</div>
                        <div>
                            <h3 className="text-lg font-bold">요소수 첨가제 판매</h3>
                            <p className="text-sm text-blue-100">건설기계 전용 고품질 첨가제</p>
                        </div>
                    </div>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="p-5 space-y-4">
                    <div className="text-center">
                        <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
                            🔥 특가 판매중
                        </div>

                        {/* 제품 이미지 */}
                        <div className="mb-4 flex justify-center">
                            <div className="w-32 h-32 rounded-lg flex items-center justify-center">
                                <Image
                                    src="/home/dswater.png"
                                    alt="요소수 첨가제"
                                    width={500}
                                    height={500}
                                    className="rounded-lg object-cover"
                                    onError={(e) => {
                                        // 이미지 로드 실패시 대체 텍스트 표시
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.innerHTML = '<span class="text-gray-400 text-sm">요소수<br/>첨가제</span>';
                                    }}
                                />
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-2">요소수 첨가제</h4>
                    </div>

                    {/* 주요 특징 */}
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <h5 className="font-bold text-white mb-3">주요 효과</h5>
                        <ul className="text-sm space-y-2 text-gray-200">
                            <li className="flex items-center">
                                <span className="text-blue-400 mr-2 font-bold">✓</span>
                                DPF 막힘 방지 및 청소 효과
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-400 mr-2 font-bold">✓</span>
                                연료 효율성 향상 (5-10%)
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-400 mr-2 font-bold">✓</span>
                                엔진 수명 연장
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-400 mr-2 font-bold">✓</span>
                                유지보수 비용 절감
                            </li>
                        </ul>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="space-y-3">
                        <button
                            onClick={handlePurchase}
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center justify-center shadow-lg"
                        >
                            <ShoppingCart size={18} className="mr-2" />
                            지금 바로 구매
                        </button>

                        <button
                            onClick={handleCall}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            <Phone size={16} className="mr-2" />
                            전화 문의: 010-2036-5073
                        </button>
                    </div>

                    {/* 하단 액션 */}
                    <div className="flex justify-end pt-2 border-t border-gray-700">
                        <button
                            onClick={handleHideToday}
                            className="text-sm text-gray-100 underline hover:text-gray-400 transition-colors px-2 py-1"
                        >
                            오늘 하루 보지 않기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UreaPopup;
