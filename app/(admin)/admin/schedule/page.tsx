import React from 'react';
import AdminScheduleCalendar from "@/components/admin/schedule/ScheduleCalender";
import {getAllSchedules} from "@/app/(admin)/admin/schedule/actions";


async function Page() {
    const schedules = await getAllSchedules();

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">스케줄 관리</h1>
                <p className="text-gray-600">달력에서 날짜를 선택하여 스케줄을 등록하거나 수정하세요.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <AdminScheduleCalendar initialSchedules={schedules} />
            </div>
        </div>
    );
}

export default Page;
