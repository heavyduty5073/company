import React from 'react';
import {getRepairCases} from "@/app/(admin)/admin/posts/actions";
import {notFound} from "next/navigation";

async function Page() {
    const data = await getRepairCases()

    if(!data) return notFound()
    console.log(data)
    return (
        <div className={'min-h-screen bg-main'}>

        </div>
    );
}

export default Page;