import React from 'react';
import RepairList from '@/components/repair/RepairList';
import { FaTools } from 'react-icons/fa';
import {getRepairCases} from "@/app/(main)/repair/actions";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "정비 사례 | DS 건설기계 - 덤프트럭 포크레인 굴삭기 수리 사례",
    description: "DS 건설기계의 덤프트럭, 포크레인, 굴삭기 등 중장비 정비 사례를 확인하세요. 실제 현장에서 발생한 문제와 해결 과정을 상세히 기록한 정비 데이터베이스입니다.",
    keywords: [
        "건설기계 정비 사례", "덤프트럭 수리 사례", "포크레인 정비", "굴삭기 수리",
        "중장비 정비", "건설장비 수리 예시", "DS 건설기계 정비", "군산 건설기계 수리"
    ],
    openGraph: {
        title: "정비 사례 | DS 건설기계",
        description: "실제 현장에서 발생한 중장비 정비 사례와 해결 과정을 확인하세요.",
        url: "https://deasung.kr/repair",
        images: [
            {
                url: "/business/workBanner.png",
                width: 1200,
                height: 630,
                alt: "DS 건설기계 정비 사례"
            }
        ]
    },
    alternates: {
        canonical: "/repair"
    }
};
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