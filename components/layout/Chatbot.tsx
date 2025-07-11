'use client'
import React, { useState, useEffect, useCallback, memo } from 'react';
import {BubbleMessage, ChatbotButton, InquiryBubble} from "@/components/ui/ChatbotButton";

// 상수 분리
const BUBBLE_SHOW_DELAY = 3000;
const BUBBLE_AUTO_HIDE_DELAY = 5000;
const GREETING_REPEAT_DELAY = 10000; // 10초마다 인사 말풍선 반복

type InquiryType = '부품문의' | '출장문의' | '기술문의';
type ChatStep = 'greeting' | 'inquiry-type' | 'form' | 'success';

interface InquiryData {
    type: InquiryType | null;
    name: string;
    contact: string;
    equipment: string;
}

function Chatbot() {
    const [showBubble, setShowBubble] = useState(false);
    const [chatStep, setChatStep] = useState<ChatStep>('greeting');
    const [inquiryData, setInquiryData] = useState<InquiryData>({
        type: null,
        name: '',
        contact: '',
        equipment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [greetingTimer, setGreetingTimer] = useState<NodeJS.Timeout | null>(null);

    // useCallback으로 함수 메모이제이션
    const handleChatbotClick = useCallback(() => {
        if (!showBubble) {
            // 말풍선이 안 보이는 상태면 문의 시작
            setShowBubble(true);
            setChatStep('inquiry-type');
            // 인사 타이머 정리
            if (greetingTimer) {
                clearInterval(greetingTimer);
                setGreetingTimer(null);
            }
        } else {
            // 말풍선이 보이는 상태면 닫기
            setShowBubble(false);
            // 약간의 지연 후 상태 초기화 (애니메이션 고려)
            setTimeout(() => {
                setChatStep('greeting');
                setInquiryData({
                    type: null,
                    name: '',
                    contact: '',
                    equipment: ''
                });
                // 인사 타이머 재시작
                startGreetingTimer();
            }, 300);
        }
    }, [showBubble, greetingTimer]);

    const handleCloseBubble = useCallback(() => {
        setShowBubble(false);
        // 약간의 지연 후 상태 초기화 (애니메이션 고려)
        setTimeout(() => {
            setChatStep('greeting');
            setInquiryData({
                type: null,
                name: '',
                contact: '',
                equipment: ''
            });
            // 인사 타이머 재시작
            startGreetingTimer();
        }, 300);
    }, []);

    const handleInquiryTypeSelect = useCallback((type: InquiryType) => {
        setInquiryData(prev => ({ ...prev, type }));
        setChatStep('form');
    }, []);

    const handleInputChange = useCallback((field: keyof InquiryData, value: string) => {
        setInquiryData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!inquiryData.name.trim() || !inquiryData.contact.trim()) {
            alert('성함과 연락처는 필수 입력 항목입니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/inquiry/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inquiryData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setChatStep('success');
                setTimeout(() => {
                    handleCloseBubble();
                }, 3000);
            } else {
                throw new Error(result.error || '문의 접수에 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 접수 오류:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [inquiryData, handleCloseBubble]);

    // 인사 타이머 시작 함수
    const startGreetingTimer = useCallback(() => {
        // 기존 타이머 정리
        if (greetingTimer) {
            clearInterval(greetingTimer);
        }

        // 첫 번째 인사 (2초 후)
        const firstTimer = setTimeout(() => {
            if (chatStep === 'greeting' && !showBubble) {
                setShowBubble(true);
            }
        }, BUBBLE_SHOW_DELAY);

        // 반복 인사 타이머 (10초마다)
        const repeatTimer = setInterval(() => {
            if (chatStep === 'greeting' && !showBubble) {
                setShowBubble(true);
            }
        }, GREETING_REPEAT_DELAY);

        setGreetingTimer(repeatTimer);

        // 컴포넌트 언마운트 시 정리
        return () => {
            clearTimeout(firstTimer);
            clearInterval(repeatTimer);
        };
    }, [chatStep, showBubble, greetingTimer]);

    // 컴포넌트 마운트 시 인사 타이머 시작
    useEffect(() => {
        const cleanup = startGreetingTimer();
        return cleanup;
    }, []);

    // 말풍선 자동 숨김 타이머 (greeting 단계에서만)
    useEffect(() => {
        if (!showBubble || chatStep !== 'greeting') return;

        const hideTimer = setTimeout(() => {
            setShowBubble(false);
        }, BUBBLE_AUTO_HIDE_DELAY);

        return () => clearTimeout(hideTimer);
    }, [showBubble, chatStep]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (greetingTimer) {
                clearInterval(greetingTimer);
            }
        };
    }, [greetingTimer]);

    return (
        <div className="fixed bottom-5 md:bottom-10 right-5 md:right-8 z-10">
            {/* 말풍선 - 조건부 렌더링 최적화 */}
            {showBubble && (
                <>
                    {chatStep === 'greeting' ? (
                        <BubbleMessage onClose={handleCloseBubble} />
                    ) : (
                        <InquiryBubble
                            step={chatStep}
                            inquiryData={inquiryData}
                            onClose={handleCloseBubble}
                            onInquiryTypeSelect={handleInquiryTypeSelect}
                            onInputChange={handleInputChange}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </>
            )}

            {/* 챗봇 버튼 */}
            <ChatbotButton onClick={handleChatbotClick} />
        </div>
    );
}

export default memo(Chatbot);
