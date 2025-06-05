import React from 'react';
import {notFound, redirect} from "next/navigation";
import {getDetailInquiry, getSupportDetail} from "@/app/(main)/support/[id]/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDateString } from "@/utils/utils";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Posts } from "@/utils/supabase/types";
import {createClient} from "@/utils/supabase/server";
import AttachmentDownload from "@/components/editor/AttachmentDownload";

async function Page({ params, searchParams }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string, page?: string }>;
}) {
    const { id } = await params;
    const { type = 'notice', page = '1' } = await searchParams;

    if (!id) notFound();

    // type 파라미터를 getSupportDetail 함수에 전달
    const data = await getSupportDetail(id, type);
    if (!data) notFound();

    // 목록 페이지로 돌아가는 링크 생성
    const backToListLink = `/admin/support?type=${type}${page ? `&page=${page}` : ''}`;

    // inquiry 타입인 경우 다른 레이아웃 사용
    if (type === 'inquiry') {
        const supabase = await createClient();
        const {data:{user}} = await supabase.auth.getUser()
        if(!user) return redirect('/login')
        const inquiry = await getDetailInquiry(id,user.id)

        if(!inquiry) return notFound()
        return (
            <div className="px-4 py-8">
                <div className="w-full">
                    {/* 뒤로가기 버튼 */}
                    <div className="mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={backToListLink} className="flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                목록으로 돌아가기
                            </Link>
                        </Button>
                    </div>

                    <Card className="shadow-md">
                        <CardHeader className="pb-4">
                            <h1 className={'font-jalnan my-4 text-xl'}>1:1 문의</h1>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    {/* 제목 및 날짜 정보 */}
                                    <div className="flex items-center gap-2 mb-2">
                                        {inquiry.answer ? (
                                            <Badge variant="outline" className="bg-green-100 text-green-800">답변완료</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">답변대기</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl font-bold">{inquiry.title}</CardTitle>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-6 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center mb-2">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>{formatDateString(inquiry.created_at)}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <Separator />

                        <CardContent className="pt-6 pb-8">
                            {/* 문의 내용 */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">문의 내용</h3>
                                <div
                                    dangerouslySetInnerHTML={{ __html: inquiry.question || '' }}
                                    className="prose max-w-none p-4 bg-gray-50 rounded-md"
                                ></div>
                            </div>

                            {/* 답변 내용 (있는 경우) */}
                            {inquiry.answer && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">답변</h3>
                                    <div className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
                                        <div
                                            dangerouslySetInnerHTML={{ __html: inquiry.answer }}
                                            className="prose max-w-none"
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    } else {
        // inquiry가 아닌 경우 Posts 타입으로 캐스팅
        const post = data as Posts;

        return (
            <div className="px-4 py-8">
                <div className="w-full">
                    {/* 뒤로가기 버튼 */}
                    <div className="mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={backToListLink} className="border border-blue-300 bg-blue-400 text-white flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                목록으로 돌아가기
                            </Link>
                        </Button>
                    </div>

                    <Card className="shadow-md">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    {/* 제목 및 날짜 정보 */}
                                    <div className="flex items-center gap-2 mb-2">
                                        {type === 'notice' && (
                                            <Badge variant="default" className="bg-blue-500">공지사항</Badge>
                                        )}
                                        {type === 'faq' && (
                                            <Badge variant="default" className="bg-green-500">자주 묻는 질문</Badge>
                                        )}
                                        {type === 'qna' && (
                                            <Badge variant="default" className="bg-purple-500">문의사항</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-6 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center mb-2">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>{formatDateString(post.created_at)}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <Separator />

                        <CardContent className="pt-6 pb-8">
                            {/* 게시물 내용 */}
                            <div className="prose max-w-none">
                                <div
                                    dangerouslySetInnerHTML={{ __html: post.contents || '' }}
                                    className="prose max-w-none"
                                ></div>
                            </div>
                            {/* 게시물 첨부파일 */}
                            <AttachmentDownload attachments={post.attachments || []} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Page;
