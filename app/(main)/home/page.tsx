import React from 'react';
import Banner from "@/components/introduce/Banner";
import { homeImages } from "@/lib/store/bannerImages";
import TypingText from "@/components/home/TypeText";
import {typingTexts} from "@/lib/store/typeTexts";
import KakaoMap from "@/utils/address/Kakaomap";


function Page() {


    return (
        <div className="relative">
            {/* 배너 섹션 */}
            <Banner images={homeImages} className="h-[30vh] lg:h-[50vh]" />

            {/* 타이핑 텍스트 - 범위 제한 및 높이 조정 */}
            <div className="absolute top-0 left-0 h-[30vh] lg:h-[50vh] flex items-center z-10 pl-2 sm:pl-8 md:pl-12 lg:pl-16 pointer-events-none">
                <div className="text-left p-3 sm:p-4 rounded-lg max-w-2xl">
                    <TypingText
                        texts={typingTexts}
                        className="text-md sm:text-xl md:text-3xl lg:text-5xl font-bold text-white text-shadow-lg"
                        typingSpeed={100}
                        deletingSpeed={30}
                        delayBetweenTexts={2000}
                    />
                </div>
            </div>
            <div className={'min-h-[30vh] bg-main'}>
                {'콘텐츠 영역'}
            </div>
            <div className={'bg-white w-full p-4'}>
                <div id={'kakaomap'} className="h-[300px] md:h-[400px] w-full">
                    <KakaoMap address={'전북특별자치도 군산시 해망로 663'}/>
                </div>
            </div>
        </div>
    );
}

export default Page;