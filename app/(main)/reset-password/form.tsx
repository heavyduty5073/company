import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import FormContainer from "@/components/ui/form";
import {updatePassword} from "@/app/(main)/reset-password/actions";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

function ResetPasswordForm() {
    return (
        <Card className="w-full max-w-md mx-auto border border-white backdrop-blur-lg text-white">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">새 비밀번호 설정</CardTitle>
                <CardDescription className="text-center text-gray-200">
                    새로운 비밀번호를 입력해주세요.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormContainer action={updatePassword}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">새 비밀번호</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                            />
                        </div>

                        <Button type="submit" className="w-full border border-white bg-white/10 hover:bg-white/20 text-white">
                            비밀번호 변경
                        </Button>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        <p className="text-gray-300 mb-2">
                            비밀번호는 최소 8자 이상이어야 합니다.
                        </p>
                    </div>
                </FormContainer>
            </CardContent>
        </Card>
    );
}

export default ResetPasswordForm;
