// components/CTASection.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaTools,
    FaHeadset
} from 'react-icons/fa';
import { MdCall, MdSchedule } from 'react-icons/md';
import { useState } from 'react';
import KakaoMap from "@/utils/address/Kakaomap";
import Link from "next/link";

const CTASection = () => {
    const [flippedCards, setFlippedCards] = useState<{[key: number]: boolean}>({});

    // 주소 정보
    const businessAddress = "군산시 해망로 663";
    const fullAddress = "전라북도 군산시 해망로 663";

    const contactMethods = [
        {
            icon: FaPhone,
            title: "전화 상담",
            description: "즉시 전문가와 상담",
            action: "010-2036-5073",
            color: "from-green-400 to-emerald-500",
            backContent: {
                title: "전화 상담",
                phone: "010-2036-5073",
                description: "언제든지 편하게 연락주세요"
            }
        },
        {
            icon: FaMapMarkerAlt,
            title: "방문 상담",
            description: "직접 방문하여 상담",
            action: "오시는 길",
            color: "from-purple-400 to-pink-500",
            backContent: {
                title: "오시는 길",
                mapId: "kakao-map",
                address: fullAddress
            }
        }
    ];

    const operatingHours = [
        { day: "평일", time: "08:30 - 18:30" },
        { day: "토요일", time: "08:30 - 18:30" },
        { day: "일요일", time: "휴무" },
        { day: "공휴일", time: "휴무" }
    ];

    const handleCardHover = (index: number, isHovered: boolean) => {
        setFlippedCards(prev => ({
            ...prev,
            [index]: isHovered
        }));
    };

    return (
        <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:50px_50px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* 메인 CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-3xl lg:text-5xl font-bold text-white mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        지금 바로 <span className="text-blue-400">전문가</span>와<br />
                        상담해보세요
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        차량 상태가 걱정되시나요? 전문적인 진단과 정비로 안전한 운행을 도와드립니다.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                    </motion.div>
                </motion.div>

                {/* 연락 방법 카드들 - 뒤집기 효과 */}
                <motion.div
                    className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {contactMethods.map((method, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer h-80"
                            onMouseEnter={() => handleCardHover(index, true)}
                            onMouseLeave={() => handleCardHover(index, false)}
                            style={{ perspective: '1000px' }}
                        >
                            <motion.div
                                className="relative w-full h-full transition-transform duration-700 preserve-3d"
                                animate={{
                                    rotateY: flippedCards[index] ? 180 : 0
                                }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* 앞면 */}
                                <div className="absolute inset-0 backface-hidden">
                                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                                        <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                                            <motion.div
                                                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center shadow-lg`}
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <method.icon className="text-white" size={24} />
                                            </motion.div>
                                            <h3 className="text-xl font-semibold text-white mb-2">
                                                {method.title}
                                            </h3>
                                            <p className="text-gray-300 mb-4">
                                                {method.description}
                                            </p>
                                            <div className="text-blue-400 font-semibold">
                                                {method.action}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* 뒤면 */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180">
                                    <Card className="bg-white/15 backdrop-blur-md border border-white/30 h-full">
                                        <CardContent className="p-6 h-full flex flex-col justify-center">
                                            {/* 전화 상담 뒤면 */}
                                            {index === 0 && (
                                                <div className="text-center">
                                                    <motion.div
                                                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center shadow-lg`}
                                                    >
                                                        <FaPhone className="text-white" size={24} />
                                                    </motion.div>
                                                    <h3 className="text-xl font-semibold text-white mb-4">
                                                        {method.backContent.title}
                                                    </h3>
                                                    <div className="mb-4">
                                                        <p className="text-2xl font-bold text-green-400 mb-2">
                                                            {method.backContent.phone}
                                                        </p>
                                                        <p className="text-gray-300 text-sm">
                                                            {method.backContent.description}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => window.open(`tel:${method.backContent.phone}`, '_blank')}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                                                    >
                                                        <FaPhone className="mr-2" />
                                                        지금 전화하기
                                                    </Button>
                                                </div>
                                            )}

                                            {/* 방문 상담 뒤면 - 지도 앱들 */}
                                            {index === 1 && (
                                                <div className="text-center">
                                                    <motion.div
                                                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center shadow-lg`}
                                                    >
                                                        <FaMapMarkerAlt className="text-white" size={24} />
                                                    </motion.div>
                                                    <h3 className="text-xl font-semibold text-white mb-3">
                                                        {method.backContent.title}
                                                    </h3>

                                                    <p className="text-gray-300 text-sm mb-4">
                                                        {businessAddress}
                                                    </p>
                                                    <Link className={'border border-black px-7 py-3 bg-white rounded-lg my-2'} href={'/home#kakaomap'}>위치 확인하기</Link>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 하단 정보 */}
                <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-1 gap-12">

                    {/* 긴급 서비스 */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md border border-red-400/30">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <FaHeadset className="mr-3 text-red-400" />
                                    긴급 서비스
                                </h3>
                                <p className="text-gray-300 mb-4">
                                    갑작스런 고장이 발생했나요?<br />
                                    긴급 출장 서비스를 이용하세요.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <FaTools className="text-red-400" />
                                        <span className="text-white">현장 응급 처치</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaPhone className="text-red-400" />
                                        <span className="text-white">010-2036-5073</span>
                                    </div>
                                </div>
                                <motion.div
                                    className="mt-4"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Button
                                        onClick={() => window.open('tel:010-2036-5073', '_blank')}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                                    >
                                        긴급 출장 요청
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* 마지막 메시지 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-center mt-16"
                >
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <h4 className="text-2xl font-bold text-white mb-4">
                                믿을 수 있는 정비 파트너
                            </h4>
                            <p className="text-gray-300 mb-6">
                                고객님의 소중한 차량을 가족처럼 생각하며<br />
                                최선을 다해 관리해드리겠습니다.
                            </p>
                            <div className="flex justify-center space-x-8">
                                {[
                                    { icon: "🏆", text: "품질 보장" },
                                    { icon: "⚡", text: "신속 서비스" },
                                    { icon: "💝", text: "고객 만족" }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="text-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <div className="text-3xl mb-2">{item.icon}</div>
                                        <span className="text-white font-medium">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;