'use client';

import React from 'react';
import GlobalLoader from "@/lib/Loading/Loading";
import useLoadingStore from "@/app/hooks/useLoading";

const LoadingWrapper: React.FC = () => {
    const { isLoading } = useLoadingStore();

    return isLoading ? <GlobalLoader /> : null;
};

export default LoadingWrapper;