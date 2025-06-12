// components/admin/AdminScheduleCalendar.tsx
'use client';

import React, {useEffect, useMemo, useState} from 'react';

import ScheduleDayModal from './ScheduleDayModal';
import {Schedules} from "@/utils/supabase/types";
import ScheduleForm from "@/components/admin/schedule/ScheduleForm";
import {updateReservationStatus} from "@/app/(admin)/admin/schedule/actions";
import {useScheduleStore} from "@/lib/store/useScheduleStore";

interface AdminScheduleCalendarProps {
    initialSchedules: Schedules[];
}

export default function AdminScheduleCalendar({ initialSchedules }: AdminScheduleCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedules | null>(null);

    const reservationStatusMap = useScheduleStore((state) => state.reservationStatus);
    const setReservationStatus = useScheduleStore((state) => state.setReservationStatus);
    const bulkSetReservationStatus = useScheduleStore((state) => state.bulkSetReservationStatus);

    // useMemo로 초기 상태 설정 최적화
    useEffect(() => {
        const map = new Map<string, boolean>();
        initialSchedules.forEach((schedule) => {
            const date = schedule.schedule_date;

            // ✅ is_open 그대로 사용
            const prev = map.get(date) ?? true;
            map.set(date, prev && schedule.is_open); // 예약 가능한 경우만 true로 유지
        });
        bulkSetReservationStatus(map);
    }, [initialSchedules]);

    const toggleReservationStatus = async (day: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const currentIsOpen = reservationStatusMap.get(dateString);
        if (currentIsOpen === undefined) return;

        const newIsOpen = !currentIsOpen;

        const { data, error } = await updateReservationStatus(dateString, newIsOpen);

        if (!error) {
            setReservationStatus(dateString, newIsOpen);
        } else {
            console.error('⛔️ 업데이트 실패:', error.message);
        }
    };

    const getCurrentMonthSchedules = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        return initialSchedules.filter((schedule) => schedule.schedule_date >= startDate && schedule.schedule_date <= endDate);
    };

    const schedules = useMemo(() => getCurrentMonthSchedules(), [currentDate, initialSchedules]);

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    };

    const getSchedulesForDate = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return schedules.filter((schedule) => schedule.schedule_date === dateString);
    };

    const getReservationStatus = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const isOpen = reservationStatusMap.get(dateString);
        if (isOpen === undefined) return 'available'; // 기본값은 예약 가능

        return isOpen ? 'available' : 'full'; // ✅ 이제 true가 '예약 가능'이 됨
    };
    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (direction === 'prev') newDate.setMonth(prev.getMonth() - 1);
            else newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    const handleDateClick = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        setSelectedDate(dateString);
    };

    const handleNewSchedule = () => {
        if (!selectedDate) return;
        setEditingSchedule(null);
        setShowForm(true);
    };

    const handleEditSchedule = (schedule: Schedules) => {
        setEditingSchedule(schedule);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSchedule(null);
    };

    const handleCloseModal = () => {
        setSelectedDate(null);
    };

    const days = generateCalendar();
    const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
    const dayNames = ['일','월','화','수','목','금','토'];

    const selectedDateSchedules = selectedDate ? schedules.filter(schedule => schedule.schedule_date === selectedDate) : [];

    const getSelectedDateReservationStatus = () => {
        if (!selectedDate) return 'available';
        const isOpen = reservationStatusMap.get(selectedDate);
        return isOpen === false ? 'full' : 'available';
    };
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
                    const hasAvailableSchedule = daySchedules.some(s => s.is_open);
                    const hasUnavailableSchedule = daySchedules.some(s => !s.is_open);
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
                                    disabled={!hasSchedules}
                                    onClick={(e) => toggleReservationStatus(day, e)}
                                    className={`w-5 h-5 rounded-full transition-colors flex items-center justify-center border border-white shadow-sm ring-1 ring-inset ring-gray-200
    ${reservationStatus === 'full' ? 'bg-orange-500' : 'bg-green-500'}`}
                                    title={reservationStatus === 'full' ? '예약 만석 → 예약 가능' : '예약 가능 → 예약 만석'}
                                >
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
                                {reservationStatus==='full' ? (
                                    <div className="w-full h-1 bg-red-400 rounded" />
                                ):  <div className="w-full h-1 bg-green-400 rounded" />}


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
                            isDateFull={getSelectedDateReservationStatus() === 'full'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
