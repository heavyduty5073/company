"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Posts } from "@/utils/supabase/types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { formatDateString } from "@/utils/utils";
import { User } from "@supabase/auth-js";
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/app/(admin)/admin/support/actions";
import useLoading from "@/app/hooks/useLoading";

interface NoticeTableProps {
    posts: Posts[];
    user: User | null;
}

const NoticeTable: React.FC<NoticeTableProps> = ({
                                                     posts,
                                                     user
                                                 }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const { isLoading, setLoading } = useLoading();

    // 삭제 확인 다이얼로그 상태
    const [deletePostId, setDeletePostId] = useState<string | null>(null);

    // 상세 페이지 링크 생성
    const createDetailLink = (postId: string) => {
        // 현재 검색 쿼리 파라미터 유지
        const queryParams = new URLSearchParams();
        if (type) queryParams.set('type', type);
        if (search) queryParams.set('search', search);

        const queryString = queryParams.toString();
        return `${pathname}/${postId}${queryString ? `?${queryString}` : ''}`;
    };

    // 수정 페이지 링크 생성
    const createEditLink = (postId: string) => {
        const queryParams = new URLSearchParams();
        if (type) queryParams.set('type', type);

        const queryString = queryParams.toString();
        return `${pathname}/edit/${postId}${queryString ? `?${queryString}` : ''}`;
    };

    // 게시물 삭제 핸들러
    const handleDelete = async () => {
        if (!deletePostId) return;

        try {
            setLoading(true);

            // 수정된 서버 액션 호출 (id만 전달)
            const result = await deletePost(deletePostId);

            if (result.code === 0) { // SUCCESS
                router.refresh(); // 페이지 새로고침
            }

        } catch (error) {
            console.error('삭제 중 오류:', error);
        } finally {
            setLoading(false);
            setDeletePostId(null);
        }
    };

    return (
        <div className="rounded-md border">
            <Table className={'bg-gray-300'}>
                {
                    <TableCaption>
                        {search && <span className="ml-2">검색어: "{search}"</span>}
                    </TableCaption>
                }
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-full text-center">제목</TableHead>
                        <TableHead className="w-[140px] text-start">작성일</TableHead>
                        {user?.user_metadata.role === 'admin' && <TableHead className="w-[80px] text-center">관리</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={user?.user_metadata.role === 'admin' ? 3 : 2} className="text-center py-8 text-gray-500">
                                {search
                                    ? `'${search}'에 대한 검색 결과가 없습니다.`
                                    : '등록된 글이 없습니다.'}
                            </TableCell>
                        </TableRow>
                    ) : (
                        posts.map((post) => (
                            <TableRow
                                key={post.id}
                                className={`hover:bg-gray-50`}
                            >
                                <TableCell>
                                    <Link
                                        href={createDetailLink(post.id)}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {post.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatDateString(post.created_at)}</TableCell>

                                {user?.user_metadata.role === 'admin' && (
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <span className="sr-only">메뉴 열기</span>
                                                    <FiMoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className={'bg-white'} align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={createEditLink(post.id)} className="flex items-center">
                                                        <FiEdit2 className="mr-2 h-4 w-4" />
                                                        <span>수정하기</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                setDeletePostId(post.id);
                                                            }}
                                                            className="text-red-600 focus:text-red-600 flex items-center"
                                                        >
                                                            <FiTrash2 className="mr-2 h-4 w-4" />
                                                            <span>삭제하기</span>
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className={'bg-white'}>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>게시물 삭제</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className={'border border-black/50'}>취소</AlertDialogCancel>
                                                            <Button
                                                                onClick={handleDelete}
                                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? '삭제 중...' : '삭제'}
                                                            </Button>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default NoticeTable;
