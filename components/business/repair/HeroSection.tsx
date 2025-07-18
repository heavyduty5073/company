'use client';

import { motion, Variants } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaTools, FaCar, FaShieldAlt, FaClock } from 'react-icons/fa';
import { IoCheckmarkCircle } from 'react-icons/io5';
import Image from "next/image";

const HeroSection = () => {
    // 이미지 배열 (실제 이미지 경로로 변경 필요)
    const constructionImages = [
        '/introduce/hero/heroImg1.jpg',
        '/introduce/hero/heroImg2.jpg',
        '/introduce/hero/heroImg3.jpg',
        '/introduce/hero/heroImg4.jpg',
        '/introduce/hero/heroImg5.jpg',
        '/introduce/hero/heroImg6.jpg',
        '/introduce/hero/heroImg7.jpg',
        '/introduce/hero/heroImg8.jpg',
    ];

    // 각 이미지의 애니메이션 설정
    const imageAnimationVariants: Variants = {
        hidden: {
            opacity: 0,
            x: 100,
            y: -100,
            scale: 0.8,
            rotate: 5
        },
        visible: (i: number) => ({
            opacity: [0, 1, 1, 0],
            x: [100, 0, -50, -150],
            y: [-100, -20, 50, 150],
            scale: [0.8, 1, 1.05, 0.9],
            rotate: [5, 0, -2, -5],
            transition: {
                duration: 8,
                delay: i * 1.5,
                repeat: Infinity,
                repeatDelay: (constructionImages.length - 1) * 1.5,
                ease: "easeInOut"
            }
        })
    };

    // 배경 떠다니는 이미지들을 위한 변형
    const floatingVariants: Variants = {
        floating: (i: number) => ({
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 5, 0],
            transition: {
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut" as any
            }
        })
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-20 rounded-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(15,23,42)_1px,transparent_0)] bg-[length:50px_50px]" />
            </div>

            {/* 배경 떠다니는 아이콘들 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[FaTools, FaCar, FaShieldAlt, FaClock].map((Icon, index) => (
                    <motion.div
                        key={index}
                        className="absolute text-blue-200"
                        style={{
                            left: `${20 + index * 20}%`,
                            top: `${10 + index * 15}%`,
                        }}
                        variants={floatingVariants}
                        animate="floating"
                        custom={index}
                    >
                        <Icon size={30 + index * 10} />
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* 왼쪽 텍스트 섹션 */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 z-10 relative"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2">
                                <FaShieldAlt className="mr-2" />
                                전문 정비 서비스
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">전문가</span>가 하는<br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                건설기계 정비 서비스
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl text-gray-600 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            10년 경력의 전문 정비사와 최신 진단 장비를 보유하여<br />
                            고객님의 소중한 건설기계를 안전하고 정확하게 관리합니다.
                        </motion.p>

                        {/* 특징 리스트 */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            {[
                                { icon: FaTools, text: "전문 정비사 상주" },
                                { icon: FaCar, text: "모든 건설장비 대응 가능" },
                                { icon: FaClock, text: "신속한 서비스 제공" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <item.icon className="text-blue-600" size={18} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA 버튼 */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 pt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                                onClick={() => window.open('tel:010-2036-5073', '_self')}
                            >
                                <FaTools className="mr-2" />
                                정비 서비스 문의
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* 오른쪽 이미지 섹션 - 애니메이션 */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative h-[600px] overflow-hidden rounded-xl"
                    >
                        {/* 메인 컨테이너 */}
                        <div className="relative w-full h-full">
                            {/* 애니메이션 이미지들 */}
                            {constructionImages.map((imageSrc, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={imageAnimationVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="absolute"
                                    style={{
                                        right: '0%',
                                        top: '0%',
                                        zIndex: constructionImages.length - index
                                    }}
                                >
                                    <div className="relative w-200 h-180 rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src={imageSrc}
                                            alt={`건설기계 ${index + 1}`}
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* 이미지 오버레이 */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                </motion.div>
                            ))}

                            {/* 고정 메인 이미지 (배경) */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl opacity-10"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.3 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            >
                                <Image
                                    src="/logo/mainLogo.png"
                                    alt="메인 배경"
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {/* 장식 요소들 */}
                            <motion.div
                                className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500 rounded-full opacity-20"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [360, 180, 0]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />

                            {/* 작은 떠다니는 도구 아이콘들 */}
                            {[...Array(3)].map((_, index) => (
                                <motion.div
                                    key={`tool-${index}`}
                                    className="absolute"
                                    style={{
                                        left: `${20 + index * 30}%`,
                                        top: `${20 + index * 20}%`,
                                    }}
                                    animate={{
                                        y: [0, -30, 0],
                                        x: [0, 15, 0],
                                        rotate: [0, 10, 0]
                                    }}
                                    transition={{
                                        duration: 5 + index,
                                        repeat: Infinity,
                                        delay: index * 0.5,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg opacity-80">
                                        <FaTools className="text-white text-xs" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 하단 그라데이션 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
};

export default HeroSection;
