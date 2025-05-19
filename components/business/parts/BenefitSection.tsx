'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeDollarSign, Leaf, Clock, Wrench } from 'lucide-react';

const benefits = [
    {
        title: "비용 절감",
        description: "정품 대비 30-50% 저렴한 가격으로 동일한 품질의 부품을 공급합니다.",
        icon: <BadgeDollarSign className="h-6 w-6 text-amber-600" />,
    },
    {
        title: "친환경적 선택",
        description: "OEM 제조사 부품 사용으로 품질은 유지하면서 자원 낭비를 줄입니다.",
        icon: <Leaf className="h-6 w-6 text-amber-600" />,
    },
    {
        title: "가동 시간 최대화",
        description: "신속한 부품 공급으로 장비의 수리 시간을 최소화합니다.",
        icon: <Clock className="h-6 w-6 text-amber-600" />,
    },
    {
        title: "기술 지원",
        description: "부품 선택과 설치에 대한 전문가의 기술 지원을 제공합니다.",
        icon: <Wrench className="h-6 w-6 text-amber-600" />,
    },
];

export default function BenefitSection() {
    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">에프터마켓 부품의 장점</h2>
            <p className="text-lg mb-8 text-gray-700">
                정품과 동일한 제조사의 에프터마켓 부품을 선택함으로써 얻을 수 있는 다양한 이점을 확인하세요.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full border-t-4 border-t-amber-500 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mb-2">{benefit.icon}</div>
                                <CardTitle className="text-lg text-amber-700">{benefit.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{benefit.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}