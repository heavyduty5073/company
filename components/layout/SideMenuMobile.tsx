'use client'
import {
    Sheet,
    SheetContent,

    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {RiMenu3Line} from "react-icons/ri";
import React from "react";
import {menus} from "@/lib/menus";
import Link from "next/link";

function SideMenuMobile() {
    return (
        <Sheet>
            <SheetTrigger><RiMenu3Line className={'w-7 h-7'}/></SheetTrigger>
            <SheetContent className={'bg-white'}>
                <SheetHeader>
                    <SheetTitle aria-readonly></SheetTitle>
                    <div>
                        {menus.map((menu,index)=>(
                            <div className={'flex flex-col justify-center items-center'} key={index}>
                                <Link href={menu.link} className={'py-3 text-lg'}>{menu.title}</Link>
                            </div>
                        ))}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    );
}

export default SideMenuMobile;