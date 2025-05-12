import React from 'react';
import Banner from "@/components/introduce/Banner";
import { homeImages } from "@/lib/store/bannerImages";
import TypingText from "@/components/home/TypeText";
import {typingTexts} from "@/lib/store/typeTexts";


function Page() {


    return (
        <div className="relative">
            {/* 배너 섹션 */}
            <Banner images={homeImages} className="h-[30vh] lg:h-[50vh]" />


            {/* 타이핑 텍스트 - 왼쪽 중단에 위치 */}
            <div className="absolute inset-y-0 left-0 flex items-center z-10 pl-2 sm:pl-8 md:pl-12 lg:pl-16 -translate-y-10">
                <div className="text-left p-3 sm:p-4 rounded-lg max-w-2xl">
                    <TypingText
                        texts={typingTexts}
                        className="text-md sm:text-xl md:text-3xl lg:text-5xl font-bold text-white"
                        typingSpeed={100}
                        deletingSpeed={30}
                        delayBetweenTexts={2000}
                    />
                </div>
            </div>
            <div className={'min-h-[30vh] bg-white'}>

            </div>
        </div>
    );
}

export default Page;