import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { DailyEntry, Goal } from "@/types";
import { ProgressBar } from "./ProgressBar";

interface Props {
  goal: Goal;
  entry?: DailyEntry;
  onMarkDone: (progress: number) => void;
  onMarkSkipped: () => void;
  onUndo: () => void;
}

export const GoalCard: React.FC<Props> = ({ goal, entry, onMarkDone, onMarkSkipped, onUndo }) => {
  const [customValue, setCustomValue] = useState(
    goal.dailyTarget ? String(goal.dailyTarget) : ""
  );

  const completed = entry?.completed ?? false;
  const skipped = entry?.skipped && !completed;
  const progress = entry?.progress ?? 0;
  const target = goal.dailyTarget ?? 1;
  const ratio = target > 0 ? progress / target : completed ? 1 : 0;

  return (
    <View style={[styles.card, completed && styles.cardDone, skipped && styles.cardSkipped]}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{goal.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{goal.name}</Text>
          {goal.kind !== "notes" && (
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

      {goal.kind !== "notes" && <ProgressBar value={ratio} color={goal.color} />}

      {!completed && !skipped && goal.kind === "numeric" && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={customValue}
            onChangeText={setCustomValue}
            placeholder={`${goal.unit ?? ""}`}
            placeholderTextColor="#64748b"
          />
          <Pressable style={styles.btnPrimary} onPress={() => onMarkDone(Number(customValue) || 0)}>
            <Text style={styles.btnPrimaryText}>Registrar</Text>
          </Pressable>
        </View>
      )}

      {!completed && !skipped && goal.kind !== "numeric" && (
        <View style={styles.actionsRow}>
          <Pressable style={styles.btnPrimary} onPress={() => onMarkDone(goal.dailyTarget ?? 1)}>
            <Text style={styles.btnPrimaryText}>Marcar hecho</Text>
          </Pressable>
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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardDone: { borderColor: "#22c55e55", backgroundColor: "#0f2318" },
  cardSkipped: { borderColor: "#f59e0b55", backgroundColor: "#241a0d" },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { fontSize: 26 },
  title: { color: "#f8fafc", fontSize: 16, fontWeight: "600" },
  subtitle: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  badgeDone: { color: "#22c55e", fontWeight: "600", fontSize: 12 },
  badgeSkipped: { color: "#f59e0b", fontWeight: "600", fontSize: 12 },
  actionsRow: { flexDirection: "row", gap: 10 },
  inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "#0b1220",
    color: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  btnPrimary: {
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnPrimaryText: { color: "#052e14", fontWeight: "700" },
  btnGhost: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  btnGhostText: { color: "#cbd5e1", fontWeight: "600" },
});
