'use client'
import React, { useEffect, useState } from 'react';
import Image from "next/image";

// 이미지 항목 타입 정의
interface ImageItem {
    image: string;
}

// Banner 컴포넌트의 props 타입 정의
interface BannerProps {
    images: ImageItem[];
    className?: string;
}

function Banner({ images,className }: BannerProps) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [nextSlide, setNextSlide] = useState<number | null>(null);
    const [transitioning, setTransitioning] = useState(false);

    // 이미지 자동 전환
    useEffect(() => {
        if (transitioning) return; // 전환 중이면 타이머 설정 안 함

        const timer = setInterval(() => {
            const next = (activeSlide + 1) % images.length;
            startTransition(next);
        }, 5000); // 5초마다 슬라이드 변경

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [activeSlide, transitioning, images.length]);

    // 크로스페이드 트랜지션 시작
    const startTransition = (index: number) => {
        setTransitioning(true);
        setNextSlide(index);

        // 전환 애니메이션 후 active 슬라이드 업데이트
        setTimeout(() => {
            setActiveSlide(index);
            setNextSlide(null);
            setTransitioning(false);
        }, 1000); // 페이드 효과가 완료되는데 걸리는 시간
    };

    return (
        <main>
            <div className={`w-full flex flex-col items-center justify-center bg-white relative overflow-hidden ${className}`}>
                {/* 현재 활성화된 슬라이드 */}
                <div
                    className={`absolute inset-0 ${
                        nextSlide !== null ? 'animate-fadeOut' : ''
                    }`}
                >
                    <Image
                        src={images[activeSlide].image}
                        alt={`Slide ${activeSlide + 1}`}
                        className="object-cover w-full h-full"
                        width={1920}
                        height={1080}
                        priority
                    />
                </div>

                {/* 다음 슬라이드 (전환 중에만 표시) */}
                {nextSlide !== null && (
                    <div className="absolute inset-0 animate-fadeIn">
                        <Image
                            src={images[nextSlide].image}
                            alt={`Next Slide ${nextSlide + 1}`}
                            className="object-cover w-full h-full"
                            width={1920}
                            height={1080}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}

export default Banner;