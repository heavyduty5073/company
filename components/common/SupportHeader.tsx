// src/components/support/NoticeHeader.tsx
import React from 'react';

interface NoticeHeaderProps {
    type: string;
}

const NoticeHeader: React.FC<NoticeHeaderProps> = ({ type }) => {
    // 타입에 따라 제목과 설명 설정
    let title = '';
    let description = '';

    switch (type) {
        case 'notice':
            title = '공지사항';
            description = '중요한 안내사항과 업데이트 소식을 확인하세요.';
            break;
        case 'faq':
            title = '자주 묻는 질문';
            description = '고객님들이 자주 문의하시는 질문들에 대한 답변입니다.';
            break;
        case 'qna':
            title = '문의하기';
            description = '궁금한 점이나 도움이 필요하신 사항을 문의해주세요.';
            break;
        default:
            title = '지원 센터';
            description = '도움이 필요하신가요? 필요한 정보를 찾아보세요.';
    }

    return (
        <div className="border rounded-lg border-black text-black p-12 mb-4">
            <h1 className="text-2xl font-jalnan mb-2">{title}</h1>
            <p className="text-black">{description}</p>
        </div>
    );
};

export default NoticeHeader;