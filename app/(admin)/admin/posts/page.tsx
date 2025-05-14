import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {getRepairCases} from "@/app/(admin)/admin/posts/actions";
import RepairCaseListWrapper from "@/components/admin/post/repair/RepairCaseListWrapper";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";

export default async function Page() {

    const data = await getRepairCases()

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-jalnan">정비 사례</h1>

                {/* 관리자만 등록 버튼 표시 */}

                <div className={'flex flex-row items-center gap-2'}>
                <div className="relative w-64 max-w-sm hidden md:flex">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="제목을 입력해주세요"
                        className="pl-8 w-full border-black"
                    />
                </div>
                    <Link href="/admin/posts/create" className={'border border-black rounded-lg'}>
                        <Button>등록하기</Button>
                    </Link>
                </div>
            </div>

            {/* 수리 사례 목록 컴포넌트 */}
            <RepairCaseListWrapper repairList={data || []} />
        </div>
    );
}