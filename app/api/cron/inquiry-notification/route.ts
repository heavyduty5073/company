// app/api/cron/inquiry-notification/route.ts (올바른 카카오워크 Button 형식)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getKakaoWorkClient } from '@/utils/kakaowork';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));

    try {
        // Vercel Cron 인증
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.error('인증 실패 - 권한 없는 접근');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();

        console.log(`문의 알림 cron 실행: ${koreaTime.toISOString()}`);

        // 지난 8시간 동안의 새로운 문의 조회 (하루 3번 실행이므로)
        const eightHoursAgo = new Date(koreaTime.getTime() - 8 * 60 * 60 * 1000);

        const { data: newInquiries, error } = await supabase
            .from('customer_inquiries')
            .select('*')
            .eq('status', 'pending')
            .gte('created_at', eightHoursAgo.toISOString())
            .order('created_at', { ascending: false });

        if (error) {
            console.error('문의 조회 오류:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const kakaoWork = getKakaoWorkClient();

        if (newInquiries && newInquiries.length > 0) {
            console.log(`새로운 문의 ${newInquiries.length}건 발견`);

            // 문의 목록 생성
            const inquiryList = newInquiries.map(inquiry => {
                const createdTime = new Date(inquiry.created_at).toLocaleString('ko-KR', {
                    timeZone: 'Asia/Seoul',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                let inquiryText = `📋 ${inquiry.inquiry_type}\n`;
                inquiryText += `👤 ${inquiry.customer_name}\n`;
                inquiryText += `📞 ${inquiry.contact}`;

                if (inquiry.equipment) {
                    inquiryText += `\n🔧 ${inquiry.equipment}`;
                }

                inquiryText += `\n🕐 ${createdTime}`;

                return inquiryText;
            }).join('\n\n' + '─'.repeat(30) + '\n\n');

            const message = `🚨 새로운 고객 문의 알림\n\n📅 ${koreaTime.toLocaleDateString('ko-KR')}\n\n${inquiryList}\n\n📊 총 ${newInquiries.length}건의 새로운 문의`;

            // 카카오워크 공식 Button Block 형식으로 버튼 생성
            const buttons = newInquiries.map(inquiry => ({
                "type": "button",
                "text": `📞 ${inquiry.customer_name} 연락하기`,
                "style": "primary",
                "action_type": "open_external_app",
                "value": `tel:${inquiry.contact.replace(/-/g, '')}`
            }));

            const blocks = [
                {
                    "type": "text",
                    "text": message
                },
                ...buttons  // 각 버튼을 개별 블록으로 추가
            ];

            // 카카오워크 메시지 전송 (올바른 블록 형식)
            try {
                await kakaoWork.sendMessage('새로운 고객 문의 알림', blocks);
                console.log(`카카오워크 알림 전송 완료: ${newInquiries.length}건`);
            } catch (kakaoError) {
                console.error('카카오워크 전송 실패:', kakaoError);
                throw kakaoError;
            }

            // 알림 발송된 문의들을 'notified' 상태로 업데이트
            const inquiryIds = newInquiries.map(inquiry => inquiry.id);
            const { error: updateError } = await supabase
                .from('customer_inquiries')
                .update({
                    status: 'notified',
                    updated_at: koreaTime.toISOString()
                })
                .in('id', inquiryIds);

            if (updateError) {
                console.error('상태 업데이트 오류:', updateError);
            } else {
                console.log(`${inquiryIds.length}건 문의 상태를 'notified'로 업데이트 완료`);
            }

            return NextResponse.json({
                success: true,
                message: `${newInquiries.length}건의 새로운 문의 알림 전송 완료`,
                inquiries: newInquiries.map(inquiry => ({
                    id: inquiry.id,
                    type: inquiry.inquiry_type,
                    customer: inquiry.customer_name,
                    contact: inquiry.contact,
                    equipment: inquiry.equipment,
                    createdAt: inquiry.created_at
                })),
                koreaTime: koreaTime.toISOString()
            });

        } else {
            console.log('새로운 문의가 없습니다.');

            return NextResponse.json({
                success: true,
                message: '새로운 문의가 없습니다.',
                count: 0,
                koreaTime: koreaTime.toISOString()
            });
        }

    } catch (error: any) {
        console.error('문의 알림 cron 오류:', error);

        return NextResponse.json({
            error: 'Internal server error',
            message: error.message,
            timestamp: koreaTime.toISOString()
        }, { status: 500 });
    }
}

// POST 메소드는 개발 테스트용
export async function POST(request: NextRequest) {
    console.log('테스트용 POST 요청 받음');

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
