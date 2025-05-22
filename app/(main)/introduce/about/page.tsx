// src/app/company/page.tsx
import React from 'react';
import { introduceImages } from "@/lib/store/bannerImages";
import Banner from "@/components/introduce/Banner";
import CompanyOverview from "@/components/introduce/about/CompanyOverview";
import ServiceSection from "@/components/introduce/about/ServiceSection";
import ClientVideoPlayer from "@/components/introduce/about/IntroVideo";
import { companyData } from '@/lib/store/company';

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
            {/*<section className="py-16 bg-white">*/}
            {/*    <div className="container mx-auto px-4">*/}
            {/*        <h2 className="text-3xl font-bold text-center mb-12">회사 소개 영상</h2>*/}

            {/*        <div className="flex flex-col md:flex-row gap-8 items-start">*/}
            {/*            /!* 비디오 플레이어 - 모바일에서는 위에, 데스크탑에서는 왼쪽에 배치 *!/*/}
            {/*            <div className="w-full md:w-3/5">*/}
            {/*                <ClientVideoPlayer videoUrl={companyData.videoUrl} />*/}
            {/*            </div>*/}

            {/*            /!* 비디오 설명 - 모바일에서는 아래에, 데스크탑에서는 오른쪽에 배치 *!/*/}
            {/*            <div className="w-full md:w-2/5 mt-8 md:mt-0">*/}
            {/*                <h3 className="text-2xl font-bold mb-6">DS 건설기계</h3>*/}

            {/*                <div className="space-y-4">*/}
            {/*                    {companyData.videoDetails.map((detail, index) => (*/}
            {/*                        <details*/}
            {/*                            key={index}*/}
            {/*                            className="border border-gray-200 rounded-lg"*/}
            {/*                        >*/}
            {/*                            <summary className="px-4 py-3 font-medium cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg">*/}
            {/*                                {detail.title}*/}
            {/*                            </summary>*/}
            {/*                            <div className="px-4 py-3 bg-white">*/}
            {/*                                <span>{detail.content}</span>*/}
            {/*                            </div>*/}
            {/*                        </details>*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>
    );
}