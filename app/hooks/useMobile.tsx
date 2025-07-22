'use client';

import { useState, useEffect } from 'react';

export function useMobile(breakpoint: number = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 초기 값 설정
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // 컴포넌트 마운트 시 체크
        checkMobile();

        // 리사이즈 이벤트 리스너
        const handleResize = () => {
            checkMobile();
        };

        window.addEventListener('resize', handleResize);

        // 클린업
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
}
