import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseCard } from '@/components/exercise-card';
import { EmptyState } from '@/components/empty-state';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { useExerciseLog } from '@/contexts/exercise-log-context';
import { filterLogsByDate, getTodayString } from '@/services/date-utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors, Opacity } from '@/constants/design-tokens';
import type { ExerciseLog } from '@/types/exercise';
import { useState } from 'react';

export default function HomeScreen() {
  const { state, deleteLog } = useExerciseLog();
  const router = useRouter();
  const bgColor = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');

  const today = getTodayString();
  const todayLogs = filterLogsByDate(state.logs, today);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const totalSets = todayLogs.reduce((sum, log) => sum + log.sets.length, 0);
  const totalVolume = todayLogs.reduce(
    (sum, log) => sum + log.sets.reduce((s, set) => s + set.reps * set.weight, 0), 0
  );

  const handleEdit = (log: ExerciseLog) => {
    router.push({ pathname: '/log', params: { editId: log.id } });
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await deleteLog(deleteTarget);
      setDeleteTarget(null);
    }
  };

  if (state.isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={styles.loadingText}>로딩 중...</ThemedText>
      </ThemedView>
    );
  }

  const ListHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.logoRow}>
        <ThemedText style={styles.logo}>FitLog</ThemedText>
        <ThemedText style={styles.greeting}>💪</ThemedText>
      </View>

      {todayLogs.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ThemedText style={[styles.statValue, { color: tint }]}>{todayLogs.length}</ThemedText>
            <ThemedText style={styles.statLabel}>운동</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={[styles.statValue, { color: tint }]}>{totalSets}</ThemedText>
            <ThemedText style={styles.statLabel}>세트</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={[styles.statValue, { color: tint }]}>
              {totalVolume > 0 ? totalVolume.toLocaleString() : '0'}
            </ThemedText>
            <ThemedText style={styles.statLabel}>볼륨(kg)</ThemedText>
          </View>
        </View>
      )}

      {todayLogs.length > 0 && (
        <ThemedText style={styles.sectionTitle}>오늘의 기록</ThemedText>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      {todayLogs.length === 0 ? (
        <>
          <ListHeader />
          <EmptyState
            message="오늘 아직 운동 기록이 없습니다"
            actionLabel="운동 기록하기"
            onAction={() => router.push('/log')}
          />
        </>
      ) : (
        <FlatList
          data={todayLogs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ExerciseCard log={item} onEdit={handleEdit} onDelete={(id) => setDeleteTarget(id)} />
            </View>
          )}
          contentContainerStyle={styles.list}
        />
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: FontSize.lg, opacity: Opacity.muted },
  headerSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  logo: {
    fontSize: FontSize['5xl'],
    fontWeight: FontWeight.black,
    letterSpacing: -1,
    lineHeight: 40,
  },
  greeting: { fontSize: FontSize['4xl'], lineHeight: 36 },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: SemanticColors.surfaceSubtle,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: { fontSize: FontSize['3xl'], fontWeight: FontWeight.extrabold },
  statLabel: { fontSize: FontSize.sm, opacity: Opacity.muted },
  sectionTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  list: { paddingBottom: Spacing.xl },
  cardWrapper: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm },
});
