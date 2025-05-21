// components/band/NaverBandFeed.tsx
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
}

const NaverBandFeed: React.FC<NaverBandFeedProps> = ({ bandUrl }) => {
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<BandPost[]>([]);

    // 초기에 표시할 게시글 수와 한 번에 추가할 게시글 수
    const initialPostCount = 5;
    const incrementPostCount = 5;

    // 현재 표시 중인 게시글 수
    const [visiblePostCount, setVisiblePostCount] = useState(initialPostCount);

    // 더 보여줄 게시글이 있는지 확인
    const hasMorePosts = visiblePostCount < posts.length;

    // 데이터 가져오기 함수
    const fetchBandPosts = async () => {
        try {
            setLoading(true);
            console.log('밴드 게시글 로딩 시작');

            const response = await axios.get('/api/band-posts');

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            if (response.data.posts) {
                console.log(`밴드 게시글 ${response.data.posts.length}개 로드 성공`);
                setPosts(response.data.posts);
            } else {
                setPosts([]);
            }
        } catch (err: any) {
            console.error('밴드 게시글 로딩 중 오류:', err);
            setError(err.message || '게시글을 불러올 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 데이터 로드
        fetchBandPosts();

        // 클린업 함수
        return () => {
            // 필요한 경우 API 요청 취소 로직 추가
        };
    }, []);

    // 더보기 버튼 클릭 처리
    const handleShowMorePosts = () => {
        setVisiblePostCount(prev => Math.min(prev + incrementPostCount, posts.length));
    };

    // 콘텐츠에서 HTML 태그 제거 (클라이언트 사이드에서만 실행)
    const stripHtml = (html: string) => {
        if (typeof window === 'undefined') return html;

        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

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

                <div className="w-full max-w-5xl mx-auto">
                    {isLoading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
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
                    )}

                    {!isLoading && !error && (
                        <>
                            <div className="grid grid-cols-1 gap-6 md:gap-8">
                                {posts.slice(0, visiblePostCount).map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/10 transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* 게시글 이미지 (있는 경우) */}
                                            {post.imageUrl && (
                                                <div className="md:w-1/3 h-64 md:h-auto relative">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt="게시글 이미지"
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                        className="object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}

                                            {/* 게시글 내용 */}
                                            <div className={`p-6 flex flex-col ${post.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                                                <div className="flex items-center text-xs text-gray-400 mb-3">
                                                    <div className="flex items-center">
                                                        {post.author.profileImage && (
                                                            <Image
                                                                src={post.author.profileImage}
                                                                width={24}
                                                                height={24}
                                                                alt={post.author.name}
                                                                className="rounded-full mr-2"
                                                                loading="lazy"
                                                            />
                                                        )}
                                                        <span>{post.author.name}</span>
                                                    </div>
                                                    <span className="mx-2">|</span>
                                                    <FaCalendarAlt className="mr-1" />
                                                    <span>{formatRelativeDate(post.date)}</span>
                                                </div>

                                                <div className="text-white mb-4 flex-grow">
                                                    <p className="text-gray-300 text-sm line-clamp-4">
                                                        {stripHtml(post.content)}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center mt-auto">
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

                            {posts.length === 0 && !isLoading && !error && (
                                <div className="text-center py-10">
                                    <p className="text-white mb-4">표시할 게시글이 없습니다.</p>
                                </div>
                            )}

                            {/* 더보기 버튼 (표시할 게시글이 더 있는 경우에만 표시) */}
                            {hasMorePosts && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleShowMorePosts}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-600/30"
                                    >
                                        더 보기
                                        <FaChevronDown className="ml-2" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NaverBandFeed;