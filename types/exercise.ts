/** 개별 세트 정보 */
export interface ExerciseSet {
  reps: number;    // 반복 횟수 (양의 정수)
  weight: number;  // 무게 (kg, 0 이상. 0은 맨몸 운동)
}

/** 개별 운동 기록 */
export interface ExerciseLog {
  id: string;              // 고유 식별자 (UUID v4)
  exerciseName: string;    // 운동 이름
  date: string;            // 날짜 (YYYY-MM-DD 형식)
  sets: ExerciseSet[];     // 세트 배열 (최소 1개)
}

/** 앱 전체 상태 */
export interface ExerciseLogState {
  logs: ExerciseLog[];
  exercises: string[];
  isLoading: boolean;
  error: string | null;
}

/** Reducer 액션 타입 */
export type ExerciseLogAction =
  | { type: 'SET_LOGS'; payload: ExerciseLog[] }
  | { type: 'ADD_LOG'; payload: ExerciseLog }
  | { type: 'UPDATE_LOG'; payload: ExerciseLog }
  | { type: 'DELETE_LOG'; payload: string }
  | { type: 'SET_EXERCISES'; payload: string[] }
  | { type: 'ADD_EXERCISE'; payload: string }
  | { type: 'DELETE_EXERCISE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

/** 유효성 검사 결과 */
export interface ValidationResult {
  isValid: boolean;
  errors: {
    exerciseName?: string;
    sets?: Array<{ reps?: string; weight?: string }>;
  };
}
