'use client';

import React, {ReactElement} from 'react';
import { Schedules } from '@/utils/supabase/types';
import FormContainer from '@/components/ui/form';
import {ERROR_CODES} from "@/utils/ErrorMessage";
import {createSchedule, updateSchedule} from "@/app/(admin)/admin/schedule/actions";

interface ScheduleFormProps {
    schedule?: Schedules | null; // null도 허용
    defaultDate?: string | null; // null도 허용
    onSuccess?: () => void; // 성공 시 콜백
    onCancel?: () => void; // 취소 시 콜백 추가
    isDateFull: boolean;
}

export default function ScheduleForm({ schedule, defaultDate, onSuccess, onCancel,isDateFull }: ScheduleFormProps) {
    const isEditMode = !!schedule;



    return (
        <div className="max-w-xl mx-auto">
            <FormContainer
                action={isEditMode ? updateSchedule : createSchedule}
                onResult={(result) => {
                    // 수정: 조건문 오타 수정
                    if (result.code === ERROR_CODES.SUCCESS && onSuccess) {
                        onSuccess();
                    }
                }}
            >
                {isEditMode && schedule && (
                    <input type="hidden" name="id" value={schedule.id} />
                )}
                <input type="hidden" name="isDateFull" value={isDateFull.toString()} />
                <div className="space-y-5">

                    {/* 날짜 */}
                    <div>
                        <label htmlFor="schedule_date" className="block text-sm font-semibold text-gray-700 mb-2">
                            📅 날짜 *
                        </label>
                        <input
                            type="date"
                            name="schedule_date"
                            id="schedule_date"
                            required
                            defaultValue={schedule?.schedule_date || defaultDate || ''}
                            className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-400 focus:border-transparent"
                        />
                    </div>

                    {/* 지역 입력 */}
                    <div>
                        <label htmlFor="region" className="block text-sm font-semibold text-gray-700 mb-2">
                            📍 출장 지역 *
                        </label>
                        <input
                            type="text"
                            name="region"
                            id="region"
                            required
                            defaultValue={schedule?.region || ''}
                            placeholder="예: 서울, 부산, 대구, 인천..."
                            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* 기사명 입력 */}
                    <div>
                        <label htmlFor="driver_name" className="block text-sm font-semibold text-gray-700 mb-2">
                            👤 배정 기사 *
                        </label>
                        <input
                            type="text"
                            name="driver_name"
                            id="driver_name"
                            required
                            defaultValue={schedule?.driver_name || ''}
                            placeholder="예: 김기사, 이기사, 박기사..."
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* 메모 */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                            📝 관리자 메모
                        </label>
                        <textarea
                            name="notes"
                            id="notes"
                            rows={12}
                            defaultValue={schedule?.notes || ''}
                            className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                            placeholder="스케줄에 대한 메모사항을 입력하세요 (선택사항)&#10;예: 오전 10시 출발, 특이사항 있음"
                        />
                    </div>

                    {/* 버튼 */}
                    <div className="flex space-x-3 pt-6">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold transition-all transform hover:scale-105"
                        >
                            {isEditMode ? '✅ 수정 완료' : '➕ 등록하기'}
                        </button>

                        {/* 취소 버튼 추가 */}
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 font-semibold transition-all"
                            >
                                ❌ 취소
                            </button>
                        )}
                    </div>
                </div>
            </FormContainer>
        </div>
    );
}
