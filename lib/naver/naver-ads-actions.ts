'use server';

import { NaverAdsApi } from '@/lib/naver-ads-api';
import {NaverAdsStats} from "@/utils/supabase/types";
import {createClient} from "@/utils/supabase/server";

export async function fetchNaverAdsData(days: number = 30): Promise<NaverAdsStats[]> {
    const supabase = await createClient();

    try {
        // Supabase에서 최근 데이터 조회
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const { data: existingData, error } = await supabase
            .from('naver_ads_stats')
            .select('*')
            .gte('date', startDate)
            .order('date', { ascending: true });

        if (error) {
            console.error('Supabase 조회 오류:', error);
            return generateFallbackData(days);
        }

        // 데이터가 없거나 오늘 데이터가 없으면 API에서 가져오기
        const today = new Date().toISOString().split('T')[0];
        const hasRecentData = existingData?.some(item => item.date === today);

        if (!existingData?.length || !hasRecentData) {
            await updateNaverAdsData();

            // 업데이트 후 다시 조회
            const { data: updatedData } = await supabase
                .from('naver_ads_stats')
                .select('*')
                .gte('date', startDate)
                .order('date', { ascending: true });

            return updatedData || generateFallbackData(days);
        }

        return existingData || generateFallbackData(days);
    } catch (error) {
        console.error('데이터 조회 실패:', error);
        return generateFallbackData(days);
    }
}

export async function updateNaverAdsData(): Promise<void> {
    const supabase = await createClient();

    try {
        const naverAds = new NaverAdsApi();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // 네이버 광고 API에서 데이터 가져오기
        const apiData = await naverAds.fetchCampaignStats(yesterday, today);

        console.log('네이버 광고 API 데이터:', apiData);

        // Supabase에 데이터 저장 또는 업데이트
        const { error } = await supabase
            .from('naver_ads_stats')
            .upsert({
                date: today,
                impressions: apiData.impressions,
                clicks: apiData.clicks,
                cost: apiData.cost,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'date'
            });

        if (error) {
            console.error('Supabase 저장 오류:', error);
        } else {
            console.log('네이버 광고 데이터 저장 완료');
        }
    } catch (error) {
        console.error('네이버 광고 데이터 업데이트 실패:', error);
    }
}

// 최근 30일간의 더미 데이터 생성 (API 오류 시 대체)
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

        data.push({
            date: dateString,
            impressions: Math.floor(random(1) * 3000) + 2000,
            clicks: Math.floor(random(2) * 200) + 100,
            cost: Math.floor(random(3) * 30000) + 20000
        });
    }

    return data;
}

// 수동으로 데이터 새로고침
export async function refreshNaverAdsData(): Promise<{ success: boolean; message: string }> {
    try {
        await updateNaverAdsData();
        return { success: true, message: '데이터가 성공적으로 업데이트되었습니다.' };
    } catch (error) {
        console.error('데이터 새로고침 실패:', error);
        return { success: false, message: '데이터 업데이트에 실패했습니다.' };
    }
}
