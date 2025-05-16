'use client'
import React from 'react';
import {User} from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaUserCircle } from "react-icons/fa";
import {signOut} from "@/app/(main)/login/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useRouter} from "next/navigation";

function Profile({user}:{user:User}) {
    const router = useRouter();

    const handleMove=(link:string)=>{
        return router.push(link);
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={user.user_metadata.avatar_url ||'/user/user.jpg'} className={'w-10 h-10'}/>
                        <AvatarFallback><FaUserCircle className={'w-7 h-7'}/></AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'flex flex-col justify-end items-center bg-white'}>
                    <DropdownMenuLabel>{`${user.user_metadata.email.slice(0,5)}님 환영합니다`}</DropdownMenuLabel>
                    <DropdownMenuItem><button>프로필</button></DropdownMenuItem>
                    <DropdownMenuItem className={'hover:pointer-cursor'} onClick={signOut}>로그아웃</DropdownMenuItem>
                    {user.user_metadata.role === 'admin' && <DropdownMenuItem className={''} onClick={()=>handleMove('/admin/dashboard')}>관리자</DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>


        </div>
    );
}

export default Profile;