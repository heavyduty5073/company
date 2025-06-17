// components/admin/AdminScheduleCalendar.tsx - Realtime 디버깅 강화
'use client';

import React, {useEffect, useMemo, useState, useCallback} from 'react';
import { createClient } from '@/utils/supabase/client';

import ScheduleDayModal from './ScheduleDayModal';
import {Schedules} from "@/utils/supabase/types";
import ScheduleForm from "@/components/admin/schedule/ScheduleForm";
import {updateReservationStatus} from "@/app/(admin)/admin/schedule/actions";
import {useScheduleStore} from "@/lib/store/useScheduleStore";
import {generateCalendar} from "@/utils/utils";
import {dayNames, monthNames} from "@/lib/store/calenderData";

interface AdminScheduleCalendarProps {
    initialSchedules: Schedules[];
}

export default function AdminScheduleCalendar({ initialSchedules }: AdminScheduleCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedules | null>(null);

    // 실시간 스케줄 데이터 상태
    const [schedules, setSchedules] = useState<Schedules[]>(initialSchedules);
    const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

    const reservationStatusMap = useScheduleStore((state) => state.reservationStatus);
    const setReservationStatus = useScheduleStore((state) => state.setReservationStatus);
    const bulkSetReservationStatus = useScheduleStore((state) => state.bulkSetReservationStatus);

    // 예약 상태 재계산 함수 - useCallback으로 메모이제이션
    const updateReservationStatusForSchedules = useCallback((scheduleList: Schedules[]) => {
        console.log('📊 예약 상태 재계산 시작, 스케줄 개수:', scheduleList.length);
        const map = new Map<string, boolean>();
        scheduleList.forEach((schedule) => {
            const date = schedule.schedule_date;
            const prev = map.get(date) ?? true;
            map.set(date, prev && schedule.is_open);
        });
        console.log('📊 예약 상태 맵 크기:', map.size);
        bulkSetReservationStatus(map);
    }, [bulkSetReservationStatus]);

    // Realtime 이벤트 처리 함수 - useCallback으로 메모이제이션
    const handleRealtimeChange = useCallback((payload: any) => {
        console.log('🔥 Realtime 이벤트 처리 함수 호출됨!');
        console.log('📡 전체 payload:', JSON.stringify(payload, null, 2));

        const { eventType, new: newRecord, old: oldRecord } = payload;

        setSchedules(prevSchedules => {
            console.log('🔄 이전 스케줄 개수:', prevSchedules.length);
            let updatedSchedules = [...prevSchedules];

            switch (eventType) {
                case 'INSERT':
                    console.log('➕ 새 스케줄 추가 처리 중:', newRecord);
                    // 중복 체크
                    const existingIndex = updatedSchedules.findIndex(s => s.id === newRecord.id);
                    if (existingIndex === -1) {
                        updatedSchedules.push(newRecord as Schedules);
                        console.log('✅ 새 스케줄 추가 완료');
                    } else {
                        console.log('⚠️ 이미 존재하는 스케줄');
                    }
                    break;

                case 'UPDATE':
                    console.log('✏️ 스케줄 수정 처리 중:', newRecord);
                    const updateIndex = updatedSchedules.findIndex(s => s.id === newRecord.id);
                    if (updateIndex !== -1) {
                        updatedSchedules[updateIndex] = newRecord as Schedules;
                        console.log('✅ 스케줄 수정 완료');
                    } else {
                        console.log('⚠️ 수정할 스케줄을 찾을 수 없음');
                    }
                    break;

                case 'DELETE':
                    console.log('🗑️ 스케줄 삭제 처리 중:', oldRecord);
                    const beforeCount = updatedSchedules.length;
                    updatedSchedules = updatedSchedules.filter(s => s.id !== oldRecord.id);
                    console.log(`✅ 스케줄 삭제 완료: ${beforeCount} → ${updatedSchedules.length}`);
                    break;

                default:
                    console.log('❓ 알 수 없는 이벤트 타입:', eventType);
            }

            console.log('🔄 업데이트된 스케줄 개수:', updatedSchedules.length);
            return updatedSchedules;
        });
    }, []);

    // Supabase Realtime 설정
    useEffect(() => {
        const supabase = createClient();

        // Realtime 구독 설정
        const channel = supabase
            .channel('schedules-changes-v2') // 채널명 변경으로 새로 연결
            .on(
                'postgres_changes',
                {
                    event: '*', // INSERT, UPDATE, DELETE 모든 이벤트
                    schema: 'public',
                    table: 'schedules'
                },
                (payload) => {
                    console.log('🎯 Realtime 이벤트 수신됨!', new Date().toLocaleTimeString());
                    console.log('📡 이벤트 데이터:', payload);
                    handleRealtimeChange(payload);
                }
            )
            .subscribe((status, err) => {
                console.log('📡 Realtime 구독 상태:', status);
                if (err) {
                    console.error('❌ Realtime 구독 오류:', err);
                    setRealtimeStatus('error');
                } else {
                    switch (status) {
                        case 'SUBSCRIBED':
                            setRealtimeStatus('connected');
                            console.log('✅ Realtime 연결 성공!');
                            break;
                        case 'CHANNEL_ERROR':
                        case 'TIMED_OUT':
                        case 'CLOSED':
                            setRealtimeStatus('error');
                            console.error('❌ Realtime 연결 실패:', status);
                            break;
                        default:
                            setRealtimeStatus('connecting');
                            console.log('⏳ Realtime 연결 중...', status);
                    }
                }
            });

        // 5초 후 연결 상태 재확인
        const statusCheckTimeout = setTimeout(() => {

            // 연결되지 않은 경우 재시도
            if (!supabase.realtime.isConnected()) {
                console.log('🔄 연결 재시도...');
                setRealtimeStatus('error');
            }
        }, 5000);

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            clearTimeout(statusCheckTimeout);
            supabase.removeChannel(channel);
        };
    }, []); // handleRealtimeChange 의존성 제거

    // schedules가 변경될 때만 예약 상태 재계산 (별도 useEffect)
    useEffect(() => {
        console.log('📊 schedules 변경됨, 예약 상태 재계산 시작');
        updateReservationStatusForSchedules(schedules);
    }, [schedules, updateReservationStatusForSchedules]);


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
        return schedules.filter((schedule) => schedule.schedule_date >= startDate && schedule.schedule_date <= endDate);
    };

    const currentMonthSchedules = useMemo(() => getCurrentMonthSchedules(), [currentDate, schedules]);

    const getSchedulesForDate = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return currentMonthSchedules.filter((schedule) => schedule.schedule_date === dateString);
    };

    const getReservationStatus = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const isOpen = reservationStatusMap.get(dateString);
        if (isOpen === undefined) return 'available';

        return isOpen ? 'available' : 'full';
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

    const days = generateCalendar(currentDate);

    const selectedDateSchedules = selectedDate ? currentMonthSchedules.filter(schedule => schedule.schedule_date === selectedDate) : [];

    const getSelectedDateReservationStatus = () => {
        if (!selectedDate) return 'available';
        const isOpen = reservationStatusMap.get(selectedDate);
        return isOpen === false ? 'full' : 'available';
    };

    // Realtime 상태 표시
    const getStatusColor = () => {
        switch (realtimeStatus) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500 animate-pulse';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (realtimeStatus) {
            case 'connected': return '실시간 연결됨';
            case 'connecting': return '연결 중...';
            case 'error': return '연결 오류';
            default: return '알 수 없음';
        }
    };

    return (
        <div className="p-6">
            {/* 디버깅 정보 패널 */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></span>
                            <span className="text-sm font-medium">{getStatusText()}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            전체 스케줄: {schedules.length}개 | 이번 달: {currentMonthSchedules.length}개
                        </div>
                    </div>

                </div>
            </div>

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
                                            <div key={schedule.id || idx} className="truncate">
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
