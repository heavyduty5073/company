'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { MenuItem, SubMenuItem } from "@/lib/menus";

// 서브메뉴 아이템 컴포넌트
const SubMenuListItem = React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div"> & { item: SubMenuItem }
>(({ className, item, ...props }, ref) => {
    return (
        <li>
            <div className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
            )}>
                <Link
                    href={item.link}
                    className="no-underline outline-none"
                >
                    <div className="text-sm leading-none">{item.title}</div>
                    {item.description && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                        </p>
                    )}
                </Link>
            </div>
        </li>
    );
});
SubMenuListItem.displayName = "SubMenuListItem";

// 메뉴 아이템 컴포넌트
interface MenuItemProps {
    item: MenuItem;
}

// 커스텀 드롭다운 메뉴 컴포넌트
// CustomDropdownMenu 컴포넌트에서 버튼 부분 수정
const CustomDropdownMenu = ({ item }: { item: MenuItem }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md text-sm transition-colors focus:outline-none focus:bg-primary/10 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-white h-10 py-2 px-4 hover:bg-primary/10 data-[active]:bg-primary/10 data-[state=open]:bg-primary/10 menu-glow"
                aria-expanded={isOpen}
                onMouseEnter={(e) => {
                    setIsOpen(true);
                    e.currentTarget.style.color = '#00ccff';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 204, 255, 0.8), 0 0 20px rgba(0, 150, 200, 0.6)';
                }}
                onMouseLeave={(e) => {
                    setIsOpen(false);
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.textShadow = '';
                }}
            >
                <span className={'font-jalnan'}>{item.title}</span>
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 z-50 bg-white rounded-md shadow-lg overflow-hidden"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <ul className={cn(
                        "grid gap-2 p-4",
                        item.id === 2 ? "grid-cols-2 w-[500px]" : "w-[200px]" // 사업부문 메뉴만 2열로 표시
                    )}>
                        {item.subMenus?.map((subItem) => (
                            <SubMenuListItem key={subItem.id} item={subItem} />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// components/layout/NavigationMenuItem.tsx

export function MenuItemComponent({ item }: MenuItemProps) {
    // 단일 링크 메뉴인 경우
    if (item.type === 'link') {
        return (
            <NavigationMenuItem>
                <div className="font-jalnan inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-primary/10 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-white h-10 py-2 px-4 hover:bg-primary/10 data-[active]:bg-primary/10 data-[state=open]:bg-primary/10">
                    <Link
                        href={item.link}
                        className="menu-glow"
                        style={{
                            transition: 'color 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = '#00ccff';
                            e.currentTarget.style.textShadow = '0 0 10px rgba(0, 204, 255, 0.8), 0 0 20px rgba(0, 150, 200, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = '';
                            e.currentTarget.style.textShadow = '';
                        }}
                    >
                        {item.title}
                    </Link>
                </div>
            </NavigationMenuItem>
        );
    }

    // 고객지원 메뉴는 id가 3인 경우
    if (item.id === 3) {
        return (
            <NavigationMenuItem>
                <CustomDropdownMenu item={item} />
            </NavigationMenuItem>
        );
    }

    // 나머지 드롭다운 메뉴인 경우
    return (
        <NavigationMenuItem value={`menu-${item.id}`}>
            <NavigationMenuTrigger
                className="bg-transparent text-white hover:bg-primary/10 focus:bg-primary/10 font-jalnan menu-glow"
                style={{
                    transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => {
                    const target = e.currentTarget;
                    target.style.color = '#00ccff';
                    target.style.textShadow = '0 0 10px rgba(0, 204, 255, 0.8), 0 0 20px rgba(0, 150, 200, 0.6)';
                }}
                onMouseOut={(e) => {
                    const target = e.currentTarget;
                    target.style.color = '';
                    target.style.textShadow = '';
                }}
            >
                {item.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className={cn(
                    "grid gap-2 p-4",
                    item.id === 2 ? "grid-cols-2 w-[500px]" : "w-[200px]"
                )}>
                    {item.subMenus?.map((subItem) => (
                        <SubMenuListItem key={subItem.id} item={subItem} />
                    ))}
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
}