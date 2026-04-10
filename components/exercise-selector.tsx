import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DEFAULT_EXERCISES } from '@/constants/default-exercises';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors, Opacity, IconSize } from '@/constants/design-tokens';

interface ExerciseSelectorProps {
  exercises: string[];
  selectedExercise: string;
  onSelect: (exercise: string) => void;
  onAddCustom: (name: string) => void;
  onDeleteCustom: (name: string) => void;
}

export function ExerciseSelector({
  exercises, selectedExercise, onSelect, onAddCustom, onDeleteCustom,
}: ExerciseSelectorProps) {
  const [newExercise, setNewExercise] = useState('');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const handleAdd = () => {
    const trimmed = newExercise.trim();
    if (trimmed) {
      onAddCustom(trimmed);
      setNewExercise('');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>운동 선택</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <View style={styles.chipRow}>
          {exercises.map((exercise) => {
            const isSelected = exercise === selectedExercise;
            const isDefault = DEFAULT_EXERCISES.includes(exercise);
            return (
              <TouchableOpacity
                key={exercise}
                style={[styles.chip, isSelected && { backgroundColor: tint }]}
                onPress={() => onSelect(exercise)}
                activeOpacity={0.7}
              >
                <ThemedText style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {exercise}
                </ThemedText>
                {!isDefault && !isSelected && (
                  <TouchableOpacity onPress={() => onDeleteCustom(exercise)} hitSlop={Spacing.sm} style={styles.chipDelete}>
                    <MaterialIcons name="close" size={IconSize.sm} color={iconColor} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.addRow}>
        <TextInput
          style={[styles.addInput, { color: textColor }]}
          value={newExercise}
          onChangeText={setNewExercise}
          placeholder="새 운동 추가..."
          placeholderTextColor={SemanticColors.placeholder}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: tint }]} onPress={handleAdd} activeOpacity={0.7}>
          <MaterialIcons name="add" size={IconSize.lg} color={SemanticColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    opacity: Opacity.soft,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: SemanticColors.surfaceLight,
    gap: Spacing.sm,
  },
  chipText: {
    fontSize: FontSize.md,
  },
  chipTextSelected: {
    color: SemanticColors.white,
    fontWeight: FontWeight.semibold,
  },
  chipDelete: {
    marginLeft: 2,
  },
  addRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: SemanticColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
