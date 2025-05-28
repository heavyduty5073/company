import MaintenanceServiceClient from '@/components/business/repair/MaintenanceServiceClient';
import React from 'react';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "정비운영 장비 | DS 건설기계 - 최첨단 건설장비 정비 장비 소개",
    description: "DS 건설기계가 보유한 최첨단 정비운영 장비를 확인하세요. 얀마엔진, 카본세척기, DPF 청소장비, 인젝터 테스트기 등 전문 정비 장비로 정확하고 안전한 건설기계 정비 서비스를 제공합니다.",
    keywords: [
        "건설기계 정비장비", "얀마엔진", "카본세척기", "DPF 청소장비", "인젝터 테스트기",
        "엔진부품샌딩기", "부품세척기", "커민스시뮬레이터", "건설장비 정비도구",
        "DS 건설기계 장비", "전문 정비장비", "건설기계 진단장비", "군산 정비장비"
    ],
    openGraph: {
        title: "정비운영 장비 | DS 건설기계",
        description: "최첨단 정비 장비를 통해 안전하고 효율적인 건설기계 정비 서비스를 제공합니다.",
        url: "https://deasung.kr/equipment",
        images: [
            {
                url: "/business/얀마엔진.jpg",
                width: 1200,
                height: 630,
                alt: "DS 건설기계 정비운영 장비"
            }
        ]
    },
    alternates: {
        canonical: "/repair"
    }
};
async function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <MaintenanceServiceClient />
        </div>
    );
}

export default Page;