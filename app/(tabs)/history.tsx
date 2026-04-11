import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseCard } from '@/components/exercise-card';
import { EmptyState } from '@/components/empty-state';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { useExerciseLog } from '@/contexts/exercise-log-context';
import { getUniqueDatesDescending, filterLogsByDate } from '@/services/date-utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors, Opacity } from '@/constants/design-tokens';
import type { ExerciseLog } from '@/types/exercise';

export default function HistoryScreen() {
  const { state, deleteLog } = useExerciseLog();
  const router = useRouter();
  const bgColor = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');

  const dates = getUniqueDatesDescending(state.logs);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const selectedLogs = selectedDate ? filterLogsByDate(state.logs, selectedDate) : [];

  const handleEdit = (log: ExerciseLog) => {
    router.push({ pathname: '/log', params: { editId: log.id } });
  };
  const handleDeleteConfirm = async () => {
    if (deleteTarget) { await deleteLog(deleteTarget); setDeleteTarget(null); }
  };

  if (state.logs.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>운동 이력</ThemedText>
        </ThemedView>
        <EmptyState message="아직 운동 기록이 없습니다" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>운동 이력</ThemedText>
      </ThemedView>

      {!selectedDate ? (
        <FlatList
          data={dates}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const dayLogs = filterLogsByDate(state.logs, item);
            return (
              <TouchableOpacity style={styles.dateCard} onPress={() => setSelectedDate(item)} activeOpacity={0.7}>
                <ThemedText style={styles.dateText}>{item}</ThemedText>
                <ThemedText style={styles.dateCount}>{dayLogs.length}개 운동</ThemedText>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedDate(null)} activeOpacity={0.7}>
            <ThemedText style={[styles.backText, { color: tint }]}>← 날짜 목록</ThemedText>
          </TouchableOpacity>
          <ThemedView style={styles.selectedDateHeader}>
            <ThemedText style={styles.selectedDate}>{selectedDate}</ThemedText>
          </ThemedView>
          <FlatList
            data={selectedLogs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard log={item} onEdit={handleEdit} onDelete={(id) => setDeleteTarget(id)} />
            )}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
          />
        </>
      )}

      <DeleteConfirmDialog
        visible={deleteTarget !== null}
        message="이 운동 기록을 삭제하시겠습니까?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize['4xl'], fontWeight: FontWeight.extrabold },
  list: { padding: Spacing.xl, gap: Spacing.md },
  separator: { height: Spacing.md, backgroundColor: 'transparent' },
  dateCard: {
    backgroundColor: SemanticColors.surfaceSubtle,
    borderRadius: Radius.lg,
    padding: Spacing['2xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
  dateCount: { fontSize: FontSize.md, opacity: Opacity.muted },
  backButton: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm },
  backText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  selectedDateHeader: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xs },
  selectedDate: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, opacity: Opacity.soft },
});
