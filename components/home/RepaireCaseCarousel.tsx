'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Posts } from "@/utils/supabase/types";
import { FaTools, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extractFirstImage, getCompanyStyle } from "@/utils/utils";
import { categoryMap } from "@/lib/store/company";
import { TiSpanner } from "react-icons/ti";
interface RepairCaseCarouselProps {
    cases: Posts[];
}

const RepairCaseCarousel: React.FC<RepairCaseCarouselProps> = ({ cases }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [cardsWidth, setCardsWidth] = useState<number[]>([]);
    const [position, setPosition] = useState(0);
    const [cardCount, setCardCount] = useState(4);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // 화면 크기에 따라 카드 개수와 너비 조정
    useEffect(() => {
        const updateCardSettings = () => {
            if (typeof window === 'undefined') return;

            const width = window.innerWidth;
            let newCardCount = 4; // 기본값

            if (width < 640) {
                newCardCount = 1; // 모바일
            } else if (width < 768) {
                newCardCount = 2; // 태블릿
            } else if (width < 1280) {
                newCardCount = 3; // 작은 데스크탑
            } else {
                newCardCount = 4; // 큰 화면
            }

            setCardCount(newCardCount);

            // 카드 크기 계산 (여백 포함)
            if (carouselRef.current) {
                const containerWidth = carouselRef.current.offsetWidth;
                const gap = 16; // 카드 간 간격
                const cardWidth = (containerWidth / newCardCount) - (gap * 2);

                // 모든 카드에 같은 너비 적용
                if (cases && cases.length > 0) {
                    setCardsWidth(new Array(cases.length * 2).fill(cardWidth));
                }
            }
        };

        // 초기 설정
        updateCardSettings();

        // 리사이즈 이벤트 리스너
        window.addEventListener('resize', updateCardSettings);
        return () => window.removeEventListener('resize', updateCardSettings);
    }, [cases]);

    // 무한 스크롤을 위한 복제 배열
    const duplicatedCases = [...(cases || []), ...(cases || [])];

    // 에스컬레이터 효과 애니메이션
    useEffect(() => {
        if (!carouselRef.current || isPaused || cardsWidth.length === 0) return;

        let animationId: number;
        let lastTimestamp: number;

        const animate = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;

            // 프레임 간 일정한 속도 유지 (60fps 기준)
            if (elapsed > 16) {
                lastTimestamp = timestamp;

                setPosition((prevPosition) => {
                    let newPosition = prevPosition - 0.8; // 속도 약간 조정

                    // 첫 번째 카드가 완전히 화면 밖으로 나가면
                    if (Math.abs(newPosition) >= cardsWidth[0] + 32) { // 카드 너비 + 여백
                        // 첫 번째 카드를 배열 끝으로 이동
                        setCardsWidth(prev => [...prev.slice(1), prev[0]]);
                        newPosition = 0;
                    }

                    return newPosition;
                });
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [isPaused, cardsWidth]);

    // 마우스 호버 효과
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
                {/* 섹션 헤더 */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <motion.h2
                        className="text-2xl sm:text-3xl lg:text-4xl text-white font-Paperlogy"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        최근 정비 사례
                    </motion.h2>

                    <Link
                        href="/repair"
                        className="group flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                    >
                        <span className="text-sm sm:text-base opacity-80 group-hover:opacity-100">
                            더 보기
                        </span>
                        <motion.div
                            className="p-2 rounded-full bg-blue-600/20 group-hover:bg-blue-600/40 transition-all"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            whileHover={{ x: 5 }}
                        >
                            <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.div>
                    </Link>
                </div>

                {/* 캐러셀 컨테이너 */}
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        ref={carouselRef}
                        className="overflow-hidden rounded-lg"
                    >
                        <div
                            className="flex gap-4"
                            style={{
                                transform: `translateX(${position}px)`,
                                transition: isPaused ? 'transform 0.3s ease' : 'none'
                            }}
                        >
                            {duplicatedCases.map((repairCase, index) => {
                                const imageUrl = extractFirstImage(repairCase.contents || '');
                                const cardWidth = cardsWidth[index] || 280;
                                const categoryStyle = categoryMap[repairCase.category] || {
                                    icon: <FaTools className="w-3 h-3 mr-1" />,
                                    name: repairCase.category || '기타',
                                    bgColor: 'bg-gray-500',
                                    textColor: 'text-white'
                                };
                                const companyStyle = getCompanyStyle(repairCase.company || '');

                                return (
                                    <motion.div
                                        key={`${repairCase.id}-${index}`}
                                        className="flex-shrink-0"
                                        style={{ width: `${cardWidth}px` }}
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link href={`/repair/${repairCase.id}`} className="block h-full">
                                            <Card className="h-full bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden">
                                                {/* 카드 헤더: 카테고리 및 회사 배지 */}
                                                <CardHeader className="p-3 pb-1">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <Badge
                                                            className={`flex items-center text-xs ${categoryStyle.bgColor} ${categoryStyle.textColor} px-2 py-1 font-medium rounded-md`}
                                                        >
                                                            <TiSpanner className={'w-5 h-5'}/>
                                                            {categoryStyle.name}
                                                        </Badge>

                                                        <Badge
                                                            className={`text-xs ${companyStyle.bgColor} ${companyStyle.textColor} px-2 py-1 font-medium rounded-md`}
                                                        >
                                                            {repairCase.company || '기타 제조사'}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>

                                                {/* 카드 내용 */}
                                                <CardContent className="p-3 pt-2">
                                                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 line-clamp-1">
                                                        {repairCase.title}
                                                    </h3>

                                                    {/* 이미지 영역 */}
                                                    <div className="relative w-full h-40 sm:h-48 lg:h-56 mb-3 overflow-hidden rounded-md bg-gray-700">
                                                        {imageUrl ? (
                                                            <Image
                                                                src={imageUrl}
                                                                alt={repairCase.title || '정비 사례 이미지'}
                                                                fill
                                                                loading="lazy"
                                                                sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw`}
                                                                className={`object-cover transition-transform duration-500 ${hoveredCard === index ? 'scale-110' : 'scale-100'}`}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FaTools className="w-12 h-12 text-gray-500" />
                                                            </div>
                                                        )}

                                                        {/* 이미지 위에 반투명 오버레이 (가독성 향상) */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40"></div>
                                                    </div>

                                                    {/* 콘텐츠 미리보기 */}
                                                    <div className="h-12 overflow-hidden text-xs sm:text-sm text-gray-300">
                                                        {repairCase.contents ? (
                                                            <div
                                                                className="line-clamp-2"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: repairCase.contents
                                                                        .replace(/<[^>]*>/g, ' ')
                                                                        .slice(0, 180) + '...'
                                                                }}
                                                            />
                                                        ) : (
                                                            <p>자세한 내용은 클릭하여 확인하세요.</p>
                                                        )}
                                                    </div>
                                                </CardContent>

                                                {/* 카드 푸터: 날짜 표시 */}
                                                <CardFooter className="p-3 pt-0">
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(repairCase.created_at).toLocaleDateString('ko-KR', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>

                                                        <motion.span
                                                            className={`text-xs text-blue-400 flex items-center gap-1 ${hoveredCard === index ? 'opacity-100' : 'opacity-0'}`}
                                                            animate={{ x: hoveredCard === index ? 0 : -10 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            자세히 보기
                                                            <FaArrowRight size={10} />
                                                        </motion.span>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 캐러셀 네비게이션 힌트 (선택 사항) */}
                    <div className="hidden sm:flex items-center justify-center mt-6 text-xs text-gray-400">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex items-center gap-2"
                        >
                            <span>마우스를 올리면 자동 슬라이드가 일시 정지됩니다</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RepairCaseCarousel;