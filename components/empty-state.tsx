import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors, Opacity } from '@/constants/design-tokens';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  const tint = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.emoji}>🏋️</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
      {actionLabel && onAction && (
        <TouchableOpacity style={[styles.button, { backgroundColor: tint }]} onPress={onAction} activeOpacity={0.7}>
          <ThemedText style={styles.buttonText}>{actionLabel}</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    gap: Spacing.lg,
  },
  emoji: {
    fontSize: 48,
    lineHeight: 60,
  },
  message: {
    fontSize: FontSize.lg,
    opacity: Opacity.subtle,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  buttonText: {
    color: SemanticColors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
});
