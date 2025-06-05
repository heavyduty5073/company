import React from 'react';
import CreateSupportForm from "@/app/(admin)/admin/support/create/form";
import {notFound} from "next/navigation";
import Link from "next/link";

async function Page({searchParams}:{searchParams:Promise<{type:string}>}) {
    const {type} = await searchParams

    if(!type) return notFound()
    return (
        <div>
            <div className={'flex mb-8'}>
            <h1 className={'font-jalnan text-2xl text-black'}>{`${type==='inquiry' ? '문의사항' : type==='faq' ? 'FAQ' : '공지사항'}작성`}</h1>
            </div>
            <CreateSupportForm type={type}/>
        </div>
    );
}

export default Page;
