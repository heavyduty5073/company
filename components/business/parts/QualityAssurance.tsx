'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Factory, Award, ShieldCheck } from 'lucide-react';

export default function QualityAssurance() {
    return (
        <section className="mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="bg-amber-50 p-8 rounded-lg border border-amber-200"
            >
                <div className="flex flex-col md:flex-row items-center mb-8">
                    <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Factory className="h-32 w-32 text-amber-600" />
                        </motion.div>
                    </div>
                    <div className="md:w-2/3 md:pl-8">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">정품과 동일한 제조사의 품질 보증</h2>
                        <p className="text-lg text-gray-700">
                            저희가 공급하는 모든 부품은 정품(OEM)과 동일한 제조사에서 생산된 에프터마켓 제품입니다.
                            정품과 동일한 품질 기준으로 제작되어 성능과 내구성을 보장하면서도, 불필요한 마케팅 비용이
                            제외된 합리적인 가격으로 제공됩니다.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card className="h-full border-amber-200 bg-white">
                            <CardContent className="pt-6">
                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">엄격한 품질 테스트</h3>
                                        <p className="text-gray-700">모든 부품은 출고 전 엄격한 품질 테스트를 거쳐 성능과 내구성을 검증합니다.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Card className="h-full border-amber-200 bg-white">
                            <CardContent className="pt-6">
                                <div className="flex items-start">
                                    <Award className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">품질 보증 프로그램</h3>
                                        <p className="text-gray-700">모든 부품에 6개월 또는 1,000시간 품질 보증을 제공하여 고객의 안심 구매를 보장합니다.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Card className="h-full border-amber-200 bg-white">
                            <CardContent className="pt-6">
                                <div className="flex items-start">
                                    <ShieldCheck className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">정품 인증 시스템</h3>
                                        <p className="text-gray-700">모든 부품에는 고유 식별 번호가 부여되어 제품의 출처와 품질을 추적할 수 있습니다.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}