'use client'
import React, { useState } from 'react';
import FormContainer, { FormState } from "@/components/ui/form";
import { Inquiry } from "@/utils/supabase/types";
import { User } from "@supabase/supabase-js";
import Editor from "@/lib/editor/Editor";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/utils";
import {submitInquiryAnswer} from "@/app/(admin)/admin/support/detail/actions";
import {ERROR_CODES} from "@/utils/ErrorMessage";
import useAlert from "@/lib/notiflix/useAlert";
import useLoading from "@/app/hooks/useLoading";

function InquiryAnswerForm({ inquiry, admin }: { inquiry: Inquiry; admin: User }) {
    const router = useRouter();
    const { notify } = useAlert();
    const {isLoading,stopLoading} = useLoading();

    const handleResult = (formState: FormState) => {
        if (formState.code === ERROR_CODES.SUCCESS) {
            notify.success('답변이 등록되었습니다.');
            // 성공 시에는 페이지 이동하므로 setLoading(false) 불필요
            router.push(`/admin/support?type=inquiry&page=1`);
        } else {
            notify.failure(`${formState.message}`);
            // 실패 시에만 로딩 상태 해제
            stopLoading();
        }
    };

    const handleSubmit = () => {
        stopLoading();
    };

    return (
        <FormContainer
            action={submitInquiryAnswer}
            onResult={handleResult}
            onSubmit={handleSubmit}
        >
            {/* 히든 필드 */}
            <input type="hidden" name="id" value={inquiry.id} />
            <input type="hidden" name="admin_id" value={admin.id} />

            {/* 문의 정보 섹션 */}
            <div className="mb-6 border-b pb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{inquiry.title}</h2>
                    <div className="text-sm text-gray-500">
                        작성일: {formatDate(inquiry.created_at)}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">문의 내용</h3>
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: inquiry.question || '내용 없음' }}
                    ></div>
                </div>
            </div>

            {/* 답변 작성 섹션 */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">답변 작성</h3>
                <Editor
                    name="answer"
                    defaultValue={inquiry.answer || ''}
                    placeholder="답변을 작성해주세요..."
                />
            </div>

            {/* 버튼 섹션 */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/support?type=inquiry')}
                    disabled={isLoading}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? '저장 중...' : '답변 등록'}
                </Button>
            </div>
        </FormContainer>
    );
}

export default InquiryAnswerForm;
