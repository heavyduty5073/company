import React, { Suspense } from 'react';
import Banner from "@/components/introduce/Banner";
import { homeImages } from "@/lib/store/bannerImages";
import TypingText from "@/components/home/TypeText";
import { typingTexts } from "@/lib/store/typeTexts";
import KakaoMap from "@/utils/address/Kakaomap";
import ContentSection from "@/components/home/ContentSection";
import GlobalLoader from "@/lib/Loading/Loading";
import { getLatestRepairCases } from "@/app/(main)/home/actions";
import RepairCaseCarousel from "@/components/home/RepaireCaseCarousel";
import NaverBandSection from "@/components/home/band/NaverBandSection";

async function Page() {
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

            {/* 콘텐츠 섹션 */}
            <section className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
                    <Suspense fallback={<div className="w-full flex justify-center py-12"><GlobalLoader /></div>}>
                        <RepairCaseCarousel cases={data} />
                    </Suspense>
                </div>
            </section>
            <NaverBandSection bandUrl="https://www.band.us/band/96686413" />
            {/* 콘텐츠 섹션 */}
            <section className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <Suspense fallback={<div className="w-full flex justify-center py-12"><GlobalLoader /></div>}>
                        <ContentSection />
                    </Suspense>
                </div>
            </section>

            {/* 지도 섹션 */}
            <section className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">
                        오시는 길
                    </h2>

                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <div id="kakaomap" className="h-[300px] md:h-[450px] w-full">
                            <KakaoMap address={'전북특별자치도 군산시 해망로 663'} />
                        </div>
                    </div>

                    <div className="mt-4 text-center text-white">
                        <p className="text-lg font-medium">DS 건설기계 군산본점</p>
                        <p className="text-sm mt-1">전북특별자치도 군산시 해망로 663 선우플랜트</p>
                        <p className="text-sm mt-1">대표번호: 010-2036-5073</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Page;