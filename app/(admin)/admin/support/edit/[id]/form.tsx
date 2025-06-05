'use client'
import React, {useState} from 'react';
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
import {Checkbox} from "@/components/ui/checkbox";

interface EditSupportFormProps {
    posts: Posts | null;
    type: string;
}

function EditSupportForm({posts,type}:EditSupportFormProps) {

    if(!posts) return notFound();

    const router = useRouter();
    const [title, setTitle] = React.useState(posts.title);
    // 기존 게시물의 tag가 'adminNotice'인지 확인하여 초기값 설정
    const [isAdminOnly, setIsAdminOnly] = useState(posts.tag === 'adminNotice');
    const {notify} = useAlert()

    const handleResult=(formState:FormState)=>{
        if(formState.code===ERROR_CODES.SUCCESS){
            router.push(`/admin/support?type=${type}`)
            notify.success('공지글이 수정되었습니다.')
        }else{
            notify.failure(`${formState.message}`)
        }
    }

    // tag 값을 조건부로 결정
    const getTagValue = () => {
        if (type === 'notice' && isAdminOnly) {
            return 'adminNotice';
        }
        return type;
    }

    return (
        <FormContainer action={updatePost} onResult={handleResult}>
            <input type="hidden" name="id" value={posts.id} />
            <input type="hidden" name="tag" value={getTagValue()} />
            <input type="hidden" name="category" value="support" />

            <div className={'flex flex-col gap-4'}>
                <div className={'flex flex-col gap-2'}>
                    <Label>공지 제목을 입력해주세요</Label>
                    <Input
                        required
                        name={'title'}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={'제목을 입력해주세요.'}
                        className={'border border-black/30'}
                    />
                </div>

                {/* 공지사항일 때만 관리자 전용 옵션 표시 */}
                {type === 'notice' && (
                    <div>
                        <Label className={'mb-2'}>공지글 권한 설정</Label>
                        <div className={'flex items-center py-3 border border-black rounded-lg'}>
                            <Label
                                htmlFor="adminOnly"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 px-2"
                            >
                                관리자만 보기 설정
                            </Label>
                            <Checkbox
                                id="adminOnly"
                                checked={isAdminOnly}
                                className={'h-7 w-7 border border-green-300'}
                                onCheckedChange={(checked) => setIsAdminOnly(checked === true)}
                            />
                        </div>
                    </div>
                )}

                <div className={'flex flex-col gap-2'}>
                    <Label>내용</Label>
                    <Editor name={"contents"} defaultValue={posts.contents || ''} />
                </div>
            </div>

            <div className={'flex justify-end items-center mt-2'}>
                <Button className={'flex justify-end items-center border border-black'} type="submit">
                    수정하기
                </Button>
            </div>
        </FormContainer>
    );
}

export default EditSupportForm;
