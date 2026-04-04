import type { ExerciseLog } from '@/types/exercise';

/** 오늘 날짜를 YYYY-MM-DD 형식으로 반환 */
export function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/** 특정 날짜의 기록만 필터링 */
export function filterLogsByDate(logs: ExerciseLog[], date: string): ExerciseLog[] {
  return logs.filter((log) => log.date === date);
}

/** 고유 날짜 목록을 최신순(내림차순)으로 정렬하여 반환 */
export function getUniqueDatesDescending(logs: ExerciseLog[]): string[] {
  const dates = [...new Set(logs.map((log) => log.date))];
  return dates.sort((a, b) => b.localeCompare(a));
}
