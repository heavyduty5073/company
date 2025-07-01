import React from 'react';
import { notFound, redirect } from "next/navigation";
import { searchSupport, getInquiry, searchInquiry } from "@/app/(main)/support/actions";
import {Posts, InquiryWithUser} from "@/utils/supabase/types";
import NoticeHeader from "@/components/common/SupportHeader";
import NoticeSearch from '@/components/common/NoticeSearch';
import NoticeTable from '@/components/common/NoticeTable';
import Pagination from "@/components/common/Pagination";
import { createClient } from "@/utils/supabase/server";
import InquiryTable from "@/components/support/InquiryTable";
import { getSupportList } from '@/app/(admin)/admin/support/actions';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { BsBoxSeam } from "react-icons/bs";
import {faqData} from "@/lib/store/faq";
// FAQ 데이터 정의


async function Page({ searchParams }: { searchParams: Promise<{ type: string; page?: string; search?: string }> }) {
    const { type, page = "1", search } = await searchParams;
    if (!type) return notFound();

    const currentPage = parseInt(page, 10) || 1;
    const pageSize = 20;

    // 로그인 확인을 위한 supabase 클라이언트 생성
    const supabase = await createClient();

    // 현재 사용자 세션 확인
    const { data: { user } } = await supabase.auth.getUser();

    // FAQ 타입인 경우 정적 FAQ 데이터 표시
    if (type === 'faq') {
        // 검색 기능 (선택사항)
        let filteredFAQ = faqData;
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredFAQ = faqData.filter(faq =>
                faq.question.toLowerCase().includes(searchTerm) ||
                faq.answer.toLowerCase().includes(searchTerm)
            );
        }

        return (
            <div className="mx-auto">
                <div className="bg-white container mx-auto min-h-screen py-8 px-4">
                    {/* 헤더 컴포넌트 */}
                    <NoticeHeader type={type} />

                    {/* 검색 컴포넌트 */}
                    <NoticeSearch type={type} />

                    {/* FAQ 섹션 */}
                    <div className="mt-8">
                        {/* FAQ 안내 텍스트 */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                자주 묻는 질문
                            </h3>
                            <p className="text-blue-600">
                                DS건설기계(대성산업) 고객님들이 자주 문의하시는 내용들을 모았습니다.
                                굴삭기, 휠로더, 덤프트럭 정비 관련 궁금한 사항이 있으시면 군산본점(010-2036-5073) 또는 김제지점(010-9590-1232)으로 문의해주세요.
                            </p>
                        </div>

                        {/* 검색 결과가 없을 때 */}
                        {filteredFAQ.length === 0 && search && (
                            <div className="text-center py-12">
                                <div className="text-gray-500 mb-4">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8a7.962 7.962 0 01-2.709 5.291z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    검색 결과가 없습니다
                                </h3>
                                <p className="text-gray-500">
                                    '{search}'에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.
                                </p>
                            </div>
                        )}

                        {/* FAQ Accordion */}
                        {filteredFAQ.length > 0 && (
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {filteredFAQ.map((faq) => (
                                    <AccordionItem
                                        key={faq.id}
                                        value={faq.id}
                                        className="border border-gray-200 rounded-lg px-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <AccordionTrigger className="text-left hover:no-underline py-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold mt-0.5">
                                                    Q
                                                </div>
                                                <span className="text-gray-900 font-medium leading-relaxed">
                                                    {faq.question}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-semibold">
                                                    A
                                                </div>
                                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}

                        {/* 추가 도움말 섹션 */}
                        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                더 많은 도움이 필요하세요?
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="flex justify-center items-center text-blue-600 mb-2">
                                        <BsFillQuestionCircleFill className={'w-7 h-7'}/>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mb-1">기술문의</h4>
                                    <p className="text-sm text-gray-600">010-7593-0091</p>
                                    <p className="text-xs text-gray-500">평일 08:30~18:30</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="flex justify-center items-center text-green-600 mb-2">
                                        <BsBoxSeam className={'w-7 h-7'}/>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mb-1">부품문의</h4>
                                    <p className="text-sm text-gray-600">010-2036-5073</p>
                                    <p className="text-xs text-gray-500">평일 08:30~18:30</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-red-600 mb-2">
                                        <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mb-1">A/S 출장문의</h4>
                                    <p className="text-sm text-gray-600">010-8222-7886</p>
                                    <p className="text-xs text-gray-500">전 지역 출장가능</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

    // 일반 게시판 공지사항인 경우 기존 로직 유지
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
