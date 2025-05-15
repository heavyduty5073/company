import React from 'react';
import { notFound } from "next/navigation";
import { getSupportList } from "@/app/(main)/support/actions";
import { Posts } from "@/utils/supabase/types";
import NoticeHeader from "@/components/common/SupportHeader";
import NoticeSearch from '@/components/common/NoticeSearch';
import NoticeTable from '@/components/common/NoticeTable';
import Pagination from "@/components/common/Pagination";

async function Page({ searchParams }: { searchParams: Promise<{ type: string; page?: string; search?: string }> }) {
    const { type, page = "1", search } = await searchParams;
    if (!type) return notFound();
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = 20;


    // 공지사항 데이터 가져오기
    const allData = await getSupportList(type);

    // 데이터가 배열이 아닌 경우(에러 발생한 경우) 처리
    const data = Array.isArray(allData) ? allData : [];

    // 검색어가 있을 경우 필터링
    const filteredData = search
        ? data.filter(post =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            (post.contents && post.contents.toLowerCase().includes(search.toLowerCase()))
        )
        : data;

    // 페이지네이션 처리
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // 현재 페이지에 해당하는 데이터만 추출
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
        <div className="mx-auto">
            <div className="bg-white container mx-auto min-h-screen py-8 px-4">
                {/* 헤더 컴포넌트 */}
                <NoticeHeader type={type} />

                {/* 검색 컴포넌트 */}
                <NoticeSearch type={type} />

                {/* 일반 공지사항 테이블 */}
                <NoticeTable
                    posts={paginatedData as Posts[]}
                    user={null}
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
        </div>
    );
}

export default Page;