'use client'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { RiMenu3Line } from "react-icons/ri";
import React, {useCallback, useEffect, useRef, useState} from "react";
import { menus } from "@/lib/menus";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {usePathname, useSearchParams} from "next/navigation";

function SideMenuMobile() {
    // 각 메뉴의 확장 상태를 관리하는 상태
    const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

// 이전 경로와 검색 파라미터를 저장하기 위한 ref
    const prevPathRef = useRef(pathname);
    const prevSearchParamsRef = useRef(searchParams.toString());

// 경로 변경을 감지하여 메뉴를 닫는 함수
        const closeMenuOnRouteChange = useCallback(() => {
        const currentPath = pathname;
        const currentSearchParams = searchParams.toString();

        // 경로나 검색 파라미터가 변경되었으면 메뉴 닫기
        if (
            prevPathRef.current !== currentPath ||
            prevSearchParamsRef.current !== currentSearchParams
        ) {
            setIsOpen(false);

            // 현재 값을 저장
            prevPathRef.current = currentPath;
            prevSearchParamsRef.current = currentSearchParams;
        }
    }, [pathname, searchParams]);

    // 경로 변경 감지
        useEffect(() => {
            closeMenuOnRouteChange();
        }, [pathname, searchParams, closeMenuOnRouteChange]);
        // 메뉴 확장/축소 토글 함수
        const toggleMenu = (menuId: number) => {
            setOpenMenus(prev => ({
                ...prev,
                [menuId]: !prev[menuId]
            }));
        };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
                <RiMenu3Line className="w-7 h-7" />
            </SheetTrigger>
            <SheetContent className="bg-white overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold mb-4">메뉴</SheetTitle>
                    <div className="mt-4 space-y-1">
                        {menus.map((menu) => (
                            <div key={menu.id} className="border-b border-gray-100 pb-2">
                                {menu.type === 'link' ? (
                                    // 단일 링크 메뉴
                                    <Link
                                        href={menu.link}
                                        className="block py-3 text-lg font-medium hover:text-blue-500 transition-colors"
                                    >
                                        {menu.title}
                                    </Link>
                                ) : (
                                    // 드롭다운 메뉴
                                    <div>
                                        <div
                                            onClick={() => toggleMenu(menu.id)}
                                            className="flex items-center justify-between py-3 cursor-pointer"
                                        >
                                            <span className="text-lg font-medium">{menu.title}</span>
                                            <motion.div
                                                initial={false}
                                                animate={{ rotate: openMenus[menu.id] ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ChevronDown className="h-5 w-5" />
                                            </motion.div>
                                        </div>
                                        <AnimatePresence>
                                            {openMenus[menu.id] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 space-y-2 my-2">
                                                        {menu.subMenus?.map((subMenu) => (
                                                            <Link
                                                                key={subMenu.id}
                                                                href={subMenu.link}
                                                                className="block py-2 text-base text-gray-700 hover:text-blue-500 transition-colors"
                                                            >
                                                                {subMenu.title}
                                                                {subMenu.description && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {subMenu.description}
                                                                    </p>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}

export default SideMenuMobile;