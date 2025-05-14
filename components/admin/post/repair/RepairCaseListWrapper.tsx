'use client'

import dynamic from 'next/dynamic'
import { Posts } from '@/utils/supabase/types'
import GlobalLoader from "@/lib/Loading/Loading";

const RepairCaseList = dynamic(() => import('./RepairList'), {
    ssr: false,
    loading: () => <GlobalLoader/>,
})

export default function RepairCaseListWrapper({ repairList }: { repairList: Posts[] }) {
    return <RepairCaseList repairList={repairList} />
    
}