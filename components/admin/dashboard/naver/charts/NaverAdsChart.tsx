'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {NaverAdsStats} from "@/utils/supabase/types";

interface NaverAdsChartProps {
    data: NaverAdsStats[];
}

export default function NaverAdsChart({ data }: NaverAdsChartProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    };

    const formatDateFull = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
        return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    };

    const chartData = data.map(item => ({
        ...item,
        dateDisplay: formatDate(item.date),
        dateFull: formatDateFull(item.date),
        cost: Math.round(item.cost)
    }));

    // Custom Tooltip 컴포넌트
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800 mb-2">{data.dateFull}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.dataKey === 'cost'
                                ? `${entry.name}: ${formatCurrency(entry.value)}`
                                : `${entry.name}: ${formatNumber(entry.value)}`
                            }
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full space-y-6">
            {/* 노출량 차트 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">일별 노출량 추이</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="dateDisplay"
                            tick={{ fontSize: 12 }}
                            interval={Math.max(1, Math.floor(chartData.length / 10))}
                        />
                        <YAxis tickFormatter={formatNumber} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="impressions"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                            name="노출량"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 클릭량 차트 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">일별 클릭량 추이</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="dateDisplay"
                            tick={{ fontSize: 12 }}
                            interval={Math.max(1, Math.floor(chartData.length / 10))}
                        />
                        <YAxis tickFormatter={formatNumber} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="clicks"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                            name="클릭량"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 비용 차트 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">일별 광고비용 추이</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="dateDisplay"
                            tick={{ fontSize: 12 }}
                            interval={Math.max(1, Math.floor(chartData.length / 10))}
                        />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="cost"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                            name="광고비용"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 통합 차트 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">일별 통합 성과 추이</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="dateDisplay"
                            tick={{ fontSize: 12 }}
                            interval={Math.max(1, Math.floor(chartData.length / 10))}
                        />
                        <YAxis yAxisId="left" tickFormatter={formatNumber} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="impressions"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            name="노출량"
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="clicks"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            name="클릭량"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cost"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            name="광고비용"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 일별 성과 테이블 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">일별 상세 데이터</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                날짜
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                노출량
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                클릭량
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CTR
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                광고비용
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CPC
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {chartData.slice().reverse().slice(0, 15).map((item, index) => {
                            const ctr = item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : '0.00';
                            const cpc = item.clicks > 0 ? (item.cost / item.clicks).toFixed(0) : '0';

                            return (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.dateFull}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatNumber(item.impressions)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatNumber(item.clicks)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ctr}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(item.cost)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(Number(cpc))}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
