'use client'
import React, { useState, useEffect } from 'react';

interface TypingTextProps {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delayBetweenTexts?: number;
    className?: string;
}

export default function TypingText({
                                       texts,
                                       typingSpeed = 150,
                                       deletingSpeed = 50,
                                       delayBetweenTexts = 1000,
                                       className = '',
                                   }: TypingTextProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    // 텍스트 타이핑 효과
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isDeleting) {
            // 글자 지우기
            if (currentText.length > 0) {
                timer = setTimeout(() => {
                    setCurrentText(prev => prev.slice(0, -1));
                }, deletingSpeed);
            } else {
                // 모든 글자가 지워졌으면 다음 텍스트로 넘어가기
                setIsDeleting(false);
                setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
                timer = setTimeout(() => {}, delayBetweenTexts / 2);
            }
        } else {
            // 현재 텍스트 완성
            const fullText = texts[currentTextIndex];
            if (currentText.length < fullText.length) {
                timer = setTimeout(() => {
                    setCurrentText(fullText.slice(0, currentText.length + 1));
                }, typingSpeed);
            } else {
                // 텍스트를 다 썼으면 잠시 대기 후 지우기 시작
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, delayBetweenTexts);
            }
        }

        return () => clearTimeout(timer);
    }, [currentText, currentTextIndex, delayBetweenTexts, deletingSpeed, isDeleting, texts, typingSpeed]);

    // 커서 깜빡임 효과
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setCursorVisible(prev => !prev);
        }, 530); // 약간 빠른 깜빡임

        return () => clearInterval(cursorInterval);
    }, []);

    const renderTextWithLineBreaks = (text: string) => {
        return text.split('\n').map((line, index, array) => (
            <React.Fragment key={index}>
                {line}
                {index < array.length - 1 && <br />}
            </React.Fragment>
        ));
    };
    return (
        <div className={`leading-tight translate-y-20 ${className}`}>
            <span className="inline-block">
                {renderTextWithLineBreaks(currentText)}
                <span
                    className={`inline-block w-1 h-4 lg:h-8 xl:h-10 ml-1 bg-white ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transition: 'opacity 0.1s' }}
                ></span>
            </span>
        </div>
    );
}