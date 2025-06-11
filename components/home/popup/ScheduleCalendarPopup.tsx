'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, Calendar } from 'lucide-react';
import { Schedules } from "@/utils/supabase/types";
import {useScheduleStore} from "@/lib/store/useScheduleStore";

interface ScheduleCalendarPopupProps {
    schedules: Schedules[];
    className?: string;
}

const ScheduleCalendarPopup: React.FC<ScheduleCalendarPopupProps> = ({
                                                                         schedules,
                                                                         className = ''
                                                                     }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const reservationStatusMap = useScheduleStore((state) => state.reservationStatus);
    useEffect(() => {
        // 모바일 감지
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // 팝업 표시 여부 확인
        const checkPopupVisibility = () => {
            const today = new Date().toDateString();
            const hideUntil = sessionStorage.getItem('hideSchedulePopupUntil');

            if (!hideUntil || hideUntil !== today) {
                // 페이지 로드 후 3초 뒤에 팝업 표시
                setTimeout(() => {
                    setIsVisible(true);
                }, 3000);
            }
        };

        checkPopupVisibility();

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);
    useEffect(() => {
        const map = new Map<string, boolean>();
        schedules.forEach((schedule) => {
            map.set(schedule.schedule_date, schedule.is_open); // true면 예약 가능
        });
        useScheduleStore.getState().bulkSetReservationStatus(map);
    }, [schedules]);

    // 현재 달의 스케줄만 필터링
    const getCurrentMonthSchedules = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];

        return schedules.filter(schedule =>
            schedule.schedule_date >= startDate && schedule.schedule_date <= endDate
        );
    };

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
        return getCurrentMonthSchedules().filter(schedule => schedule.schedule_date === dateString);
    };

    // 예약 가능 여부 확인
    const getReservationStatus = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const isOpen = reservationStatusMap.get(dateString);
        if (isOpen === undefined) return true; // 기본값: 예약 가능
        return isOpen; // true = 예약 가능, false = 마감
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleHideToday = () => {
        const today = new Date().toDateString();
        sessionStorage.setItem('hideSchedulePopupUntil', today);
        setIsVisible(false);
    };

    const handleCall = () => {
        window.location.href = 'tel:010-2036-5073';
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

    if (!isVisible) return null;

    const days = generateCalendar();
    const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    // 모바일 팝업 (중앙 표시)
    if (isMobile) {
        return (
            <>
                {/* 배경 오버레이 */}
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-700 max-h-[90vh] overflow-y-auto">
                        {/* 헤더 */}
                        <div className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 relative sticky top-0">
                            <button
                                onClick={handleClose}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-lg font-bold text-center">📅 예약 현황</h3>
                            <p className="text-sm text-center mt-1 text-blue-100">출장 서비스 예약 가능 날짜</p>
                        </div>

                        {/* 달력 네비게이션 */}
                        <div className="p-4 bg-gray-800 flex justify-between items-center">
                            <button
                                onClick={() => navigateMonth('prev')}
                                className="text-white hover:text-blue-300 transition-colors"
                            >
                                ← 이전
                            </button>
                            <h4 className="text-white font-semibold">
                                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                            </h4>
                            <button
                                onClick={() => navigateMonth('next')}
                                className="text-white hover:text-blue-300 transition-colors"
                            >
                                다음 →
                            </button>
                        </div>

                        {/* 달력 */}
                        <div className="p-4">
                            {/* 요일 헤더 */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayNames.map((dayName, index) => (
                                    <div
                                        key={dayName}
                                        className={`p-2 text-center text-xs font-medium ${
                                            index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-300'
                                        }`}
                                    >
                                        {dayName}
                                    </div>
                                ))}
                            </div>

                            {/* 날짜 셀 */}
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((day, index) => {
                                    if (day === null) {
                                        return <div key={`empty-${index}`} className="p-2 h-14" />;
                                    }

                                    const isOpen = getReservationStatus(day);
                                    const daySchedules = getSchedulesForDate(day);

                                    return (
                                        <div
                                            key={`day-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                                            onClick={() => handleDateClick(day)}
                                            className={`p-2 border rounded-md h-14 text-center cursor-pointer transition-colors relative flex flex-col justify-center ${
                                                index % 7 === 0 ? 'text-red-400' : index % 7 === 6 ? 'text-blue-400' : 'text-gray-200'
                                            } ${
                                                isOpen ? 'border-green-500 bg-green-900/30 hover:bg-green-800/50' :
                                                    daySchedules.length > 0 ? 'border-red-500 bg-red-900/30' : 'border-gray-600 hover:bg-gray-700'
                                            }`}
                                        >
                                            <div className="text-sm font-medium">{day}</div>
                                            {isOpen && (
                                                <div className="text-xs text-green-400 font-bold">○</div>
                                            )}
                                            {daySchedules.length > 0 && !isOpen && (
                                                <div className="text-xs text-red-400 font-bold">×</div>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>

                            {/* 범례 */}
                            <div className="mt-4 text-xs text-gray-300 space-y-1">
                                <div className="flex items-center">
                                    <span className="inline-block w-3 h-3 bg-green-400 rounded mr-2"></span>
                                    예약 가능
                                </div>
                                <div className="flex items-center">
                                    <span className="inline-block w-3 h-3 bg-red-400 rounded mr-2"></span>
                                    예약 마감
                                </div>
                            </div>
                        </div>

                        {/* 하단 액션 */}
                        <div className="p-4 border-t border-gray-700 space-y-3">
                            <button
                                onClick={handleCall}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <Phone size={16} className="mr-2" />
                                전화 예약: 010-2036-5073
                            </button>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleHideToday}
                                    className="text-xs text-gray-100 underline hover:text-gray-400 transition-colors px-2 py-1"
                                >
                                    오늘 하루 보지 않기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // 웹 팝업 (오른쪽 고정)
    return (
        <div className="fixed right-20 top-1/2 -translate-y-1/2 z-50 animate-in slide-in-from-right duration-500">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl w-96 overflow-hidden border border-gray-700">
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">📅</div>
                        <div>
                            <h3 className="text-lg font-bold">예약 현황 확인</h3>
                            <p className="text-sm text-blue-100">출장 서비스 예약 가능 날짜</p>
                        </div>
                    </div>
                </div>

                {/* 달력 네비게이션 */}
                <div className="p-4 bg-gray-800 flex justify-between items-center">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="text-white hover:text-blue-300 transition-colors font-medium"
                    >
                        ← 이전 달
                    </button>
                    <h4 className="text-white font-semibold text-lg">
                        {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                    </h4>
                    <button
                        onClick={() => navigateMonth('next')}
                        className="text-white hover:text-blue-300 transition-colors font-medium"
                    >
                        다음 달 →
                    </button>
                </div>

                {/* 달력 */}
                <div className="p-4">
                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 gap-1 mb-3">
                        {dayNames.map((dayName, index) => (
                            <div
                                key={dayName}
                                className={`p-2 text-center text-sm font-medium ${
                                    index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-300'
                                }`}
                            >
                                {dayName}
                            </div>
                        ))}
                    </div>

                    {/* 날짜 셀 */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {days.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} className="p-2 h-14" />;
                            }

                            const is_open = getReservationStatus(day);
                            const daySchedules = getSchedulesForDate(day);

                            return (
                                <div
                                    key={`day-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                                    onClick={() => handleDateClick(day)}
                                    className={`p-2 border rounded-md h-14 text-center cursor-pointer transition-colors relative flex flex-col justify-center ${
                                        index % 7 === 0 ? 'text-red-400' : index % 7 === 6 ? 'text-blue-400' : 'text-gray-200'
                                    } ${
                                        is_open ? 'border-green-500 bg-green-900/30 hover:bg-green-800/50' :
                                            daySchedules.length > 0 ? 'border-red-500 bg-red-900/30' : 'border-gray-600 hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="text-sm font-medium">{day}</div>
                                    {is_open && (
                                        <div className="text-xs text-green-400 font-bold">○</div>
                                    )}
                                    {daySchedules.length > 0 && !is_open && (
                                        <div className="text-xs text-red-400 font-bold">×</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* 범례 */}
                    <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 mb-4">
                        <div className="text-sm space-y-2 text-gray-200">
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 bg-green-400 rounded mr-2"></span>
                                예약 가능
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 bg-red-400 rounded mr-2"></span>
                                예약 마감
                            </div>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    <button
                        onClick={handleCall}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center mb-3"
                    >
                        <Phone size={16} className="mr-2" />
                        전화 예약: 010-2036-5073
                    </button>

                    {/* 하단 액션 */}
                    <div className="flex justify-end border-t border-gray-700 pt-3">
                        <button
                            onClick={handleHideToday}
                            className="text-sm text-gray-100 underline hover:text-gray-400 transition-colors px-2 py-1"
                        >
                            오늘 하루 보지 않기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCalendarPopup;
