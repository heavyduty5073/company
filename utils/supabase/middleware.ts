// utils/supabase/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function updateSession(request: NextRequest) {
    try {
        const url = request.nextUrl.pathname;

        // auth/callback 경로는 건너뛰기
        if (url === '/auth/callback') {
            console.log('미들웨어: auth/callback 경로 감지, 처리 건너뜀');
            return NextResponse.next();
        }

        // 기본 응답 생성
        let response = NextResponse.next();

        try {

            // createClient 함수 사용
            const supabase = await createClient();
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            // 세션 확인
            // 실제 사용자 정보 검증
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                await supabase.auth.signOut();
                return NextResponse.redirect(new URL('/login', request.url));
            }

            if (url.startsWith("/admin")) {
                const isAdmin = user.user_metadata?.role === 'admin';
                if (!isAdmin) {
                    return NextResponse.redirect(new URL("/unauthorized", request.url));
                }
            }

            // 로그인된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리디렉트
            if ((url === "/login" || url === "/register") && session) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (authError) {
            console.error('미들웨어 인증 처리 오류:', authError);
        }

        return response;
    } catch (e) {
        console.error("미들웨어 오류:", e);
        return NextResponse.next();
    }
}