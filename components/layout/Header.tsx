import React from 'react';
import Link from "next/link";
import SideMenuMobile from "@/components/layout/SideMenuMobile";
import Image from "next/image";
import HeaderNavigation from "@/components/layout/HeaderNavigation";
import { createClient } from "@/utils/supabase/server";
import Profile from "@/components/auth/Profile";
import HeaderScroll from "./HeaderScroll";

async function Header() {
    // Create a modified version of createClient that won't throw errors
    const supabase = await createClient()

    // Only try to get user if we have a client
    let user = null;
    if (supabase) {
        try {
            const { data } = await supabase.auth.getUser();
            user = data.user;
        } catch (error) {
            console.error("Auth error:", error);
        }
    }

    return (
        <HeaderScroll>
            <div className="mx-auto px-2 lg:px-20">
                <div className="flex justify-between items-center h-full">
                    <Link href={'/home'} className={'w-[180px] lg:w-[300px]'}>
                        <div className="flex flex-row items-center justify-center text-center text-white gap-1 lg:gap-2">
                            <div id="header-logo" className="transition-all duration-300">
                                <Image
                                    src={'/logo/mainLogo.png'}
                                    alt={'/logo'}
                                    width={250}
                                    height={250}
                                    className="w-[100px] h-[100px] transition-all duration-300 lg:w-[100px] lg:h-[100px]"
                                />
                            </div>
                            <h1 id="header-title" className="text-lg lg:text-3xl text-center font-Paperlogy transition-all duration-300">
                                DS 건설기계
                            </h1>
                        </div>
                    </Link>
                    <div className="mx-auto justify-center items-center hidden lg:block">
                        <HeaderNavigation />
                    </div>
                    <div className="hidden lg:flex flex-row items-center gap-2 text-white">
                        {user ? <Profile user={user} /> : <Link className="text-xs lg:text-sm" href={'/login'}>로그인/회원가입</Link>}
                    </div>
                    <div className="block lg:hidden text-white">
                        <SideMenuMobile />
                    </div>
                </div>
            </div>
        </HeaderScroll>
    );
}

export default Header;