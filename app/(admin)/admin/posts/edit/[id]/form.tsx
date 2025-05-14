'use client';

import React, { useState, useEffect } from 'react';
import FormContainer from "@/components/ui/form";
import Editor from "@/lib/editor/Editor";
import { updatePost } from './actions';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { companyOptions } from "@/lib/store/company";
import { Posts } from "@/utils/supabase/types";

interface EditPostProps {
    post: Posts;
}

function EditPost({ post }: EditPostProps) {
    const [category, setCategory] = useState<string>(post.category || '');

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

    // 폼 제출 핸들러
    const handleSubmit = async (formData: FormData) => {
        // post.id를 폼 데이터에 추가
        formData.append('id', post.id.toString());

        // updatePost 액션 호출
        return updatePost(formData);
    };

    return (
        <FormContainer action={handleSubmit}>
            <div className="space-y-8">
                <div>
                    <h1 className="font-jalnan text-2xl mb-6">정비 사례 수정</h1>
                    <p className="text-gray-600 mb-4">
                        정비 사례 정보를 수정하세요. 상세한 내용과 이미지는 아래 에디터를 사용해 주세요.
                    </p>
                </div>

                {/* 숨겨진 태그 필드 - 항상 'repaircase'로 설정 */}
                <input type="hidden" name="tag" value="repaircase" />

                {/* 제목 입력 */}
                <div className="space-y-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                        id="title"
                        name="title"
                        defaultValue={post.title}
                        placeholder="정비 사례 제목을 입력하세요"
                        required
                        className="w-full"
                    />
                </div>

                {/* 작업 종류 선택 (카테고리) */}
                <div className="space-y-2">
                    <Label htmlFor="category">작업 종류</Label>
                    <Select
                        name="category"
                        required
                        defaultValue={post.category}
                        onValueChange={(value) => setCategory(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="작업 종류를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent className={'bg-white'}>
                            <SelectItem value="excavator">굴삭기</SelectItem>
                            <SelectItem value="loader">로더</SelectItem>
                            <SelectItem value="truck">대형트럭</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 회사 선택 */}
                <div className="space-y-2">
                    <Label htmlFor="company">제조사</Label>
                    <Select
                        name="company"
                        required
                        disabled={!category}
                        defaultValue={post.company ||''}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={category ? "제조사를 선택하세요" : "작업 종류를 먼저 선택하세요"} />
                        </SelectTrigger>
                        <SelectContent className={'bg-white'}>
                            {getCompanyOptions().map((company) => (
                                <SelectItem key={company} value={company}>
                                    {company}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 내용 에디터 */}
                <div className="space-y-2">
                    <Label htmlFor="contents">상세 내용</Label>
                    <div className="min-h-[400px] border rounded-md">
                        <Editor name="contents" defaultValue={post.contents ||''} />
                    </div>
                </div>

                {/* 제출 버튼 */}
                <div className="flex justify-end items-center pt-4 gap-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()} className="w-full md:w-auto border border-black px-8">
                        취소
                    </Button>
                    <Button type="submit" className="w-full md:w-auto border border-black px-8">
                        수정하기
                    </Button>
                </div>
            </div>
        </FormContainer>
    );
}

export default EditPost;