import React from 'react';
import ProductCategories from "@/components/business/parts/ProductionCategories";
import QualityAssurance from "@/components/business/parts/QualityAssurance";
import ShippingProcess from "@/components/business/parts/ShippingProcess";
import BenefitSection from "@/components/business/parts/BenefitSection";
import CTASection from "@/components/business/parts/CTASection";
import AnimatedHeader from "@/components/business/parts/AnimatedHeader";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: '건설기계 정품급 부품 공급 | DS 건설기계',
    description: '정품과 동일한 제조사에서 생산된 고품질 에프터마켓 부품을 합리적인 가격으로 제공합니다. 전문적인 포장과 신속한 배송 서비스를 이용해보세요.',
    keywords: '건설기계 부품, 에프터마켓 부품, 중장비 부품 공급, 건설장비 부품 판매, 정품 부품',
    openGraph: {
        title: '건설기계 정품급 부품 공급 | DS 건설기계',
        description: '정품과 동일한 제조사에서 생산된 고품질 에프터마켓 부품을 합리적인 가격으로 제공합니다. 전문적인 포장과 신속한 배송 서비스를 이용해보세요.',
        url: 'https://yourcompany.com/business/parts',
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
        <div>
            <AnimatedHeader/>
            <main className="max-w-6xl mx-auto py-12 px-4">
                {/* 소개 섹션 */}
                <section className="mb-16">
                    <h2 className=" text-2xl lg:text-3xl font-bold mb-6 text-gray-800">건설기계 정품 수준의 부품 공급</h2>
                    <p className="text-lg mb-8 text-gray-700">
                        당사는 건설기계 부품 시장에서 2019년 시작해 지금까지 경험을 바탕으로, 정품과 동일한 제조사에서 생산된
                        고품질 에프터마켓 부품을 합리적인 가격에 제공합니다. 엄격한 품질 관리와 신속한 배송 서비스로
                        고객의 장비 가동 시간을 극대화하고 비용을 절감해 드립니다.
                    </p>

                    <ProductCategories />
                </section>

                {/*/!* 품질 보증 섹션 *!/*/}
                <QualityAssurance />

                {/*/!* 배송 프로세스 섹션 *!/*/}
                <ShippingProcess />

                {/*/!* 이점 섹션 *!/*/}
                <BenefitSection />

                {/*/!* CTA 섹션 *!/*/}
                <CTASection />
            </main>
        </div>
    );
}

export default Page;