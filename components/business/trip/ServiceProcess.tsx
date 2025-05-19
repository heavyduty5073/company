'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const processSteps = [
    {
        step: 1,
        title: "상담 및 예약",
        description: "전화 또는 온라인으로 문제 상황을 상담하고 출장 일정을 예약합니다."
    },
    {
        step: 2,
        title: "현장 방문 및 진단",
        description: "전문 기술자가 현장을 방문하여 장비 상태를 정확히 진단합니다."
    },
    {
        step: 3,
        title: "수리 견적 제공",
        description: "진단 결과를 바탕으로 필요한 수리 작업과 비용에 대한 투명한 견적을 제공합니다."
    },
    {
        step: 4,
        title: "정비 및 수리",
        description: "승인 후 현장에서 바로 정비 작업을 시행합니다. 대부분의 문제는 한 번의 방문으로 해결됩니다."
    },
    {
        step: 5,
        title: "사후 관리",
        description: "수리 후 장비 상태를 확인하고, 향후 유지보수 방법에 대한 조언을 제공합니다."
    }
];

export default function ServiceProcess() {
    return (
        <section className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">출장 정비 서비스 프로세스</h2>

            <div className="space-y-4">
                {processSteps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <Card className="overflow-hidden">
                            <div className="flex items-start p-6">
                                <Badge variant="default" className="bg-blue-600 h-8 w-8 rounded-full flex items-center justify-center text-white mr-4">
                                    {step.step}
                                </Badge>
                                <CardContent className="p-0">
                                    <h3 className="text-xl font-semibold text-blue-700 mb-2">{step.title}</h3>
                                    <p className="text-gray-700">{step.description}</p>
                                </CardContent>
                            </div>
                            {index < processSteps.length - 1 && (
                                <motion.div
                                    className="w-0.5 h-8 bg-blue-200 ml-10"
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
        </section>
    );
}
