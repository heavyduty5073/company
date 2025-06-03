'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Wrench, Settings, Truck, Package } from 'lucide-react';

interface ContactBannerProps {
    className?: string;
}

const ContactBanner: React.FC<ContactBannerProps> = ({ className = '' }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // 캐러셀 콘텐츠 데이터 - 간소화
    const carouselContent = [
        {
            icon: <Wrench className="text-yellow-400 mr-2 flex-shrink-0" size={20} />,
            title: "건설기계 수리",
            phone: "010-1111-1234"
        },
        {
            icon: <Settings className="text-yellow-400 mr-2 flex-shrink-0" size={20} />,
            title: "DPF·SCR 정비",
            phone: "010-1111-1234"
        },
        {
            icon: <Package className="text-yellow-400 mr-2 flex-shrink-0" size={20} />,
            title: "부품 판매",
            phone: "010-1111-1234"
        },
        {
            icon: <Truck className="text-yellow-400 mr-2 flex-shrink-0" size={20} />,
            title: "24시간 출장",
            phone: "010-1111-1234"
        }
    ];

    // 자동 슬라이드 효과
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
        }, 3000); // 3초마다 슬라이드

        return () => clearInterval(interval);
    }, [carouselContent.length]);

    const handleCall = () => {
        window.location.href = 'tel:010-1111-1234';
    };

    return (
        <>
            {/* 큰 화면용 세로 배너 */}
            <div className={`hidden lg:block ${className}`}>
                <div className="bg-gradient-to-b from-blue-900 to-blue-800 rounded-xl shadow-2xl w-72 overflow-hidden border border-blue-700">
                    {/* 헤더 */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4">
                        <div className="flex items-center">
                            <Wrench className="text-2xl mr-3" size={24} />
                            <div>
                                <h3 className="text-lg font-bold">DS 건설기계</h3>
                                <p className="text-sm text-blue-100">전문 정비 서비스</p>
                            </div>
                        </div>
                    </div>

                    {/* 메인 콘텐츠 */}
                    <div className="p-5 space-y-4">
                        {/* 서비스 소개 */}
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-white mb-2">24시간 출장 서비스</h4>
                            <p className="text-sm text-blue-100">
                                굴삭기, 로더, 덤프트럭 등<br />
                                모든 건설기계 정비
                            </p>
                        </div>

                        {/* 주요 서비스 */}
                        <div className="bg-blue-800/50 rounded-lg p-3 border border-blue-600">
                            <h5 className="font-bold text-white mb-2 text-sm">전문 서비스</h5>
                            <ul className="text-xs space-y-1 text-blue-100">
                                <li className="flex items-center">
                                    <span className="text-yellow-400 mr-2">⚡</span>
                                    VGT 터보 정비
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-400 mr-2">⚡</span>
                                    DPF 청소 및 교체
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-400 mr-2">⚡</span>
                                    요소수 시스템 정비
                                </li>
                                <li className="flex items-center">
                                    <span className="text-yellow-400 mr-2">⚡</span>
                                    엔진 오버홀
                                </li>
                            </ul>
                        </div>

                        {/* 연락처 정보 */}
                        <div className="space-y-3">
                            <div className="bg-blue-800/30 rounded-lg p-3">
                                <div className="flex items-center mb-2">
                                    <Phone size={14} className="text-blue-300 mr-2" />
                                    <span className="text-sm font-medium text-white">긴급 출장 전화</span>
                                </div>
                                <p className="text-lg font-bold text-yellow-400">010-1111-1234</p>
                            </div>

                            <div className="bg-blue-800/30 rounded-lg p-3">
                                <div className="flex items-center mb-1">
                                    <MapPin size={14} className="text-blue-300 mr-2" />
                                    <span className="text-sm font-medium text-white">위치</span>
                                </div>
                                <p className="text-xs text-blue-100">군산시 해망로 663</p>
                            </div>

                            <div className="bg-blue-800/30 rounded-lg p-3">
                                <div className="flex items-center mb-1">
                                    <Clock size={14} className="text-blue-300 mr-2" />
                                    <span className="text-sm font-medium text-white">영업시간</span>
                                </div>
                                <p className="text-xs text-blue-100">평일 09:00 - 18:00</p>
                                <p className="text-xs text-yellow-400">24시간 긴급출장</p>
                            </div>
                        </div>

                        {/* 전화 버튼 */}
                        <button
                            onClick={handleCall}
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center justify-center shadow-lg"
                        >
                            <Phone size={16} className="mr-2" />
                            지금 전화하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 작은 화면용 캐러셀 배너 */}
            <div className={`lg:hidden w-full bg-main ${className}`} style={{ height: '12vh' }}>
                <div className="px-4 py-2 h-full flex flex-col">
                    <div className="bg-gradient-to-r from-blue-900/80 to-blue-800/80 rounded-lg shadow-lg overflow-hidden h-full border border-blue-700/50">
                        <div className="p-3 h-full flex flex-col justify-center">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {carouselContent.map((content, index) => (
                                    <div key={index} className="w-full flex-shrink-0">
                                        <div className="flex items-center justify-between">
                                            {/* 왼쪽 정보 */}
                                            <div className="flex items-center flex-1 min-w-0">
                                                {content.icon}
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-white">{content.title}</h3>
                                                </div>
                                            </div>

                                            {/* 중앙 연락처 */}
                                            <div className="flex items-center mx-4 flex-shrink-0">
                                                <Phone size={16} className="text-yellow-400 mr-2" />
                                                <div>
                                                    <p className="text-lg font-bold text-yellow-400">{content.phone}</p>
                                                </div>
                                            </div>

                                            {/* 오른쪽 버튼 */}
                                            <button
                                                onClick={handleCall}
                                                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg font-bold hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center shadow-lg whitespace-nowrap text-sm flex-shrink-0"
                                            >
                                                <Phone size={14} className="mr-1" />
                                                전화
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 슬라이드 인디케이터 */}
                            <div className="flex justify-center mt-3 space-x-2">
                                {carouselContent.map((_, dotIndex) => (
                                    <div
                                        key={dotIndex}
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                            dotIndex === currentSlide
                                                ? 'bg-yellow-400'
                                                : 'bg-blue-600/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactBanner;
