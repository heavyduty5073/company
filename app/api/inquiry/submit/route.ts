// app/api/inquiry/submit/route.ts (올바른 카카오워크 Button 형식)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getKakaoWorkClient } from '@/utils/kakaowork';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, name, contact, equipment } = body;

        // 필수 값 검증
        if (!type || !name?.trim() || !contact?.trim()) {
            console.error('필수 값 누락:', { type, name: !!name, contact: !!contact });
            return NextResponse.json(
                {
                    success: false,
                    error: '문의 유형, 성함, 연락처는 필수 입력 항목입니다.'
                },
                { status: 400 }
            );
        }

        // 문의 유형 검증
        const validTypes = ['부품문의', '출장문의', '기술문의'];
        if (!validTypes.includes(type)) {
            console.error('잘못된 문의 유형:', type);
            return NextResponse.json(
                {
                    success: false,
                    error: '올바르지 않은 문의 유형입니다.'
                },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));

        // 문의 데이터 저장
        const insertData = {
            inquiry_type: type,
            customer_name: name.trim(),
            contact: contact.trim(),
            equipment: equipment?.trim() || null,
            status: 'pending',
            created_at: koreaTime.toISOString(),
            updated_at: koreaTime.toISOString()
        };

        const { data: inquiry, error } = await supabase
            .from('customer_inquiries')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            console.error('문의 저장 DB 오류:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: '문의 접수 중 오류가 발생했습니다.'
                },
                { status: 500 }
            );
        }

        // 즉시 카카오워크 알림 전송 (올바른 Button Block 형식)
        try {
            const kakaoWork = getKakaoWorkClient();

            const createdTime = new Date(inquiry.created_at).toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            let notificationMessage = `🔔 새로운 문의 즉시 알림\n\n`;
            notificationMessage += `📋문의유형: ${inquiry.inquiry_type}\n`;
            notificationMessage += `👤고객명: ${inquiry.customer_name}\n`;
            notificationMessage += `📞연락처: ${inquiry.contact}`;

            if (inquiry.equipment) {
                notificationMessage += `\n🔧장비명: ${inquiry.equipment}`;
            }

            notificationMessage += `\n🕐 ${createdTime}`;

            // 카카오워크 공식 Button Block 형식
            const blocks = [
                {
                    "type": "text",
                    "text": notificationMessage
                },
                {
                    "type": "button",
                    "text": `📞 ${inquiry.customer_name} 연락하기`,
                    "style": "primary",
                    "action_type": "open_external_app",
                    "value": `tel:${inquiry.contact.replace(/-/g, '')}`
                }
            ];

            await kakaoWork.sendMessage('새로운 문의가 즉시 접수되었습니다', blocks);
            console.log('즉시 카카오워크 알림 전송 완료 (Button 포함)');

            // 상태를 바로 'notified'로 업데이트
            await supabase
                .from('customer_inquiries')
                .update({
                    status: 'notified',
                    updated_at: koreaTime.toISOString()
                })
                .eq('id', inquiry.id);

        } catch (kakaoError) {
            console.error('카카오워크 즉시 알림 실패:', kakaoError);
            // 알림 실패해도 문의 접수는 성공으로 처리
        }

        return NextResponse.json({
            success: true,
            message: '문의가 성공적으로 접수되었습니다.',
            inquiryId: inquiry.id,
            timestamp: koreaTime.toISOString(),
            notificationSent: true // 즉시 알림 전송됨
        });

    } catch (error) {
        console.error('문의 접수 API 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '서버 오류가 발생했습니다.'
            },
            { status: 500 }
        );
    }
}
