import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, Radius, FontSize, FontWeight, SemanticColors, Opacity } from '@/constants/design-tokens';

interface DeleteConfirmDialogProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ visible, message, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const bgColor = useThemeColor({}, 'background');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: bgColor }]}>
          <ThemedText style={styles.title}>삭제 확인</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} activeOpacity={0.7}>
              <ThemedText style={styles.cancelText}>취소</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm} activeOpacity={0.7}>
              <ThemedText style={styles.confirmText}>삭제</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: SemanticColors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  dialog: {
    width: '100%',
    borderRadius: Radius.xl,
    padding: Spacing['2xl'],
    gap: Spacing.lg,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
  },
  message: {
    fontSize: FontSize.base,
    opacity: Opacity.soft,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: SemanticColors.surfaceLight,
  },
  confirmButton: {
    backgroundColor: SemanticColors.error,
  },
  cancelText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  confirmText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: SemanticColors.white,
  },
});
