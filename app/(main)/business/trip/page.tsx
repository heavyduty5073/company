import React from 'react';
import AnimatedHeader from "@/components/business/trip/AnimatedHeader";
import ServiceCards from "@/components/business/trip/ServiceCards";
import EquipmentSection from "@/components/business/trip/EquipmentSection";
import ServiceProcess from "@/components/business/trip/ServiceProcess";
import ServiceAreas from '@/components/business/trip/ServiceAreas';
import CTASection from "@/components/business/trip/CTASection";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: '건설기계 출장 정비 서비스 | DS 건설기계',
    description: '현장에서 바로 해결하는 신속한 건설기계 출장 정비 서비스. 전문 기술진이 직접 현장을 방문하여 장비 가동 중단 시간을 최소화합니다.',
    keywords: '건설기계 정비, 출장 서비스, 현장 정비, 중장비 수리, 건설장비 유지보수',
    openGraph: {
        title: '건설기계 출장 정비 서비스 | DS 건설기계',
        description: '현장에서 바로 해결하는 신속한 건설기계 출장 정비 서비스. 전문 기술진이 직접 현장을 방문하여 장비 가동 중단 시간을 최소화합니다.',
        url: 'https://yourcompany.com/business/trip',
        siteName: 'DS 건설기계',
        locale: 'ko_KR',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

function Page() {
    return (
        <div><AnimatedHeader/>
            <main className="max-w-6xl mx-auto py-12 px-4">
                {/* 서비스 소개 */}
                <section className="mb-16">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">현장으로 찾아가는 정비 서비스</h2>
                    <p className="text-lg mb-8 text-gray-700">
                        건설 현장에서 장비 고장은 공정 지연과 비용 손실로 이어집니다.
                        저희는 고객의 시간과 비용을 절약해드리기 위해 전문 기술자가 직접 현장을 방문하여
                        신속하고 정확한 정비 서비스를 제공합니다.
                    </p>

                    <ServiceCards />
                </section>

                {/*/!* 장비 및 공구 소개 *!/*/}
                <EquipmentSection />

                {/*/!* 서비스 프로세스 *!/*/}
                <ServiceProcess />

                {/*/!* 서비스 지역 *!/*/}
                <ServiceAreas />

                {/*/!* CTA 섹션 *!/*/}
                <CTASection />
            </main></div>
    );
}

export default Page;