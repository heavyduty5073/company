import React from 'react';
import Link from "next/link";
import SideMenuMobile from "@/components/layout/SideMenuMobile";
import Image from "next/image";
import HeaderNavigation from "@/components/layout/HeaderNavigation";
import {createClient} from "@/utils/supabase/server";
import Profile from "@/components/auth/Profile";
async function Header() {
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    return (
        <>
        <div className={'flex justify-between items-center py-2 lg:py-4 bg-gradient-to-r from-[#003247] to-black px-2 lg:px-20'}>
            <Link href={'/home'}>
                <div className={'flex flex-row items-center justify-center text-center text-white gap-1 lg:gap-2'}>
                <Image src={'/logo/mainLogo.png'} alt={'/logo'} width={180} height={180} className={'w-12 h-12'}/>
                <h1 className={'text-lg lg:text-xl text-center font-Gangwon'}>DS 건설기계</h1>
                </div>
            </Link>
            <div className={'hidden lg:flex flex-row items-center gap-2 text-white'}>
                {user ? <Profile user={user}/>: <Link className={'text-xs lg:text-sm'} href={'/login'}>로그인/회원가입</Link>}

            </div>
            <div className={'block lg:hidden text-white'}>
                <SideMenuMobile/>
            </div>
        </div>
            <div className={'hidden lg:block w-full bg-main'}>
            <HeaderNavigation/>
            </div>
            </>
    );
}

export default Header;