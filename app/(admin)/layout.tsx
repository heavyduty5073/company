import React, { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/layout/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Alert from "@/components/admin/layout/Alert";
import {createClient} from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import {signOut} from "@/app/(main)/login/actions";
import {getUnansweredInquiryCount} from "@/app/(admin)/admin/support/actions";

async function AdminLayout({ children }: { children: ReactNode }) {

    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    const data = await getUnansweredInquiryCount()
    if(!user || user.user_metadata.role!=='admin') return redirect('/login')
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-slate-50 flex flex-col w-full">
                {/* 상단 헤더 */}
                <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
                    <div className="flex h-16  justify-between items-center px-4 w-full">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger><AppSidebar user={user}/></SidebarTrigger>
                            <Link href={'/home'} className={'flex flex-row items-center'}>
                            <h1 className="text-xl font-semibold">관리자 페이지</h1>
                            </Link>
                        </div>

                        <div className="flex items-center ml-auto gap-4">

                            {/* 알림 */}
                            <Alert dataCount={data}/>

                            {/* 사용자 프로필 */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-8 w-8 m-2">
                                            <AvatarImage src={user.user_metadata.avatar_url || '/user/user.jpg'} alt="관리자" />
                                            <AvatarFallback className={'border border-black'}><Image src={'/user/user.jpg'} alt={'userImg'} fill className={'w-full h-full'}/></AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={'bg-white'}>
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-0.5">
                                            <p className="text-xs text-muted-foreground">
                                                {user.user_metadata.name ||'관리자'}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>프로필 설정</DropdownMenuItem>
                                    <DropdownMenuItem>계정 관리</DropdownMenuItem>
                                    <DropdownMenuItem>환경 설정</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={signOut} className="text-rose-500">로그아웃</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* 사이드바 */}
                    <AppSidebar user={user}/>

                    {/* 메인 콘텐츠 */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="container mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default AdminLayout;