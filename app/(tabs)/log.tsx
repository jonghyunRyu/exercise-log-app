import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseSelector } from '@/components/exercise-selector';
import { SetInput } from '@/components/set-input';
import { useExerciseLog } from '@/contexts/exercise-log-context';
import { validateExerciseLog } from '@/services/validation';
import { getTodayString } from '@/services/date-utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors } from '@/constants/design-tokens';
import type { ExerciseSet, ValidationResult } from '@/types/exercise';

export default function LogScreen() {
  const { state, addLog, updateLog, addExercise, deleteExercise } = useExerciseLog();
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string }>();
  const bgColor = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');

  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState<ExerciseSet[]>([{ reps: 0, weight: 0 }]);
  const [errors, setErrors] = useState<ValidationResult['errors']>({});
  const isEditMode = !!params.editId;

  useEffect(() => {
    if (params.editId) {
      const existing = state.logs.find((l) => l.id === params.editId);
      if (existing) {
        setSelectedExercise(existing.exerciseName);
        setSets(existing.sets.map((s) => ({ ...s })));
      }
    }
  }, [params.editId]);

  const handleSetChange = (index: number, updated: ExerciseSet) => {
    setSets(sets.map((s, i) => (i === index ? updated : s)));
  };
  const handleRemoveSet = (index: number) => {
    if (sets.length > 1) setSets(sets.filter((_, i) => i !== index));
  };
  const handleAddSet = () => setSets([...sets, { reps: 0, weight: 0 }]);

  const handleAddExercise = async (name: string) => {
    const result = await addExercise(name);
    if (!result.success && result.message) Alert.alert('알림', result.message);
  };
  const handleDeleteExercise = async (name: string) => {
    const result = await deleteExercise(name);
    if (!result.success && result.message) Alert.alert('알림', result.message);
  };

  const handleSave = async () => {
    const validation = validateExerciseLog({ exerciseName: selectedExercise, sets });
    if (!validation.isValid) { setErrors(validation.errors); return; }
    setErrors({});

    if (isEditMode && params.editId) {
      await updateLog({
        id: params.editId,
        exerciseName: selectedExercise,
        date: state.logs.find((l) => l.id === params.editId)?.date ?? getTodayString(),
        sets,
      });
    } else {
      await addLog({ exerciseName: selectedExercise, date: getTodayString(), sets });
    }

    setSelectedExercise('');
    setSets([{ reps: 0, weight: 0 }]);
    router.push('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>{isEditMode ? '운동 수정' : '운동 기록'}</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <ExerciseSelector
          exercises={state.exercises}
          selectedExercise={selectedExercise}
          onSelect={setSelectedExercise}
          onAddCustom={handleAddExercise}
          onDeleteCustom={handleDeleteExercise}
        />
        {errors.exerciseName && <ThemedText style={styles.error}>{errors.exerciseName}</ThemedText>}

        <ThemedView style={styles.setsSection}>
          <ThemedView style={styles.setsHeader}>
            <ThemedText style={styles.sectionTitle}>세트</ThemedText>
            <TouchableOpacity onPress={handleAddSet} activeOpacity={0.7}>
              <ThemedText style={[styles.addSetText, { color: tint }]}>+ 세트 추가</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {sets.map((set, i) => (
            <SetInput key={i} set={set} index={i} onChange={handleSetChange} onRemove={handleRemoveSet} errors={errors.sets?.[i]} />
          ))}
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: tint }]} onPress={handleSave} activeOpacity={0.7}>
          <ThemedText style={styles.saveText}>{isEditMode ? '수정 완료' : '저장'}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize['4xl'], fontWeight: FontWeight.extrabold },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.xl, gap: Spacing.xl },
  error: { fontSize: FontSize.md, color: SemanticColors.error, marginTop: -Spacing.md },
  setsSection: { gap: Spacing.md },
  setsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, opacity: 0.7 },
  addSetText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  footer: { padding: Spacing.xl, paddingBottom: Spacing.sm },
  saveButton: { paddingVertical: Spacing.lg, borderRadius: Radius.lg, alignItems: 'center' },
  saveText: { color: SemanticColors.white, fontSize: FontSize.xl, fontWeight: FontWeight.bold },
});
