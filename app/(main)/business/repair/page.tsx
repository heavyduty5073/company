import React from 'react';
import {getRepairCases} from "@/app/(admin)/admin/posts/actions";
import Link from "next/link";

async function Page() {
    const data = await getRepairCases()


    return (
        <div>

        </div>

    );
}

export default Page;