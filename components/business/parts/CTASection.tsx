'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { RiKakaoTalkFill } from "react-icons/ri";
export default function CTASection() {
    return (
        <motion.section
            className="mb-16 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
        >
            <div className="bg-amber-700 text-white p-8 rounded-lg text-center relative z-10">
                <motion.h2
                    className="text-2xl lg:text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    지금 바로 견적 요청하세요
                </motion.h2>
                <motion.p
                    className="text-xl mb-8 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    필요한 부품의 모델명과 수량을 알려주시면 최상의 가격으로 견적을 제공해 드립니다.
                </motion.p>
                <motion.div
                    className="flex flex-row items-center justify-center space-x-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={()=>window.open('tel:010-2036-5073', '_blank')}
                        className="bg-white text-amber-700 hover:bg-gray-100"
                    >
                        <Phone className="mr-2 h-4 w-4" /> 문의 전화하기
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={()=>alert('준비중입니다.')}
                        className="border-white text-black bg-yellow-400 hover:bg-amber-800"
                    >
                        <RiKakaoTalkFill className="text-black mr-2 h-4 w-4" /> 카카오톡 상담
                    </Button>
                </motion.div>
            </div>

            {/* 배경 애니메이션 */}
            <motion.div
                className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-600 rounded-full opacity-30"
                style={{ filter: 'blur(70px)' }}
                animate={{
                    scale: [1, 1.2, 1],
                    transition: {
                        duration: 4,
                        repeat: Infinity
                    }
                }}
            />
            <motion.div
                className="absolute -top-16 -left-16 w-64 h-64 bg-amber-500 rounded-full opacity-20"
                style={{ filter: 'blur(70px)' }}
                animate={{
                    scale: [1, 1.3, 1],
                    transition: {
                        duration: 5,
                        repeat: Infinity,
                        delay: 1
                    }
                }}
            />
        </motion.section>
    );
}