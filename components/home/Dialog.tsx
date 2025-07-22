'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import {useMobile} from "@/app/hooks/useMobile";

// 이미지 배열 정의 - 모바일과 웹용
const dialogImages = {
    mobile: [
        '/dialog/mobile.png',
        '/dialog/mobile2.png',
        // 추가 모바일 이미지들
    ],
    web: [
        '/dialog/web.png',
        '/dialog/web2.png',
        // 추가 웹 이미지들
    ]
};

function Dialogsics() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isMobile = useMobile();

    // 현재 사용할 이미지 배열 선택
    const currentImages = isMobile ? dialogImages.mobile : dialogImages.web;

    // 5초마다 자동 슬라이드 - 바로 다음 이미지로 변경
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % currentImages.length
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [currentImages.length]);

    // 디바이스가 변경될 때 인덱스 리셋
    useEffect(() => {
        setCurrentIndex(0);
    }, [isMobile]);

    return (
        <section className="bg-main w-full">
            <div className={'container mx-auto px-4 pt-8 md:pt-12 lg:pt-20'}>
                <div className={'bg-white w-[90%] md:w-[88%] lg:w-[88%] mx-auto rounded-sm md:rounded-xl overflow-hidden relative h-[5vh] md:h-[105px]'}>
                    <div className="relative w-full h-full">
                        <div className="w-full h-full">
                            <Image
                                src={currentImages[currentIndex]}
                                alt={`dialog-${isMobile ? 'mobile' : 'web'}-${currentIndex + 1}`}
                                fill
                                className={'object-cover rounded-none md:rounded-xl transition-all duration-500 ease-in-out'}
                                priority={currentIndex === 0}
                                quality={100}
                                sizes="(max-width: 768px) 100vw, 100vw"
                                key={currentIndex} // 이미지 변경 시 리렌더링 강제
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dialogsics;
