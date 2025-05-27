import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'DS 건설기계 - 전북 군산 건설장비 수리 전문',
        short_name: 'DS 건설기계',
        description: '전북 군산 지역 건설장비 출장수리 및 부품 전문업체',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1e40af',
        orientation: 'portrait',
        scope: '/',
        lang: 'ko',
        categories: ['business', 'utilities'],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/logo/mainLogo.png',
                sizes: '400x400',
                type: 'image/png'
            }
        ],
        screenshots: [
            {
                src: '/introduce/introImage_3.jpg',
                sizes: '1200x630',
                type: 'image/png'
            }
        ]
    }
}