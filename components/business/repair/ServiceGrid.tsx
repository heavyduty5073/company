// components/ServicesGrid.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    FaOilCan,
    FaCog,
    FaCarBattery,
    FaTools,
    FaCarCrash
} from 'react-icons/fa';
import {
    MdBuild,
    MdSpeed,
    MdSecurity
} from 'react-icons/md';
import { IoSpeedometer } from 'react-icons/io5';
import { HiSparkles } from "react-icons/hi";
const ServicesGrid = () => {
    const services = [
        {
            icon: FaCog,
            title: "엔진 정비",
            description: "엔진 시스템 전반의 정밀 점검 및 수리",
            features: ["진단기 활용 점검", "부품 교체", "성능 최적화"],
            color: "from-blue-400 to-indigo-500"
        },
        {
            icon: FaCarBattery,
            title: "배터리 점검",
            description: "배터리 상태 점검 및 교환 서비스",
            features: ["무료 배터리 테스트", "교체 후 보증", "긴급 출장 서비스"],
            color: "from-green-400 to-emerald-500"
        },
        {
            icon: MdBuild,
            title: "브레이크 정비",
            description: "안전한 제동을 위한 브레이크 시스템 점검",
            features: ["패드 교체", "디스크 점검", "브레이크액 교환"],
            color: "from-red-400 to-rose-500"
        },
        {
            icon: IoSpeedometer,
            title: "종합 진단",
            description: "차량 전체 시스템의 종합적인 진단 서비스",
            features: ["컴퓨터 진단", "상태 리포트", "예방 정비 안내"],
            color: "from-orange-400 to-red-500"
        },
        {
            icon: HiSparkles,
            title: "DPF 청소관리",
            description: "후처리 장치 클리닝 서비스",
            features: ["DPF 클리닝", "열처리", "습식처리"],
            color: "from-purple-400 to-pink-500"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2">
                        <MdSecurity className="mr-2" />
                        전문 서비스
                    </Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            전문적인 정비 서비스
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        숙련된 정비사와 첨단 장비를 통해 고객님의 차량을 완벽하게 관리합니다
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                rotateY: 5,
                                rotateX: 5
                            }}
                            className="group"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px'
                            }}
                        >
                            <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* 그라디언트 헤더 */}
                                <div className={`h-2 bg-gradient-to-r ${service.color}`} />

                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-4">
                                        <motion.div
                                            className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <service.icon className="text-white" size={24} />
                                        </motion.div>
                                        <div>
                                            <CardTitle className="text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {service.title}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 text-sm">포함 서비스:</h4>
                                        <ul className="space-y-1">
                                            {service.features.map((feature, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    className="flex items-center space-x-2 text-sm text-gray-600"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                                                >
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                    <span>{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* 호버 시 나타나는 추가 정보 */}
                                    <motion.div
                                        className="pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        initial={false}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">전문성 보장</span>
                                            <div className="flex space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2 h-2 bg-yellow-400 rounded-full"
                                                        initial={{ scale: 0 }}
                                                        whileInView={{ scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 추가 정보 섹션 */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: MdSpeed,
                                    title: "신속한 서비스",
                                    description: "평균 1일이내 완벽수리"
                                },
                                {
                                    icon: FaTools,
                                    title: "전문 장비",
                                    description: "최신 정비 장비 완비"
                                },
                                {
                                    icon: FaCarCrash,
                                    title: "안전 보장",
                                    description: "작업 후 품질 검증"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex flex-col items-center space-y-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <item.icon className="text-white" size={20} />
                                    </div>
                                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                    <p className="text-sm text-gray-600 text-center">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesGrid;