'use client'
import { motion } from 'motion/react';
import { Clock, Users, DollarSign } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
function ServiceCards() {
    const serviceItems = [
        {
            title: "신속한 대응",
            description: "긴급 상황에도 빠르게 대응하여 장비 가동 중단 시간을 최소화합니다.",
            icon: <Clock className="h-8 w-8 text-blue-600" />,
        },
        {
            title: "전문 기술진",
            description: "다양한 건설기계에 대한 전문 지식과 풍부한 경험을 갖춘 기술자가 방문합니다.",
            icon: <Users className="h-8 w-8 text-blue-600" />,
        },
        {
            title: "합리적인 비용",
            description: "불필요한 부품 교체 없이 정확한 진단과 수리로 비용을 절감해 드립니다.",
            icon: <DollarSign className="h-8 w-8 text-blue-600" />,
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };
    return (
        <motion.div
            className="grid md:grid-cols-3 gap-8 mt-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            {serviceItems.map((service, index) => (
                <motion.div key={index} variants={item}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="mb-2">{service.icon}</div>
                            <CardTitle className="text-xl text-blue-700">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{service.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}

export default ServiceCards;