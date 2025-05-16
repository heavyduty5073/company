'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Posts } from "@/utils/supabase/types";
import { FaTools } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {extractFirstImage, getCompanyStyle} from "@/utils/utils";
import {categoryMap} from "@/lib/store/company";

interface RepairCaseCarouselProps {
    cases: Posts[];
}

const RepairCaseCarousel: React.FC<RepairCaseCarouselProps> = ({ cases }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [cardsWidth, setCardsWidth] = useState<number[]>([]);
    const [position, setPosition] = useState(0);
    const [cardCount, setCardCount] = useState(4); // 기본값 4개

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
                const margin = 32; // mx-4 = 16px * 2
                const cardWidth = (containerWidth / newCardCount) - margin;

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
                    let newPosition = prevPosition - 1; // 천천히 이동

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
        <div className="w-full mx-auto w-full overflow-hidden py-4 mb-12">
            <Link href={'/repair'} className={'flex justify-between items-center max-w-7xl mx-auto px-4 md:px-0'}>
                <motion.h2
                    className="text-2xl sm:text-4xl text-white text-start my-3 md:my-12 font-Paperlogy"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    최근 정비 사례
                </motion.h2>
                <motion.div
                    className="text-white my-3 md:my-12"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ x: 5 }}
                >
                    <IoIosArrowForward className={'w-10 md:w-12 h-10 md:w-12 text-center'} />
                </motion.div>
            </Link>

            <div
                className="relative px-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={carouselRef}
                    className="overflow-hidden"
                >
                    <div
                        className="flex"
                        style={{
                            transform: `translateX(${position}px)`,
                            transition: isPaused ? 'transform 0.3s ease' : 'none'
                        }}
                    >
                        {duplicatedCases.map((repairCase, index) => {
                            // 첫 번째 이미지 URL 추출
                            const imageUrl = extractFirstImage(repairCase.contents || '');
                            const cardWidth = cardsWidth[index] || 280; // 기본값 설정
                            const categoryStyle = categoryMap[repairCase.category] || { icon: <FaTools className="w-3 h-3 mr-1" />, name: repairCase.category, bgColor: 'bg-gray-500', textColor: 'text-white' };
                            const companyStyle = getCompanyStyle(repairCase.company ||'');

                            return (
                                <div
                                    key={`${repairCase.id}-${index}`}
                                    className="flex-shrink-0 mx-4 bg-white rounded-lg"
                                    style={{ width: `${cardWidth}px` }}
                                >
                                    <Link href={`/repair/${repairCase.id}`}>
                                        <Card className="h-full justify-between transition-all duration-300 hover:shadow-xl hover:border-blue-300">
                                            <CardHeader className="p-3">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge
                                                        className={`flex items-center ${categoryStyle.bgColor} ${categoryStyle.textColor}`}
                                                    >
                                                        <FaTools className="w-3 h-3 mr-1" />
                                                        {categoryStyle.name}
                                                    </Badge>
                                                    <Badge
                                                        className={`${companyStyle.bgColor} ${companyStyle.textColor}`}
                                                    >
                                                        {repairCase.company}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <h3 className="text-lg font-jalnan text-gray-800 mb-2 truncate">
                                                    {repairCase.title}
                                                </h3>

                                                {/* 이미지 표시 영역 */}
                                                {imageUrl && (
                                                    <div className="relative w-full h-44 lg:h-[20vh] mb-3 overflow-hidden rounded-md">
                                                        <Image
                                                            src={imageUrl}
                                                            alt={repairCase.title}
                                                            fill
                                                            sizes={`${cardWidth}px`}
                                                            className="object-cover transform hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                )}

                                                <div className="h-10 overflow-hidden text-sm text-black">
                                                    {repairCase.contents ? (
                                                        <div
                                                            className="line-clamp-2"
                                                            dangerouslySetInnerHTML={{
                                                                __html: repairCase.contents.replace(/<[^>]*>/g, ' ').slice(0, 200) + '...'
                                                            }}
                                                        />
                                                    ) : (
                                                        <p>내용 없음</p>
                                                    )}
                                                </div>
                                            </CardContent>

                                            <CardFooter className="p-3">
                                                <div className="text-sm text-gray-500 w-full">
                                                    {new Date(repairCase.created_at).toLocaleDateString('ko-KR')}
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepairCaseCarousel;