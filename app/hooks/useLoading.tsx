'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import GlobalLoader from "@/lib/Loading/Loading";

// LoadingContext 타입 정의
interface LoadingContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    startLoading: () => void;
    stopLoading: () => void;
}

// 기본값 설정
const defaultContext: LoadingContextType = {
    isLoading: false,
    setLoading: () => {},
    startLoading: () => {},
    stopLoading: () => {},
};

// Context 생성
const LoadingContext = createContext<LoadingContextType>(defaultContext);

// LoadingProvider props 타입 정의
interface LoadingProviderProps {
    children: ReactNode;
}

/**
 * 로딩 상태를 관리하는 Provider 컴포넌트
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 로딩 상태 설정 함수
    const setLoading = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    // 로딩 시작 함수
    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    // 로딩 종료 함수
    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    // 컨텍스트 값
    const value = {
        isLoading,
        setLoading,
        startLoading,
        stopLoading,
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {isLoading && <GlobalLoader />}
        </LoadingContext.Provider>
    );
};

/**
 * 로딩 상태를 관리하는 커스텀 훅
 * @returns 로딩 관련 상태와 함수들
 */
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);

    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }

    return context;
};

export default useLoading;