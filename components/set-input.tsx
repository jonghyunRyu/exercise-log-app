import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ExerciseSet } from '@/types/exercise';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors, Opacity, IconSize } from '@/constants/design-tokens';

interface SetInputProps {
  set: ExerciseSet;
  index: number;
  onChange: (index: number, set: ExerciseSet) => void;
  onRemove: (index: number) => void;
  errors?: { reps?: string; weight?: string };
}

export function SetInput({ set, index, onChange, onRemove, errors }: SetInputProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.setLabel}>세트 {index + 1}</ThemedText>
        <TouchableOpacity onPress={() => onRemove(index)} hitSlop={Spacing.sm}>
          <MaterialIcons name="close" size={IconSize.lg} color={iconColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>반복</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: errors?.reps ? SemanticColors.error : SemanticColors.border }]}
            value={set.reps > 0 ? String(set.reps) : ''}
            onChangeText={(text) => {
              const num = parseInt(text, 10);
              onChange(index, { ...set, reps: isNaN(num) ? 0 : num });
            }}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={SemanticColors.placeholder}
          />
          {errors?.reps && <ThemedText style={styles.error}>{errors.reps}</ThemedText>}
        </View>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>무게 (kg)</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: errors?.weight ? SemanticColors.error : SemanticColors.border }]}
            value={set.weight > 0 ? String(set.weight) : ''}
            onChangeText={(text) => {
              const num = parseFloat(text);
              onChange(index, { ...set, weight: isNaN(num) ? 0 : num });
            }}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={SemanticColors.placeholder}
          />
          {errors?.weight && <ThemedText style={styles.error}>{errors.weight}</ThemedText>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SemanticColors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    opacity: Opacity.soft,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputGroup: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    opacity: Opacity.muted,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.lg,
  },
  error: {
    fontSize: FontSize.xs,
    color: SemanticColors.error,
  },
});
