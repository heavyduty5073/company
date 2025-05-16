// app/(main)/support/write/page.tsx
import React from 'react';
import { notFound, redirect } from "next/navigation";
import InquiryCreateForm from "@/app/(main)/support/write/form";
import { createClient } from "@/utils/supabase/server";

async function Page({ searchParams }: { searchParams: Promise<{ type: string }> }) {
    const { type } = await searchParams;

    if (!type) return notFound();

    // 현재 사용자 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!user) {
        return redirect('/login');
    }

    // inquiry 타입인 경우만 문의 작성 폼 표시
    if (type === 'inquiry') {
        return (
            <div className="container mx-auto py-8">
                <InquiryCreateForm user={user} />
            </div>
        );
    }

    // 다른 타입은 지원하지 않음
    return notFound();
}

export default Page;