'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
// YouTube 비디오 컴포넌트
const YouTubeEmbed: React.FC<{ videoId: string; className?: string }> = ({ videoId, className = '' }) => {
    return (
        <div className={`relative overflow-hidden ${className}`} style={{ paddingBottom: '56.25%' }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
            />
        </div>
    );
};

const ContentSection: React.FC = () => {
    // 콘텐츠 카드에 사용할 데이터
    const contentCards: ContentCardProps[] = [
        {
            id: 1,
            title: '부품1',
            description: '부품설명',
            imageUrl: '/home/parts_01.jpg',
        },
        {
            id: 2,
            title: '부품2',
            description: '부품설명',
            imageUrl: '/home/parts_01.jpg',
        },
        {
            id: 3,
            title: '부품3',
            description: '부품설명',
            imageUrl: '/home/parts_01.jpg',
        },
        {
            id: 4,
            title: '부품4',
            description: '부품설명',
            imageUrl: '/home/parts_01.jpg',
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
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-main">
            {/* YouTube 동영상 섹션 */}
            <motion.div
                ref={videoRef}
                initial="hidden"
                animate={videoControls}
                variants={videoVariants}
                className="max-w-7xl mx-auto mb-20"
            >
                <div className="flex flex-col lg:flex-row items-center justify-between bg-gray-900 rounded-xl overflow-hidden shadow-xl">
                    <div className="p-8 lg:p-12 lg:w-1/2">
                        <h2 className="text-2xl lg:text-3xl sm:text-4xl font-Paperlogy text-white mb-6">
                            건설기계 진단 차량 보유
                        </h2>
                        <p className="text-gray-300 text-sm lg:text-lg mb-6">
                            최고의 품질과 서비스로 고객의 성공을 위한 최적의 솔루션을 제공합니다.
                            혁신적인 기술과 전문가의 노하우가 결합된 DS 건설기계와 함께 더 효율적인 작업 환경을 경험해보세요.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                        >
                            더 알아보기
                        </motion.button>
                    </div>
                    <div className="w-full lg:w-1/2 p-4 lg:p-8">
                        {/* YouTube 비디오 - videoId는 YouTube URL의 v= 다음에 오는 값입니다 */}
                        <YouTubeEmbed
                            videoId="D5Bs7IGXqrE"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </motion.div>

            {/* 제품 카드 섹션 */}
            <div className="max-w-7xl mx-auto">
                <Link href={'/parts'} className={'flex justify-between items-center'}>
                <motion.h2
                    className="text-2xl sm:text-4xl font-bold text-white text-start mb-12 font-Paperlogy"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    다양한 건설기계 부품
                </motion.h2>
                <motion.h2
                    className="text-white text-center mb-12 font-Paperlogy"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <IoIosArrowForward className={'w-12 h-12 text-center'}/>
                </motion.h2>
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contentCards.map((card, index) => (
                        <AnimatedCard key={card.id} card={card} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 개별 카드 컴포넌트에 애니메이션 적용
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
                delay: index * 0.3 // 카드가 순차적으로 나타나도록 지연 설정
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 }
            }}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <div className="h-48 overflow-hidden">
                <motion.img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.5 }
                    }}
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    문의하기
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ContentSection;