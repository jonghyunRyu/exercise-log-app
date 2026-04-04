import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExerciseLog } from '@/types/exercise';

const LOGS_KEY = 'exercise_logs';
const EXERCISES_KEY = 'custom_exercises';

/** 운동 기록 로드 (역직렬화) */
export async function loadLogs(): Promise<ExerciseLog[]> {
  const json = await AsyncStorage.getItem(LOGS_KEY);
  if (!json) return [];
  return JSON.parse(json) as ExerciseLog[];
}

/** 운동 기록 저장 (직렬화) */
export async function saveLogs(logs: ExerciseLog[]): Promise<void> {
  await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

/** 사용자 정의 운동 목록 로드 */
export async function loadExercises(): Promise<string[]> {
  const json = await AsyncStorage.getItem(EXERCISES_KEY);
  if (!json) return [];
  return JSON.parse(json) as string[];
}

/** 사용자 정의 운동 목록 저장 */
export async function saveExercises(exercises: string[]): Promise<void> {
  await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
}
