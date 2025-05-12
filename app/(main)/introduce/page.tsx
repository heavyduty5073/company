import React from 'react';
import Banner from "@/components/introduce/Banner";
import {introduceImages} from "@/lib/store/bannerImages";

function Page() {
    return (
        <div>
            <Banner images={introduceImages} className={'h-[20vh] lg:h-[30vh]'}/>
        </div>
    );
}

export default Page;