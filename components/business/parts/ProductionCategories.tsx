'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, DropletIcon, Battery } from 'lucide-react';
import { FaTools } from "react-icons/fa";
const categories = [
    {
        title: "엔진 부품",
        description: "피스톤, 밸브, 실린더 헤드 등 엔진의 핵심 부품을 정품 수준의 품질로 제공합니다.",
        icon: <Settings className="h-8 w-8 text-amber-600" />,
    },
    {
        title: "유압 시스템",
        description: "펌프, 밸브, 실린더, 호스 등 유압 시스템의 모든 부품을 취급합니다.",
        icon: <DropletIcon className="h-8 w-8 text-amber-600" />,
    },
    {
        title: "전기 시스템",
        description: "배터리, 스타터, 알터네이터 등 전기 시스템 부품을 안정적으로 공급합니다.",
        icon: <Battery className="h-8 w-8 text-amber-600" />,
    },
    {
        title: "소모품",
        description: "필터, 벨트, 베어링 등 정기적으로 교체가 필요한 소모품을 합리적인 가격에 제공합니다.",
        icon: <FaTools className="h-8 w-8 text-amber-600" />,
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

export default function ProductCategories() {
    return (
        <motion.div
            className="grid md:grid-cols-2 gap-6 mt-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            {categories.map((category, index) => (
                <motion.div key={index} variants={item}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="mb-2">{category.icon}</div>
                            <CardTitle className="text-xl text-amber-700">{category.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{category.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}