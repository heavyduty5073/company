import {Database} from "@/lib/database.types";

export type Posts = Database['public']['Tables']['posts']['Row'];
export type Inquiry = Database['public']['Tables']['inquiry']['Row'];
export type Schedules = Database['public']['Tables']['schedules']['Row'];
export type CustomerInquiries = Database['public']['Tables']['customer_inquiries']['Row'];

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

// ECOUNT ERP
export interface ProductWithInventory {
    // 기본 제품 정보
    PROD_CD: string;
    PROD_DES: string;
    PROD_TYPE: string;
    UNIT: string;
    SIZE_DES: string;
    BAR_CODE: string;
    CLASS_CD: string;
    CLASS_CD2: string;
    CLASS_CD3: string;
    VAT_YN: string;
    MIN_QTY: string;
    SAFE_QTY: string;
    REMARKS: string;
    CONT1: string;
    CONT2: string;
    CONT3: string;
    CONT4: string;
    CONT5: string;
    CONT6: string;
    INSPECT_STATUS: string;
    QC_YN: string;
    // 재고 정보
    BAL_QTY: string; // 현재 재고수량
    STOCK_STATUS: 'SAFE' | 'LOW' | 'OUT' | 'UNKNOWN'; // 재고 상태
}

// 재고현황 API 응답 타입
export interface InventoryBalanceItem {
    PROD_CD: string; // 품목코드
    BAL_QTY: string; // 재고수량
}

export interface InventoryBalanceResponse {
    Data: {
        IsSuccess: boolean;
        EXPIRE_DATE: string;
        QUANTITY_INFO: string;
        TRACE_ID: string;
        TotalCnt: number;
        Result: InventoryBalanceItem[];
    };
    Status: string;
    Error: any;
    Timestamp: string;
    RequestKey: string;
    IsEnableNoL4: boolean;
}
