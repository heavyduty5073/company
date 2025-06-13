'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import NaverBandSkeleton from './NaverBandSkeleton';

// 동적으로 NaverBandFeed 컴포넌트 임포트
const NaverBandFeed = dynamic(() => import('./NaverBandFeed'), {
    loading: () => <NaverBandSkeleton />,
    ssr: false
});

// 밴드 포스트 인터페이스 정의
interface Author {
    name: string;
    profileImage: string;
}

interface BandPost {
    id: string;
    author: Author;
    content: string;
    date: string;
    imageUrl: string | null;
    commentCount: number;
    emotionCount: number;
    postUrl: string;
}

interface NaverBandSectionProps {
    bandUrl: string;
}

const NaverBandSection: React.FC<NaverBandSectionProps> = ({ bandUrl }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<BandPost[]>([]);
    const [isDataReady, setIsDataReady] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const hasStartedLoading = useRef(false);

    // 중복 제거 함수
    const removeDuplicatePosts = (postArray: BandPost[]): BandPost[] => {
        const seen = new Set<string>();
        return postArray.filter(post => {
            if (seen.has(post.id)) {
                return false;
            }
            seen.add(post.id);
            return true;
        });
    };

    // 초기 5개 데이터만 가져오는 함수
    const fetchBandPosts = async () => {
        // 이미 로딩이 시작되었다면 중복 호출 방지
        if (hasStartedLoading.current) return;

        hasStartedLoading.current = true;

        try {
            // 초기 로딩은 5개만 (page=1, limit=5)
            const response = await axios.get('/api/band-posts', {
                params: {
                    page: 1,
                    limit: 5
                }
            });



            if (response.data.error) {
                throw new Error(response.data.error);
            }

            if (response.data.posts) {
                // 중복 제거
                const uniquePosts = removeDuplicatePosts(response.data.posts);
                setPosts(uniquePosts);
                setIsDataReady(true);
            } else {
                setPosts([]);
                setIsDataReady(true);
            }
        } catch (err: any) {
            console.error('밴드 게시글 로딩 중 오류 (NaverBandSection):', err);
            setError(err.message || '게시글을 불러올 수 없습니다.');
            setIsDataReady(true);
        }
    };


    // 컴포넌트가 뷰포트에 들어왔는지 감지
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // 데이터 로딩 시작
                    if (!hasStartedLoading.current) {
                        fetchBandPosts();
                    }

                    // 컴포넌트 가시성 설정
                    setIsVisible(true);

                    // Observer 해제
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px',
                threshold: 0.01
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={sectionRef} className="band-section-container">
            {isVisible ? (
                isDataReady ? (
                    // 데이터가 준비되면 NaverBandFeed에 데이터를 직접 전달
                    <NaverBandFeed
                        key="naver-band-feed" // 고유 키 추가
                        bandUrl={bandUrl}
                        prefetchedPosts={posts}
                        prefetchedError={error}
                        skipFetching={true} // 데이터를 이미 가져왔으므로 추가 API 호출 건너뛰기
                    />
                ) : (
                    // 데이터는 로딩 중이지만 컴포넌트는 표시
                    <NaverBandSkeleton />
                )
            ) : (
                // 컴포넌트가 아직 보이지 않음
                <NaverBandSkeleton />
            )}
        </div>
    );
};

export default NaverBandSection;
