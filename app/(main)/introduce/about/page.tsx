import React from 'react';
import {introduceImages} from "@/lib/store/bannerImages";
import Banner from "@/components/introduce/Banner";

function Page() {
    return (
        <div>
            <Banner images={introduceImages} className={'h-[20vh] lg:h-[30vh]'}/>
        </div>
    );
}

export default Page;