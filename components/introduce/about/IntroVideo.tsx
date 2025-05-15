"use client";

// src/components/introduce/ClientVideoPlayer.tsx
import { useState, useRef, useEffect } from 'react';

interface ClientVideoPlayerProps {
    videoUrl: string;
}

export default function ClientVideoPlayer({ videoUrl }: ClientVideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 비디오 메타데이터 로드 시 실행
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // 비디오 시간 업데이트 시 실행
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const percent = (current / videoRef.current.duration) * 100;
            setCurrentTime(current);
            setProgress(percent);
        }
    };

    // 비디오 재생/일시정지 토글
    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // 진행바 클릭 시 시간 이동
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;

        const progressBar = e.currentTarget;
        const clickPosition = e.nativeEvent.offsetX;
        const percent = clickPosition / progressBar.offsetWidth;

        videoRef.current.currentTime = percent * videoRef.current.duration;
    };

    // 볼륨 조절
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;

        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;

        if (newVolume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    // 음소거 토글
    const toggleMute = () => {
        if (!videoRef.current) return;

        if (isMuted) {
            videoRef.current.volume = volume || 0.5;
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    // 전체화면 토글
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                alert(`전체화면 에러: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // 시간 표시 형식 변환 (초 -> 분:초)
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // 풀스크린 이벤트 리스너
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // 비디오 종료 시 처리
    const handleVideoEnded = () => {
        if (!videoRef.current) return;

        setIsPlaying(false);
        videoRef.current.currentTime = 0;
        setProgress(0);
    };

    return (
        <div ref={containerRef} className="max-w-3xl mx-auto rounded-lg overflow-hidden shadow-xl bg-black relative">
            {/* 비디오 플레이어 */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onClick={togglePlay}
                playsInline
            />

            {/* 컨트롤 영역 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                {/* 진행바 */}
                <div
                    className="h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
                    onClick={handleProgressClick}
                >
                    <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* 컨트롤 버튼 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* 재생/일시정지 버튼 */}
                        <button
                            className="text-white focus:outline-none"
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {/* 음소거 버튼 */}
                        <button
                            className="text-white focus:outline-none"
                            onClick={toggleMute}
                        >
                            {isMuted ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {/* 볼륨 슬라이더 */}
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 accent-blue-500"
                        />

                        {/* 시간 표시 */}
                        <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
                    </div>

                    {/* 전체화면 버튼 */}
                    <button
                        className="text-white focus:outline-none"
                        onClick={toggleFullscreen}
                    >
                        {isFullscreen ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5 4h2a1 1 0 010 2H5v2a1 1 0 01-2 0V4a1 1 0 011-1h2a1 1 0 011 1v2zm8 0h2a1 1 0 011 1v2a1 1 0 01-2 0V6h-2a1 1 0 010-2zM5 14h2a1 1 0 010 2H5a1 1 0 01-1-1v-2a1 1 0 012 0v1zm8 0h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* 재생 오버레이 (비디오가 일시정지 상태일 때만 표시) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40"
                    onClick={togglePlay}
                >
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 bg-opacity-80">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}