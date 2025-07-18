'use client';

import React, {useEffect, useMemo, useState, useCallback, ReactElement} from 'react';
import { createClient } from '@/utils/supabase/client';

import ScheduleDayModal from './ScheduleDayModal';
import {Schedules} from "@/utils/supabase/types";
import ScheduleForm from "@/components/admin/schedule/ScheduleForm";
import {updateReservationStatus} from "@/app/(admin)/admin/schedule/actions";
import {useScheduleStore} from "@/lib/store/useScheduleStore";
import {generateCalendar} from "@/utils/utils";
import {dayNames, monthNames} from "@/lib/store/calenderData";
import { HiMiniXCircle } from "react-icons/hi2";
interface AdminScheduleCalendarProps {
    initialSchedules: Schedules[];
}

export default function AdminScheduleCalendar({ initialSchedules }: AdminScheduleCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [editingSchedule, setEditingSchedule] = useState<Schedules | null>(null);

    // 실시간 스케줄 데이터 상태
    const [schedules, setSchedules] = useState<Schedules[]>(initialSchedules);
    const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error' | 'disabled'>('disabled');

    // Hydration 문제 해결: 클라이언트에서만 실행되는 상태
    const [isClient, setIsClient] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // 폴링 모드 (Realtime 대체)
    const [usePolling, setUsePolling] = useState(false);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

    const reservationStatusMap = useScheduleStore((state) => state.reservationStatus);
    const setReservationStatus = useScheduleStore((state) => state.setReservationStatus);
    const bulkSetReservationStatus = useScheduleStore((state) => state.bulkSetReservationStatus);
    const showForm = useScheduleStore((state) => state.showForm);
    const setShowForm = useScheduleStore((state) => state.setShowForm);

    // 클라이언트 사이드 감지
    useEffect(() => {
        setIsClient(true);
        // 클라이언트에서 바로 폴링 시작 (Realtime 대신)
        setTimeout(() => {
            setUsePolling(true);
        }, 1000);
    }, []);

    // 캐싱 문제 해결을 위한 새로고침 함수
    const forceRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    // 날짜 문자열 생성 함수 - 일관성 있게 처리
    const createDateString = useCallback((year: number, month: number, day: number): string => {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }, []);

    // 예약 상태 재계산 함수
    const updateReservationStatusForSchedules = useCallback((scheduleList: Schedules[]) => {
        const map = new Map<string, boolean>();
        scheduleList.forEach((schedule) => {
            const date = schedule.schedule_date;
            const prev = map.get(date) ?? true;
            map.set(date, prev && schedule.is_open);
        });
        bulkSetReservationStatus(map);
    }, [bulkSetReservationStatus]);

    // 수동 새로고침 함수 (데이터 다시 가져오기)
    const manualRefresh = useCallback(async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('schedules')
                .select('*')
                .order('schedule_date', { ascending: true });

            if (error) {
                console.error('데이터 새로고침 실패:', error);
            } else {
                setSchedules(data || []);
                forceRefresh();
            }
        } catch (error) {
            console.error('수동 새로고침 오류:', error);
        }
    }, [forceRefresh]);

    // 폴링 시작/중지 함수
    const togglePolling = useCallback(() => {
        if (usePolling && pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
            setUsePolling(false);
        } else {
            const interval = setInterval(async () => {
                await manualRefresh();
            }, 5000); // 5초마다

            setPollingInterval(interval);
            setUsePolling(true);
        }
    }, [usePolling, pollingInterval, manualRefresh]);

    // Realtime 시도 (실패해도 상관없음)
    const tryRealtimeConnection = useCallback(() => {
        if (!isClient) return;

        const supabase = createClient();
        let channelRef: any = null;

        setRealtimeStatus('connecting');

        try {
            // Realtime 구독 설정
            const channel = supabase
                .channel(`schedules-changes-${Date.now()}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'schedules'
                    },
                    (payload) => {
                        // Realtime 성공 시 폴링 중지
                        if (usePolling) {
                            togglePolling();
                        }
                        // 데이터 새로고침
                        setTimeout(() => manualRefresh(), 100);
                    }
                )
                .subscribe((status, err) => {
                    if (err) {
                        setRealtimeStatus('error');
                    } else {
                        switch (status) {
                            case 'SUBSCRIBED':
                                setRealtimeStatus('connected');
                                // 폴링 중지 (Realtime 사용)
                                if (usePolling) {
                                    togglePolling();
                                }
                                break;
                            case 'CHANNEL_ERROR':
                            case 'TIMED_OUT':
                            case 'CLOSED':
                                setRealtimeStatus('error');
                                // 폴링이 꺼져있으면 시작
                                if (!usePolling) {
                                    setTimeout(() => togglePolling(), 1000);
                                }
                                break;
                            default:
                                setRealtimeStatus('connecting');
                        }
                    }
                });

            channelRef = channel;

            // 10초 후 연결 실패로 간주하고 폴링 시작
            setTimeout(() => {
                if (realtimeStatus !== 'connected' && !usePolling) {
                    setRealtimeStatus('error');
                    togglePolling();
                }
            }, 10000);

        } catch (error) {
            setRealtimeStatus('error');
            if (!usePolling) {
                togglePolling();
            }
        }

        // 정리 함수
        return () => {
            if (channelRef) {
                supabase.removeChannel(channelRef);
            }
        };
    }, [isClient, realtimeStatus, usePolling, togglePolling, manualRefresh]);

    // 클라이언트에서 Realtime 시도
    useEffect(() => {
        if (!isClient) return;

        const cleanup = tryRealtimeConnection();
        return cleanup;
    }, [isClient]);

    // 폴링 자동 시작
    useEffect(() => {
        if (isClient && usePolling && !pollingInterval) {
            togglePolling();
        }
    }, [isClient, usePolling]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    // schedules가 변경될 때마다 예약 상태 재계산
    useEffect(() => {
        updateReservationStatusForSchedules(schedules);
    }, [schedules, updateReservationStatusForSchedules]);

    // 캐싱 방지: getCurrentMonthSchedules 함수 수정
    const getCurrentMonthSchedules = useCallback(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;

        // 월말 날짜 계산 수정 - 마지막 날 포함되도록
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

        const filtered = schedules.filter((schedule) =>
            schedule.schedule_date >= startDate && schedule.schedule_date <= endDate
        );

        return filtered;
    }, [currentDate, schedules, refreshTrigger]);

    const currentMonthSchedules = useMemo(() =>
            getCurrentMonthSchedules(),
        [getCurrentMonthSchedules]
    );

    const toggleReservationStatus = async (day: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dateString = createDateString(year, month, day);

        const currentIsOpen = reservationStatusMap.get(dateString);
        if (currentIsOpen === undefined) return;

        const newIsOpen = !currentIsOpen;

        const { data, error } = await updateReservationStatus(dateString, newIsOpen);

        if (!error) {
            setReservationStatus(dateString, newIsOpen);
            // 상태 변경 후 새로고침
            setTimeout(() => manualRefresh(), 500);
        } else {
            console.error('업데이트 실패:', error.message);
        }
    };

    const getSchedulesForDate = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dateString = createDateString(year, month, day);

        return currentMonthSchedules.filter((schedule) => schedule.schedule_date === dateString);
    };

    const getReservationStatus = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dateString = createDateString(year, month, day);

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
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dateString = createDateString(year, month, day);

        setSelectedDate(dateString);
    };

    //새 스케줄 생성
    const handleNewSchedule = () => {
        if (!selectedDate) return;
        setEditingSchedule(null);
        setShowForm(true);
    };

    //스케줄 수정
    const handleEditSchedule = (schedule: Schedules) => {
        setEditingSchedule(schedule);
        setShowForm(true);
    };

    //스케줄 닫기
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSchedule(null);
        // 폼 닫을 때 수동 새로고침
        setTimeout(() => manualRefresh(), 500);
    };

    //날짜 모달닫기
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

    // 연결 상태 표시
    const getStatusColor = () => {
        if (usePolling) return 'bg-blue-500';
        switch (realtimeStatus) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500 animate-pulse';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        if (usePolling) return '폴링 모드';
        switch (realtimeStatus) {
            case 'connected': return '실시간 연결됨';
            case 'connecting': return '연결 중...';
            case 'error': return '연결 오류';
            default: return '알 수 없음';
        }
    };

    const handleBackdropClick=(e:React.MouseEvent<HTMLDivElement>)=>{
        if(e.target===e.currentTarget) setShowForm(false)
    }
    return (
        <div className="p-6">
            {/* 상태 표시 패널 */}
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

                    {/* 새로고침 버튼 */}
                    <button
                        onClick={manualRefresh}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        🔄 새로고침
                    </button>
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
                            key={`day-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}-${refreshTrigger}`}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingSchedule ? '스케줄 수정' : '새 스케줄 등록'}
                            </h3>
                            <button
                                onClick={handleCloseForm}
                                className="text-red-300 hover:text-red-500"
                            >
                                <HiMiniXCircle className={'w-10 h-10'}/>
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
