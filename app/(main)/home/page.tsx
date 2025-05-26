import React, { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Banner from "@/components/introduce/Banner";
import { homeImages } from "@/lib/store/bannerImages";
import TypingText from "@/components/home/TypeText";
import { typingTexts } from "@/lib/store/typeTexts";
import KakaoMap from "@/utils/address/Kakaomap";
import ContentSection from "@/components/home/ContentSection";
import GlobalLoader from "@/lib/Loading/Loading";
import { getLatestRepairCases } from "@/app/(main)/home/actions";
import CountView from "@/components/home/CountView";

// 동적 임포트 (서버 컴포넌트에서는 ssr: false 옵션 제거)
const RepairCaseCarousel = dynamic(
    () => import("@/components/home/RepaireCaseCarousel"),
    {
        loading: () => <div className="w-full flex justify-center py-12"><GlobalLoader /></div>
    }
);

const NaverBandSection = dynamic(
    () => import("@/components/home/band/NaverBandSection"),
    {
        loading: () => <div className="h-32 bg-main animate-pulse"></div>
    }
);

// SEO 메타데이터
export const metadata: Metadata = {
    title: 'DS 건설기계 | 전문 건설기계 정비 서비스',
    description: '군산, 김제 지역 최고의 건설기계 정비 전문업체. 굴삭기, 로더, 덤프트럭 등 모든 건설기계 정비 서비스를 제공합니다.',
    keywords: '건설기계, 정비, 수리, 군산, 김제, 굴삭기, 로더, 덤프트럭',
    openGraph: {
        title: 'DS 건설기계 | 전문 건설기계 정비 서비스',
        description: '군산, 김제 지역 최고의 건설기계 정비 전문업체',
        type: 'website',
    },
};

async function Page() {
    // 서버에서 데이터 프리페치
    const data = await getLatestRepairCases();

    return (
        <main className="flex flex-col w-full">
            {/* 히어로 섹션: 배너 + 타이핑 텍스트 */}
            <section className="relative w-full">
                {/* 배너 섹션 */}
                <Banner
                    images={homeImages}
                    className="h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] w-full object-cover"
                />

                {/* 타이핑 텍스트 오버레이 */}
                <div className="absolute inset-0 flex items-center z-10 px-4 sm:px-8 md:px-12 lg:px-16 pointer-events-none bg-gradient-to-r from-black/50 to-transparent">
                    <div className="text-left p-3 sm:p-4 max-w-2xl">
                        <TypingText
                            texts={typingTexts}
                            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-shadow-lg"
                            typingSpeed={100}
                            deletingSpeed={30}
                            delayBetweenTexts={2000}
                        />
                    </div>
                </div>
            </section>

            {/* 정비 사례 캐러셀 섹션 */}
            <section className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-12 lg:py-24">
                    <Suspense fallback={<div className="w-full flex justify-center py-12"><GlobalLoader /></div>}>
                        <RepairCaseCarousel cases={data} />
                    </Suspense>
                </div>
            </section>

            {/* 네이버 밴드 섹션 */}
            <Suspense fallback={<div className="h-32 bg-main animate-pulse"></div>}>
                <NaverBandSection bandUrl="https://www.band.us/band/96686413" />
            </Suspense>

            {/* 콘텐츠 섹션 */}
            <section className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <Suspense fallback={<div className="w-full flex justify-center py-12"><GlobalLoader /></div>}>
                        <ContentSection />
                    </Suspense>
                </div>
            </section>
            <section className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-24">
                    <CountView/>
                </div>
            </section>

            {/* 지도 섹션 */}
            <section id='kakaomap' className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-20 lg:py-32">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">
                        오시는 길
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <div className="h-[300px] md:h-[450px] w-full">
                                <KakaoMap address="전북특별자치도 군산시 해망로 663" />
                            </div>
                            <div className="mt-4 text-center text-white">
                                <p className="text-lg font-medium">DS 건설기계 군산본점</p>
                                <p className="text-sm mt-1">전북특별자치도 군산시 해망로 663 선우플랜트</p>
                                <p className="text-sm mt-1">대표번호: 010-2036-5073</p>
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <div className="h-[300px] md:h-[450px] w-full">
                                <KakaoMap address="전북특별자치도 김제시 황토로 919" />
                            </div>
                            <div className="mt-4 text-center text-white">
                                <p className="text-lg font-medium">DS 건설기계 김제점</p>
                                <p className="text-sm mt-1">전북특별자치도 김제시 황토로 919 1동</p>
                                <p className="text-sm mt-1">대표번호: 010-9590-1232</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Page;