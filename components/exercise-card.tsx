import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ExerciseLog } from '@/types/exercise';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors, Opacity, IconSize } from '@/constants/design-tokens';

interface ExerciseCardProps {
  log: ExerciseLog;
  onEdit?: (log: ExerciseLog) => void;
  onDelete?: (logId: string) => void;
  showActions?: boolean;
}

export function ExerciseCard({ log, onEdit, onDelete, showActions = true }: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tint = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const totalVolume = log.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.exerciseName}>{log.exerciseName}</ThemedText>
          <ThemedText style={styles.setCount}>{log.sets.length}세트</ThemedText>
        </View>
        {showActions && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity onPress={() => onEdit(log)} hitSlop={Spacing.sm}>
                <MaterialIcons name="edit" size={IconSize.md} color={iconColor} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={() => onDelete(log.id)} hitSlop={Spacing.sm}>
                <MaterialIcons name="delete-outline" size={IconSize.md} color={iconColor} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {isExpanded && (
        <View style={styles.details}>
          <View style={styles.detailHeader}>
            <ThemedText style={styles.detailLabel}>세트</ThemedText>
            <ThemedText style={styles.detailLabel}>반복</ThemedText>
            <ThemedText style={styles.detailLabel}>무게</ThemedText>
          </View>
          {log.sets.map((set, i) => (
            <View key={i} style={styles.detailRow}>
              <ThemedText style={styles.detailValue}>{i + 1}</ThemedText>
              <ThemedText style={styles.detailValue}>{set.reps}회</ThemedText>
              <ThemedText style={styles.detailValue}>{set.weight}kg</ThemedText>
            </View>
          ))}
          {totalVolume > 0 && (
            <View style={[styles.detailRow, styles.totalRow]}>
              <ThemedText style={styles.totalLabel}>총 볼륨</ThemedText>
              <ThemedText style={[styles.totalValue, { color: tint }]}>
                {totalVolume.toLocaleString()}kg
              </ThemedText>
            </View>
          )}
        </View>
      )}

      <View style={styles.expandHint}>
        <MaterialIcons
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={IconSize.lg}
          color={iconColor}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SemanticColors.surfaceSubtle,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  exerciseName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  setCount: {
    fontSize: FontSize.md,
    opacity: Opacity.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  details: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  detailHeader: {
    flexDirection: 'row',
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SemanticColors.divider,
  },
  detailLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    opacity: Opacity.muted,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.xs,
  },
  detailValue: {
    flex: 1,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: SemanticColors.divider,
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: FontSize.md,
    opacity: Opacity.subtle,
    fontWeight: FontWeight.semibold,
  },
  totalValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  expandHint: {
    alignItems: 'center',
  },
});
