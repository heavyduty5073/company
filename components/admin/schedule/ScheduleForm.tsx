'use client';

import React from 'react';
import { Schedules } from '@/utils/supabase/types';
import FormContainer from '@/components/ui/form';
import {ERROR_CODES} from "@/utils/ErrorMessage";
import {createSchedule, updateSchedule} from "@/app/(admin)/admin/schedule/actions";

interface ScheduleFormProps {
    schedule?: Schedules | null; // null도 허용
    defaultDate?: string | null; // null도 허용
    onSuccess?: () => void; // 성공 시 콜백
}

export default function ScheduleForm({ schedule, defaultDate, onSuccess }: ScheduleFormProps) {
    const isEditMode = !!schedule;

    return (
        <div className="max-w-md mx-auto">
            <FormContainer
                action={isEditMode ? updateSchedule : createSchedule}
                onResult={(result) => {
                    if (result.code && ERROR_CODES.SUCCESS && onSuccess) {
                        onSuccess();
                    }
                }}
            >
                {isEditMode && schedule && (
                    <input type="hidden" name="id" value={schedule.id} />
                )}

                <div className="space-y-5">
                    {/* 제목 */}
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isEditMode ? '📝 스케줄 수정' : '➕ 새 스케줄 등록'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            필수 정보를 입력하여 스케줄을 {isEditMode ? '수정' : '등록'}하세요
                        </p>
                    </div>

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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                            rows={4}
                            defaultValue={schedule?.notes || ''}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
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
                    </div>
                </div>
            </FormContainer>
        </div>
    );
}
