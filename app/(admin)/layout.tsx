import React, { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/layout/AppSidebar";
import {
    Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Alert from "@/components/admin/layout/Alert";

function AdminLayout({ children }: { children: ReactNode }) {

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-slate-50 flex flex-col">
                {/* 상단 헤더 */}
                <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <h1 className="text-xl font-semibold">DS 건설기계 관리자</h1>
                        </div>

                        <div className="flex items-center ml-auto gap-4">
                            {/* 검색창 */}
                            <div className="relative w-64 max-w-sm hidden md:flex">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="검색..."
                                    className="pl-8 w-full"
                                />
                            </div>

                            {/* 알림 */}
                            <Alert/>

                            {/* 사용자 프로필 */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/images/admin-avatar.jpg" alt="관리자" />
                                            <AvatarFallback>관</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-0.5">
                                            <p className="text-sm font-medium">관리자</p>
                                            <p className="text-xs text-muted-foreground">
                                                admin@dsconstructionmachinery.com
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>프로필 설정</DropdownMenuItem>
                                    <DropdownMenuItem>계정 관리</DropdownMenuItem>
                                    <DropdownMenuItem>환경 설정</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-rose-500">로그아웃</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* 사이드바 */}
                    <AppSidebar />

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