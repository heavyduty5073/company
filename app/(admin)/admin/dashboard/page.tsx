import React from 'react';
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

async function Page() {
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()

    return (
        <div>관리자 페이지에 오신것을 환영합니다.</div>
    );
}

export default Page;