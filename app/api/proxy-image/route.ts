import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return new NextResponse('URL parameter is required', { status: 400 });
        }

        // 네이버 이미지 URL 검증
        const allowedDomains = [
            'pstatic.net',
            'naver.com',
            'band.us'
        ];

        const url = new URL(imageUrl);
        const isAllowed = allowedDomains.some(domain => url.hostname.includes(domain));

        if (!isAllowed) {
            return new NextResponse('Domain not allowed', { status: 403 });
        }

        // 모바일 User-Agent와 적절한 헤더로 이미지 요청
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
                'Referer': 'https://band.us/',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site',
            },
        });

        if (!response.ok) {
            console.error(`Image fetch failed: ${response.status} ${response.statusText}`);
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('Content-Type') || 'image/jpeg';

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable', // 1년 캐시
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
