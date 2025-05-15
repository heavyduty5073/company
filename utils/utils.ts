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