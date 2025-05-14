// utils/supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // 클라이언트 측에서 환경 변수 확인 (개발 모드에서만)

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}