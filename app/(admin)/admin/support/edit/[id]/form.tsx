'use client'
import React from 'react';
import {notFound,useRouter} from "next/navigation";
import {Posts} from "@/utils/supabase/types";
import {updatePost} from "@/app/(admin)/admin/support/actions";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Editor from "@/lib/editor/Editor";
import {Button} from "@/components/ui/button";
import FormContainer, {FormState} from "@/components/ui/form";
import {ERROR_CODES} from "@/utils/ErrorMessage";
import useAlert from "@/lib/notiflix/useAlert";

interface EditSupportFormProps {
    posts: Posts | null;
    type: string;
}
function EditSupportForm({posts,type}:EditSupportFormProps) {

    if(!posts) return notFound();

    const router = useRouter();
    const [title,setTitle] = React.useState(posts.title);
    const {notify} = useAlert()
    const handleResult=(formState:FormState)=>{

        if(formState.code===ERROR_CODES.SUCCESS){
            router.push(`/admin/support?type=${type}`)
            notify.success('공지글이 등록되었습니다.')
        }else{
            notify.failure(`${formState.message}`)
        }

    }
    return (
        <FormContainer action={updatePost} onResult={handleResult}>
            <input type="hidden" name="id" value={posts.id} />
            <input type="hidden" name="tag" value={type} />
            <input type="hidden" name="category" value="support" />
            <div className={'flex flex-col gap-2'}>
                <Label>공지 제목을 입력해주세요</Label>
                <Input required name={'title'} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder={'제목을 입력해주세요.'} className={'border border-black/30'}/>
                <Editor name={"contents"} defaultValue={posts.contents ||''}/>
            </div>
            <div className={'flex justify-end items-center mt-2'}>
                <Button className={'flex justify-end items-center border border-black'} type="submit">등록하기</Button>
            </div>
        </FormContainer>
    );
}

export default EditSupportForm;