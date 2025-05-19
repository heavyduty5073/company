'use client'
import { motion } from 'motion/react';
import React from 'react';

function AnimatedHeader() {
    return (
        <header className="bg-blue-800 text-white py-16 px-4 overflow-hidden relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h1
                    className="text-4xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    전문가의 출장 정비 서비스
                </motion.h1>
                <motion.p
                    className="text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    현장에서 바로 해결하는 신속한 건설기계 정비 서비스
                </motion.p>
            </div>

            {/* 배경 애니메이션 요소 */}
            <motion.div
                className="absolute right-0 top-0 w-96 h-96 bg-blue-700 rounded-full"
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
                className="absolute left-0 bottom-0 w-64 h-64 bg-blue-600 rounded-full"
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