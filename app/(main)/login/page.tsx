import React from 'react';
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import LoginForm from "@/app/(main)/login/form";
import Image from "next/image";

async function Page() {
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if(user) redirect('/home')
    return (
        <div className="relative min-h-screen flex items-center justify-center py-20">
            {/* 배경 이미지 */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/login/loginBanner3.jpg" // 이미지 경로를 실제 이미지 경로로 변경하세요
                    alt="Login Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* 오버레이 (배경 이미지 위에 약간의 어두운 필터) */}
            <div className="absolute inset-0 z-10"></div>

            {/* 로그인 폼 */}
            <div className="relative z-20 w-full max-w-md px-4">
                <LoginForm />
            </div>
        </div>
    );
}

export default Page;