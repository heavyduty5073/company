// utils/format-date.ts

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