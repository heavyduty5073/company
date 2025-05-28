'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

// 전역 gtag_report_conversion 함수 타입 선언
declare global {
    interface Window {
        gtag_report_conversion: (url?: string) => boolean;
    }
}

function InAppButton() {
    const businessAddress = "군산시 해망로 663";
    const lat = 35.978404;
    const lng = 126.670992;

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 구글 광고 콜백 함수 호출
    const reportConversion = () => {
        if (typeof window !== 'undefined' && window.gtag_report_conversion) {
            window.gtag_report_conversion();
        }
    };

    // 카카오맵
    const openKakaoMap = () => {
        try {
            if (isMobile) {
                // 모바일에서 카카오맵 앱 실행 시도
                window.location.href = `kakaomap://route?ep=${lat},${lng}&by=CAR`;

                // 콜백 실행
                setTimeout(() => {
                    reportConversion();
                }, 500);

                // 앱이 설치되지 않은 경우 웹 버전으로 이동
                setTimeout(() => {
                    window.open(`https://map.kakao.com/link/to/${encodeURIComponent(businessAddress)},${lat},${lng}`, '_blank');
                }, 1000);
            } else {
                // 데스크톱에서는 바로 웹 버전 열고 콜백 실행
                window.open(`https://map.kakao.com/link/to/${encodeURIComponent(businessAddress)},${lat},${lng}`, '_blank');
                reportConversion();
            }
        } catch (error) {
            console.error('카카오맵 실행 중 오류:', error);
            // 오류 발생 시에도 콜백 실행
            reportConversion();
        }
    };

    // T맵
    const openTMap = () => {
        try {
            const tmapUrl = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(businessAddress)}`;

            if (isMobile) {
                // 모바일에서 T맵 앱 실행 시도
                window.location.href = tmapUrl;

                // 콜백 실행
                setTimeout(() => {
                    reportConversion();
                }, 500);

                // 앱이 설치되지 않은 경우 웹 버전으로 이동
                setTimeout(() => {
                    window.open(`https://apis.openapi.sk.com/tmap/app/routes?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(businessAddress)}`, '_blank');
                }, 1000);
            } else {
                // 데스크톱에서는 T맵 웹사이트로 이동
                window.open('https://www.tmap.co.kr/', '_blank');
                reportConversion();
            }
        } catch (error) {
            console.error('T맵 실행 중 오류:', error);
            reportConversion();
        }
    };

    // 네이버 지도
    const openNaverMap = () => {
        try {
            const naverMapUrl = `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(businessAddress)}&appname=com.yourapp.name`;

            if (isMobile) {
                // 모바일에서 네이버지도 앱 실행 시도
                window.location.href = naverMapUrl;

                // 콜백 실행
                setTimeout(() => {
                    reportConversion();
                }, 500);

                // 앱이 설치되지 않은 경우 웹 버전으로 이동
                setTimeout(() => {
                    window.open(`https://map.naver.com/v5/directions/-/-/${lng},${lat},${encodeURIComponent(businessAddress)}/car`, '_blank');
                }, 1000);
            } else {
                // 데스크톱에서는 바로 웹 버전 열고 콜백 실행
                window.open(`https://map.naver.com/v5/directions/-/-/${lng},${lat},${encodeURIComponent(businessAddress)}/car`, '_blank');
                reportConversion();
            }
        } catch (error) {
            console.error('네이버지도 실행 중 오류:', error);
            reportConversion();
        }
    };

    return (
        <div className="space-y-2">
            <Button
                onClick={openKakaoMap}
                className="w-full bg-yellow-400 hover:bg-yellow-700 text-black font-semibold text-sm py-2"
            >
                <FaMapMarkerAlt className="mr-2 text-blue-600" size={16} />
                카카오맵으로 길찾기
            </Button>

            <Button
                onClick={openTMap}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm py-2"
            >
                <Image src="/logo/tmapimg.webp" alt="tmap" width={20} height={20} className="mr-2 rounded-md" />
                T맵으로 길찾기
            </Button>

            <Button
                onClick={openNaverMap}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2"
            >
                <FaMapMarkerAlt className="mr-2" size={16} />
                네이버지도로 길찾기
            </Button>
        </div>
    );
}

export default InAppButton;