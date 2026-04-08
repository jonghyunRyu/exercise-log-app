import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import * as Crypto from 'expo-crypto';
import type {
  ExerciseLog,
  ExerciseLogState,
  ExerciseLogAction,
} from '@/types/exercise';
import { DEFAULT_EXERCISES } from '@/constants/default-exercises';
import * as StorageService from '@/services/storage-service';

// --- Reducer ---

const initialState: ExerciseLogState = {
  logs: [],
  exercises: [...DEFAULT_EXERCISES],
  isLoading: true,
  error: null,
};

function exerciseLogReducer(
  state: ExerciseLogState,
  action: ExerciseLogAction
): ExerciseLogState {
  switch (action.type) {
    case 'SET_LOGS':
      return { ...state, logs: action.payload };
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.payload] };
    case 'UPDATE_LOG':
      return {
        ...state,
        logs: state.logs.map((log) =>
          log.id === action.payload.id ? action.payload : log
        ),
      };
    case 'DELETE_LOG':
      return {
        ...state,
        logs: state.logs.filter((log) => log.id !== action.payload),
      };
    case 'SET_EXERCISES':
      return { ...state, exercises: action.payload };
    case 'ADD_EXERCISE':
      return { ...state, exercises: [...state.exercises, action.payload] };
    case 'DELETE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.filter((e) => e !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// --- Context ---

interface ExerciseLogContextValue {
  state: ExerciseLogState;
  addLog: (log: Omit<ExerciseLog, 'id'>) => Promise<void>;
  updateLog: (log: ExerciseLog) => Promise<void>;
  deleteLog: (logId: string) => Promise<void>;
  addExercise: (name: string) => Promise<{ success: boolean; message?: string }>;
  deleteExercise: (name: string) => Promise<{ success: boolean; message?: string }>;
}

const ExerciseLogContext = createContext<ExerciseLogContextValue | null>(null);

// --- Provider ---

export function ExerciseLogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(exerciseLogReducer, initialState);

  // 앱 시작 시 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const [logs, customExercises] = await Promise.all([
          StorageService.loadLogs(),
          StorageService.loadExercises(),
        ]);
        dispatch({ type: 'SET_LOGS', payload: logs });
        dispatch({
          type: 'SET_EXERCISES',
          payload: [...DEFAULT_EXERCISES, ...customExercises],
        });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: '데이터를 불러오는 중 오류가 발생했습니다' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  const addLog = useCallback(async (log: Omit<ExerciseLog, 'id'>) => {
    try {
      const newLog: ExerciseLog = { ...log, id: Crypto.randomUUID() };
      dispatch({ type: 'ADD_LOG', payload: newLog });
      const updatedLogs = [...state.logs, newLog];
      await StorageService.saveLogs(updatedLogs);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '기록 저장 중 오류가 발생했습니다' });
    }
  }, [state.logs]);

  const updateLog = useCallback(async (log: ExerciseLog) => {
    try {
      dispatch({ type: 'UPDATE_LOG', payload: log });
      const updatedLogs = state.logs.map((l) => (l.id === log.id ? log : l));
      await StorageService.saveLogs(updatedLogs);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '기록 수정 중 오류가 발생했습니다' });
    }
  }, [state.logs]);

  const deleteLog = useCallback(async (logId: string) => {
    try {
      dispatch({ type: 'DELETE_LOG', payload: logId });
      const updatedLogs = state.logs.filter((l) => l.id !== logId);
      await StorageService.saveLogs(updatedLogs);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '기록 삭제 중 오류가 발생했습니다' });
    }
  }, [state.logs]);

  const addExercise = useCallback(async (name: string): Promise<{ success: boolean; message?: string }> => {
    const trimmed = name.trim();
    if (state.exercises.includes(trimmed)) {
      return { success: false, message: '이미 존재하는 운동입니다' };
    }
    try {
      dispatch({ type: 'ADD_EXERCISE', payload: trimmed });
      const customExercises = state.exercises
        .filter((e) => !DEFAULT_EXERCISES.includes(e))
        .concat(trimmed);
      await StorageService.saveExercises(customExercises);
      return { success: true };
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '운동 추가 중 오류가 발생했습니다' });
      return { success: false, message: '저장 중 오류가 발생했습니다' };
    }
  }, [state.exercises]);

  const deleteExercise = useCallback(async (name: string): Promise<{ success: boolean; message?: string }> => {
    if (DEFAULT_EXERCISES.includes(name)) {
      return { success: false, message: '기본 운동은 삭제할 수 없습니다' };
    }
    try {
      dispatch({ type: 'DELETE_EXERCISE', payload: name });
      const customExercises = state.exercises
        .filter((e) => !DEFAULT_EXERCISES.includes(e) && e !== name);
      await StorageService.saveExercises(customExercises);
      return { success: true };
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '운동 삭제 중 오류가 발생했습니다' });
      return { success: false, message: '삭제 중 오류가 발생했습니다' };
    }
  }, [state.exercises]);

  return (
    <ExerciseLogContext.Provider
      value={{ state, addLog, updateLog, deleteLog, addExercise, deleteExercise }}
    >
      {children}
    </ExerciseLogContext.Provider>
  );
}

// --- Hook ---

export function useExerciseLog(): ExerciseLogContextValue {
  const context = useContext(ExerciseLogContext);
  if (!context) {
    throw new Error('useExerciseLog must be used within ExerciseLogProvider');
  }
  return context;
}
