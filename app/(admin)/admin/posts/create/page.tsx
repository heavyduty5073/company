import React from 'react';
import CreatePost from "@/app/(admin)/admin/posts/create/form";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
function Page() {
    return (
        <div className="container mx-auto py-8 px-4">
            <Link href="/admin/posts" className={'flex flex-row items-center gap-2 mb-4 font-jalnan'}><IoIosArrowBack className={'relative w-5 h-5'}/>뒤로가기</Link>
            <CreatePost/>
        </div>
    );
}

export default Page;