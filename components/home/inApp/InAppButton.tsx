'use client'
import React from 'react';
import {Button} from "@/components/ui/button";
import { RiKakaoTalkFill } from "react-icons/ri";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
function InAppButton() {

    // 주소 정보
    const businessAddress = "군산시 해망로 663";
    const fullAddress = "전라북도 군산시 해망로 663";

    // 카카오맵 열기 함수
    const openKakaoMap = () => {
        const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(businessAddress)},37.5665,126.9780`;
        // 모바일에서는 앱, 데스크톱에서는 웹으로 열기
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // 모바일: 카카오맵 앱 시도 후 웹으로 폴백
            window.location.href = `kakaomap://look?p=37.5665,126.9780`;
            setTimeout(() => {
                window.open(kakaoMapUrl, '_blank');
            }, 1000);
        } else {
            // 데스크톱: 웹에서 열기
            window.open(kakaoMapUrl, '_blank');
        }
    };

    // T맵 열기 함수
    const openTMap = () => {
        const tmapUrl = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${process.env.TMAP_API_KEY}&goalname=${encodeURIComponent(businessAddress)}&goalx=126.9780&goaly=37.5665`;
        const tmapAppUrl = `tmap://route?goalname=${encodeURIComponent(businessAddress)}&goalx=126.9780&goaly=37.5665`;

        // 모바일에서는 앱, 데스크톱에서는 웹으로 열기
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // 모바일: T맵 앱 시도 후 웹으로 폴백
            window.location.href = tmapAppUrl;
            setTimeout(() => {
                window.open(`https://tmapapi.sktelecom.com/main.html#webservice/docs/tmapWebServiceGuide`, '_blank');
            }, 1000);
        } else {
            // 데스크톱: 웹에서 T맵 사이트로 이동
            window.open('https://www.tmap.co.kr/', '_blank');
        }
    };

    // 네이버 지도 열기 함수
    const openNaverMap = () => {
        const naverMapUrl = `https://map.naver.com/v5/directions/-/-/-/car?c=14.00,0,0,0,dh&pinType=place&lng=126.9780&lat=37.5665&placePath=${encodeURIComponent(fullAddress)}`;
        window.open(naverMapUrl, '_blank');
    };
    return (
        <div className="space-y-2">
            <Button
                onClick={openKakaoMap}
                className="w-full bg-yellow-400 hover:bg-yellow-700 text-black font-semibold text-sm py-2"
            >
                <FaMapMarkerAlt className={'text-blue-500'} size={16} />
                카카오맵으로 길찾기
            </Button>

            <Button
                onClick={openTMap}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm py-2"
            >
                <Image src={'/logo/tmapimg.webp'} alt={'tmap'} width={50} height={50} className={'w-5 h-5 rounded-lg'}/>
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