import React from 'react';

import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { getOneRepairCase } from "./actions";
import { notFound } from 'next/navigation';
import EditPost from "@/app/(admin)/admin/posts/edit/[id]/form";

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        notFound();
    }

    const response = await getOneRepairCase(id);

    // 에러 코드가 있는 경우 처리
    if ('code' in response) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Link href="/admin/posts" className={'flex flex-row items-center gap-2 mb-4 font-jalnan'}>
                    <IoIosArrowBack className={'relative w-5 h-5'}/>뒤로가기
                </Link>
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">오류 발생</h1>
                    <p className="text-gray-600">{response.message}</p>
                </div>
            </div>
        );
    }

    // 정상적인 데이터를 받은 경우
    return (
        <div className="container mx-auto py-8 px-4">
            <Link href="/admin/posts" className={'flex flex-row items-center gap-2 mb-4 font-jalnan'}>
                <IoIosArrowBack className={'relative w-5 h-5'}/>뒤로가기
            </Link>
            <EditPost post={response} />
        </div>
    );
}

export default Page;