import { ThemedText } from '@/components/themed-text';
import { FontSize, FontWeight, Opacity, Radius, SemanticColors, Spacing } from '@/constants/design-tokens';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const PRESET_SECONDS = [30, 60, 90, 120];

export function RestTimer() {
  const [seconds, setSeconds] = useState(60);
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tint = useThemeColor({}, 'tint');

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStart = () => { setRemaining(seconds); setIsRunning(true); };
  const handleStop = () => { setIsRunning(false); setRemaining(0); };
  const progress = seconds > 0 ? remaining / seconds : 0;

  // 축소 상태: 타이머 실행 중일 때 한 줄 미니바로 표시
  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={[styles.miniBar, isRunning && { borderColor: tint }]}
        onPress={() => setIsExpanded(true)}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.miniLabel}>⏱ 휴식 타이머</ThemedText>
        {isRunning ? (
          <View style={styles.miniRight}>
            <ThemedText style={[styles.miniTime, { color: tint }]}>{formatTime(remaining)}</ThemedText>
            <View style={styles.miniProgress}>
              <View style={[styles.miniProgressFill, { width: `${progress * 100}%`, backgroundColor: tint }]} />
            </View>
          </View>
        ) : (
          <ThemedText style={styles.miniHint}>탭하여 열기</ThemedText>
        )}
      </TouchableOpacity>
    );
  }

  // 확장 상태
  return (
    <View style={styles.expanded}>
      <TouchableOpacity style={styles.expandedHeader} onPress={() => setIsExpanded(false)} activeOpacity={0.7}>
        <ThemedText style={styles.sectionTitle}>⏱ 휴식 타이머</ThemedText>
        <ThemedText style={styles.collapseHint}>접기</ThemedText>
      </TouchableOpacity>

      {!isRunning && remaining === 0 && (
        <View style={styles.presetRow}>
          {PRESET_SECONDS.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[styles.presetChip, seconds === preset && { backgroundColor: tint }]}
              onPress={() => setSeconds(preset)}
              activeOpacity={0.7}
            >
              <ThemedText style={[styles.presetText, seconds === preset && styles.presetTextSelected]}>
                {formatTime(preset)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.timerRow}>
        <ThemedText style={[styles.timerText, isRunning && { color: tint }]}>
          {isRunning || remaining > 0 ? formatTime(remaining) : formatTime(seconds)}
        </ThemedText>
        {!isRunning ? (
          <TouchableOpacity style={[styles.timerButton, { backgroundColor: tint }]} onPress={handleStart} activeOpacity={0.7}>
            <ThemedText style={styles.timerButtonText}>시작</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.timerButton, { backgroundColor: SemanticColors.error }]} onPress={handleStop} activeOpacity={0.7}>
            <ThemedText style={styles.timerButtonText}>중지</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {isRunning && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: tint }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // --- 축소(미니바) ---
  miniBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SemanticColors.surfaceSubtle,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  miniLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  miniRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  miniTime: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  miniHint: {
    fontSize: FontSize.sm,
    opacity: Opacity.muted,
  },
  miniProgress: {
    width: 40,
    height: 3,
    backgroundColor: SemanticColors.surfaceLight,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: Radius.sm,
  },
  // --- 확장 ---
  expanded: {
    backgroundColor: SemanticColors.surfaceSubtle,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  collapseHint: {
    fontSize: FontSize.sm,
    opacity: Opacity.muted,
  },
  presetRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  presetChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: SemanticColors.surfaceLight,
    alignItems: 'center',
  },
  presetText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  presetTextSelected: {
    color: SemanticColors.white,
    fontWeight: FontWeight.semibold,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerText: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  timerButton: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  timerButtonText: {
    color: SemanticColors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: SemanticColors.surfaceLight,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.sm,
  },
});
