'use client'
import React, {useState} from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Bell} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

function Alert() {
    const [notifications, setNotifications] = useState(5);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] p-0 flex items-center justify-center bg-rose-500">
                            {notifications}
                        </Badge>
                    )}
                    <span className="sr-only">알림</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">알림</h4>
                        <Button variant="ghost" size="sm" className="text-xs h-auto px-2">
                            모두 읽음 표시
                        </Button>
                    </div>
                </div>
                <div className="max-h-80 overflow-auto">
                    {/* 알림 목록 */}
                    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm">
                                <span className="font-medium">김고객</span>님이 새로운 수리 요청을 보냈습니다.
                            </p>
                            <p className="text-xs text-muted-foreground">10분 전</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm">
                                <span className="font-medium">오늘의 통계</span> 보고서가 준비되었습니다.
                            </p>
                            <p className="text-xs text-muted-foreground">1시간 전</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                        모든 알림 보기
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default Alert;