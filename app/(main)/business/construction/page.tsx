import React from 'react';
import EquipmentGrid from "@/components/business/construction/EquipmentGrid";
import ConstructHeader from "@/components/business/construction/ConstructHeader";
import {equipmentData} from "@/lib/store/constructData";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "정비운영 장비 | DS 건설기계 - 전문 정비장비 현황",
    description: "DS 건설기계의 최첨단 정비운영 장비를 확인하세요. 얀마엔진, 카본세척기, DPF 세정장비, 인젝터 테스트기 등 전문 장비로 정확한 진단과 수리를 제공합니다.",
    keywords: [
        "건설기계 정비장비", "얀마엔진", "카본세척기", "DPF 세정장비", "인젝터 테스트기",
        "엔진 진단장비", "부품세척기", "커민스 시뮬레이터", "건설장비 정비도구", "DS 건설기계 장비"
    ],
    openGraph: {
        title: "정비운영 장비 | DS 건설기계",
        description: "최첨단 정비장비로 정확한 진단과 전문적인 수리 서비스를 제공합니다.",
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
        canonical: "/business/construction"
    }
};
function Page() {

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <ConstructHeader/>
                <EquipmentGrid equipmentList={equipmentData} />
            </div>
        </div>
    );
}

export default Page;