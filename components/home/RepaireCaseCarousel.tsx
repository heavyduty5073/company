'use client';

import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import Link from 'next/link';
import { Posts } from "@/utils/supabase/types";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import RepairCard from './RepairCard';

interface RepairCaseCarouselProps {
    cases: Posts[];
}

const RepairCaseCarousel: React.FC<RepairCaseCarouselProps> = ({ cases }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const [isPaused, setIsPaused] = useState(false);
    const [cardsWidth, setCardsWidth] = useState<number[]>([]);
    const [position, setPosition] = useState(0);
    const [cardCount, setCardCount] = useState(4);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // 카드 설정 업데이트를 useCallback으로 최적화
    const updateCardSettings = useCallback(() => {
        if (typeof window === 'undefined' || !carouselRef.current) return;

        const width = window.innerWidth;
        let newCardCount = 4;

        if (width < 640) {
            newCardCount = 1;
        } else if (width < 768) {
            newCardCount = 2;
        } else if (width < 1280) {
            newCardCount = 3;
        }

        setCardCount(newCardCount);

        const containerWidth = carouselRef.current.offsetWidth;
        const gap = 16;
        const cardWidth = (containerWidth / newCardCount) - (gap * 2);

        if (cases && cases.length > 0) {
            setCardsWidth(new Array(cases.length * 2).fill(cardWidth));
        }
    }, [cases]);

    // 리사이즈 이벤트 최적화 (디바운싱)
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const debouncedUpdate = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateCardSettings, 100);
        };

        updateCardSettings();
        window.addEventListener('resize', debouncedUpdate);

        return () => {
            window.removeEventListener('resize', debouncedUpdate);
            clearTimeout(timeoutId);
        };
    }, [updateCardSettings]);

    // 무한 스크롤 데이터 메모화
    const duplicatedCases = React.useMemo(() =>
            [...(cases || []), ...(cases || [])],
        [cases]
    );

    // 애니메이션 최적화
    useEffect(() => {
        if (!carouselRef.current || isPaused || cardsWidth.length === 0) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        let lastTimestamp = 0;

        const animate = (timestamp: number) => {
            if (timestamp - lastTimestamp < 16) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            lastTimestamp = timestamp;

            setPosition((prevPosition) => {
                let newPosition = prevPosition - 0.8;

                if (Math.abs(newPosition) >= cardsWidth[0] + 32) {
                    setCardsWidth(prev => [...prev.slice(1), prev[0]]);
                    newPosition = 0;
                }

                return newPosition;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused, cardsWidth]);

    // 이벤트 핸들러 최적화
    const handleMouseEnter = useCallback(() => setIsPaused(true), []);
    const handleMouseLeave = useCallback(() => setIsPaused(false), []);

    const handleCardMouseEnter = useCallback((index: number) => {
        setHoveredCard(index);
    }, []);

    const handleCardMouseLeave = useCallback(() => {
        setHoveredCard(null);
    }, []);

    // 데이터가 없는 경우 처리
    if (!cases || cases.length === 0) {
        return (
            <section className="py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <p>등록된 정비 사례가 없습니다.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
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
                        className="group flex items-center gap-2 bg-white rounded-full px-3 py-1 lg:px-5 lg:py-2 text-black transition-colors"
                    >
                        <span className="text-xs sm:text-base opacity-80 group-hover:opacity-100 font-jalnan">
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

                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div ref={carouselRef} className="overflow-hidden rounded-lg">
                        <div
                            className="flex gap-4"
                            style={{
                                transform: `translateX(${position}px)`,
                                transition: isPaused ? 'transform 0.3s ease' : 'none',
                                willChange: 'transform'
                            }}
                        >
                            {duplicatedCases.map((repairCase, index) => (
                                <RepairCard
                                    key={`${repairCase.id}-${index}`}
                                    repairCase={repairCase}
                                    cardWidth={cardsWidth[index] || 280}
                                    isHovered={hoveredCard === index}
                                    onMouseEnter={() => handleCardMouseEnter(index)}
                                    onMouseLeave={handleCardMouseLeave}
                                />
                            ))}
                        </div>
                    </div>

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

export default memo(RepairCaseCarousel);
