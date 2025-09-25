// 날짜 문자열을 Date 객체로 변환하는 유틸리티 함수들

/**
 * "2025년 11월 16일" 형식의 날짜 문자열을 Date 객체로 변환
 */
export function parseKoreanDate(dateStr: string): Date | null {
  const match = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!match) return null;
  
  const [, year, month, day] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * "09:55 - 10:40" 형식의 시간 문자열을 파싱하여 시작/종료 시간을 반환
 */
export function parseTimeRange(timeStr: string): { startTime: { hour: number; minute: number } | null; endTime: { hour: number; minute: number } | null } {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return { startTime: null, endTime: null };
  
  const [, startHour, startMinute, endHour, endMinute] = match;
  return {
    startTime: { hour: parseInt(startHour), minute: parseInt(startMinute) },
    endTime: { hour: parseInt(endHour), minute: parseInt(endMinute) }
  };
}

/**
 * 날짜와 시간을 결합하여 완전한 Date 객체 생성
 */
export function combineDateAndTime(date: Date, time: { hour: number; minute: number }): Date {
  const combined = new Date(date);
  combined.setHours(time.hour, time.minute, 0, 0);
  return combined;
}

/**
 * 수업 상태를 계산하는 함수
 */
export function calculateClassStatus(dateStr: string, timeStr: string): "upcoming" | "ongoing" | "completed" {
  const classDate = parseKoreanDate(dateStr);
  if (!classDate) return "upcoming";
  
  const { startTime, endTime } = parseTimeRange(timeStr);
  if (!startTime || !endTime) return "upcoming";
  
  const now = new Date();
  const classStart = combineDateAndTime(classDate, startTime);
  const classEnd = combineDateAndTime(classDate, endTime);
  
  if (now < classStart) {
    return "upcoming";
  } else if (now >= classStart && now <= classEnd) {
    return "ongoing";
  } else {
    return "completed";
  }
}

/**
 * 날짜 문자열을 정렬 가능한 형태로 변환 (YYYY-MM-DD)
 */
export function formatDateForSorting(dateStr: string): string {
  const date = parseKoreanDate(dateStr);
  if (!date) return dateStr;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 날짜 필터링을 위한 비교 함수
 */
export function isDateInRange(dateStr: string, startDate?: string, endDate?: string): boolean {
  if (!startDate && !endDate) return true;
  
  const sortableDate = formatDateForSorting(dateStr);
  
  if (startDate && sortableDate < startDate) {
    return false;
  }
  
  if (endDate && sortableDate > endDate) {
    return false;
  }
  
  return true;
}