'use client';

import { NaverAdsStats } from '@/utils/supabase/types';
import React from 'react';

interface StatsCardsProps {
    data: NaverAdsStats[];
}

export default function StatsCards({ data }: StatsCardsProps) {
    const totalStats = data.reduce(
        (acc, item) => ({
            impressions: acc.impressions + item.impressions,
            clicks: acc.clicks + item.clicks,
            cost: acc.cost + item.cost,
        }),
        { impressions: 0, clicks: 0, cost: 0 }
    );

    const avgCTR = totalStats.impressions > 0
        ? ((totalStats.clicks / totalStats.impressions) * 100).toFixed(2)
        : '0.00';

    const avgCPC = totalStats.clicks > 0
        ? (totalStats.cost / totalStats.clicks).toFixed(0)
        : '0';

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">총 노출량</h3>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(totalStats.impressions)}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">총 클릭량</h3>
                <p className="text-2xl font-bold text-green-600">{formatNumber(totalStats.clicks)}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">총 광고비용</h3>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalStats.cost)}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">평균 CTR</h3>
                <p className="text-2xl font-bold text-purple-600">{avgCTR}%</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">평균 CPC</h3>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(Number(avgCPC))}</p>
            </div>
        </div>
    );
}
