'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideImage {
    id: number;
    url: string;
    title: string;
    description: string;
}

const ImageSlider: React.FC = () => {
    const images: SlideImage[] = [
        {
            id: 1,
            url: '/home/homeImg1.jpg',
            title: '최고의 기술력으로 승부합니다.',
            description: ''
        },
        {
            id: 2,
            url: '/home/homeImg2.jpg',
            title: '',
            description: ''
        },
        {
            id: 3,
            url: '/home/homeImg3.jpg',
            title: '',
            description: ''
        },
    ];

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // 이미지 자동 순환
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    // 수동으로 이미지 변경
    const handlePrev = (): void => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = (): void => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % images.length
        );
    };

    // 인디케이터 클릭으로 이미지 변경
    const goToSlide = (index: number): void => {
        setCurrentIndex(index);
    };

    // 슬라이드 애니메이션 효과
    const slideVariants = {
        hidden: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 30,
            },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 30,
            },
        }),
    };

    // 슬라이드 방향 추적
    const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        setPage([currentIndex, currentIndex > page ? 1 : -1]);
    }, [currentIndex, page]);

    return (
        <div className="relative h-[40vh] overflow-hidden bg-main">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={page}
                    custom={direction}
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0"
                >
                    <img
                        src={images[currentIndex].url}
                        alt={images[currentIndex].title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="text-center max-w-3xl px-4">
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-3xl md:text-5xl font-bold text-white mb-4"
                            >
                                {images[currentIndex].title}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-xl text-white"
                            >
                                {images[currentIndex].description}
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                            >
                                자세히 알아보기
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* 좌우 화살표 버튼 */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-all z-10"
                aria-label="이전 이미지"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-all z-10"
                aria-label="다음 이미지"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* 하단 인디케이터 */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 w-3 rounded-full transition-all ${
                            index === currentIndex ? 'bg-white w-6' : 'bg-white bg-opacity-50'
                        }`}
                        aria-label={`슬라이드 ${index + 1}로 이동`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;