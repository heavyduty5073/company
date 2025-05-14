// utils/supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // 클라이언트 측에서 환경 변수 확인 (개발 모드에서만)
    if (process.env.NODE_ENV === 'development') {
        console.log('Client Environment:', process.env.NODE_ENV);
        console.log('Site URL (client):', process.env.NEXT_PUBLIC_SITE_URL);
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}