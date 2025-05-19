'use client'
import { motion } from 'motion/react';
import React from 'react';

function AnimatedHeader() {
    return (
        <header className="bg-amber-700 text-white py-16 px-4 overflow-hidden relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h1
                    className="text-3xl lg:text-4xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    정품급 건설기계 부품 공급
                </motion.h1>
                <motion.p
                    className="text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    정품과 동일한 제조사의 에프터마켓 부품, 합리적인 가격과 신속한 배송
                </motion.p>
            </div>

            {/* 배경 애니메이션 요소 */}
            <motion.div
                className="absolute right-0 top-0 w-96 h-96 bg-amber-600 rounded-full"
                style={{ filter: 'blur(100px)' }}
                initial={{ x: 100, opacity: 0.5 }}
                animate={{
                    x: 0,
                    opacity: 0.3,
                    transition: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'reverse'
                    }
                }}
            />
            <motion.div
                className="absolute left-0 bottom-0 w-64 h-64 bg-amber-500 rounded-full"
                style={{ filter: 'blur(80px)' }}
                initial={{ x: -50, opacity: 0.4 }}
                animate={{
                    x: 0,
                    opacity: 0.2,
                    transition: {
                        duration: 2.5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: 0.5
                    }
                }}
            />
        </header>
    );
}

export default AnimatedHeader;