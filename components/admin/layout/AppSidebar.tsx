'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarItem,
    useSidebar
} from "@/components/ui/sidebar"
import {
    LayoutDashboard,
    Users,
    Boxes,
    Settings,
    HelpCircle,
    LogOut,
    Wrench,
    BarChart3,
    AlertCircle
} from "lucide-react"
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AiOutlineSchedule } from "react-icons/ai";
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import {User} from "@supabase/auth-js";
import {signOut} from "@/app/(main)/login/actions";
import { IoInformationCircleSharp } from "react-icons/io5";
import { FaQuora } from "react-icons/fa";
export function AppSidebar({user}:{user:User}) {
    const pathname = usePathname()
    const { isOpen } = useSidebar()

    // 현재 경로에 따라 활성 메뉴 아이템 결정
    const isActive = (path: string) => pathname === path

    return (
        <Sidebar>
            <SidebarHeader aria-readonly={true} className={'hidden'}></SidebarHeader>
            <SidebarContent>
                {/* 관리자 프로필 */}
                {isOpen && (
                    <div className="flex flex-col items-center justify-center p-4 mb-6 border rounded-xl bg-slate-50">
                        <Avatar className="w-20 h-20 mb-4 border-4 border-white shadow-md">
                            <AvatarImage src={`${user.user_metadata.avatar_url}` || '/user/user.jpg'} alt="관리자" />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                {user?.user_metadata.email.slice(0, 5)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="font-semibold text-base">{user?.user_metadata.email.slice(0,5)}</h3>
                            <p className="text-xs text-muted-foreground">{user?.user_metadata.role}</p>
                        </div>
                    </div>
                )}

                {/* 주요 메뉴 그룹 */}
                <SidebarGroup title="주요 메뉴">
                    <SidebarItem
                        href="/admin/dashboard"
                        icon={<LayoutDashboard size={20} />}
                        title="대시보드"
                        active={isActive('/admin/dashboard')}
                    />
                    <SidebarItem
                        href="/admin/products"
                        icon={<Boxes size={20} />}
                        title="부품 관리"
                        active={isActive('/admin/products')}
                        // badge={
                        //     <Badge variant="outline" className="ml-auto bg-primary/10 border-primary/20 text-primary">
                        //         {3}
                        //     </Badge>
                        // }
                        // 숫자 뱃지 처리시
                    />
                    <SidebarItem
                        href="/admin/customers"
                        icon={<Users size={20} />}
                        title="고객 관리"
                        active={isActive('/admin/customers')}
                    />
                    <SidebarItem
                        href="/admin/schedule"
                        icon={<AiOutlineSchedule size={20} />}
                        title="일정 관리"
                        active={isActive('/admin/schedule')}
                    />
                    {/*<SidebarItem*/}
                    {/*    href="/admin/repair"*/}
                    {/*    icon={<Wrench size={20} />}*/}
                    {/*    title="수리 서비스"*/}
                    {/*    active={isActive('/admin/repair')}*/}
                    {/*/>*/}

                </SidebarGroup>

                {/* 콘텐츠 관리 그룹 */}
                <SidebarGroup title="콘텐츠 관리">
                    <SidebarItem
                        href="/admin/posts"
                        icon={<Wrench size={20} />}
                        title="정비 사례"
                        active={isActive('/admin/posts')}
                    />
                    <SidebarItem
                        href="/admin/support?type=notice"
                        icon={<IoInformationCircleSharp size={20} />}
                        title="공지사항 관리"
                        active={isActive('/admin/support?type=notice')}
                    />
                    <SidebarItem
                        href="/admin/support?type=inquiry"
                        icon={<HiOutlineChatAlt2 size={20} />}
                        title="문의사항 관리"
                        active={isActive('/admin/support?type=inquiry')}
                    />
                </SidebarGroup>

                {/* 시스템 그룹 */}
                <SidebarGroup title="시스템">
                    <SidebarItem
                        href="/admin/analytics"
                        icon={<BarChart3 size={20} />}
                        title="통계 분석"
                        active={isActive('/admin/analytics')}
                    />
                    <SidebarItem
                        href="/admin/settings"
                        icon={<Settings size={20} />}
                        title="환경 설정"
                        active={isActive('/admin/settings')}
                    />
                    {/*<SidebarItem*/}
                    {/*    href="/admin/notifications"*/}
                    {/*    icon={<BellRing size={20} />}*/}
                    {/*    title="알림 센터"*/}
                    {/*    active={isActive('/admin/notifications')}*/}
                    {/*    badge={*/}
                    {/*        notifications > 0 ? (*/}
                    {/*            <Badge variant="outline" className="ml-auto bg-rose-500/10 border-rose-500/20 text-rose-500">*/}
                    {/*                {notifications}*/}
                    {/*            </Badge>*/}
                    {/*        ) : null*/}
                    {/*    }*/}
                    {/*/>*/}
                    <SidebarItem
                        href="/admin/help"
                        icon={<HelpCircle size={20} />}
                        title="도움말"
                        active={isActive('/admin/help')}
                    />
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="space-y-4">
                    {/* 알림 요약 */}
                    <div className="flex items-center p-3 bg-orange-50 text-orange-700 rounded-lg">
                        <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                        <div className="text-xs">
                            <span className="font-medium">{0}개</span>의 새로운 알림이 있습니다
                        </div>
                    </div>

                    {/* 로그아웃 버튼 */}
                    <Button onClick={signOut} variant="outline" className="w-full flex items-center gap-2 justify-start">
                        <LogOut className="h-4 w-4" />
                        <span>로그아웃</span>
                    </Button>

                    {/* 버전 정보 */}
                    <div className="text-xs text-center text-muted-foreground">
                        DS 건설기계 관리자 v1.0
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
