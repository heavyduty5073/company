'use client'
import React, { useState } from 'react';
import FormContainer, { FormState } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp } from "@/app/(main)/signup/actions";
import { Checkbox } from "@/components/ui/checkbox";
import SocialLogin from "@/components/auth/SocialLogin";
import { ERROR_CODES } from '@/utils/ErrorMessage';
import useAlert from '@/lib/notiflix/useAlert';
import { useRouter } from "next/navigation";

function SignupForm() {
    const { notify } = useAlert();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (confirmPassword && e.target.value !== confirmPassword) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (e.target.value && e.target.value !== password) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    };

    const handleResult = (formState: FormState) => {
        if (formState.code === ERROR_CODES.SUCCESS) {
            notify.success('회원가입이 완료되었습니다!');
            router.push('/login');
        } else if (formState.code === ERROR_CODES.EMAIL_EXISTS) {
            notify.failure('이미 등록된 이메일 주소입니다.');
        } else {
            notify.failure(formState.message || '회원가입 중 오류가 발생했습니다.');
        }
    };

    const validateForm = (e: React.FormEvent) => {
        if (password !== confirmPassword) {
            e.preventDefault();
            setPasswordsMatch(false);
            notify.failure('비밀번호가 일치하지 않습니다.');
            return false;
        }
        return true;
    };

    return (
        <Card className="w-full max-w-md mx-auto border border-white backdrop-blur-lg text-white">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
                <CardDescription className="text-center text-white/70">
                    회원가입 후 서비스를 이용해주세요
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormContainer action={signUp} onResult={handleResult} onSubmit={validateForm}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-white">이메일</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                required
                                className="bg-white/10 text-white border-white/30 placeholder:text-white/50"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-white">비밀번호</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={handlePasswordChange}
                                className="bg-white/10 text-white border-white/30 placeholder:text-white/50"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password" className="text-white">비밀번호 확인</Label>
                            <Input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={`bg-white/10 text-white border-white/30 placeholder:text-white/50 ${
                                    !passwordsMatch ? 'border-red-500' : ''
                                }`}
                                placeholder="비밀번호 확인"
                            />
                            {!passwordsMatch && (
                                <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>
                            )}
                        </div>

                        <div className="flex items-center mt-4">
                            <Checkbox
                                id="terms"
                                name="terms"
                                required
                                className="bg-white/10 border-white/30 text-primary"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-white">
                                <span>이용약관 및 개인정보 처리방침에 동의합니다</span>
                            </label>
                        </div>

                        <Button type="submit" className="w-full border border-white hover:bg-white hover:text-black">
                            회원가입
                        </Button>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        계정이 있으신가요?{' '}
                        <Link href="/login" className="text-white hover:underline font-medium">
                            로그인
                        </Link>
                    </div>
                </FormContainer>

                <SocialLogin />
            </CardContent>
        </Card>
    );
}

export default SignupForm;