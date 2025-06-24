// lib/ecount-api.ts
import { InventoryBalanceItem, ProductWithInventory } from '@/utils/supabase/types';
import axios, { AxiosInstance } from 'axios';

// Ecount API 클라이언트 설정
class EcountInventoryApiClient {
    private zoneClient: AxiosInstance;
    private apiClient: AxiosInstance | null = null;
    private sessionId: string | null = null;
    private zone: string | null = null;
    private domain: string | null = null;

    constructor() {
        // Zone API 전용 클라이언트
        this.zoneClient = axios.create({
            baseURL: 'https://oapi.ecount.com/OAPI/V2',
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        this.setupInterceptors(this.zoneClient, 'Zone');
    }

    private setupInterceptors(client: AxiosInstance, type: string) {
        // 요청 인터셉터
        client.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                console.error(`${type} 요청 인터셉터 오류:`, error);
                return Promise.reject(error);
            }
        );

        // 응답 인터셉터
        client.interceptors.response.use(
            (response) => {

                return response;
            },
            (error) => {
                console.error(`${type} API 응답 오류:`, {
                    url: error.config?.url,
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                    fullError: error.response || error,
                });
                return Promise.reject(error);
            }
        );
    }

    // 1단계: Zone 정보 조회
    async getZoneInfo(companyId?: string): Promise<{ zone: string; domain: string }> {
        try {
            const requestData = {
                COM_CODE: companyId || process.env.ECOUNT_COMPANY_ID
            };

            const response = await this.zoneClient.post('/Zone', requestData);

            if (response.data.Status !== '200') {
                throw new Error(`Zone API 오류: ${response.data.Error?.Message || 'Unknown error'}`);
            }

            this.zone = response.data.Data.ZONE;
            this.domain = response.data.Data.DOMAIN;

            return {
                zone: this.zone!,
                domain: this.domain!
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // 2단계: 로그인하여 SESSION_ID 받기
    async login(): Promise<string> {
        try {
            if (!this.zone || !this.domain) {
                await this.getZoneInfo();
            }

            const apiConfigs = [
                {
                    baseURL: `https://oapi${this.zone}${this.domain}/OAPI/V2`,
                    endpoint: '/OAPILogin'
                },
                {
                    baseURL: `https://sboapi${this.zone}${this.domain}/OAPI/V2`,
                    endpoint: '/OAPILogin'
                }
            ];

            const loginData = {
                COM_CODE: process.env.ECOUNT_COMPANY_ID,
                USER_ID: process.env.ECOUNT_USER_ID,
                API_CERT_KEY: process.env.ECOUNT_API_CERT_KEY,
                LAN_TYPE: "ko-KR",
                ZONE: this.zone
            };

            for (const config of apiConfigs) {
                try {
                    const fullUrl = `${config.baseURL}${config.endpoint}`;

                    const tempClient = axios.create({
                        baseURL: config.baseURL,
                        timeout: 15000,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });

                    const response = await tempClient.post(config.endpoint, loginData);

                    if (response.data.Status === '200' && !response.data.Error) {
                        const sessionId = response.data.Data?.Datas?.SESSION_ID || response.data.Data?.SESSION_ID;

                        if (sessionId) {
                            this.apiClient = tempClient;
                            this.setupInterceptors(this.apiClient, 'Main');
                            this.sessionId = sessionId;
                            return this.sessionId!;
                        }
                    }
                } catch (error: any) {

                    continue;
                }
            }

            throw new Error('모든 로그인 API 엔드포인트에서 실패했습니다.');

        } catch (error) {
            throw this.handleError(error);
        }
    }

    // 3단계: 제품 기본정보 조회
    async getProducts(params?: {
        PROD_CD?: string;
        PROD_TYPE?: string;
        FROM_PROD_CD?: string;
        TO_PROD_CD?: string;
        COMMA_FLAG?: string;
    }) {
        try {
            if (!this.sessionId || !this.apiClient) {
                await this.login();
            }

            const requestData = {
                PROD_CD: params?.PROD_CD || '',
                PROD_TYPE: params?.PROD_TYPE || '',
                FROM_PROD_CD: params?.FROM_PROD_CD || '',
                TO_PROD_CD: params?.TO_PROD_CD || '',
                COMMA_FLAG: params?.COMMA_FLAG || 'N',
            };

            const response = await this.apiClient!.post(
                `/InventoryBasic/GetBasicProductsList?SESSION_ID=${this.sessionId}`,
                requestData
            );

            if (response.data.Status !== '200') {
                throw new Error(`품목 조회 오류: ${response.data.Error?.Message || 'Unknown error'}`);
            }

            let resultData = response.data.Data.Result;
            if (typeof resultData === 'string') {
                try {
                    resultData = JSON.parse(resultData);
                } catch (parseError) {
                    console.error('Result 파싱 오류:', parseError);
                    return [];
                }
            }

            return resultData || [];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // 4단계: 재고현황 조회
    async getInventoryBalance(params?: {
        BASE_DATE?: string; // YYYYMMDD 형식
        WH_CD?: string; // 창고코드
        PROD_CD?: string; // 품목코드
        ZERO_FLAG?: string; // 재고수량0포함 (Y/N)
        BAL_FLAG?: string; // 수량관리제외품목포함 (Y/N)
        DEL_GUBUN?: string; // 사용중단품목포함 (Y/N)
        SAFE_FLAG?: string; // 안전재고미만표시 (Y/N)
    }): Promise<InventoryBalanceItem[]> {
        try {
            if (!this.sessionId || !this.apiClient) {
                await this.login();
            }

            // 기본값: 오늘 날짜
            const today = new Date();
            const defaultDate = today.getFullYear().toString() +
                (today.getMonth() + 1).toString().padStart(2, '0') +
                today.getDate().toString().padStart(2, '0');

            const requestData = {
                BASE_DATE: params?.BASE_DATE || defaultDate,
                WH_CD: params?.WH_CD || '',
                PROD_CD: params?.PROD_CD || '',
                ZERO_FLAG: params?.ZERO_FLAG || 'Y', // 재고 0인 것도 포함
                BAL_FLAG: params?.BAL_FLAG || 'N',
                DEL_GUBUN: params?.DEL_GUBUN || 'N',
                SAFE_FLAG: params?.SAFE_FLAG || 'N'
            };

            const response = await this.apiClient!.post(
                `/InventoryBalance/GetListInventoryBalanceStatus?SESSION_ID=${this.sessionId}`,
                requestData
            );

            if (response.data.Status !== '200') {
                throw new Error(`재고현황 조회 오류: ${response.data.Error?.Message || 'Unknown error'}`);
            }

            return response.data.Data.Result || [];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // 5단계: 제품정보와 재고정보 결합
    async getProductsWithInventory(params?: {
        BASE_DATE?: string;
        WH_CD?: string;
        PROD_CD?: string;
        PROD_TYPE?: string;
        ZERO_FLAG?: string;
    }): Promise<ProductWithInventory[]> {
        try {
            console.log('=== 제품정보 + 재고현황 조회 시작 ===');

            // 1. 제품 기본정보 조회
            const products = await this.getProducts({
                PROD_CD: params?.PROD_CD,
                PROD_TYPE: params?.PROD_TYPE
            });

            // 2. 재고현황 조회
            const inventory = await this.getInventoryBalance({
                BASE_DATE: params?.BASE_DATE,
                WH_CD: params?.WH_CD,
                PROD_CD: params?.PROD_CD,
                ZERO_FLAG: params?.ZERO_FLAG || 'Y'
            });

            // 3. 재고정보를 Map으로 변환 (빠른 조회를 위해)
            const inventoryMap = new Map<string, string>();
            inventory.forEach(item => {
                inventoryMap.set(item.PROD_CD, item.BAL_QTY);
            });

            // 4. 제품정보와 재고정보 결합
            const result: ProductWithInventory[] = products.map((product:ProductWithInventory) => {
                const balQty = inventoryMap.get(product.PROD_CD) || '0';
                const balQtyNum = parseFloat(balQty);
                const safeQtyNum = parseFloat(product.SAFE_QTY || '0');

                // 재고 상태 판단
                let stockStatus: 'SAFE' | 'LOW' | 'OUT' | 'UNKNOWN' = 'UNKNOWN';
                if (balQtyNum === 0) {
                    stockStatus = 'OUT';
                } else if (safeQtyNum > 0 && balQtyNum < safeQtyNum) {
                    stockStatus = 'LOW';
                } else if (balQtyNum > 0) {
                    stockStatus = 'SAFE';
                }

                return {
                    ...product,
                    BAL_QTY: balQty,
                    STOCK_STATUS: stockStatus
                };
            });

            return result;

        } catch (error) {
            console.error('제품정보 + 재고현황 조회 실패:', error);
            throw error;
        }
    }

    // API 연결 테스트
    async testConnection() {
        try {

            const zoneInfo = await this.getZoneInfo();

            const sessionId = await this.login();

            const products = await this.getProductsWithInventory();

            return {
                success: true,
                zoneInfo,
                sessionId,
                productCount: products?.length || 0,
                sampleProducts: products?.slice(0, 3) || []
            };
        } catch (error) {
            console.error('API 연결 테스트 실패:', error);
            throw error;
        }
    }

    private handleError(error: any) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.Error?.Message ||
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data ||
                error.message;
            const errorCode = error.response?.status || error.code;

            console.error('Ecount API 상세 오류:', {
                code: errorCode,
                message: errorMessage,
                url: error.config?.url,
                data: error.response?.data,
                requestData: error.config?.data,
            });

            return new Error(`Ecount API 오류 (${errorCode}): ${JSON.stringify(errorMessage)}`);
        }

        return error;
    }
}

// 싱글톤 인스턴스 생성
export const ecountInventoryApi = new EcountInventoryApiClient();

// 편의 함수들
export const fetchProductsWithInventory = async (params?: {
    BASE_DATE?: string;
    WH_CD?: string;
    PROD_CD?: string;
    PROD_TYPE?: string;
    ZERO_FLAG?: string;
}) => {
    return ecountInventoryApi.getProductsWithInventory(params);
};

export const testEcountInventoryConnection = async () => {
    return ecountInventoryApi.testConnection();
};
