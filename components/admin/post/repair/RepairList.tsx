'use client'
import React, { useState, useMemo } from 'react';
import { Posts } from '@/utils/supabase/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RepairCaseCard } from "@/components/admin/post/repair/RepairCaseCard";
import {companyOptions} from "@/lib/store/company";

// 드롭다운 대신 버튼 그룹을 사용한 버전
export default function RepairCaseList({ repairList = [] }: {repairList: Posts[]}) {
    const [category, setCategory] = useState<string | null>(null);
    const [company, setCompany] = useState<string | null>(null);

    // 카테고리 변경 시 회사 필터 초기화
    const handleCategoryChange = (value: string | null) => {
        if (value === category) {
            // 같은 카테고리를 다시 클릭하면 필터 제거
            setCategory(null);
        } else {
            setCategory(value);
        }
        setCompany(null); // 회사 필터 항상 초기화
    };

    // 회사 변경 핸들러
    const handleCompanyChange = (value: string | null) => {
        if (value === company) {
            // 같은 회사를 다시 클릭하면 필터 제거
            setCompany(null);
        } else {
            setCompany(value);
        }
    };

    // 선택된 카테고리에 따라 회사 옵션 리스트 결정
    const getCompanyOptions = () => {
        switch (category) {
            case 'excavator':
            case 'loader':
                return companyOptions.excavator;
            case 'truck':
                return companyOptions.truck;
            default:
                return [];
        }
    };


    // 필터링된 리스트
    const filteredList = useMemo(() => {
        return repairList.filter(post => {
            // 카테고리 필터
            if (category && post.category !== category) {
                return false;
            }

            // 회사 필터
            if (company && post.company !== company) {
                return false;
            }

            return true;
        });
    }, [repairList, category, company]);

    return (
        <div>
            {/* 카테고리 필터 버튼 그룹 */}
            <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">작업 종류</h3>
                <div className="flex flex-wrap gap-2">
                    <Button
                        className={`${category === null ? "bg-main text-white" : "border-black bg-white"} rounded-full border`}
                        onClick={() => handleCategoryChange(null)}
                        size="sm"
                    >
                        전체
                    </Button>
                    <Button
                        className={`${category === 'excavator' ? "bg-main text-white" : "border-black bg-white"} rounded-full border`}
                        onClick={() => handleCategoryChange('excavator')}
                        size="sm"
                    >
                        굴삭기
                    </Button>
                    <Button
                        className={`${category === 'loader' ? "bg-main text-white" : "border-black bg-white"} rounded-full border`}
                        onClick={() => handleCategoryChange('loader')}
                        size="sm"
                    >
                        로더
                    </Button>
                    <Button
                        className={`${category === 'truck' ? "bg-main text-white" : "border-black bg-white"} rounded-full border`}
                        onClick={() => handleCategoryChange('truck')}
                        size="sm"
                    >
                        대형트럭
                    </Button>
                </div>
            </div>

            {/* 회사 필터 버튼 그룹 */}
            {category && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">제조사</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={company === null ? "default" : "outline"}
                            onClick={() => handleCompanyChange(null)}
                            size="sm"
                        >
                            전체
                        </Button>
                        {getCompanyOptions().map((companyOption) => (
                            <Button
                                key={companyOption}
                                variant={company === companyOption ? "default" : "outline"}
                                onClick={() => handleCompanyChange(companyOption)}
                                size="sm"
                            >
                                {companyOption}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* 목록이 비어 있을 때 */}
            {Array.isArray(repairList) && repairList.length === 0 && (
                <Alert>
                    <AlertDescription className="text-center py-8">
                        등록된 정비 사례가 없습니다.
                    </AlertDescription>
                </Alert>
            )}

            {/* 필터링된 결과가 없을 때 */}
            {Array.isArray(repairList) && repairList.length > 0 && filteredList.length === 0 && (
                <Alert>
                    <AlertDescription className="text-center py-8">
                        선택한 필터에 맞는 정비 사례가 없습니다.
                    </AlertDescription>
                </Alert>
            )}

            {/* 게시글 목록 */}
            {filteredList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredList.map((post) => (
                        <RepairCaseCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}