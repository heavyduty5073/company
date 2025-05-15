'use client'
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import FormContainer, {FormState} from "@/components/ui/form";
import {createPost} from "@/app/(admin)/admin/support/actions";
import Editor from "@/lib/editor/Editor";
import {Button} from "@/components/ui/button";
import {ERROR_CODES} from "@/utils/ErrorMessage";
import {useRouter} from "next/navigation";
import useAlert from "@/lib/notiflix/useAlert";


function CreateSupportForm({type}:{type:string}) {
    const [title,setTitle] = useState('');
    const router = useRouter()
    const {notify} = useAlert();
    const handleResult=(formState:FormState)=>{
        if(formState.code===ERROR_CODES.SUCCESS){
            router.push(`/admin/support?type=${type}`)
            notify.success('공지글이 등록되었습니다.')
        }else{
            notify.failure(`${formState.message}`)
        }
    }
    return (
        <FormContainer action={createPost} onResult={handleResult}>
            <input type="hidden" name="tag" value={type} />
            <input type="hidden" name="category" value="support" />
                <div className={'flex flex-col gap-2'}>
                <Label>공지 제목을 입력해주세요</Label>
                <Input required name={'title'} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder={'제목을 입력해주세요.'} className={'border border-black/30'}/>
                    <Editor name={"contents"} />
                </div>
            <div className={'flex justify-end items-center mt-2'}>
            <Button className={'flex justify-end items-center border border-black'} type="submit">등록하기</Button>
            </div>
        </FormContainer>
    );
}

export default CreateSupportForm;