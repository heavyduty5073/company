'use client';

import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
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

// 개별 카드 컴포넌트를 메모화하여 불필요한 리렌더링 방지
const RepairCard = memo(({
                             repairCase,
                             cardWidth,
                             isHovered,
                             onMouseEnter,
                             onMouseLeave
                         }: {
    repairCase: Posts;
    cardWidth: number;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) => {
    const imageUrl = extractFirstImage(repairCase.contents || '');
    const categoryStyle = categoryMap[repairCase.category] || {
        icon: <FaTools className="w-3 h-3 mr-1" />,
        name: repairCase.category || '기타',
        bgColor: 'bg-gray-500',
        textColor: 'text-white'
    };
    const companyStyle = getCompanyStyle(repairCase.company || '');

    return (
        <motion.div
            className="flex-shrink-0"
            style={{ width: `${cardWidth}px` }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/repair/${repairCase.id}`} className="block h-full">
                <Card className="h-full bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-3 pb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge
                                className={`flex items-center text-xs ${categoryStyle.bgColor} ${categoryStyle.textColor} px-2 py-1 font-medium rounded-md`}
                            >
                                <TiSpanner className="w-5 h-5" />
                                {categoryStyle.name}
                            </Badge>
                            <Badge
                                className={`text-xs ${companyStyle.bgColor} ${companyStyle.textColor} px-2 py-1 font-medium rounded-md`}
                            >
                                {repairCase.company || '기타 제조사'}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 pt-2">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-3 line-clamp-1">
                            {repairCase.title}
                        </h3>

                        <div className="relative w-full h-40 sm:h-48 lg:h-56 mb-3 overflow-hidden rounded-md bg-gray-700">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={repairCase.title || '정비 사례 이미지'}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                    className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaTools className="w-12 h-12 text-gray-500" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40" />
                        </div>

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
                                className={`text-xs text-blue-400 flex items-center gap-1 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                animate={{ x: isHovered ? 0 : -10 }}
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
});

RepairCard.displayName = 'RepairCard';

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
