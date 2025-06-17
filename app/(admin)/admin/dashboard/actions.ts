'use server';

import { createClient } from '@/utils/supabase/server';
import { NaverAdsApi } from '@/lib/naver-ads-api';
import {NaverAdsStats} from "@/utils/supabase/types";

export async function fetchNaverAdsData(days: number = 30): Promise<NaverAdsStats[]> {
    const supabase = await createClient();

    try {
        // Supabase에서 최근 데이터 조회
        const { data: existingData, error } = await supabase
            .from('naver_ads_stats')
            .select('*')
            .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) {
            console.error('Supabase 조회 오류:', error);
            return [];
        }

        // 데이터가 없거나 최신 데이터가 없으면 API에서 가져오기
        const today = new Date().toISOString().split('T')[0];
        const hasRecentData = existingData?.some(item => item.date === today);

        if (!existingData?.length || !hasRecentData) {
            await updateNaverAdsData();

            // 업데이트 후 다시 조회
            const { data: updatedData } = await supabase
                .from('naver_ads_stats')
                .select('*')
                .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                .order('date', { ascending: true });

            return updatedData || [];
        }

        return existingData || [];
    } catch (error) {
        console.error('데이터 조회 실패:', error);
        return [];
    }
}

async function fillMissingDates(days: number): Promise<void> {
    const supabase = await createClient();
    const naverAds = new NaverAdsApi();

    // 최근 N일의 모든 날짜 생성
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        dates.push(date.toISOString().split('T')[0]);
    }

    // 기존 데이터 확인
    const { data: existingData } = await supabase
        .from('naver_ads_stats')
        .select('date')
        .in('date', dates);

    const existingDates = new Set(existingData?.map(item => item.date) || []);
    const missingDates = dates.filter(date => !existingDates.has(date));

    console.log(`${missingDates.length}개의 누락된 날짜 발견:`, missingDates);

    // 누락된 날짜의 데이터 수집
    for (const date of missingDates) {
        try {
            console.log(`${date} 데이터 수집 중...`);

            // 각 날짜별로 API 호출
            const apiData = await naverAds.fetchCampaignStats(date, date);

            // Supabase에 저장
            const { error } = await supabase
                .from('naver_ads_stats')
                .upsert({
                    date: date,
                    impressions: apiData.impressions,
                    clicks: apiData.clicks,
                    cost: apiData.cost,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'date'
                });

            if (error) {
                console.error(`${date} 데이터 저장 오류:`, error);
            } else {
                console.log(`${date} 데이터 저장 완료`);
            }

            // API 호출 간격 (1초 대기)
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`${date} 데이터 수집 실패:`, error);
        }
    }
}

export async function updateNaverAdsData(): Promise<void> {
    await fillMissingDates(30); // 최근 30일 데이터 확인 및 업데이트
}

// 최근 N일간의 더미 데이터 생성 (API 오류 시 대체)
function generateFallbackData(days: number): NaverAdsStats[] {
    const data: NaverAdsStats[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateString = date.toISOString().split('T')[0];

        // 날짜를 시드로 사용하여 일관된 데이터 생성
        const seed = date.getTime();
        const random = (offset: number) => {
            const x = Math.sin(seed + offset) * 10000;
            return Math.abs(x - Math.floor(x));
        };

        // 주말은 낮은 수치로 설정
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const weekendMultiplier = isWeekend ? 0.3 : 1;

        data.push({
            date: dateString,
            impressions: Math.floor(random(1) * 3000 * weekendMultiplier) + 1000,
            clicks: Math.floor(random(2) * 200 * weekendMultiplier) + 50,
            cost: Math.floor(random(3) * 30000 * weekendMultiplier) + 10000
        });
    }

    return data;
}

export async function updateDateRange(startDate: string, endDate: string): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();
    const naverAds = new NaverAdsApi();

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates: string[] = [];

        // 날짜 범위 내의 모든 날짜 생성
        for (let current = start; current <= end; current.setDate(current.getDate() + 1)) {
            dates.push(current.toISOString().split('T')[0]);
        }

        let successCount = 0;
        let failCount = 0;

        for (const date of dates) {
            try {
                const apiData = await naverAds.fetchCampaignStats(date, date);

                const { error } = await supabase
                    .from('naver_ads_stats')
                    .upsert({
                        date: date,
                        impressions: apiData.impressions,
                        clicks: apiData.clicks,
                        cost: apiData.cost,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'date'
                    });

                if (error) {
                    console.error(`${date} 저장 오류:`, error);
                    failCount++;
                } else {
                    successCount++;
                }

                // API 호출 간격
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`${date} 처리 실패:`, error);
                failCount++;
            }
        }

        return {
            success: successCount > 0,
            message: `${successCount}개 성공, ${failCount}개 실패`
        };
    } catch (error) {
        console.error('날짜 범위 업데이트 실패:', error);
        return { success: false, message: '업데이트에 실패했습니다.' };
    }
}
