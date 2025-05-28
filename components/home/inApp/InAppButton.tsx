'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

function InAppButton() {
    const businessAddress = "군산시 해망로 663";
    const lat = 35.978404;
    const lng = 126.670992;

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 카카오맵
    const openKakaoMap = () => {
        if (isMobile) {
            window.location.href = `kakaomap://route?ep=${lat},${lng}&by=CAR`;
            setTimeout(() => {
                window.open(`https://map.kakao.com/link/to/${encodeURIComponent(businessAddress)},${lat},${lng}`, '_blank');
            }, 1000);
        } else {
            window.open(`https://map.kakao.com/link/to/${encodeURIComponent(businessAddress)},${lat},${lng}`, '_blank');
        }
    };

    // T맵
    const openTMap = () => {
        const tmapUrl = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(businessAddress)}`;
        if (isMobile) {
            window.location.href = tmapUrl;
            setTimeout(() => {
                window.open(`https://apis.openapi.sk.com/tmap/app/routes?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(businessAddress)}`, '_blank');
            }, 1000);
        } else {
            window.open('https://www.tmap.co.kr/', '_blank');
        }
    };

    // 네이버 지도
    const openNaverMap = () => {
        const naverMapUrl = `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(businessAddress)}&appname=com.yourapp.name`;
        if (isMobile) {
            window.location.href = naverMapUrl;
            setTimeout(() => {
                window.open(`https://map.naver.com/v5/directions/-/-/${lng},${lat},${encodeURIComponent(businessAddress)}/car`, '_blank');
            }, 1000);
        } else {
            window.open(`https://map.naver.com/v5/directions/-/-/${lng},${lat},${encodeURIComponent(businessAddress)}/car`, '_blank');
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
