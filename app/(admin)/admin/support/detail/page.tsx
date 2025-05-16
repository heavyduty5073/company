import React from 'react';
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import InquiryAnswerForm from "@/app/(admin)/admin/support/detail/form";
import { getAdminInquiry } from "@/app/(admin)/admin/support/detail/actions";
import { ERROR_CODES } from "@/utils/ErrorMessage";

async function Page({ searchParams }: {
    searchParams: Promise<{ id:string; type: string }>
}) {
    const { id,type } = await searchParams;

    // 권한 및 유효성 검사
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect('/login');
    if (!id || type !== 'inquiry') return notFound();

    // 문의 데이터 조회
    const result = await getAdminInquiry(id);
    if (result.code !== ERROR_CODES.SUCCESS || !result.data) return notFound();

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6">문의 답변</h1>
            <InquiryAnswerForm inquiry={result.data} admin={user} />
        </div>
    );
}

export default Page;