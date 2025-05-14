import React from 'react';
import { Posts } from "@/utils/supabase/types";
import Link from "next/link";
import Image from "next/image";
import { FaTools, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { categoryMap, companyColorMap } from '@/lib/store/company';
import {extractFirstImage} from "@/utils/utils";

// 카테고리 스타일 가져오기
const getCategoryStyle = (category: string) => {
    return categoryMap[category] || { name: category, bgColor: 'bg-gray-500', textColor: 'text-white' };
};

// 회사 스타일 가져오기
const getCompanyStyle = (company: string) => {
    return companyColorMap[company] || companyColorMap['default'];
};

interface RepairListProps {
    repairList: Posts[] | [];
    showFilters?: boolean;
}

function RepairList({ repairList, showFilters = true }: RepairListProps) {
    if (!repairList || repairList.length === 0)
        return (
            <div className="text-center py-16 text-gray-500">
                <FaSearch className="mx-auto text-4xl mb-4 opacity-30" />
                <p className="text-xl">정비 사례 데이터를 찾을 수 없습니다.</p>
                <p className="mt-2 text-sm">나중에 다시 확인해 주세요.</p>
            </div>
        );

    return (
        <div className="w-full">
            {/* 필터 영역 (옵션) */}
            {showFilters && (
                <div className="mb-8 bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-3">필터</h3>
                    <div className="flex flex-wrap gap-3">
                        <div className="w-full md:w-auto">
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="text-sm font-semibold">카테고리:</span>
                                {Object.keys(categoryMap).map((category) => (
                                    <Badge
                                        key={category}
                                        className={`${categoryMap[category].bgColor} ${categoryMap[category].textColor} cursor-pointer`}
                                    >
                                        {categoryMap[category].name}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm font-semibold">제조사:</span>
                                {Object.keys(companyColorMap).filter(company => company !== 'default').map((company) => (
                                    <Badge
                                        key={company}
                                        className={`${companyColorMap[company].bgColor} ${companyColorMap[company].textColor} cursor-pointer`}
                                    >
                                        {company}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 정비 사례 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {repairList.map((item, index) => {
                    const imageUrl = extractFirstImage(item.contents || '');
                    const categoryStyle = getCategoryStyle(item.category);
                    const companyStyle = getCompanyStyle(item.company ||'');

                    return (
                        <Link href={`/repair/${item.id}`} key={item.id}>
                            <Card className="h-full bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-300">
                                <CardHeader className="p-3 pb-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge className={`flex items-center ${categoryStyle.bgColor} ${categoryStyle.textColor}`}>
                                            <FaTools className="w-3 h-3 mr-1" />
                                            {categoryStyle.name}
                                        </Badge>
                                        <Badge className={`${companyStyle.bgColor} ${companyStyle.textColor}`}>
                                            {item.company}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-3 pt-0">
                                    <h3 className="text-lg font-jalnan text-black mb-2 truncate">
                                        {item.title}
                                    </h3>

                                    {/* 이미지 표시 영역 */}
                                    {imageUrl ? (
                                        <div className="relative w-full h-40 mb-3 overflow-hidden rounded-md bg-gray-100">
                                            <Image
                                                src={imageUrl}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                                className="object-cover transform hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-40 mb-3 bg-gray-100 flex items-center justify-center rounded-md">
                                            <FaTools className="text-4xl text-gray-300" />
                                        </div>
                                    )}

                                    <div className="h-20 overflow-hidden text-sm text-black">
                                        {item.contents ? (
                                            <div
                                                className="line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: item.contents.replace(/<[^>]*>/g, ' ').slice(0, 100) + '...'
                                                }}
                                            />
                                        ) : (
                                            <p>내용 없음</p>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-3 pt-0 flex items-center text-sm text-gray-500">
                                    <FaCalendarAlt className="mr-1" />
                                    {new Date(item.created_at).toLocaleDateString('ko-KR')}
                                </CardFooter>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default RepairList;