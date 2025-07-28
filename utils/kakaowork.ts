// utils/kakaowork.ts - 수정된 카카오워크 유틸리티
export interface KakaoWorkMessage {
    conversation_id: string;
    text: string;
    blocks?: any[];
}

export class KakaoWorkClient {
    private botToken: string;
    private conversationId: string;

    constructor(botToken: string, conversationId: string) {
        this.botToken = botToken;
        this.conversationId = conversationId;
    }

    async sendMessage(text: string, blocks?: any[]) {
        try {
            const messageData: KakaoWorkMessage = {
                conversation_id: this.conversationId,
                text: text,
                ...(blocks && { blocks: blocks })
            };

            const response = await fetch('https://api.kakaowork.com/v1/messages.send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.botToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`카카오워크 API 오류: ${response.status} - ${errorData}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('카카오워크 메시지 전송 실패:', error);
            throw error;
        }
    }

    // 스케줄 등록 알림 메시지 생성 (올바른 블록 형식)
    createScheduleCreatedMessage(scheduleData: any) {
        return {
            text: `📅 새 스케줄이 등록되었습니다!\n날짜: ${scheduleData.schedule_date}\n지역: ${scheduleData.region}\n기사: ${scheduleData.driver_name}`,
            blocks: [
                {
                    "type": "text",
                    "text": "📅 **새 스케줄이 등록되었습니다!**",
                    "inlines": [
                        {
                            "type": "styled",
                            "text": "📅 ",
                        },
                        {
                            "type": "styled",
                            "text": "새 스케줄이 등록되었습니다!",
                            "bold": true,
                            "color": "blue"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `📅 **날짜:** ${scheduleData.schedule_date}\n📍 **지역:** ${scheduleData.region}\n👤 **기사:** ${scheduleData.driver_name}\n📝 **메모:** ${scheduleData.notes || '없음'}`,
                    "inlines": [
                        {
                            "type": "styled",
                            "text": "📅 "
                        },
                        {
                            "type": "styled",
                            "text": "날짜: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.schedule_date}\n`
                        },
                        {
                            "type": "styled",
                            "text": "📍 "
                        },
                        {
                            "type": "styled",
                            "text": "지역: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.region}\n`
                        },
                        {
                            "type": "styled",
                            "text": "👤 "
                        },
                        {
                            "type": "styled",
                            "text": "기사: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.driver_name}\n`
                        },
                        {
                            "type": "styled",
                            "text": "📝 "
                        },
                        {
                            "type": "styled",
                            "text": "메모: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.notes || '없음'}`
                        }
                    ]
                },
                {
                    "type": "divider"
                },
            ]
        };
    }

    // 스케줄 수정 알림 메시지 생성
    createScheduleUpdatedMessage(scheduleData: any) {
        return {
            text: `📅 스케줄이 수정되었습니다!\n날짜: ${scheduleData.schedule_date}\n지역: ${scheduleData.region}\n기사: ${scheduleData.driver_name}`,
            blocks: [
                {
                    "type": "text",
                    "text": "📅 **스케줄이 수정되었습니다!**",
                    "inlines": [
                        {
                            "type": "styled",
                            "text": "📅 ",
                        },
                        {
                            "type": "styled",
                            "text": "스케줄이 수정되었습니다!",
                            "bold": true,
                            "color": "blue"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `📅 **날짜:** ${scheduleData.schedule_date}\n📍 **지역:** ${scheduleData.region}\n👤 **기사:** ${scheduleData.driver_name}\n📝 **메모:** ${scheduleData.notes || '없음'}`,
                    "inlines": [
                        {
                            "type": "styled",
                            "text": "📅 "
                        },
                        {
                            "type": "styled",
                            "text": "날짜: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.schedule_date}\n`
                        },
                        {
                            "type": "styled",
                            "text": "📍 "
                        },
                        {
                            "type": "styled",
                            "text": "지역: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.region}\n`
                        },
                        {
                            "type": "styled",
                            "text": "👤 "
                        },
                        {
                            "type": "styled",
                            "text": "기사: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.driver_name}\n`
                        },
                        {
                            "type": "styled",
                            "text": "📝 "
                        },
                        {
                            "type": "styled",
                            "text": "메모: ",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `${scheduleData.notes || '없음'}`
                        }
                    ]
                },
                {
                    "type": "divider"
                },
            ]
        };
    }

    // 스케줄 삭제 알림 메시지 생성
    createScheduleDeletedMessage(scheduleData: any) {
        return {
            text: `🗑️ 스케줄이 삭제되었습니다\n삭제된 스케줄: ${scheduleData.schedule_date} - ${scheduleData.region} (${scheduleData.driver_name})`,
            blocks: [
                {
                    "type": "text",
                    "text": "🗑️ **스케줄이 삭제되었습니다**",
                    "inlines": [
                        {
                            "type": "styled",
                            "text": "🗑️ ",
                        },
                        {
                            "type": "styled",
                            "text": "스케줄이 삭제되었습니다",
                            "bold": true,
                            "color": "red"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "text",
                    "text": `**삭제된 스케줄:**\n📅 ${scheduleData.schedule_date} - ${scheduleData.region} (${scheduleData.driver_name})`,
                    "inlines": [
                        {
                            "type": "styled",
                            "text": "삭제된 스케줄:",
                            "bold": true
                        },
                        {
                            "type": "styled",
                            "text": `\n📅 ${scheduleData.schedule_date} - ${scheduleData.region} (${scheduleData.driver_name})`
                        }
                    ]
                }
            ]
        };
    }

    // 간단한 텍스트 메시지 (블록 없이)
    createSimpleMessage(text: string) {
        return {
            text: text,
            blocks: [] // 빈 블록 배열 또는 생략 가능
        };
    }
}

// 싱글톤 인스턴스 생성
export function getKakaoWorkClient() {
    const botToken = process.env.KAKAO_WORK_BOT_TOKEN;
    const conversationId = process.env.KAKAO_WORK_CONVERSATION_ID;

    if (!botToken || !conversationId) {
        throw new Error('카카오워크 설정이 누락되었습니다. 환경변수를 확인해주세요.');
    }

    return new KakaoWorkClient(botToken, conversationId);
}

// 안전한 알림 전송 (실패해도 원본 기능에 영향 없음)
export async function sendScheduleNotification(type: 'created' | 'updated' | 'deleted', scheduleData: any) {
    try {
        const client = getKakaoWorkClient();

        let message;
        switch (type) {
            case 'created':
                message = client.createScheduleCreatedMessage(scheduleData);
                break;
            case 'updated':
                message = client.createScheduleUpdatedMessage(scheduleData);
                break;
            case 'deleted':
                message = client.createScheduleDeletedMessage(scheduleData);
                break;
            default:
                // 복잡한 블록 대신 간단한 텍스트로 전송
                message = client.createSimpleMessage(`스케줄 알림: ${type} - ${scheduleData.schedule_date}`);
        }

        await client.sendMessage(message.text, message.blocks);

    } catch (error) {
        console.error(`스케줄 ${type} 알림 전송 실패:`, error);

        // 블록 전송이 실패하면 단순 텍스트로 재시도
        try {
            const client = getKakaoWorkClient();
            const simpleText = `📅 스케줄 ${type === 'created' ? '등록' : type === 'updated' ? '수정' : '삭제'}: ${scheduleData.schedule_date} - ${scheduleData.region} (${scheduleData.driver_name})`;
            await client.sendMessage(simpleText);

        } catch (fallbackError) {
            console.error('간단 텍스트 알림도 실패:', fallbackError);
        }
    }
}
