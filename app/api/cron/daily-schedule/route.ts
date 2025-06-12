import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getKakaoWorkClient } from '@/utils/kakaowork';

export async function GET(request: NextRequest) {
    const today = new Date().toISOString().split('T')[0];
    try {
        // Vercel Cron 인증 (선택사항)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();

        // 오늘의 스케줄 조회
        const { data: todaySchedules, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('schedule_date', today)
            .order('region');

        if (error) {
            console.error('스케줄 조회 오류:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (todaySchedules && todaySchedules.length > 0) {
            const kakaoWork = getKakaoWorkClient();

            const scheduleList = todaySchedules.map(schedule =>
                `• ${schedule.region} - ${schedule.driver_name}`
            ).join('\n');

            // ✅ 테스트된 간단한 블록 형식 (inlines 없이)
            const blocks = [
                {
                    "type": "text",
                    "text": "🌅 오늘의 스케줄 안내 (오전 8:30)"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `${today} 스케줄 현황`
                },
                {
                    "type": "text",
                    "text": scheduleList
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `총 ${todaySchedules.length}개의 스케줄이 있습니다.`
                }
            ];

            await kakaoWork.sendMessage('오늘의 스케줄을 확인하세요!', blocks);

            return NextResponse.json({
                success: true,
                message: `${todaySchedules.length}개의 스케줄 알림 전송 완료`,
                date: today
            });
        } else {
            const kakaoWork = getKakaoWorkClient();

            // 스케줄이 없을 때도 블록 형식
            const noScheduleBlocks = [
                {
                    "type": "text",
                    "text": "📅 오늘의 스케줄"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `${today}`
                },
                {
                    "type": "text",
                    "text": "오늘은 스케줄이 없습니다."
                }
            ];

            await kakaoWork.sendMessage('오늘 스케줄 확인', noScheduleBlocks);

            return NextResponse.json({
                success: true,
                message: '오늘 스케줄이 없습니다.',
                date: today
            });
        }

    } catch (error) {
        console.error('일일 스케줄 알림 오류:', error);

        // 블록 전송 실패 시 간단한 텍스트로 폴백
        try {
            const kakaoWork = getKakaoWorkClient();
            await kakaoWork.sendMessage(`🌅 오늘의 스케줄 안내\n${today}\n스케줄 조회 중 오류가 발생했습니다.`);
        } catch (fallbackError) {
            console.error('폴백 메시지도 실패:', fallbackError);
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
