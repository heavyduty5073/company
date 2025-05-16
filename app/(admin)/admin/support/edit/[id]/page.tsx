import React from 'react';
import {notFound} from "next/navigation";
import {getSupportDetail} from "@/app/(admin)/admin/support/actions";
import EditSupportForm from "@/app/(admin)/admin/support/edit/[id]/form";

// searchParams를 Promise가 아닌 일반 객체로 수정
async function Page({params, searchParams}:{
    params: Promise<{id: string}>;
    searchParams: Promise<{type?: string, page?: string}>
}) {
    const {id} = await params;
    const {type} = await searchParams;
    if(!id || !type) return notFound()

    const data = await getSupportDetail(id)
    return (
        <div>
            <div className={'flex mb-8'}>
                <h1 className={'font-jalnan text-2xl text-black'}>{`${type==='inquiry' ? '문의사항' : type==='faq' ? 'FAQ' : '공지사항'}작성`}</h1>
            </div>
            <EditSupportForm type={type} posts={data || null}/>
        </div>
    );
}

export default Page;