'use server'

import { createClient } from "@/utils/supabase/server";
import {FormState} from "@/components/ui/form";
import { ERROR_CODES } from "@/utils/ErrorMessage";
import {revalidatePath} from "next/cache";
import {Schedules} from "@/utils/supabase/types";

export async function getAllSchedules(): Promise<Schedules[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('schedule_date', { ascending: true });

    if (error) {
        console.error('Get schedules error:', error);
        return [];
    }

    return data || [];
}

// 특정 날짜 범위의 스케줄 조회
export async function getSchedulesByDateRange(startDate: string, endDate: string): Promise<Schedules[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .gte('schedule_date', startDate)
        .lte('schedule_date', endDate)
        .order('schedule_date', { ascending: true });

    if (error) {
        console.error('Get schedules by date range error:', error);
        return [];
    }

    return data || [];
}

// 예약 가능한 스케줄만 조회 (사용자용)
export async function getAvailableSchedules(region?: string): Promise<Schedules[]> {
    const supabase = await createClient();

    let query = supabase
        .from('schedules')
        .select('*')
        .eq('is_available', true)
        .gte('schedule_date', new Date().toISOString().split('T')[0])
        .order('schedule_date', { ascending: true });

    if (region) {
        query = query.eq('region', region);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Get available schedules error:', error);
        return [];
    }

    return data || [];
}

// 특정 스케줄 조회
export async function getScheduleById(id: string): Promise<Schedules | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Get schedule by id error:', error);
        return null;
    }

    return data;
}

// 지역 목록 조회 (등록된 스케줄에서 추출)
export async function getRegions(): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('schedules')
        .select('region')
        .order('region', { ascending: true });

    if (error) {
        console.error('Get regions error:', error);
        return [];
    }

    // 중복 제거
    const uniqueRegions = [...new Set(data?.map(item => item.region) || [])];
    return uniqueRegions;
}

// 기사 목록 조회 (등록된 스케줄에서 추출)
export async function getDrivers(): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('schedules')
        .select('driver_name')
        .order('driver_name', { ascending: true });

    if (error) {
        console.error('Get drivers error:', error);
        return [];
    }

    // 중복 제거
    const uniqueDrivers = [...new Set(data?.map(item => item.driver_name) || [])];
    return uniqueDrivers;
}

// 달력용 스케줄 데이터 조회
export async function getSchedulesForCalendar(year: number, month: number): Promise<Schedules[]> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // 해당 월의 마지막 날

    return getSchedulesByDateRange(startDate, endDate);
}
export async function updateReservationStatus(date: string, isOpen: boolean) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('schedules')
        .update({ is_open: isOpen })
        .eq('schedule_date', date)
        .select();

    if (error) {
        console.error('예약 상태 업데이트 실패:', error.message);
    }

    return { data, error };
}
export async function createSchedule(formData: FormData): Promise<FormState> {
    try {
        const supabase = await createClient();

        const isDateFull = formData.get('isDateFull') === 'true';

        const scheduleData = {
            schedule_date: formData.get('schedule_date') as string,
            region: formData.get('region') as string,
            driver_name: formData.get('driver_name') as string,
            notes: formData.get('notes') as string || null,
            is_open:!isDateFull,
        };

        // 유효성 검사
        if (!scheduleData.schedule_date || !scheduleData.region || !scheduleData.driver_name) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: '날짜, 지역, 기사명은 필수 입력 항목입니다.',
            };
        }

        const { data, error } = await supabase
            .from('schedules')
            .insert([scheduleData])
            .select()
            .single();

        if (error) {
            console.error('Schedule creation error:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '스케줄 생성 중 오류가 발생했습니다.',
            };
        }

        revalidatePath('/admin/schedule');
        return {
            code: ERROR_CODES.SUCCESS,
            message: '스케줄이 성공적으로 생성되었습니다.',
            data: data,
        };
    } catch (error) {
        console.error('Create schedule error:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        };
    }
}

// 스케줄 업데이트
export async function updateSchedule(formData: FormData): Promise<FormState> {
    try {
        const supabase = await createClient();

        const id = formData.get('id') as string;
        const scheduleData = {
            schedule_date: formData.get('schedule_date') as string,
            region: formData.get('region') as string,
            driver_name: formData.get('driver_name') as string,
            notes: formData.get('notes') as string || null,
            updated_at: new Date().toISOString(),
        };

        if (!id) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: '수정할 스케줄 ID가 필요합니다.',
            };
        }

        // 유효성 검사
        if (!scheduleData.schedule_date || !scheduleData.region || !scheduleData.driver_name) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: '날짜, 지역, 기사명은 필수 입력 항목입니다.',
            };
        }

        const { data, error } = await supabase
            .from('schedules')
            .update(scheduleData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Schedule update error:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '스케줄 수정 중 오류가 발생했습니다.',
            };
        }

        revalidatePath('/admin/schedule');
        return {
            code: ERROR_CODES.SUCCESS,
            message: '스케줄이 성공적으로 수정되었습니다.',
            data: data,
        };
    } catch (error) {
        console.error('Update schedule error:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        };
    }
}

// 스케줄 삭제
export async function deleteSchedule(formData: FormData): Promise<FormState> {
    try {
        const supabase = await createClient();

        const id = formData.get('id') as string;

        if (!id) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: '삭제할 스케줄 ID가 필요합니다.',
            };
        }

        const { error } = await supabase
            .from('schedules')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Schedule delete error:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '스케줄 삭제 중 오류가 발생했습니다.',
            };
        }

        revalidatePath('/admin/schedule');
        return {
            code: ERROR_CODES.SUCCESS,
            message: '스케줄이 성공적으로 삭제되었습니다.',
        };
    } catch (error) {
        console.error('Delete schedule error:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        };
    }
}

// 스케줄 가용성 토글
export async function toggleScheduleAvailability(formData: FormData): Promise<FormState> {
    try {
        const supabase = await createClient();

        const id = formData.get('id') as string;
        const isAvailable = formData.get('is_available') === 'true';

        if (!id) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: '스케줄 ID가 필요합니다.',
            };
        }

        const { data, error } = await supabase
            .from('schedules')
            .update({
                is_available: isAvailable,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Toggle availability error:', error);
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '상태 변경 중 오류가 발생했습니다.',
            };
        }

        revalidatePath('/admin/schedule');
        return {
            code: ERROR_CODES.SUCCESS,
            message: `스케줄이 ${isAvailable ? '활성화' : '비활성화'}되었습니다.`,
            data: data,
        };
    } catch (error) {
        console.error('Toggle availability error:', error);
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        };
    }
}
