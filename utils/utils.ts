// utils/format-date.ts

import {categoryMap, companyColorMap} from "@/lib/store/company";

/**
 * 날짜 문자열을 포맷팅하여 반환합니다.
 * @param dateString ISO 형식의 날짜 문자열 또는 Timestamp
 * @param options 날짜 포맷 옵션
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(
    dateString: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
): string {
    if (!dateString) return '날짜 정보 없음';

    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

        // 유효한 날짜인지 확인
        if (isNaN(date.getTime())) {
            return '유효하지 않은 날짜';
        }

        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    } catch (error) {
        console.error('Date formatting error:', error);
        return '날짜 포맷 오류';
    }
}
// HTML 콘텐츠에서 첫 번째 이미지 URL 추출 함수
export const extractFirstImage = (htmlContent: string): string | null => {
    if (!htmlContent) return null;

    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = htmlContent.match(imgRegex);

    return match ? match[1] : null;
};
export const getCompanyStyle = (company: string | null | undefined) => {
    if (!company) return companyColorMap['default'];
    return companyColorMap[company] || companyColorMap['default'];
};

// 카테고리 스타일 가져오기 함수 수정
export const getCategoryStyle = (category: string | null | undefined) => {
    if (!category) return { name: '기타', bgColor: 'bg-gray-500', textColor: 'text-white' };
    return categoryMap[category] || { name: category, bgColor: 'bg-gray-500', textColor: 'text-white' };
};

// 날짜 포멧함수
export const formatDateString = (dateString: string | null) => {
    if (!dateString) return '-';
    return formatDate(new Date(dateString));
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export function formatYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * 날짜를 YYYY-MM-DD HH:MM 형식으로 포맷팅
 */
export function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 숫자에 천 단위 쉼표 추가
 */
export function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 타임스탬프를 날짜로 변환하는 함수**/
export const formatRelativeDate = (dateValue: string | number) => {
    const timestamp = typeof dateValue === 'string' ? Number(dateValue) : dateValue;
    const date = new Date(timestamp);
    const now = new Date();

    if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
    }

    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 오늘
    if (date.toDateString() === now.toDateString()) {
        return '오늘';
    }

    // 어제
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return '어제';
    }

    // 7일 이내
    if (diffDays < 7) {
        return `${diffDays}일 전`;
    }

    // 30일 이내
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}주 전`;
    }

    // 그 외에는 날짜 표시
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

export function parseAttachments(attachments: any): any[] {
    if (!attachments) return [];
    if (Array.isArray(attachments)) return attachments;

    try {
        if (typeof attachments === 'string') {
            const parsed = JSON.parse(attachments);
            return Array.isArray(parsed) ? parsed : [];
        }
        return [];
    } catch (error) {
        console.error('첨부파일 파싱 실패:', error);
        return [];
    }
}

export const formatScheduleDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
};
