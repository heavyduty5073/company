'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    FaAward,
    FaUserGraduate,
    FaCertificate,
    FaHandshake,
    FaStar,
    FaUsers
} from 'react-icons/fa';
import {
    MdVerified,
    MdTrendingUp,
    MdSecurity
} from 'react-icons/md';

const ExpertiseSection = () => {
    const certifications = [
        { name: "자동차정비기능사", percentage: 100 },
        { name: "대형면허", percentage: 100 },
    ];

    const achievements = [
        {
            icon: FaUsers,
            number: "5,000+",
            label: "만족 고객",
            color: "text-blue-600"
        },
        {
            icon: FaCertificate,
            number: "15+",
            label: "보유 기술력",
            color: "text-green-600"
        },
        {
            icon: FaAward,
            number: "10+",
            label: "년 경력",
            color: "text-purple-600"
        },
        {
            icon: FaStar,
            number: "4.9",
            label: "고객 평점",
            color: "text-yellow-600"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 px-4 py-2">
                        <MdVerified className="mr-2" />
                        전문성 인증
                    </Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            검증된 전문성
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        다년간의 경험과 지속적인 교육을 통해 축적된 전문성으로 최고의 서비스를 제공합니다
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-1 gap-16 items-center justify-center">

                    {/* 오른쪽 - 성과 및 통계 */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* 성과 통계 */}
                        <div className="grid grid-cols-2 gap-6">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card className="p-6 text-center hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
                                        <CardContent className="p-0">
                                            <motion.div
                                                className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <achievement.icon className={`${achievement.color}`} size={20} />
                                            </motion.div>
                                            <motion.p
                                                className={`text-2xl font-bold ${achievement.color} mb-1`}
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: index * 0.1 + 0.3 }}
                                            >
                                                {achievement.number}
                                            </motion.p>
                                            <p className="text-sm text-gray-600">{achievement.label}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* 고객 신뢰도 */}
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <CardContent className="p-6">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaHandshake className="mr-2 text-blue-600" />
                                    고객 신뢰도
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: "재방문율", value: 92 },
                                        { label: "추천도", value: 96 },
                                        { label: "만족도", value: 98 }
                                    ].map((metric, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                                                <span className="text-sm font-semibold text-blue-600">{metric.value}%</span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-2">
                                                <motion.div
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${metric.value}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.2, duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSection;