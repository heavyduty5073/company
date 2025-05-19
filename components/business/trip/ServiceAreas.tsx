'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const areas = [
    "서울", "경기도", "인천", "충청도",
    "강원도", "전라도", "경상도", "제주도"
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
};

export default function ServiceAreas() {
    return (
        <section className="mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">서비스 지역</h2>
                <p className="text-lg mb-4 text-gray-700">
                    수도권 및 인근 지역 어디든 출장 서비스가 가능합니다. 원거리 지역은 사전 협의가 필요할 수 있습니다.
                </p>

                <Tabs defaultValue="areas" className="w-full gap-0">
                    <TabsList className="grid w-full grid-cols-2 rounded-b-none">
                        <TabsTrigger className={'bg-blue-300 rounded-r-none'} value="areas">지역 목록</TabsTrigger>
                        <TabsTrigger className={'bg-green-300 rounded-l-none'} value="response-time">대응 시간</TabsTrigger>
                    </TabsList>
                    <TabsContent value="areas">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-700">주요 서비스 지역</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                    variants={container}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                >
                                    {areas.map((area, index) => (
                                        <motion.div
                                            key={index}
                                            className="p-3 bg-gray-100 rounded text-center hover:bg-blue-50 transition-colors"
                                            variants={item}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {area}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="response-time">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-700">평균 대응 시간</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>수도권</span>
                                        <span className="font-semibold text-blue-700">3-5시간 이내</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-blue-600 h-full rounded-full"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '90%' }}
                                            transition={{ duration: 1 }}
                                            viewport={{ once: true }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span>인근 지역 (충청/강원)</span>
                                        <span className="font-semibold text-blue-700">1-3시간 이내</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-blue-600 h-full rounded-full"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '70%' }}
                                            transition={{ duration: 1 }}
                                            viewport={{ once: true }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span>원거리 지역</span>
                                        <span className="font-semibold text-blue-700">다음 영업일</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-blue-600 h-full rounded-full"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '50%' }}
                                            transition={{ duration: 1 }}
                                            viewport={{ once: true }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </section>
    );
}