// 업데이트된 버전의 src/components/support/Pagination.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    type: string;
    search?: string;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   type,
                                                   search
                                               }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 페이지 그룹화 (7개씩 표시)
    const pageGroup = Math.ceil(currentPage / 7);
    const startPage = (pageGroup - 1) * 7 + 1;
    const endPage = Math.min(startPage + 6, totalPages);

    // 페이지 링크 생성 함수
    const createPageLink = (page: number) => {
        // URL 파라미터 복사
        const params = new URLSearchParams(searchParams.toString());
        params.set('type', type);
        params.set('page', page.toString());

        // 검색어가 있으면 유지
        if (search) {
            params.set('search', search);
        }

        return `${pathname}?${params.toString()}`;
    };

    // 페이지 번호 배열 생성
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center text-black items-center mt-8 gap-1" aria-label="페이지네이션">
            {/* 첫 페이지로 */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                asChild={currentPage !== 1}
                aria-label="첫 페이지로 이동"
            >
                {currentPage === 1 ? (
                    <span><ChevronsLeft className="h-4 w-4" /></span>
                ) : (
                    <Link href={createPageLink(1)}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Link>
                )}
            </Button>

            {/* 이전 페이지 */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                asChild={currentPage !== 1}
                aria-label="이전 페이지로 이동"
            >
                {currentPage === 1 ? (
                    <span><ChevronLeft className="h-4 w-4" /></span>
                ) : (
                    <Link href={createPageLink(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                )}
            </Button>

            {/* 페이지 번호 */}
            {pageNumbers.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    asChild={currentPage !== page}
                    aria-label={`${page} 페이지로 이동`}
                    aria-current={currentPage === page ? "page" : undefined}
                >
                    {currentPage === page ? (
                        <span>{page}</span>
                    ) : (
                        <Link href={createPageLink(page)}>
                            {page}
                        </Link>
                    )}
                </Button>
            ))}

            {/* 다음 페이지 */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                asChild={currentPage !== totalPages}
                aria-label="다음 페이지로 이동"
            >
                {currentPage === totalPages ? (
                    <span><ChevronRight className="h-4 w-4" /></span>
                ) : (
                    <Link href={createPageLink(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                )}
            </Button>

            {/* 마지막 페이지로 */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                asChild={currentPage !== totalPages}
                aria-label="마지막 페이지로 이동"
            >
                {currentPage === totalPages ? (
                    <span><ChevronsRight className="h-4 w-4" /></span>
                ) : (
                    <Link href={createPageLink(totalPages)}>
                        <ChevronsRight className="h-4 w-4" />
                    </Link>
                )}
            </Button>
        </nav>
    );
};

export default Pagination;