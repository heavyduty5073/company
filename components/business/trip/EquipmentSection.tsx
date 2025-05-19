'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const diagnosticTools = [
    "컴퓨터화된 진단 시스템",
    "유압 시스템 테스터",
    "엔진 성능 분석기",
    "전자 회로 진단 장비",
    "배출가스 분석기"
];

const serviceVehicles = [
    "이동식 정비 공구 세트",
    "현장 용접 장비",
    "휴대용 유압 시스템",
    "비상 전원 공급 장치",
    "필수 부품 재고 탑재"
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function EquipmentSection() {
    return (
        <section className="mb-16">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                className="bg-gray-100 p-8 rounded-lg"
            >
                <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">최첨단 진단 장비와 전문 공구 보유</h2>
                <p className="text-lg mb-8 text-gray-700">
                    저희는 다양한 건설기계의 문제를 정확히 진단하고 수리할 수 있는 최신 장비와 전문 공구를 갖추고 있습니다.
                    특수 제작된 진단 차량으로 어떤 현장에서도 공장급 정비 서비스를 제공합니다.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-700">첨단 진단 장비</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {diagnosticTools.map((tool, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center"
                                    >
                                        <div className="h-2 w-2 bg-blue-600 rounded-full mr-2"></div>
                                        {tool}
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-700">맞춤형 정비 차량</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {serviceVehicles.map((vehicle, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center"
                                    >
                                        <div className="h-2 w-2 bg-blue-600 rounded-full mr-2"></div>
                                        {vehicle}
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </section>
    );
}