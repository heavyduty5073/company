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
import InAppButton from "@/components/home/inApp/InAppButton";
import WorkTime from "@/components/home/WorkTime";
import UreaPopup from '@/components/home/popup/UreaPopup';
import ScheduleCalendarPopup from "@/components/home/popup/ScheduleCalendarPopup";
import {getAllSchedules} from "@/app/(admin)/admin/schedule/actions";
import ScrollVelocity from "@/components/ui/scrollVelocity";

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
    title: 'DS 건설기계 | 전문 건설기계 정비 및 후처리클리닝 서비스',
    description: '굴삭기, 로더, 덤프트럭 최고의 건설기계 정비 전문업체 DOC,DPF,SCR 후처리 클리닝 전문업체 모든 건설기계 정비 서비스를 제공합니다. 얀마, 케타, 볼보, 현대, 두산 벤츠등 모든 진단기 보유 및 정밀진단',
    keywords: '건설기계, 정비, 수리, 굴삭기, 로더, 덤프트럭, 굴착기, 굴삭기, HX145, 6w, 8w, 3w, VGT, 요소수인젝터, 요소수펌프, DPF경고등, DPF, SCR, DOC, 얀마, 케타, 볼보, 두산, 현대, 벤츠, ',
    openGraph: {
        title: 'DS 건설기계 | 전문 건설기계 정비 서비스',
        description: '최고의 건설기계 정비 후처리클리닝 전문업체',
        type: 'website',
    },
};

const diagnosticBrands = [
    '볼보', '현대', '케타', '얀마', '두산', '벤츠', '커민스',
    '히타치', '코마츠', '캐터필러'
];

async function Page() {
    // 서버에서 데이터 프리페치
    const data = await getLatestRepairCases();
    const schedules = await getAllSchedules();
    return (
        <main className="flex flex-col w-full">
            {/* 요소수 첨가제 홍보 팝업 */}

            <ScheduleCalendarPopup schedules={schedules}/>
            <UreaPopup />
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
            {/*영업 시간*/}
            <section className={'bg-main w-full'}>
            <WorkTime/>
            </section>
            {/* 지도 섹션 */}
            <section id='kakaomap' className="bg-main w-full">
                <div className="container mx-auto px-4 py-8 md:py-20 lg:py-32">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">
                        오시는 길
                    </h2>
                    <div className={'w-full max-w-3xl mx-auto mb-12'}>
                    <InAppButton/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <div className="h-[300px] md:h-[450px] w-full">
                                <KakaoMap address="전북특별자치도 군산시 해망로 663" />
                            </div>
                            <div className="mt-4 text-center text-white">
                                <p className="text-lg font-SCore">DS 건설기계 군산본점</p>
                                <p className="text-sm mt-1">전북특별자치도 군산시 해망로 663 선우플랜트</p>
                                <p className="text-sm mt-1">대표번호: 010-2036-5073</p>
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <div className="h-[300px] md:h-[450px] w-full">
                                <KakaoMap address="전북특별자치도 김제시 황토로 919" />
                            </div>
                            <div className="mt-4 text-center text-white">
                                <p className="text-lg font-SCore">DS 건설기계 김제점</p>
                                <p className="text-sm mt-1">전북특별자치도 김제시 황토로 919 1동</p>
                                <p className="text-sm mt-1">대표번호: 010-9590-1232</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* 진단기 보유 섹션 - 개선된 버전 */}
            <section className="bg-gradient-to-b from-[#003247] to-[#1E3269]/80 py-16 md:py-24 overflow-hidden">
                <div className="container mx-auto px-4 mb-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-jalnan text-white mb-4">
                            모든 종류 진단기 보유
                        </h2>
                        <p className="text-md md:text-xl text-white/80 max-w-2xl mx-auto">
                            국내외 모든 브랜드의 전용 진단기를 보유하여<br/> 정확한 진단과 정비를 제공합니다
                        </p>
                    </div>
                </div>

                {/* 첫 번째 스크롤 - 오른쪽으로 이동 */}
                <div className="mb-6 flex justify-center">
                    <ScrollVelocity
                        texts={diagnosticBrands.slice(0, 6)}
                        velocity={50}
                        className="text-white/90 text-2xl md:text-3xl lg:text-4xl font-SCore px-6 py-3 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10"
                        damping={50}
                        stiffness={400}
                        numCopies={10}
                        parallaxClassName="flex justify-center"
                        scrollerClassName="gap-8 justify-center"
                    />
                </div>

                {/* 두 번째 스크롤 - 왼쪽으로 이동 */}
                <div className="mb-6 flex justify-center">
                    <ScrollVelocity
                        texts={diagnosticBrands.slice(6)}
                        velocity={-40}
                        className="text-white/90 text-2xl md:text-3xl lg:text-4xl font-SCore px-6 py-3 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10"
                        damping={50}
                        stiffness={400}
                        numCopies={10}
                        parallaxClassName="flex justify-center"
                        scrollerClassName="gap-2 justify-center"
                    />
                </div>

                {/* 세 번째 스크롤 - 다시 오른쪽으로 */}
                <div className="flex justify-center">
                    <ScrollVelocity
                        texts={['전문 진단', '정확한 수리', '신속한 서비스', '합리적 가격', '품질 보증']}
                        velocity={60}
                        className="text-white text-xl md:text-2xl lg:text-3xl font-SCore px-6 py-3 bg-black/30 rounded-lg backdrop-blur-sm border border-yellow-300/20"
                        damping={40}
                        stiffness={300}
                        numCopies={8}
                        parallaxClassName="flex justify-center"
                        scrollerClassName="gap-2 justify-center"
                    />
                </div>
            </section>

        </main>
    );
}

export default Page;
