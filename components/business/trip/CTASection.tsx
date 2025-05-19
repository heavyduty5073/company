'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PhoneCall, Calendar } from 'lucide-react';
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
            <div className="bg-blue-700 text-white p-8 rounded-lg text-center relative z-10">
                <motion.h2
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    지금 바로 출장 정비 서비스를 예약하세요
                </motion.h2>
                <motion.p
                    className="text-xl mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    장비 가동 중단으로 인한 손실을 최소화하고, 전문가의 신속한 해결책을 경험해보세요.
                </motion.p>
                <motion.div
                    className="space-x-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={()=>window.open('tel:010-2036-5073', '_blank')}
                        className="bg-white text-blue-700 hover:bg-gray-100"
                    >
                        <PhoneCall className="mr-2 h-4 w-4" /> 전화문의
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={()=>alert('준비중입니다.')}
                        className="border-white text-black bg-yellow-300"
                    >
                        <RiKakaoTalkFill className="text-black mr-2 h-4 w-4" /> 카카오 상담
                    </Button>
                </motion.div>
            </div>

            {/* 배경 애니메이션 */}
            <motion.div
                className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-600 rounded-full opacity-30"
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
                className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500 rounded-full opacity-20"
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