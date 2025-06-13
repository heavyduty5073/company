'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaComments, FaThumbsUp, FaExternalLinkAlt, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import useLoading from "@/app/hooks/useLoading";
import { formatRelativeDate } from "@/utils/utils";

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

interface NaverBandFeedProps {
    bandUrl: string;
    prefetchedPosts?: BandPost[]; // 선택적 프리로드된 포스트 데이터
    prefetchedError?: string | null; // 선택적 프리로드된 에러
    skipFetching?: boolean; // API 호출 건너뛰기 옵션
}

const NaverBandFeed: React.FC<NaverBandFeedProps> = ({
                                                         bandUrl,
                                                         prefetchedPosts = [],
                                                         prefetchedError = null,
                                                         skipFetching = false
                                                     }) => {
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState<string | null>(prefetchedError);
    const [posts, setPosts] = useState<BandPost[]>(prefetchedPosts);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const pageSize = 5; // 한 번에 5개씩 로드

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

    // 이미지 URL을 프록시를 통해 처리하는 함수
    const getImageSrc = (imageUrl: string): string => {
        // 네이버 관련 도메인 이미지는 프록시를 통해 로드
        if (imageUrl.includes('pstatic.net') || imageUrl.includes('naver.com') || imageUrl.includes('band.us')) {
            return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        }
        return imageUrl;
    };

    // 데이터 가져오기 함수
    const fetchBandPosts = async (page: number = 1, isLoadMore: boolean = false) => {
        try {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setLoading(true);
            }

            const response = await axios.get('/api/band-posts', {
                params: {
                    page,
                    limit: pageSize
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            if (response.data.posts) {
                const newPosts = response.data.posts;

                if (isLoadMore) {
                    // 더보기인 경우 기존 게시글에 추가 후 중복 제거
                    setPosts(prev => removeDuplicatePosts([...prev, ...newPosts]));
                } else {
                    // 초기 로딩인 경우 새로 설정 후 중복 제거
                    setPosts(removeDuplicatePosts(newPosts));
                }

                // API 응답에서 hasMore 값 사용
                if (response.data.pagination) {
                    setHasMorePosts(response.data.pagination.hasMore);
                } else {
                    // 백업: 게시글 개수로 판단
                    setHasMorePosts(newPosts.length === pageSize);
                }
            } else {
                setPosts([]);
                setHasMorePosts(false);
            }
        } catch (err: any) {
            console.error('밴드 게시글 로딩 중 오류 (NaverBandFeed):', err);
            setError(err.message || '게시글을 불러올 수 없습니다.');
        } finally {
            if (isLoadMore) {
                setIsLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    // 초기 로딩
    useEffect(() => {
        // 프리로드된 데이터가 있고 API 호출을 건너뛰는 옵션이 활성화되어 있으면
        // API 호출을 수행하지 않음
        if (skipFetching) {
            // 프리로드된 데이터도 중복 제거
            const uniquePrefetchedPosts = removeDuplicatePosts(prefetchedPosts);
            setPosts(uniquePrefetchedPosts);
            // 프리로드된 데이터가 pageSize와 같으면 더 많은 데이터가 있을 수 있음
            setHasMorePosts(uniquePrefetchedPosts.length === pageSize);
            return;
        }

        // 프리로드된 데이터가 없으면 API 호출
        if (prefetchedPosts.length === 0) {
            fetchBandPosts(1, false);
        } else {
            // 프리로드된 데이터가 있으면 중복 제거 후 설정
            const uniquePrefetchedPosts = removeDuplicatePosts(prefetchedPosts);
            setPosts(uniquePrefetchedPosts);
            setHasMorePosts(uniquePrefetchedPosts.length === pageSize);
        }

        // 클린업 함수
        return () => {
            // 필요한 경우 API 요청 취소 로직 추가
        };
    }, [skipFetching, prefetchedPosts.length]);

    // 더보기 버튼 클릭 처리
    const handleShowMorePosts = async () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        await fetchBandPosts(nextPage, true);
    };

    // 콘텐츠에서 HTML 태그 제거 (클라이언트 사이드에서만 실행)
    const stripHtml = (html: string) => {
        if (typeof window === 'undefined') return html;

        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // 이미지 에러 처리 개선
    const handleImageError = (imageUrl: string, event: any) => {
        console.error('이미지 로드 실패:', imageUrl);
        setFailedImages(prev => new Set([...prev, imageUrl]));
        // 이미지 컨테이너 숨김
        const parent = event.currentTarget.parentElement;
        if (parent) {
            parent.style.display = 'none';
        }
    };

    // 프리로드된 데이터가 있는 경우 로딩 상태 비활성화
    const showLoading = isLoading && (!skipFetching || posts.length === 0);

    return (
        <section className="py-10 md:py-16 bg-main">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center mb-4">
                        <Image
                            src="/footer/band.svg"
                            alt="네이버 밴드"
                            width={32}
                            height={32}
                            className="mr-3"
                        />
                        <h2 className="text-2xl md:text-3xl font-bold text-white">DS 건설기계 밴드 소식</h2>
                    </div>

                    <p className="text-center text-white text-sm md:text-base max-w-2xl mb-6">
                        DS 건설기계 네이버 밴드의 최신 게시글을 확인하세요.
                        부품 정보, 정비 사례, 이벤트 소식을 실시간으로 공유합니다.
                    </p>
                </div>

                {/* 고정 높이 컨테이너 */}
                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                    {/* 헤더 */}
                    <div className="p-4 border-b border-gray-700 bg-gray-900/50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">최신 게시글</h3>
                            {posts.length > 0 && (
                                <div className="text-sm text-gray-400">
                                    {posts.length}개 게시글
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 스크롤 가능한 컨텐츠 영역 */}
                    <div className="h-[600px] overflow-y-auto">
                        {showLoading && (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {error && (
                            <div className="p-6 text-center">
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                                    <p className="text-white mb-4">{error}</p>
                                    <Link
                                        href={bandUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg font-medium transition-all duration-300"
                                    >
                                        네이버 밴드에서 확인하기
                                        <FaExternalLinkAlt className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {!showLoading && !error && (
                            <>
                                <div className="p-4 space-y-4">
                                    {posts.map((post, index) => (
                                        <div
                                            key={`${post.id}-${index}`} // 고유 키 보장
                                            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-900/10 transition-shadow border border-gray-700"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* 게시글 이미지 (있는 경우) - 실패한 이미지는 표시하지 않음 */}
                                                {post.imageUrl && !failedImages.has(post.imageUrl) && (
                                                    <div className="md:w-1/3 h-48 md:h-auto relative">
                                                        <Image
                                                            src={getImageSrc(post.imageUrl)}
                                                            alt="게시글 이미지"
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, 33vw"
                                                            className="object-cover"
                                                            loading="lazy"
                                                            onError={(e) => handleImageError(post.imageUrl!, e)}
                                                        />
                                                    </div>
                                                )}

                                                {/* 게시글 내용 */}
                                                <div className={`p-4 flex flex-col ${
                                                    post.imageUrl && !failedImages.has(post.imageUrl)
                                                        ? 'md:w-2/3'
                                                        : 'w-full'
                                                }`}>
                                                    <div className="flex items-center text-xs text-gray-400 mb-3">
                                                        <div className="flex items-center">
                                                            {post.author.profileImage && !failedImages.has(post.author.profileImage) && (
                                                                <Image
                                                                    src={getImageSrc(post.author.profileImage)}
                                                                    width={20}
                                                                    height={20}
                                                                    alt={post.author.name}
                                                                    className="rounded-full mr-2"
                                                                    loading="lazy"
                                                                    onError={(e) => handleImageError(post.author.profileImage, e)}
                                                                />
                                                            )}
                                                            <span>{post.author.name}</span>
                                                        </div>
                                                        <span className="mx-2">|</span>
                                                        <FaCalendarAlt className="mr-1" />
                                                        <span>{formatRelativeDate(post.date)}</span>
                                                    </div>

                                                    <div className="text-white mb-3 flex-grow">
                                                        <p className="text-gray-300 text-sm line-clamp-3">
                                                            {stripHtml(post.content)}
                                                        </p>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                                                            <div className="flex items-center">
                                                                <FaThumbsUp className="mr-1" />
                                                                <span>{post.emotionCount}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaComments className="mr-1" />
                                                                <span>{post.commentCount}</span>
                                                            </div>
                                                        </div>

                                                        <Link
                                                            href={post.postUrl || `${bandUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center transition-colors"
                                                        >
                                                            자세히 보기
                                                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {posts.length === 0 && !showLoading && !error && (
                                    <div className="text-center py-20">
                                        <p className="text-white mb-4">표시할 게시글이 없습니다.</p>
                                    </div>
                                )}

                                {/* 더보기 버튼 (스크롤 영역 하단에 고정) */}
                                {hasMorePosts && (
                                    <div className="p-4 border-t border-gray-700 bg-gray-900/30">
                                        <button
                                            onClick={handleShowMorePosts}
                                            disabled={isLoadingMore}
                                            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoadingMore ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                    로딩 중...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    더 보기
                                                    <FaChevronDown className="ml-2" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* 로딩 중일 때 하단에 표시 */}
                                {isLoadingMore && (
                                    <div className="p-4 text-center border-t border-gray-700">
                                        <div className="flex items-center justify-center text-gray-400">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400 mr-2"></div>
                                            새로운 게시글을 불러오는 중...
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NaverBandFeed;
