import React from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt, FaBuilding, FaTools } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import {getRepairCaseDetail} from "@/app/(main)/repair/[id]/actions";
import {getCategoryStyle, getCompanyStyle} from "@/utils/utils";

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if(!id) return notFound();
    const repairCase = await getRepairCaseDetail(id);

    // 에러 또는 데이터가 없는 경우 404 페이지 표시
    if ('code' in repairCase || !repairCase) {
        notFound();
    }

    const categoryStyle = getCategoryStyle(repairCase.category);
    const companyStyle = getCompanyStyle(repairCase.company);
    return (
        <div className="container mx-auto py-8 px-4">
            {/* 뒤로 가기 */}
            <Link href="/repair" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FaArrowLeft className="mr-2" />
                목록으로 돌아가기
            </Link>

            {/* 헤더 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={`${categoryStyle.bgColor} ${categoryStyle.textColor}`}>
                        <FaTools className="w-3 h-3 mr-1" />
                        {categoryStyle.name}
                    </Badge>
                    <Badge className={`${companyStyle.bgColor} ${companyStyle.textColor}`}>
                        <FaBuilding className="w-3 h-3 mr-1" />
                        {repairCase.company}
                    </Badge>
                </div>

                <h1 className="text-2xl font-jalnan text-gray-900 mb-3">{repairCase.title}</h1>

                <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1" />
                    <span>작성일: {new Date(repairCase.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
            </div>

            {/* 내용 */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="prose prose-lg max-w-none">
                    <div
                        className="content"
                        dangerouslySetInnerHTML={{ __html: repairCase.contents || '내용 없음' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Page;