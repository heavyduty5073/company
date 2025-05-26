'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';

interface HeaderScrollProps {
    children: ReactNode;
}

export default function HeaderScroll({ children }: HeaderScrollProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 화면 크기 감지 (디바운싱 적용)
    const checkMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 1024);
    }, []);

    useEffect(() => {
        // 초기 체크
        checkMobile();

        // 디바운싱된 리사이즈 핸들러
        let timeoutId: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkMobile, 100);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [checkMobile]);

    // 스크롤 이벤트 최적화
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;
                    setIsScrolled(scrollPosition > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // PC에서만 호버 효과 적용 - 더 안정적인 호버 처리
    const handleMouseEnter = useCallback(() => {
        if (!isMobile) {
            setIsHovered(true);
        }
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (!isMobile) {
            // 약간의 지연을 두어 서브메뉴 호버 시 깜빡임 방지
            setTimeout(() => {
                setIsHovered(false);
            }, 200);
        }
    }, [isMobile]);

    // 스타일 업데이트를 useCallback으로 최적화
    const updateHeaderStyles = useCallback(() => {
        // 로고 크기 조정
        const logoEl = document.getElementById('header-logo');
        if (logoEl) {
            const imgEl = logoEl.querySelector('img');
            if (imgEl) {
                if ((isScrolled && !isHovered) || isMobile) {
                    imgEl.style.width = '50px';
                    imgEl.style.height = '50px';
                } else {
                    imgEl.style.width = '100px';
                    imgEl.style.height = '100px';
                }
            }
        }

        // 타이틀 크기 조정
        const titleEl = document.getElementById('header-title');
        if (titleEl) {
            if ((isScrolled && !isHovered) || isMobile) {
                titleEl.classList.remove('text-lg', 'lg:text-3xl');
                titleEl.classList.add('text-xl');
            } else {
                titleEl.classList.remove('text-xl');
                titleEl.classList.add('text-lg', 'lg:text-3xl');
            }
        }
    }, [isScrolled, isHovered, isMobile]);

    // 스타일 업데이트
    useEffect(() => {
        updateHeaderStyles();
    }, [updateHeaderStyles]);

    // 헤더 높이 계산
    const getHeaderHeight = () => {
        if (isMobile) return 'h-16';
        return (isScrolled && !isHovered) ? 'h-16' : 'h-[116px]';
    };

    const getHeaderPadding = () => {
        if (isMobile) return 'py-1';
        return (isScrolled && !isHovered) ? 'py-1' : 'py-2 lg:py-4';
    };

    const getMarginBottom = () => {
        if (isMobile) return 'mb-16';
        return (isScrolled && !isHovered) ? 'mb-16' : 'mb-[116px]';
    };

    return (
        <div className={`header-container ${getMarginBottom()}`}>
            {/* 헤더 */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'shadow-lg backdrop-blur-sm' : ''
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className={`bg-gradient-to-r from-[#003247] to-black transition-all duration-300 ${
                        getHeaderPadding()
                    } ${getHeaderHeight()}`}
                >
                    {children}
                </div>

                {/* 호버 영역 확장 - 서브메뉴와의 간격을 메우기 위한 투명 영역 */}
                {!isMobile && isHovered && (
                    <div
                        className={`absolute top-full left-0 right-0 bg-transparent z-40 ${isHovered && !isMobile ? "h-[116px]" : 'h-16'}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    />
                )}
            </div>
        </div>
    );
}