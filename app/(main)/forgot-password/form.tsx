import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import FormContainer from "@/components/ui/form";
import {sendPasswordResetEmail} from "@/app/(main)/forgot-password/actions";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";

function ForgotPasswordForm() {
    return (
        <Card className="w-full max-w-md mx-auto border border-white backdrop-blur-lg text-white">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">비밀번호 찾기</CardTitle>
                <CardDescription className="text-center text-gray-200">
                    가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormContainer action={sendPasswordResetEmail}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                required
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                            />
                        </div>

                        <Button type="submit" className="w-full border border-white bg-white/10 hover:bg-white/20 text-white">
                            재설정 이메일 보내기
                        </Button>
                    </div>

                    <div className="mt-4 text-center text-sm space-y-2">
                        <div>
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                로그인으로 돌아가기
                            </Link>
                        </div>
                        <div>
                            아직 계정이 없으신가요?{' '}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                회원가입
                            </Link>
                        </div>
                    </div>
                </FormContainer>
            </CardContent>
        </Card>
    );
}

export default ForgotPasswordForm;
