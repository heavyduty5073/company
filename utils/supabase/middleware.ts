// utils/supabase/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function updateSession(request: NextRequest) {
    try {
        const url = request.nextUrl.pathname;

        // 특정 경로는 인증 체크 제외
        const publicPaths = [
            '/auth/callback',
            '/login',
            '/',
            '/home',
            '/repair',
            '/about',
            '/unautorized',
            '/support',
            '/support/faq',
            '/support/inquiry',
            '/support/notice',
            '/signup',
            '/parts',
            '/introduce/about',
            '/introduce/ceo',
            '/business/parts',
            '/business/construction',
            '/business/industrial',
            '/business/repair'
            // 추가 공개 경로들...
        ];

        // 정적 파일 경로도 제외
        if (
            url.includes('/_next') ||
            url.includes('/api/') ||
            url.includes('/favicon.ico') ||
            url.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/) ||
            publicPaths.some(path => url === path || url.startsWith(`${path}/`))
        ) {
            return NextResponse.next();
        }

        // 기본 응답 생성
        const response = NextResponse.next();

        try {
            // Supabase 클라이언트 생성
            const supabase = await createClient();

            // 세션 확인
            const { data: { session } } = await supabase.auth.getSession();

            // 인증이 필요한 경로이지만 세션이 없는 경우
            if (!session && url.startsWith("/admin")) {
                const redirectUrl = new URL('/login', request.url);
                redirectUrl.searchParams.set('redirectTo', url);
                return NextResponse.redirect(redirectUrl);
            }

            // 세션이 있는 경우만 추가 검증 수행
            if (session) {
                // 관리자 권한 체크 - /admin 경로의 경우
                if (url.startsWith("/admin")) {
                    const isAdmin = session.user.user_metadata?.role === 'admin';
                    if (!isAdmin) {
                        return NextResponse.redirect(new URL("/unauthorized", request.url));
                    }
                }

                // 이미 로그인된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리디렉트
                if (url === "/login" || url === "/register") {
                    return NextResponse.redirect(new URL("/", request.url));
                }
            }

            return response;

        } catch (authError) {
            return response;
        }
    } catch (e) {
        console.error("미들웨어 오류:", e);
        return NextResponse.next();
    }
}