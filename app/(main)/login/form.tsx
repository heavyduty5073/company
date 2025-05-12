'use client'
import React from 'react';
import FormContainer from "@/components/ui/form";
import { signIn } from "@/app/(main)/login/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import SocialLogin from "@/components/auth/SocialLogin";
function LoginForm() {
    return (
        <Card className="w-full max-w-md mx-auto border border-white backdrop-blur-lg text-white">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
                <CardDescription className="text-center">
                    계정에 로그인하여 서비스를 이용하세요
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormContainer action={signIn}>

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
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">비밀번호</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    비밀번호 찾기
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full border border-white">
                            로그인
                        </Button>
                    </div>

                        <div className="mt-4 text-center text-sm">
                            아직 계정이 없으신가요?{' '}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                회원가입
                            </Link>
                        </div>

                </FormContainer>
                <SocialLogin/>
            </CardContent>
        </Card>
    );
}

export default LoginForm;