import React from 'react';
import {notFound, redirect} from "next/navigation";
import {getAdminInquiry, getSearchAdminInquiry, getSupportList} from "@/app/(admin)/admin/support/actions";
import NoticeSearch from "@/components/common/NoticeSearch";
import NoticeTable from "@/components/common/NoticeTable";
import {InquiryWithUser, Posts} from "@/utils/supabase/types";
import Pagination from "@/components/common/Pagination";
import {createClient} from "@/utils/supabase/server";
import Link from "next/link";
import {searchSupport} from "@/app/(main)/support/actions";
import InquiryTable from "@/components/support/InquiryTable";

async function Page({ searchParams }: { searchParams: Promise<{ type: string; page?: string; search?: string }> }) {
    const { type, page = "1", search } = await searchParams;
    if (!type) return notFound();
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = 20;

    if(!user) return redirect('/login')
    if(type==='inquiry'){
        const data = search
            ? await getSearchAdminInquiry(search)
            : await getAdminInquiry()

        const filteredData = Array.isArray(data) ? data : [];
        // 페이지네이션 처리
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        // 현재 페이지에 해당하는 데이터만 추출
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        return (
            <div className="bg-white min-h-screen">
                {/* 검색 컴포넌트 */}
                <h1 className={'font-jalnan text-2xl text-black mb-2'}>{`${type==='inquiry' ? '문의사항' : type==='faq' ? 'FAQ' : '공지사항'} 관리`}</h1>
                <NoticeSearch type={type} />
                <InquiryTable
                    inquiries={paginatedData as unknown as InquiryWithUser[]}
                    user={user}
                />
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        type={type}
                        search={search}
                    />
                )}
            </div>
        );
    }else{
        const data = search
            ? await searchSupport(type, search)
            : await getSupportList(type);

        const filteredData = Array.isArray(data) ? data : [];
        // 페이지네이션 처리
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        // 현재 페이지에 해당하는 데이터만 추출
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        return (
            <div className="bg-white min-h-screen">
                {/* 검색 컴포넌트 */}
                <h1 className={'font-jalnan text-2xl text-black mb-2'}>{`${type==='inquiry' ? '문의사항' : type==='faq' ? 'FAQ' : '공지사항'} 관리`}</h1>
                <NoticeSearch type={type} />
                {/* 일반 공지사항 테이블 */}
                <div className={'flex w-full justify-end'}>
                    <Link href={`/admin/support/create?type=${type}`} className={'text-sm font-semibold px-3 bg-main text-white rounded-lg py-2 mb-2'}>게시물 등록</Link>
                </div>
                <NoticeTable
                    posts={paginatedData as Posts[]}
                    user={user}
                />
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        type={type}
                        search={search}
                    />
                )}
            </div>
        );
    }

}

export default Page;