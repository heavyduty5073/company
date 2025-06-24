// app/api/cron/daily-schedule/route.ts - 완전히 수정된 버전
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getKakaoWorkClient } from '@/utils/kakaowork';

export async function GET(request: NextRequest) {
    const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    const today = koreaTime.toISOString().split('T')[0];

    const authHeader = request.headers.get('authorization');

    try {
        // Vercel Cron 인증 활성화
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.error('인증 실패 - 권한 없는 접근');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();

        // 오늘의 스케줄 조회 (모든 필드 포함)
        const { data: todaySchedules, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('schedule_date', today)
            .order('region');

        if (error) {
            console.error('스케줄 조회 오류:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const kakaoWork = getKakaoWorkClient();

        if (todaySchedules && todaySchedules.length > 0) {
            console.log(`오늘 스케줄 ${todaySchedules.length}개 발견`);

            // 메모 포함한 스케줄 목록 생성
            const scheduleList = todaySchedules.map(schedule => {
                let scheduleText = `📍 ${schedule.region} - ${schedule.driver_name}`;
                if (schedule.notes && schedule.notes.trim()) {
                    scheduleText += `\n   💬 ${schedule.notes}`;
                }
                return scheduleText;
            }).join('\n\n');

            // 간단한 텍스트 메시지로 먼저 테스트
            const simpleMessage = `🌅 오늘의 스케줄 안내\n\n📅 ${today}\n\n${scheduleList}\n\n📊 총 ${todaySchedules.length}개의 스케줄`;

            try {
                await kakaoWork.sendMessage(simpleMessage);

            } catch (kakaoError) {
                console.error('카카오워크 전송 실패:', kakaoError);
                throw kakaoError;
            }

            return NextResponse.json({
                success: true,
                message: `${todaySchedules.length}개의 스케줄 알림 전송 완료`,
                date: today,
                schedules: todaySchedules.map(s => ({
                    region: s.region,
                    driver: s.driver_name,
                    notes: s.notes || null
                }))
            });

        } else {
            //등록된 스케줄 없을 경우

            const noScheduleMessage = `📅 오늘의 스케줄\n\n${today}\n\n😴 오늘은 등록된 스케줄이 없습니다.`;

            try {
                await kakaoWork.sendMessage(noScheduleMessage);
            } catch (kakaoError) {
                console.error('카카오워크 전송 실패:', kakaoError);
                throw kakaoError;
            }

            return NextResponse.json({
                success: true,
                message: '오늘 스케줄이 없습니다.',
                date: today
            });
        }

    } catch (error: any) {
        console.error('일일 스케줄 알림 오류:', error);

        return NextResponse.json({
            error: 'Internal server error',
            message: error.message,
            date: today
        }, { status: 500 });
    }
}

// POST 메소드는 개발 테스트용
export async function POST(request: NextRequest) {

    // 개발환경에서는 인증 헤더 자동 추가
    const testRequest = new NextRequest(request.url, {
        method: 'GET',
        headers: {
            ...request.headers,
            'authorization': `Bearer ${process.env.CRON_SECRET}`
        }
    });

    return await GET(testRequest);
}
