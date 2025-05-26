'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

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
            </div>
        </section>
    );
};

export default ContentSection;