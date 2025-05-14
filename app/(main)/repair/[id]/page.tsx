import React from 'react';
import {notFound} from "next/navigation";
import {getOneRepairCase} from "@/app/(admin)/admin/posts/edit/[id]/actions";

async function Page({params}:{params:Promise<{id:string}>}) {
    const {id} = await params;
    if(!id) return notFound();

    const data = getOneRepairCase(id)

    if(!data) return notFound()
    return (
        <div>
            목록1
        </div>
    );
}

export default Page;