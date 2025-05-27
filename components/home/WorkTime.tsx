'use client'
import React from 'react';
import {motion} from "framer-motion";
import {Card, CardContent} from "@/components/ui/card";
import {FaClock} from "react-icons/fa";

function WorkTime() {
    const operatingHours = [
        { day: "평일", time: "08:30 - 18:30" },
        { day: "토요일", time: "08:30 - 18:30" },
        { day: "일요일", time: "휴무" },
        { day: "공휴일", time: "휴무" }
    ];

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                            <FaClock className="mr-3 text-blue-400" />
                            운영 시간
                        </h3>
                        <div className="space-y-3">
                            {operatingHours.map((schedule, index) => (
                                <motion.div
                                    key={index}
                                    className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="text-gray-300">{schedule.day}</span>
                                    <span className="text-white font-medium">{schedule.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default WorkTime;