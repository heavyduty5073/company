'use client'
import React from 'react';
import CountUp from "react-countup";

function CountView() {
    const stats = [
        {
            icon: "🔧",
            number: 5000,
            suffix: "+",
            label: "누적 정비건수",
            description: "2019년부터 현재까지"
        },
        {
            icon: "🚚",
            number: 98,
            suffix: "%",
            label: "고객만족도",
            description: "고객 피드백 기준"
        },
        {
            icon: "⚡",
            number: 24,
            suffix: "시간",
            label: "응급출장서비스",
            description: "연중무휴 출장수리"
        },
        {
            icon: "🏭",
            number: 6,
            suffix: "년",
            label: "업계 경력",
            description: "축적된 전문 노하우"
        },
        {
            icon: "🛠️",
            number: 850,
            suffix: "+",
            label: "부품 재고보유",
            description: "즉시 교체 가능"
        },
        {
            icon: "📍",
            number: 2,
            suffix: "개소",
            label: "지역 거점",
            description: "군산본점, 김제점"
        }
    ];

    return (
        <div className="w-full">
            {/* 섹션 타이틀 */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    DS 건설기계와 함께하는
                    <span className="text-yellow-400 block mt-2">믿을 수 있는 파트너십</span>
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    6년간 쌓아온 전문성과 신뢰로 고객의 건설기계를 완벽하게 관리합니다
                </p>
            </div>

            {/* 통계 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                    >
                        {/* 아이콘 */}
                        <div className="text-4xl mb-4">
                            {stat.icon}
                        </div>

                        {/* 숫자 카운터 */}
                        <div className="mb-3">
                            <span className="text-4xl md:text-5xl font-bold text-yellow-400">
                                <CountUp
                                    end={stat.number}
                                    duration={2.5}
                                    separator=","
                                    delay={index * 0.2} // 순차적 애니메이션
                                />
                            </span>
                            <span className="text-2xl md:text-3xl font-bold text-yellow-400 ml-1">
                                {stat.suffix}
                            </span>
                        </div>

                        {/* 라벨 */}
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {stat.label}
                        </h3>

                        {/* 설명 */}
                        <p className="text-gray-300 text-sm">
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* 하단 설명 섹션 */}
            <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl p-8 border border-yellow-400/30">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        🏆 전문 건설기계 정비 서비스
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div>
                            <h4 className="text-lg font-semibold text-yellow-400 mb-2">주요 서비스</h4>
                            <ul className="text-gray-300 space-y-1">
                                <li>• 굴삭기, 로더, 덤프트럭 정비</li>
                                <li>• 건설기계 부품 판매</li>
                                <li>• 응급 출장수리</li>
                                <li>• 정기점검 및 예방정비</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-yellow-400 mb-2">서비스 지역</h4>
                            <ul className="text-gray-300 space-y-1">
                                <li>• 군산 지역 (본점 운영)</li>
                                <li>• 김제 지역 (지점 운영)</li>
                                <li>• 전 지역 출장서비스</li>
                                <li>• 인근 지역 응급출동</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CountView;