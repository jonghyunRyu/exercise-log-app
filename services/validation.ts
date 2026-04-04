import type { ExerciseSet, ValidationResult } from '@/types/exercise';

/**
 * 운동 기록 저장 전 입력값을 검증한다.
 * - 운동 이름: 비어 있으면 안 됨
 * - 세트: 최소 1개 이상
 * - 반복 횟수: 양의 정수 (0 초과)
 * - 무게: 0 이상 (맨몸 운동은 0)
 */
export function validateExerciseLog(input: {
  exerciseName: string;
  sets: ExerciseSet[];
}): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  let isValid = true;

  // 운동 이름 검증
  if (!input.exerciseName || input.exerciseName.trim() === '') {
    errors.exerciseName = '운동 이름을 선택해주세요';
    isValid = false;
  }

  // 세트 검증
  if (!input.sets || input.sets.length === 0) {
    errors.sets = [{ reps: '최소 1개의 세트가 필요합니다' }];
    isValid = false;
  } else {
    const setErrors: Array<{ reps?: string; weight?: string }> = [];
    let hasSetError = false;

    for (const set of input.sets) {
      const setError: { reps?: string; weight?: string } = {};

      if (set.reps == null || !Number.isInteger(set.reps) || set.reps <= 0) {
        setError.reps = '반복 횟수를 입력해주세요 (1 이상의 정수)';
        hasSetError = true;
      }

      if (set.weight == null || set.weight < 0) {
        setError.weight = '0 이상의 값을 입력해주세요';
        hasSetError = true;
      }

      setErrors.push(setError);
    }

    if (hasSetError) {
      errors.sets = setErrors;
      isValid = false;
    }
  }

  return { isValid, errors };
}
