import React from 'react';
import { notFound, redirect } from "next/navigation";
import { getSupportList, searchSupport, getInquiry, searchInquiry } from "@/app/(main)/support/actions";
import {Posts, InquiryWithUser} from "@/utils/supabase/types";
import NoticeHeader from "@/components/common/SupportHeader";
import NoticeSearch from '@/components/common/NoticeSearch';
import NoticeTable from '@/components/common/NoticeTable';
import Pagination from "@/components/common/Pagination";
import { createClient } from "@/utils/supabase/server";
import InquiryTable from "@/components/support/InquiryTable";

async function Page({ searchParams }: { searchParams: Promise<{ type: string; page?: string; search?: string }> }) {
    const { type, page = "1", search } = await searchParams;
    if (!type) return notFound();

    const currentPage = parseInt(page, 10) || 1;
    const pageSize = 20;

    // 로그인 확인을 위한 supabase 클라이언트 생성
    const supabase = await createClient();

    // 현재 사용자 세션 확인
    const { data: { user } } = await supabase.auth.getUser();

    // inquiry 타입인 경우 로그인 확인 및 사용자별 데이터 조회
    if (type === 'inquiry') {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        if (!user) {
            redirect('/login');
        }

        // 검색어 유무에 따라 다른 함수 호출
        const data = search
            ? await searchInquiry(user.id, search)
            : await getInquiry(user.id);

        // 데이터 처리
        const filteredData = Array.isArray(data) ? data : [];

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

                    {/* 문의 내역 테이블 - Inquiry 테이블 컴포넌트 사용 */}
                    <InquiryTable
                        inquiries={paginatedData as InquiryWithUser[]}
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
            </div>
        );
    }

    // 일반 게시판(공지사항, FAQ 등)인 경우 기존 로직 유지
    const data = search
        ? await searchSupport(type, search)
        : await getSupportList(type);

    // 데이터가 배열이 아닌 경우(에러 발생한 경우) 처리
    const filteredData = Array.isArray(data) ? data : [];

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
                    user={user || null}
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