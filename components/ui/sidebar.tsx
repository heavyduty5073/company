// components/ui/sidebar.tsx
'use client'

import * as React from 'react'
import { createContext, useContext, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import {DialogDescription, DialogTitle} from "@radix-ui/react-dialog";

// 사이드바 컨텍스트 정의
type SidebarContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// 사이드바 프로바이더
export function SidebarProvider({
                                  children,
                                }: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // 반응형 설정
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    // 초기 로드 시 체크
    checkScreenSize()

    // 리사이즈 이벤트에 대한 리스너
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
      <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
        <div className="flex h-screen overflow-hidden">
          {children}
        </div>
      </SidebarContext.Provider>
  )
}

// 사이드바 컨텍스트 훅
export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

// 사이드바 토글 버튼
export function SidebarTrigger({ children }: { children?: React.ReactNode }) {
    const { isOpen, setIsOpen, isMobile } = useSidebar();

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px] bg-white">
                    <DialogTitle className="sr-only">네비게이션 메뉴</DialogTitle>
                    <DialogDescription className="sr-only">사이트 내비게이션을 위한 메뉴입니다.</DialogDescription>
                    {children}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}

// 메인 사이드바 컴포넌트
export function Sidebar({
                            className,
                            children,
                            ...props
                        }: React.HTMLAttributes<HTMLDivElement>) {
    const { isOpen, isMobile } = useSidebar();

    // 모바일에서는 Sheet에 내용이 렌더링되므로, 데스크톱에서만 표시
    if (isMobile) {
        return null;
    }

    return (
        <aside
            className={cn(
                "group py-4 border-r bg-background/95 backdrop-blur-sm relative duration-300 ease-in-out",
                isOpen ? "w-[280px]" : "w-[70px]",
                className
            )}
            {...props}
        >
            {children}
        </aside>
    );
}

// 사이드바 헤더
export function SidebarHeader({
                                className,
                                children,
                                ...props
                              }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()

  return (
      <div
          className={cn(
              "px-2 lg:px-4 mb-0 lg:mb-6 flex items-center",
              isOpen ? "justify-between" : "justify-center",
              className
          )}
          {...props}
      >
        {children || (
            <>
              <div className={cn("flex items-center gap-2", !isOpen && "hidden")}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DS</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Admin</h2>
              </div>

              {isOpen && (
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => useSidebar().setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
              )}

              {!isOpen && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DS</span>
                  </div>
              )}
            </>
        )}
      </div>
  )
}

// 사이드바 컨텐츠
export function SidebarContent({
                                 className,
                                 children,
                                 ...props
                               }: React.HTMLAttributes<HTMLDivElement>) {
  return (
      <div
          className={cn("px-3 space-y-4 flex-1 overflow-auto", className)}
          {...props}
      >
        {children}
      </div>
  )
}

// 사이드바 그룹
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  icon?: React.ReactNode
}

export function SidebarGroup({
                               className,
                               title,
                               icon,
                               children,
                               ...props
                             }: SidebarGroupProps) {
  const { isOpen } = useSidebar()

  return (
      <div className={cn("space-y-1", className)} {...props}>
        {title && (
            <div className={cn("flex items-center gap-2 px-3 py-1.5",
                isOpen ? "justify-start" : "justify-center"
            )}>
              {icon}
              {isOpen && (
                  <p className="text-xs uppercase text-muted-foreground tracking-wider font-medium">
                    {title}
                  </p>
              )}
            </div>
        )}
        <div className="space-y-1">
          {children}
        </div>
      </div>
  )
}

// 사이드바 푸터
export function SidebarFooter({
                                className,
                                children,
                                ...props
                              }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()

  return (
      <div
          className={cn(
              "mt-auto px-4 py-4 border-t",
              isOpen ? "block" : "hidden",
              className
          )}
          {...props}
      >
        {children}
      </div>
  )
}

// 사이드바 항목
interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode
  title: string
  active?: boolean
  href: string
  badge?: React.ReactNode
}

export function SidebarItem({
                              className,
                              icon,
                              title,
                              active,
                              href,
                              badge,
                              ...props
                            }: SidebarItemProps) {
  const { isOpen } = useSidebar()

  return (
      <a
          href={href}
          className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
              isOpen ? "justify-start" : "justify-center",
              className
          )}
          {...props}
      >
        {icon && (
            <span className={cn("text-base", active && "text-accent-foreground")}>
          {icon}
        </span>
        )}
        {isOpen && <span>{title}</span>}
        {isOpen && badge && <span className="ml-auto">{badge}</span>}
      </a>
  )
}