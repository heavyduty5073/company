// components/DiagnosticSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    FaLaptopCode,
    FaSearch,
    FaChartLine,
    FaMicrochip,
    FaTools,
    FaCogs
} from 'react-icons/fa';
import {
    MdPrecisionManufacturing,
    MdSpeed,
    MdSecurity
} from 'react-icons/md';
import Image from "next/image";

const DiagnosticSection = () => {
    const diagnosticFeatures = [
        {
            icon: FaLaptopCode,
            title: "최신 진단 장비",
            description: "OBD-II 포트를 통한 MCU-CAN 통신 정밀 진단"
        },
        {
            icon: FaSearch,
            title: "실시간 모니터링",
            description: "차량 상태 실시간 확인 및 분석"
        },
        {
            icon: FaChartLine,
            title: "데이터 분석",
            description: "축적된 데이터로 예방 정비 제안"
        },
        {
            icon: MdSpeed,
            title: "신속한 진단",
            description: "15분 내 정확한 진단 결과 제공"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* 왼쪽 이미지 섹션 */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="relative">
                            {/* 메인 이미지 */}
                            <motion.div
                                className="relative z-10 rounded-2xl overflow-hidden shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image src={'/business/toolms.jpg'} alt={'toolms'} width={600} height={400} className={'w-[600px] lg:w-[800px] h-auto'}/>
                            </motion.div>

                            {/* 배경 패턴 */}
                            <motion.div
                                className="absolute inset-0 bg-blue-100 rounded-2xl transform rotate-3 -z-10"
                                initial={{ opacity: 0, rotate: 0 }}
                                whileInView={{ opacity: 1, rotate: 3 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            />
                        </div>

                        {/* 진단 장비 특징 카드들 */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {diagnosticFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                >
                                    <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                                        <CardContent className="p-0">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <feature.icon className="text-blue-600" size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm text-gray-800 mb-1">
                                                        {feature.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 오른쪽 텍스트 섹션 */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 order-1 lg:order-2"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2">
                                <MdPrecisionManufacturing className="mr-2" />
                                진단 전문 장비
                            </Badge>
                        </motion.div>

                        <motion.h2
                            className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="text-green-600">모든 차량</span><br />
                            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                진단기 완비
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            국산차부터 수입차까지, 모든 브랜드의 차량에 대응하는<br />
                            전용 진단기를 보유하고 있어 정확하고 빠른 진단이 가능합니다.
                        </motion.p>

                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: FaTools,
                                        title: "전 브랜드 대응",
                                        subtitle: "현대/기아, 스카니아, 벤츠, MAN 등 모든 브랜드"
                                    },
                                    {
                                        icon: FaCogs,
                                        title: "정밀 진단",
                                        subtitle: "엔진, 변속기, 브레이크 등 모든 시스템 진단 가능"
                                    },
                                    {
                                        icon: MdSecurity,
                                        title: "데이터 보안",
                                        subtitle: "고객 건설기계 완벽 보안 시스템 구축"
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                                            <item.icon className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.subtitle}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* 통계 */}
                        <motion.div
                            className="grid grid-cols-3 gap-6 pt-6 border-t"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                        >
                            {[
                                { number: "50+", label: "진단기 보유" },
                                { number: "99%", label: "진단 정확도" },
                                { number: "15분", label: "평균 진단시간" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.9 + index * 0.1 }}
                                >
                                    <p className="text-2xl font-bold text-green-600">{stat.number}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DiagnosticSection;