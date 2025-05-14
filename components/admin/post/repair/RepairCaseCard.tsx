'use client'

import React from 'react';
import { Posts } from '@/utils/supabase/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {formatDate} from "@/utils/utils";

interface RepairCaseCardProps {
    post: Posts;
}

export function RepairCaseCard({ post }: RepairCaseCardProps) {
    // 카테고리 변환 함수
    const getCategoryName = (categoryValue: string): string => {
        switch (categoryValue) {
            case 'excavator': return '굴삭기';
            case 'loader': return '로더';
            case 'truck': return '대형트럭';
            default: return categoryValue;
        }
    };

    return (
        <Link href={`/admin/posts/edit/${post.id}`}>
            <Card className="h-full transition-shadow border border-gray-400 min-h-[25vh] hover:shadow-md">
                <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>
                        {getCategoryName(post.category)} | {post.company}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="line-clamp-3 text-sm">
                        {post.contents ? (
                            <div dangerouslySetInnerHTML={{ __html: post.contents.substring(0, 150) + (post.contents.length > 150 ? '...' : '') }} />
                        ) : (
                            <p>내용 없음</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                    {post.created_at ? formatDate(post.created_at) : '날짜 정보 없음'}
                </CardFooter>
            </Card>
        </Link>
    );
}