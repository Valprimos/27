import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { DailyEntry, Goal } from "@/types";
import { ProgressBar } from "./ProgressBar";
import { GlassCard } from "./GlassCard";
import { GradientButton } from "./GradientButton";
import { goalGradient } from "@/utils/color";
import { colors } from "@/theme";

interface Props {
  goal: Goal;
  entry?: DailyEntry;
  onMarkDone: (progress: number) => void;
  onMarkSkipped: () => void;
  onUndo: () => void;
}

export const GoalCard: React.FC<Props> = ({ goal, entry, onMarkDone, onMarkSkipped, onUndo }) => {
  const [customValue, setCustomValue] = useState(goal.dailyTarget ? String(goal.dailyTarget) : "");

  const completed = entry?.completed ?? false;
  const skipped = entry?.skipped && !completed;
  const progress = entry?.progress ?? 0;
  const target = goal.dailyTarget ?? 1;
  const ratio = target > 0 ? progress / target : completed ? 1 : 0;
  const gradient = goalGradient(goal.color);

  return (
    <GlassCard accentGradient={gradient} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{goal.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{goal.name}</Text>
          {goal.kind !== "money" && (
            <Text style={styles.subtitle}>
              Objetivo hoy: {goal.dailyTarget ?? "—"} {goal.unit ?? ""}
            </Text>
          )}
          {goal.kind === "money" && (
            <Text style={styles.subtitle}>
              Ahorrado: {goal.moneySaved ?? 0}€ / {goal.moneyTarget ?? 0}€
            </Text>
          )}
        </View>
        {completed && <Text style={styles.badgeDone}>✅ Hecho</Text>}
        {skipped && <Text style={styles.badgeSkipped}>⏭️ Saltado</Text>}
      </View>

      <ProgressBar value={ratio} gradient={gradient} />

      {!completed && !skipped && goal.kind === "numeric" && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={customValue}
            onChangeText={setCustomValue}
            placeholder={`${goal.unit ?? ""}`}
            placeholderTextColor={colors.textFaint}
          />
          <GradientButton
            label="Registrar"
            gradient={gradient}
            style={{ minWidth: 120 }}
            onPress={() => onMarkDone(Number(customValue) || 0)}
          />
        </View>
      )}

      {!completed && !skipped && goal.kind !== "numeric" && (
        <View style={styles.actionsRow}>
          <GradientButton
            label="Marcar hecho"
            gradient={gradient}
            style={{ flex: 1 }}
            onPress={() => onMarkDone(goal.dailyTarget ?? 1)}
          />
          <Pressable style={styles.btnGhost} onPress={onMarkSkipped}>
            <Text style={styles.btnGhostText}>Saltar hoy</Text>
          </Pressable>
        </View>
      )}

      {(completed || skipped) && (
        <Pressable style={styles.btnGhost} onPress={onUndo}>
          <Text style={styles.btnGhostText}>Deshacer</Text>
        </Pressable>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 14, gap: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
  title: { color: colors.text, fontSize: 16, fontWeight: "700" },
  subtitle: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  badgeDone: { color: "#34d399", fontWeight: "700", fontSize: 12 },
  badgeSkipped: { color: "#fbbf24", fontWeight: "700", fontSize: 12 },
  actionsRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  btnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorderStrong,
  },
  btnGhostText: { color: colors.textDim, fontWeight: "600" },
});
