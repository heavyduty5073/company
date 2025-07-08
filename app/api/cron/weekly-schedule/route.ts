// weekly-schedule/route.ts (네트워크 재시도 및 오류 처리 개선)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getKakaoWorkClient } from '@/utils/kakaowork';

// 재시도 유틸리티 함수
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }

            const delay = baseDelay * Math.pow(2, attempt - 1); // 지수 백오프
            console.log(`재시도 ${attempt}/${maxRetries} - ${delay}ms 후 재시도`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('재시도 실패');
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    try {
        // Vercel Cron 인증
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 한국 시간 기준으로 현재 시간 확인
        const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
        const currentDay = koreaTime.getDay(); // 0: 일요일, 1: 월요일, ...

        console.log(`현재 한국 시간: ${koreaTime.toISOString()}, 요일: ${currentDay}`);

        // 월요일(1)이 아닌 경우 실행하지 않음
        if (currentDay !== 1) {
            return NextResponse.json({
                success: false,
                message: `월요일이 아님 (현재: ${currentDay}). 주간 알림은 월요일에만 발송됩니다.`,
                koreaTime: koreaTime.toISOString()
            });
        }

        const supabase = await createClient();

        // 이번 주 일요일부터 토요일까지 (한국 시간 기준)
        const startOfWeek = new Date(koreaTime);
        startOfWeek.setDate(koreaTime.getDate() - koreaTime.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = endOfWeek.toISOString().split('T')[0];

        console.log(`주간 스케줄 조회: ${startDate} ~ ${endDate}`);

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

        const kakaoWork = getKakaoWorkClient();

        if (weekSchedules && weekSchedules.length > 0) {
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
                    "text": "📋 이번 주 스케줄 요약"
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

            // 재시도 로직으로 메시지 전송
            await retryWithBackoff(async () => {
                return kakaoWork.sendMessage('이번 주 스케줄을 확인하세요!', blocks);
            });

            return NextResponse.json({
                success: true,
                message: `주간 스케줄 요약 전송 완료 (${weekSchedules.length}건)`,
                period: `${startDate} ~ ${endDate}`,
                serverTime: new Date().toISOString(),
                koreaTime: koreaTime.toISOString()
            });
        } else {
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

            // 재시도 로직으로 메시지 전송
            await retryWithBackoff(async () => {
                return kakaoWork.sendMessage('이번 주 스케줄 확인', noScheduleBlocks);
            });

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

        // 에러 발생 시 알림을 보내지 않고 로그만 남김
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : '알 수 없는 오류'
        }, { status: 500 });
    }
}
