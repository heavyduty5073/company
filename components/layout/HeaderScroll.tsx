'use client';

import { useState, useEffect, ReactNode } from 'react';

interface HeaderScrollProps {
    children: ReactNode;
}

export default function HeaderScroll({ children }: HeaderScrollProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 화면 크기 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg 브레이크포인트 (1024px)
        };

        // 초기 체크
        checkMobile();

        // 리사이즈 이벤트 리스너
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // PC에서만 호버 효과 적용
    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovered(false);
        }
    };

    // 스크롤/호버 상태를 DOM에 전달
    useEffect(() => {
        // 로고 크기 조정
        const logoEl = document.getElementById('header-logo');
        if (logoEl) {
            const imgEl = logoEl.querySelector('img');
            if (imgEl) {
                if ((isScrolled && !isHovered) || isMobile) {
                    // 스크롤 다운 상태이거나 모바일인 경우 항상 작은 크기
                    imgEl.style.width = '50px';
                    imgEl.style.height = '50px';
                } else {
                    // PC에서 스크롤 맨 위에 있고 호버 상태일 때만 큰 크기
                    imgEl.style.width = '100px';
                    imgEl.style.height = '100px';
                }
            }
        }

        // 타이틀 크기 조정
        const titleEl = document.getElementById('header-title');
        if (titleEl) {
            if ((isScrolled && !isHovered) || isMobile) {
                // 스크롤 다운 상태이거나 모바일인 경우 항상 작은 크기
                titleEl.classList.remove('text-lg', 'lg:text-3xl');
                titleEl.classList.add('text-xl');
            } else {
                // PC에서 스크롤 맨 위에 있고 호버 상태일 때만 큰 크기
                titleEl.classList.remove('text-xl');
                titleEl.classList.add('text-lg', 'lg:text-3xl');
            }
        }
    }, [isScrolled, isHovered, isMobile]);

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="header-container"
        >
            {/* 헤더 */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
            >

                <div
                    className={`bg-gradient-to-r from-[#003247] to-black transition-all duration-300 ${
                        (isScrolled && !isHovered) || isMobile ? 'py-1 h-16' : 'py-2 lg:py-4 h-[116px]'
                    }`}
                >

                    {children}
                </div>
            </div>

            {/* 네비게이션 메뉴 */}
            {/*<div*/}
            {/*    className={`w-full bg-main transition-all duration-300 fixed left-0 right-0 z-40 hidden lg:block ${*/}
            {/*        (isScrolled && !isHovered) || isMobile ? 'top-16 h-0 opacity-0 overflow-hidden' : 'top-[116px] h-auto opacity-100 overflow-visible'*/}
            {/*    }`}*/}
            {/*>*/}
            {/*    {navigationMenu}*/}
            {/*</div>*/}
        </div>
    );
}