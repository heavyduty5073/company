'use client'
import React from 'react';
import {User} from "@supabase/auth-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaUserCircle } from "react-icons/fa";
import {signOut} from "@/app/(main)/login/actions";
function Profile({user}:{user:User}) {
    return (
        <div>
            <Avatar onClick={signOut}>
                <AvatarImage src={user.user_metadata.avatar_url ||''} />
                <AvatarFallback><FaUserCircle className={'w-7 h-7'}/></AvatarFallback>
            </Avatar>
        </div>
    );
}

export default Profile;