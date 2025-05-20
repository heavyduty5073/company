// src/app/company/page.tsx
import React from 'react';
import { introduceImages } from "@/lib/store/bannerImages";
import Banner from "@/components/introduce/Banner";
import CompanyOverview from "@/components/introduce/about/CompanyOverview";
import ServiceSection from "@/components/introduce/about/ServiceSection";
import ClientVideoPlayer from "@/components/introduce/about/IntroVideo";

// 회사 정보 데이터 타입 정의
interface Service {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

interface CompanyData {
    name: string;
    establishedYear: string;
    vision: string;
    mission: string;
    services: Service[];
    videoUrl: string;
    videoDetails: VideoDetail[];
}

interface VideoDetail {
    title: string;
    content: string;
}

// 회사 정보 데이터 (서버에서 가져올 데이터라고 가정)
const companyData: CompanyData = {
    name: "건설기계 전문기업",
    establishedYear: "2019",
    vision: "최고의 건설기계 정비 및 부품 공급 업체",
    mission: "고객에게 최상의 품질과 서비스를 제공하여 건설 산업의 발전에 기여합니다",
    services: [
        {
            id: 1,
            title: "건설기계 수리 및 정비",
            description: "전문 기술자에 의한 신속하고 정확한 정비 서비스를 제공합니다.",
            imageUrl: "/introduce/homeImg5.jpg"
        },
        {
            id: 2,
            title: "건설기계 부품판매",
            description: "정품 및 고품질 호환 부품을 경쟁력 있는 가격으로 제공합니다.",
            imageUrl: "/introduce/parts1.jpg"
        },
        {
            id: 3,
            title: "기술 컨설팅",
            description: "건설기계 관련 전문적인 기술 자문을 제공합니다.",
            imageUrl: "/introduce/talktotalk.jpg"
        }
    ],
    videoUrl: "/videos/company-intro.mp4",
    videoDetails: [
        {
            title: "회사 연혁",
            content: "2019년 설립 이후 지속적인 성장과 혁신을 통해 건설기계 업계의 선도적인 위치를 확립해 왔습니다."
        },
        {
            title: "전문 기술력",
            content: "숙련된 기술자와 최신 장비를 갖추고 모든 종류의 건설기계에 대한 정비 서비스를 제공합니다."
        },
        {
            title: "품질 보증",
            content: "모든 정비 서비스와 부품에 대한 품질을 보증하며, 고객 만족을 최우선으로 합니다."
        }
    ]
};

export default function CompanyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 배너 섹션 - 기존 코드 활용 */}
            <Banner images={introduceImages} className="h-[40vh] lg:h-[50vh]" />

            {/* 회사 개요 섹션 */}
            <CompanyOverview
                name={companyData.name}
                establishedYear={companyData.establishedYear}
                vision={companyData.vision}
                mission={companyData.mission}
            />

            {/* 서비스 섹션 */}
            <ServiceSection services={companyData.services} />

            {/* 비디오 섹션 - 클라이언트 컴포넌트 사용 */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">회사 소개 영상</h2>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* 비디오 플레이어 - 모바일에서는 위에, 데스크탑에서는 왼쪽에 배치 */}
                        <div className="w-full md:w-3/5">
                            <ClientVideoPlayer videoUrl={companyData.videoUrl} />
                        </div>

                        {/* 비디오 설명 - 모바일에서는 아래에, 데스크탑에서는 오른쪽에 배치 */}
                        <div className="w-full md:w-2/5 mt-8 md:mt-0">
                            <h3 className="text-2xl font-bold mb-6">DS 건설기계</h3>

                            <div className="space-y-4">
                                {companyData.videoDetails.map((detail, index) => (
                                    <details
                                        key={index}
                                        className="border border-gray-200 rounded-lg"
                                    >
                                        <summary className="px-4 py-3 font-medium cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg">
                                            {detail.title}
                                        </summary>
                                        <div className="px-4 py-3 bg-white">
                                            <span>{detail.content}</span>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}