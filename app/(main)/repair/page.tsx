import React from 'react';
import RepairList from '@/components/repair/RepairList';
import { FaTools } from 'react-icons/fa';
import {getRepairCases} from "@/app/(main)/repair/actions";

async function Page() {
    const data = await getRepairCases();

    return (
        <div className="py-8 px-4 bg-main text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-jalnan mb-2">
                        정비 사례
                    </h1>
                    <p>
                        다양한 중장비 정비 사례를 확인하세요.
                    </p>
                </div>

            </div>

            {/* 설명 영역 */}
            <div className="bg-gray-700 p-4 rounded-lg mb-8 border border-gray-200">
                <div className="flex items-start">
                    <FaTools className="text-main text-xl mt-1 mr-3" />
                    <div>
                        <h2 className="text-lg font-bold text-white mb-2">정비 사례 데이터베이스</h2>
                        <p className="text-white">
                            종류, 제조사별로 다양한 중장비 정비 사례를 확인하실 수 있습니다.
                            각 사례는 실제 현장에서 발생한 문제와 해결 과정을 상세히 기록하고 있습니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 정비 사례 리스트 컴포넌트 */}
            <RepairList repairList={data} />
        </div>
    );
}

export default Page;