// app/(main)/support/write/form.tsx
"use client";

import React, { useState } from 'react';
import FormContainer, {FormState} from "@/components/ui/form";
import Editor from "@/lib/editor/Editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/auth-js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useLoading from "@/app/hooks/useLoading";
import {ERROR_CODES} from "@/utils/ErrorMessage";
import {createInquiry} from "@/app/(main)/support/write/actions";
import useAlert from "@/lib/notiflix/useAlert";

function InquiryCreateForm({ user }: { user: User }) {
    const router = useRouter();
    const {isLoading,startLoading,stopLoading} =useLoading()
    const {notify} = useAlert();
    const handleCancel=()=>{
        router.back();
    }
    const handleResult=(formState:FormState)=>{
        startLoading()
        try{
            if(formState.code===ERROR_CODES.SUCCESS){
                router.push('/support?type=inquiry&page=1')
                notify.success(formState.message || '문의가 성공적으로 작성되었습니다.')
            }else{
                notify.failure(formState.message || '문의 중 오류가 발생했습니다.');
            }
        }catch(error){
            console.error(error)
        }finally {
            stopLoading()
        }

    }
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">1:1 문의하기</h1>

            <FormContainer action={createInquiry} onResult={handleResult}>
                <input type="hidden" name="userId" value={user.id} />

                <div className="mb-4">
                    <Label htmlFor="title" className="block mb-2">문의 제목</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="제목을 입력해주세요."
                        required
                        className="w-full"
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="question" className="block mb-2">문의 내용</Label>
                    <Editor
                        name="question"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        * 개인정보(주민번호, 전화번호 등)가 포함되지 않도록 주의해주세요.
                    </p>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? '제출 중...' : '문의하기'}
                    </Button>
                </div>
            </FormContainer>
        </div>
    );
}

export default InquiryCreateForm;
