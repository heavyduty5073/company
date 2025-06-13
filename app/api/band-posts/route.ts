// app/api/band-posts/route.ts
import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
    try {
        // URL에서 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');

        // 파라미터 유효성 검사
        if (page < 1 || limit < 1 || limit > 50) {
            return NextResponse.json({
                error: '잘못된 페이지네이션 파라미터입니다. (page >= 1, 1 <= limit <= 50)'
            }, { status: 400 });
        }

        // 액세스 토큰 사용
        const accessToken = process.env.BAND_ACCESS_TOKEN!

        // 1. 사용자 정보 확인
        const userResponse = await axios.get('https://openapi.band.us/v2/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (userResponse.data.result_code !== 1) {
            return NextResponse.json({
                error: '사용자 정보를 가져오는데 실패했습니다.',
                details: userResponse.data
            }, { status: 500 });
        }

        // 2. 사용자의 밴드 목록 가져오기
        const bandsResponse = await axios.get('https://openapi.band.us/v2/bands', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (bandsResponse.data.result_code !== 1) {
            return NextResponse.json({
                error: '밴드 목록을 가져오는데 실패했습니다.',
                details: bandsResponse.data
            }, { status: 500 });
        }

        // 사용자에게 접근 가능한 모든 밴드 목록 출력
        const bands = bandsResponse.data.result_data.bands;

        // 3. 밴드 찾기 - 여러 방법으로 시도
        let dsBand = null;

        // 방법 1: 정확한 이름으로 찾기
        dsBand = bands.find((band: any) => band.name === 'DS 건설기계');

        // 방법 2: 부분 이름으로 찾기
        if (!dsBand) {
            dsBand = bands.find((band: any) => band.name.includes('DS') || band.name.includes('건설기계'));
        }

        // 방법 3: 첫 번째 밴드 사용 (테스트용)
        if (!dsBand && bands.length > 0) {
            dsBand = bands[0];
        }

        if (!dsBand) {
            return NextResponse.json({
                error: 'DS 건설기계 밴드를 찾을 수 없습니다. 밴드에 접근 권한이 있는지 확인하세요.',
                availableBands: bands.map((b: any) => b.name)
            }, { status: 404 });
        }

        // 4. 밴드 게시글 가져오기 (더 많은 데이터 요청)
        // 네이버 밴드 API에서 최대 100개까지 가져올 수 있음
        const maxApiLimit = 100;
        const requestLimit = Math.min(maxApiLimit, page * limit + 20); // 여유분 포함

        const postsResponse = await axios.get('https://openapi.band.us/v2/band/posts', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                band_key: dsBand.band_key,
                locale: 'ko_KR',
                limit: requestLimit
            },
        });

        if (postsResponse.data.result_code !== 1) {
            return NextResponse.json({
                error: '게시글을 가져오는데 실패했습니다.',
                details: postsResponse.data
            }, { status: 500 });
        }

        // 5. 게시글 데이터 가공
        const postsData = postsResponse.data.result_data.items || [];

        const allPosts = postsData.map((post: any) => {
            // 첫 번째 이미지 URL 추출
            let imageUrl = null;
            if (post.photos && post.photos.length > 0) {
                imageUrl = post.photos[0].url;
            }

            return {
                id: post.post_key,
                author: {
                    name: post.author.name,
                    profileImage: post.author.profile_image_url,
                },
                content: post.content,
                date: post.created_at,
                imageUrl,
                commentCount: post.comment_count || 0,
                emotionCount: post.emotion_count || 0,
                postUrl: post.url,
            };
        });

        // 6. 페이지네이션 처리
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = allPosts.slice(startIndex, endIndex);

        // 7. 응답 데이터 구성
        const totalPosts = allPosts.length;
        const hasMore = endIndex < totalPosts;

        return NextResponse.json({
            success: true,
            bandName: dsBand.name,
            bandKey: dsBand.band_key,
            posts: paginatedPosts,
            pagination: {
                page,
                limit,
                total: totalPosts,
                hasMore,
                totalPages: Math.ceil(totalPosts / limit)
            }
        });

    } catch (error: any) {
        console.error('밴드 API 호출 중 오류:', error);

        // API 호출 오류 세부 정보 반환
        return NextResponse.json({
            error: '밴드 게시글을 가져오는데 실패했습니다.',
            message: error.message,
            response: error.response?.data || null
        }, { status: 500 });
    }
}
