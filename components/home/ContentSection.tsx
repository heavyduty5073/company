'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import Image from "next/image"; // Next.js Image 최적화 컴포넌트 사용

interface ContentCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

interface AnimatedCardProps {
    card: ContentCardProps;
    index: number;
}

// YouTube 비디오 컴포넌트 - 접근성 및 성능 개선
const YouTubeEmbed: React.FC<{ videoId: string; className?: string }> = ({ videoId, className = '' }) => {
    return (
        <div className={`relative overflow-hidden rounded-xl shadow-xl ${className}`} style={{ paddingBottom: '56.25%' }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                loading="lazy" // 지연 로딩
                frameBorder="0"
                aria-label="DS 건설기계 진단 차량 소개 영상"
            />
        </div>
    );
};

const ContentSection: React.FC = () => {
    // 콘텐츠 카드에 사용할 데이터
    const contentCards: ContentCardProps[] = [
        {
            id: 1,
            title: '유압 부품',
            description: '고품질 유압 실린더 및 펌프 부품',
            imageUrl: '/home/parts_02.jpg',
        },
        {
            id: 2,
            title: '엔진 부품',
            description: '고성능 엔진 및 관련 부품',
            imageUrl: '/home/parts_03.jpg',
        },
        {
            id: 3,
            title: '전기 시스템',
            description: '정밀한 전기 제어 시스템 부품',
            imageUrl: '/home/parts_04.jpg',
        },
        {
            id: 4,
            title: '구동 부품',
            description: '내구성 높은 구동 시스템 부품',
            imageUrl: '/home/parts_05.jpg',
        },
    ];

    // YouTube 동영상 섹션 애니메이션
    const [videoRef, videoInView] = useInView({
        threshold: 0.3,
        triggerOnce: true
    });
    const videoControls = useAnimation();

    useEffect(() => {
        if (videoInView) {
            videoControls.start('visible');
        }
    }, [videoControls, videoInView]);

    const videoVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* 유튜브 동영상 섹션 */}
                <motion.div
                    ref={videoRef}
                    initial="hidden"
                    animate={videoControls}
                    variants={videoVariants}
                    className="mb-24 mt-12"
                >
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-stretch">
                            {/* 텍스트 섹션 */}
                            <div className="p-6 lg:p-8 lg:w-1/2 flex flex-col justify-center">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-Paperlogy text-white mb-8 text-start">
                                    건설기계 전문 서비스
                                </h2>
                                <div className="h-1 w-full bg-blue-600 mb-6 rounded-full"></div>
                                <p className="text-gray-300 text-sm lg:text-base mb-8 leading-relaxed">
                                    최고의 품질과 서비스로 고객의 성공을 위한 최적의 솔루션을 제공합니다.
                                    혁신적인 기술과 전문가의 노하우가 결합된 DS 건설기계와 함께 더 효율적인 작업 환경을 경험해보세요.
                                </p>
                                <Link href="/business/trip" className="inline-block">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center"
                                    >
                                        더 알아보기
                                        <IoIosArrowForward className="ml-1" />
                                    </motion.button>
                                </Link>
                            </div>

                            {/* 비디오 섹션 */}
                            <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10">
                                <YouTubeEmbed videoId="D5Bs7IGXqrE" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 제품 카드 섹션 */}
                <div className="my-24">
                    <div className="flex justify-between items-center mb-10">
                        <motion.h2
                            className="text-2xl sm:text-3xl lg:text-4xl text-white font-Paperlogy"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            다양한 건설기계 부품
                        </motion.h2>

                        <Link href="/parts" className="group">
                            <motion.div
                                className="flex items-center text-white text-sm sm:text-base"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="mr-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    전체보기
                                </span>
                                <div className="p-2 rounded-full bg-blue-600/20 group-hover:bg-blue-600/50 transition-all">
                                    <IoIosArrowForward className="w-5 h-5" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {contentCards.map((card, index) => (
                            <AnimatedCard key={card.id} card={card} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// 개별 카드 컴포넌트에 애니메이션 적용 - 디자인 개선
const AnimatedCard: React.FC<AnimatedCardProps> = ({ card, index }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.2 // 약간 빠르게 조정
            }
        }
    };

    return (
        <div className="relative group h-80">
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 }
            }}
            className="bg-gradient-to-b from-subMain to-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300 group relative"
        >
            <div className="h-64 overflow-hidden">
                <div className="relative h-full w-full">
                    {/* Next.js Image 컴포넌트 사용 */}
                    <Image
                        src={card.imageUrl}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>
            </div>

            <div className="px-6 py-5 relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-300 text-sm">{card.description}</p>
            </div>

        </motion.div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-4/5 opacity-0 group-hover:opacity-100 transform translate-y-12 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                <Link href="/support/inquiry" className="block">
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-xl hover:shadow-blue-600/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-blue-500/30"
                    >
                        문의하기
                        <IoIosArrowForward className="ml-1" />
                    </motion.button>
                </Link>
            </div>
            </div>
    );
};

export default ContentSection;