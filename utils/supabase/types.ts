import {Database} from "@/lib/database.types";

export type Posts = Database['public']['Tables']['posts']['Row'];
export type Inquiry = Database['public']['Tables']['inquiry']['Row'];
export type Schedules = Database['public']['Tables']['schedules']['Row'];

export interface InquiryWithUser {
    id: string;
    user_id: string;
    created_at: string;
    question: string | null;
    answer: string | null;
    admin_id: string | null;
    title: string;
    user_email: string;
    user_created_at: string;
}
export interface States<T=unknown> {
    success: boolean;
    data: T | null;
    error: string | null;
}
export interface Service {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

export interface CompanyData {
    name: string;
    establishedYear: string;
    vision: string;
    mission: string;
    services: Service[];
    videoUrl: string;
    videoDetails: VideoDetail[];
}

export interface VideoDetail {
    title: string;
    content: string;
}

/*NAVER ADS*/
export interface NaverAdsData {
    id: string;
    date: string;
    impressions: number;
    clicks: number;
    cost: number;
    created_at: string;
}

export interface NaverAdsStats {
    date: string;
    impressions: number;
    clicks: number;
    cost: number;
}

export interface NaverAdsApiResponse {
    impressions: number;
    clicks: number;
    cost: number;
}

export interface CampaignStatResponse {
    data?: Array<{
        impressionCnt?: number;
        clickCnt?: number;
        salesAmt?: number;
    }>;
}
