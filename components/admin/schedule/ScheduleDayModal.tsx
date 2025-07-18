'use client';

import React from 'react';
import { Schedules } from "@/utils/supabase/types";
import FormContainer, {FormState} from "@/components/ui/form";
import {deleteSchedule} from "@/app/(admin)/admin/schedule/actions";
import {formatScheduleDate} from "@/utils/utils";
import useAlert from "@/lib/notiflix/useAlert";
import {ERROR_CODES} from "@/utils/ErrorMessage";
import {useRouter} from "next/navigation";

interface ScheduleDayModalProps {
    date: string;
    schedules: Schedules[];
    onClose: () => void;
    onNewSchedule: () => void;
    onEditSchedule: (schedule: Schedules) => void;
}

export default function ScheduleDayModal({
                                             date,
                                             schedules,
                                             onClose,
                                             onNewSchedule,
                                             onEditSchedule,
                                         }: ScheduleDayModalProps) {


    const {notify } = useAlert();
    const router = useRouter();
    const handleDelete = (formState:FormState) => {
       if(formState.code===ERROR_CODES.SUCCESS){
           notify.success(formState.message);
           router.refresh()
       }else{
           notify.failure(formState.message);
       }
    };

    const handleBackdropClick=(e:React.MouseEvent<HTMLDivElement>)=>{
        if(e.target===e.currentTarget) onClose()
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={handleBackdropClick}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {formatScheduleDate(date)} 스케줄
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* 새 스케줄 등록 버튼 */}
                <div className="mb-4">
                    <button
                        onClick={onNewSchedule}
                        className="w-full font-jalnan bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        + 이 날짜에 새 스케줄 등록
                    </button>
                </div>

                {/* 스케줄 목록 */}
                {schedules.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-4">📅</div>
                        <p className="text-gray-500 text-lg mb-2">등록된 스케줄이 없습니다.</p>
                        <p className="text-gray-400 text-sm">위 버튼을 클릭하여 새 스케줄을 등록하세요.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className={`p-4 border-2 rounded-lg transition-all`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className="text-lg">📍</span>
                                            <span className="font-semibold text-gray-900 ml-2 text-lg">
                        {schedule.region}
                      </span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <span className="text-lg">👤</span>
                                            <span className="text-gray-700 ml-2 font-bold">
                        {schedule.driver_name}
                      </span>
                                        </div>
                                        {schedule.notes && (
                                            <div className="flex items-start mt-2">
                                                <span className="text-sm">📝</span>
                                                <div className="text-sm text-gray-600 ml-2">
                                                    {schedule.notes}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 액션 버튼들 */}
                                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => onEditSchedule(schedule)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        수정
                                    </button>
                                    <FormContainer action={deleteSchedule} onResult={handleDelete}>
                                        <input type="hidden" name="id" value={schedule.id} />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            삭제
                                        </button>
                                    </FormContainer>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
