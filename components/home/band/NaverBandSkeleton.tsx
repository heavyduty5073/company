// components/band/NaverBandSkeleton.tsx
'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const NaverBandSkeleton: React.FC = () => {
    return (
        <section className="py-10 md:py-16 bg-main">
            <div className="container mx-auto px-4">
                {/* Header skeleton - 더 단순화됨 */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center mb-4">
                        <Skeleton className="h-8 w-52 rounded" />
                    </div>
                    <Skeleton className="w-full max-w-xl h-4 rounded mb-2" />
                </div>

                {/* Posts skeleton - 더 단순화됨 */}
                <div className="w-full max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 gap-6 md:gap-8">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* 이미지 스켈레톤 - 위에서 아래로 로딩되는 효과와 외곽 빛 효과 추가 */}
                                    <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden bg-gray-800">
                                        {/* 외곽 빛나는 효과를 위한 박스 쉐도우 */}
                                        <div
                                            className="absolute inset-0 w-full h-full"
                                            style={{
                                                boxShadow: "inset 0 0 15px rgba(255, 255, 255, 0.15)",
                                                animation: "glowPulse 3s infinite alternate"
                                            }}
                                        ></div>

                                        {/* 위에서 아래로 움직이는 그라데이션 효과 */}
                                        <div
                                            className="absolute inset-0 w-full h-full overflow-hidden"
                                        >
                                            <div
                                                className="absolute inset-0 w-full h-full"
                                                style={{
                                                    background: 'linear-gradient(to bottom, transparent, rgba(100, 100, 120, 0.1), transparent)',
                                                    animation: 'moveDown 1.5s infinite'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* 내용 스켈레톤 - 더 단순화됨 */}
                                    <div className="p-6 flex flex-col md:w-2/3">
                                        {/* 헤더 */}
                                        <div className="flex items-center mb-4">
                                            <Skeleton className="w-6 h-6 rounded-full mr-2" />
                                            <Skeleton className="h-4 w-32 rounded" />
                                        </div>

                                        {/* 본문 */}
                                        <div className="mb-6 space-y-2">
                                            <Skeleton className="h-4 rounded w-full" />
                                            <Skeleton className="h-4 rounded w-full" />
                                            <Skeleton className="h-4 rounded w-2/3" />
                                        </div>

                                        {/* 푸터 */}
                                        <div className="flex justify-between items-center mt-auto">
                                            <Skeleton className="h-4 w-20 rounded" />
                                            <Skeleton className="h-4 w-20 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NaverBandSkeleton;
