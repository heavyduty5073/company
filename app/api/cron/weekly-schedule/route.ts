// weekly-schedule/route.ts (디버깅 로그 추가)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getKakaoWorkClient } from '@/utils/kakaowork';

export async function GET(request: NextRequest) {
    console.log('=== 주간 스케줄 디버깅 정보 ===');
    const authHeader = request.headers.get('authorization');
    console.log('받은 Authorization:', authHeader);
    console.log('환경변수 CRON_SECRET:', process.env.CRON_SECRET);
    console.log('예상 값:', `Bearer ${process.env.CRON_SECRET}`);
    console.log('일치 여부:', authHeader === `Bearer ${process.env.CRON_SECRET}`);

    try {
        // Vercel Cron 인증
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.log('❌ 인증 실패');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('✅ 인증 통과');

        const supabase = await createClient();

        // 🕘 한국 시간대로 이번 주 계산
        const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
        console.log('한국 시간:', koreaTime.toISOString());

        // 이번 주 일요일부터 토요일까지 (한국 시간 기준)
        const startOfWeek = new Date(koreaTime);
        startOfWeek.setDate(koreaTime.getDate() - koreaTime.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = endOfWeek.toISOString().split('T')[0];

        console.log('주간 기간:', `${startDate} ~ ${endDate}`);

        // 이번 주 스케줄 조회
        const { data: weekSchedules, error } = await supabase
            .from('schedules')
            .select('*')
            .gte('schedule_date', startDate)
            .lte('schedule_date', endDate)
            .order('schedule_date');

        if (error) {
            console.error('주간 스케줄 조회 오류:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('조회된 스케줄 수:', weekSchedules?.length || 0);

        if (weekSchedules && weekSchedules.length > 0) {
            const kakaoWork = getKakaoWorkClient();

            // 날짜별로 그룹화
            const schedulesByDate = weekSchedules.reduce((acc, schedule) => {
                const date = schedule.schedule_date;
                if (!acc[date]) acc[date] = [];
                acc[date].push(schedule);
                return acc;
            }, {} as Record<string, any[]>);

            // 날짜별 상세 스케줄 생성 (한국 시간대 기준)
            const dateDetailList = Object.keys(schedulesByDate).sort().map(date => {
                const daySchedules = schedulesByDate[date];
                const dayName = new Date(date + 'T12:00:00').toLocaleDateString('ko-KR', {
                    weekday: 'short',
                    timeZone: 'Asia/Seoul'
                });
                const scheduleDetails = daySchedules.map(schedule =>
                    `    - ${schedule.region} (${schedule.driver_name})`
                ).join('\n');

                return `${date} (${dayName}) - ${daySchedules.length}건\n${scheduleDetails}`;
            }).join('\n\n');

            const blocks = [
                {
                    "type": "text",
                    "text": "📋 이번 주 스케줄 요약 (월요일 오전 8:30)"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `${startDate} ~ ${endDate}`
                },
                {
                    "type": "text",
                    "text": dateDetailList
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `총 ${weekSchedules.length}개의 스케줄`
                }
            ];

            console.log('카카오워크 메시지 전송 시도...');
            await kakaoWork.sendMessage('이번 주 스케줄을 확인하세요!', blocks);
            console.log('✅ 메시지 전송 완료');

            return NextResponse.json({
                success: true,
                message: `주간 스케줄 요약 전송 완료 (${weekSchedules.length}건)`,
                period: `${startDate} ~ ${endDate}`,
                serverTime: new Date().toISOString(),
                koreaTime: koreaTime.toISOString()
            });
        } else {
            const kakaoWork = getKakaoWorkClient();

            // 스케줄이 없을 때도 블록 형식
            const noScheduleBlocks = [
                {
                    "type": "text",
                    "text": "📋 이번 주 스케줄"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `${startDate} ~ ${endDate}`
                },
                {
                    "type": "text",
                    "text": "이번 주는 스케줄이 없습니다."
                }
            ];

            console.log('스케줄 없음 - 카카오워크 메시지 전송 시도...');
            await kakaoWork.sendMessage('이번 주 스케줄 확인', noScheduleBlocks);
            console.log('✅ 스케줄 없음 메시지 전송 완료');

            return NextResponse.json({
                success: true,
                message: '이번 주 스케줄이 없습니다.',
                period: `${startDate} ~ ${endDate}`,
                serverTime: new Date().toISOString(),
                koreaTime: koreaTime.toISOString()
            });
        }

    } catch (error) {
        console.error('주간 스케줄 알림 오류:', error);

        // 블록 전송 실패 시 간단한 텍스트로 폴백
        try {
            const kakaoWork = getKakaoWorkClient();
            await kakaoWork.sendMessage(`📋 이번 주 스케줄 요약\n스케줄 조회 중 오류가 발생했습니다.`);
            console.log('폴백 메시지 전송 완료');
        } catch (fallbackError) {
            console.error('폴백 메시지도 실패:', fallbackError);
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
