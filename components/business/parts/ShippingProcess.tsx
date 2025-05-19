'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ClipboardList, Package, TruckIcon, CheckCheck
} from 'lucide-react';

const processSteps = [
    {
        step: 1,
        title: "주문 접수",
        description: "온라인, 전화 또는 이메일로 필요한 부품을 주문하시면 즉시 처리됩니다.",
        icon: <ClipboardList className="h-6 w-6 text-amber-600" />
    },
    {
        step: 2,
        title: "전문 포장",
        description: "각 부품은 손상 방지를 위해 전문적으로 포장되며, 정확한 부품임을 다시 한번 확인합니다.",
        icon: <Package className="h-6 w-6 text-amber-600" />
    },
    {
        step: 3,
        title: "신속 배송",
        description: "재고 부품은 당일 출고되며, 빠른 배송을 위해 신뢰할 수 있는 물류 파트너와 협력합니다.",
        icon: <TruckIcon className="h-6 w-6 text-amber-600" />
    },
    {
        step: 4,
        title: "배송 확인",
        description: "부품 도착 후 상태를 확인하고, 필요시 기술 지원을 제공해 드립니다.",
        icon: <CheckCheck className="h-6 w-6 text-amber-600" />
    }
];

export default function ShippingProcess() {
    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">제품 포장 및 배송 프로세스</h2>
            <p className="text-lg mb-8 text-gray-700">
                부품의 안전한 배송과 신속한 장비 복구를 위해 전문적인 포장 및 배송 시스템을 운영하고 있습니다.
                모든 제품은 최적의 상태로 고객에게 전달됩니다.
            </p>

            <div className="space-y-4">
                {processSteps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <Card className="overflow-hidden border-amber-200">
                            <div className="flex items-start p-6">
                                <Badge variant="outline" className="bg-amber-100 border-amber-300 h-10 w-10 rounded-full flex items-center justify-center text-amber-800 mr-4">
                                    {step.step}
                                </Badge>
                                <CardContent className="p-0 flex-1">
                                    <div className="flex items-center mb-2">
                                        <div className="mr-2">{step.icon}</div>
                                        <h3 className="text-xl font-semibold text-amber-700">{step.title}</h3>
                                    </div>
                                    <p className="text-gray-700">{step.description}</p>
                                </CardContent>
                            </div>
                            {index < processSteps.length - 1 && (
                                <motion.div
                                    className="w-0.5 h-8 bg-amber-200 ml-10"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 32 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                    viewport={{ once: true }}
                                />
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="mt-8 bg-amber-700 text-white p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center">
                    <TruckIcon className="h-6 w-6 mr-2" />
                    <p className="font-medium">재고 부품은 오후 3시 이전 주문 시 당일 출고됩니다.</p>
                </div>
            </motion.div>
        </section>
    );
}