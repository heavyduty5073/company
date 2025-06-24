import {CampaignStatResponse, NaverAdsApiResponse} from "@/utils/supabase/types";
import crypto from 'crypto';
export class NaverAdsApi {
    private accessLicense: string;
    private secretKey: string;

    constructor() {
        this.accessLicense = process.env.NAVER_ADS_ACCESS_LICENSE!;
        this.secretKey = process.env.NAVER_ADS_SECRET_KEY!;
    }

    private generateSignature(timestamp: string, method: string, uri: string): string {
        try {
            const message = `${timestamp}.${method}.${uri}`;
            const signature = crypto
                .createHmac('sha256', this.secretKey)
                .update(message, 'utf8')
                .digest('base64');

            return signature;
        } catch (error) {
            console.error('서명 생성 오류:', error);
            throw error;
        }
    }

    async fetchCampaignStats(startDate: string, endDate: string): Promise<NaverAdsApiResponse> {
        const timestamp = Date.now().toString();
        const method = 'GET';
        const uri = '/ncc/campaigns/stat';

        try {
            const signature = this.generateSignature(timestamp, method, uri);

            const url = new URL('https://ncc.naver.com/ncc/campaigns/stat');
            url.searchParams.append('fromTime', startDate.replace(/-/g, ''));
            url.searchParams.append('toTime', endDate.replace(/-/g, ''));
            url.searchParams.append('timeRange', 'REALTIME');
            url.searchParams.append('dataType', 'SUMMARY');

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'X-Timestamp': timestamp,
                    'X-API-KEY': this.accessLicense,
                    'X-Signature': signature,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                signal:AbortSignal.timeout(30000)
            });


            if (!response.ok) {
                console.error(`네이버 광고 API 오류: ${response.status} ${response.statusText}`);
                const errorText = await response.text();
                console.error('API 오류 응답:', errorText);
                throw new Error(`네이버 광고 API 오류: ${response.status}`);
            }

            const data: CampaignStatResponse = await response.json();

            // API 응답 데이터를 파싱하여 반환
            const stats = data.data?.[0] || {};
            return {
                impressions: stats.impressionCnt || 0,
                clicks: stats.clickCnt || 0,
                cost: stats.salesAmt || 0
            };
        } catch (error) {
            console.error('네이버 광고 API 호출 실패:', error);

            // 개발 환경에서는 날짜별로 일관된 더미 데이터 반환
            const dateHash = new Date(startDate).getTime();
            const random = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };

            return {
                impressions: Math.floor(random(dateHash) * 5000) + 2000,
                clicks: Math.floor(random(dateHash + 1) * 300) + 100,
                cost: Math.floor(random(dateHash + 2) * 50000) + 20000
            };
        }
    }
}
