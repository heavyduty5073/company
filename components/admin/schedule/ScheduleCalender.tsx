// components/admin/AdminScheduleCalendar.tsx
'use client';

import React, { useState } from 'react';

import ScheduleDayModal from './ScheduleDayModal';
import {Schedules} from "@/utils/supabase/types";
import ScheduleForm from "@/components/admin/schedule/ScheduleForm";

interface AdminScheduleCalendarProps {
    initialSchedules: Schedules[];
}

export default function AdminScheduleCalendar({ initialSchedules }: AdminScheduleCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedules | null>(null);
    // 날짜별 예약 상태 관리 (관리자용 - 전화 예약 현황 업데이트)
    const [dateReservationStatus, setDateReservationStatus] = useState<Map<string, 'available' | 'full'>>(new Map());

    // 현재 달의 스케줄만 필터링
    const getCurrentMonthSchedules = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];

        return initialSchedules.filter(schedule =>
            schedule.schedule_date >= startDate && schedule.schedule_date <= endDate
        );
    };

    const schedules = getCurrentMonthSchedules();

    // 달력 생성 함수
    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // 이전 달의 날짜들
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    // 특정 날짜의 스케줄 가져오기
    const getSchedulesForDate = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return schedules.filter(schedule => schedule.schedule_date === dateString);
    };

    // 날짜별 예약 상태 토글 (관리자가 전화 예약 현황에 따라 업데이트)
    const toggleReservationStatus = (day: number, e: React.MouseEvent) => {
        e.stopPropagation(); // 날짜 클릭 이벤트 방지
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        setDateReservationStatus(prev => {
            const newMap = new Map(prev);
            const currentStatus = newMap.get(dateString) || 'available';
            newMap.set(dateString, currentStatus === 'available' ? 'full' : 'available');
            return newMap;
        });
    };

    // 날짜의 예약 상태 확인
    const getReservationStatus = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return dateReservationStatus.get(dateString) || 'available';
    };

    // 이전/다음 달 이동
    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    // 날짜 클릭 핸들러
    const handleDateClick = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        setSelectedDate(dateString);
    };

    // 새 스케줄 등록
    const handleNewSchedule = () => {
        if (!selectedDate) return;
        setEditingSchedule(null);
        setShowForm(true);
    };

    // 스케줄 수정
    const handleEditSchedule = (schedule: Schedules) => {
        setEditingSchedule(schedule);
        setShowForm(true);
    };

    // 폼 닫기
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSchedule(null);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setSelectedDate(null);
    };

    const days = generateCalendar();
    const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    const selectedDateSchedules = selectedDate ?
        schedules.filter(schedule => schedule.schedule_date === selectedDate) : [];

    return (
        <div className="p-6">
            {/* 상단 컨트롤 */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        ← 이전 달
                    </button>
                    <h2 className="text-2xl font-semibold">
                        {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                    </h2>
                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        다음 달 →
                    </button>
                </div>

                <div className="text-sm text-gray-600 flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-400 rounded mr-2"></span>예약 가능
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-red-400 rounded mr-2"></span>예약 마감
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-orange-400 rounded mr-2"></span>예약 만석
                    </div>
                </div>
            </div>

            {/* 달력 */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {/* 요일 헤더 */}
                {dayNames.map((dayName, index) => (
                    <div
                        key={dayName}
                        className={`p-3 text-center text-sm font-medium border-b ${
                            index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                        }`}
                    >
                        {dayName}
                    </div>
                ))}

                {/* 날짜 셀 */}
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className="p-3 h-32" />;
                    }

                    const daySchedules = getSchedulesForDate(day);
                    const hasSchedules = daySchedules.length > 0;
                    const hasAvailableSchedule = daySchedules.some(s => s.is_available);
                    const hasUnavailableSchedule = daySchedules.some(s => !s.is_available);
                    const reservationStatus = getReservationStatus(day);

                    return (
                        <div
                            key={`day-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                            onClick={() => handleDateClick(day)}
                            className={`p-2 border rounded-md h-32 cursor-pointer transition-colors relative hover:bg-gray-50 ${
                                index % 7 === 0 ? 'text-red-600' : index % 7 === 6 ? 'text-blue-600' : 'text-gray-900'
                            } ${
                                reservationStatus === 'full' ? 'bg-orange-50 border-orange-200' : ''
                            }`}
                        >
                            {/* 날짜와 예약 상태 토글 버튼 */}
                            <div className="flex justify-between items-start mb-1">
                                <div className="text-sm font-medium">{day}</div>
                                <button
                                    onClick={(e) => toggleReservationStatus(day, e)}
                                    className={`w-5 h-5 rounded-full text-xs font-bold transition-colors flex items-center justify-center ${
                                        reservationStatus === 'full'
                                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                    title={reservationStatus === 'full' ? '예약 만석 → 예약 가능으로 변경' : '예약 가능 → 예약 만석으로 변경'}
                                >
                                    {reservationStatus === 'full' ? '×' : '○'}
                                </button>
                            </div>

                            {/* 예약 상태 메시지 */}
                            <div className="text-xs font-medium mb-1">
                                {reservationStatus === 'full' ? (
                                    <span className="text-orange-600">📞 예약 만석</span>
                                ) : (
                                    <span className="text-green-600">📞 예약 가능</span>
                                )}
                            </div>

                            {/* 스케줄 상태 표시 */}
                            <div className="space-y-1">
                                {hasAvailableSchedule && (
                                    <div className="w-full h-1 bg-green-400 rounded" />
                                )}
                                {hasUnavailableSchedule && (
                                    <div className="w-full h-1 bg-red-400 rounded" />
                                )}

                                {/* 스케줄 개수와 메모 표시 */}
                                {hasSchedules && (
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <div className="font-medium">
                                            {daySchedules.length}개 스케줄
                                        </div>
                                        {/* 메모 내용 표시 (최대 2개까지) */}
                                        {daySchedules.slice(0, 2).map((schedule, idx) => (
                                            <div key={idx} className="truncate">
                                                {schedule.notes && (
                                                    <div className="text-xs text-blue-600 bg-blue-50 px-1 rounded">
                                                        📝 {schedule.notes.length > 10 ?
                                                        `${schedule.notes.substring(0, 10)}...` :
                                                        schedule.notes
                                                    }
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-500">
                                                    {schedule.region} - {schedule.driver_name}
                                                </div>
                                            </div>
                                        ))}
                                        {daySchedules.length > 2 && (
                                            <div className="text-xs text-gray-400">
                                                +{daySchedules.length - 2}개 더...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 선택된 날짜 모달 */}
            {selectedDate && (
                <ScheduleDayModal
                    date={selectedDate}
                    schedules={selectedDateSchedules}
                    onClose={handleCloseModal}
                    onNewSchedule={handleNewSchedule}
                    onEditSchedule={handleEditSchedule}
                />
            )}

            {/* 스케줄 폼 모달 */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingSchedule ? '스케줄 수정' : '새 스케줄 등록'}
                            </h3>
                            <button
                                onClick={handleCloseForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <ScheduleForm
                            schedule={editingSchedule}
                            defaultDate={selectedDate}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
