// app/(admin)/admin/products/page.tsx (서버 컴포넌트)
import React from 'react';
import {ProductWithInventory} from "@/utils/supabase/types";
import {fetchProductsWithInventory} from "@/lib/ecount-api";
import EcountProductTable from "@/components/admin/products/ProductTable";

async function fetchInventoryData(): Promise<ProductWithInventory[]> {
    try {

        // 오늘 날짜로 재고현황 조회
        const today = new Date();
        const baseDate = today.getFullYear().toString() +
            (today.getMonth() + 1).toString().padStart(2, '0') +
            today.getDate().toString().padStart(2, '0');

        const response = await fetchProductsWithInventory({
            BASE_DATE: baseDate,
            ZERO_FLAG: 'Y' // 재고 0인 것도 포함
        });

        return response;

    } catch (error) {
        console.error('재고현황 데이터를 가져오는 중 오류가 발생했습니다:', error);

        return [];
    }
}

export default async function EcountInventoryPage() {
    const products = await fetchInventoryData();

    // 재고 상태별 통계
    const stockStats = {
        total: products.length,
        safe: products.filter(p => p.STOCK_STATUS === 'SAFE').length,
        low: products.filter(p => p.STOCK_STATUS === 'LOW').length,
        out: products.filter(p => p.STOCK_STATUS === 'OUT').length
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-jalnan text-gray-900">재고현황 관리</h1>
                <p className="mt-2 text-gray-600 font-jalnan">Ecount ERP 연동 실시간 재고현황 시스템</p>
                <div className="mt-3 flex gap-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        재고충분: {stockStats.safe}개
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                        재고부족: {stockStats.low}개
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                        재고없음: {stockStats.out}개
                    </span>
                </div>
            </div>
            <EcountProductTable products={products || []} />
        </div>
    );
}
