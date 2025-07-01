'use server';

import {createClient} from "@/utils/supabase/server";
import {Posts} from "@/utils/supabase/types";

export async function getRepairCases() {
    const supabase =await createClient()
    try{
        const {data}= await supabase.from('posts').select('*').eq("tag","repaircase").order('created_at',{ascending:false})

        if(!data || data.length===0) return []

        return data as Posts[]
    }catch(error){
        return []
    }
}
