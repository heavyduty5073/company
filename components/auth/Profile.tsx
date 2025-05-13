'use client'
import React from 'react';
import {User} from "@supabase/auth-js";
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
                        <AvatarImage src={user.user_metadata.avatar_url ||''} className={'w-7 h-7'}/>
                        <AvatarFallback><FaUserCircle className={'w-7 h-7'}/></AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'bg-white'}>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>로그아웃</DropdownMenuItem>
                    {user.user_metadata.role === 'admin' && <DropdownMenuItem onClick={()=>handleMove('/dashboard')}>관리자</DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>


        </div>
    );
}

export default Profile;