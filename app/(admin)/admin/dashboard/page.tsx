import React from 'react';
import { fetchNaverAdsData } from '@/lib/naver/naver-ads-actions';
import StatsCards from "@/components/admin/dashboard/naver/StatsCards";
import NaverAdsChart from "@/components/admin/dashboard/naver/charts/NaverAdsChart";

async function Page() {
    // const adsData = await fetchNaverAdsData(30); // 최근 30일 데이터
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    {/*<h1 className="text-3xl font-bold text-gray-900 mb-2">*/}
                    {/*    네이버 검색광고 관리자 대시보드*/}
                    {/*</h1>*/}
                </div>

                {/* 통계 카드 (클라이언트 컴포넌트) */}
                {/*<StatsCards data={adsData} />*/}

                {/* 차트 (클라이언트 컴포넌트) */}
                {/*<NaverAdsChart data={adsData} />*/}
            </div>
        </div>
    );
}

export default Page;
