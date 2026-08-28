import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { computeGoalStats, computeOverallStats } from "@/utils/stats";
import { WEEKDAY_LABELS } from "@/utils/dates";
import { evaluateDay } from "@/services/ai";

export default function StatsScreen() {
  const { goals, entries, settings } = useApp();
  const [note, setNote] = useState("");
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeGoals = goals.filter((g) => g.active);
  const overall = useMemo(() => computeOverallStats(goals, entries), [goals, entries]);

  async function handleEvaluate() {
    if (!settings.aiEnabled || !settings.aiApiKey) {
      Alert.alert("IA no configurada", "Activa la IA en Ajustes para recibir una evaluación de tu día.");
      return;
    }
    setLoading(true);
    try {
      const text = await evaluateDay({ apiKey: settings.aiApiKey, goals, entries, extraContext: note });
      setEvaluation(text);
    } catch (err: any) {
      Alert.alert("Error de IA", err.message ?? "No se pudo evaluar el día.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
      <Text style={styles.header}>Resumen general</Text>
      <View style={styles.summaryRow}>
        <SummaryTile label="Completados" value={String(overall.totalCompleted)} color="#22c55e" />
        <SummaryTile label="Saltados" value={String(overall.totalSkipped)} color="#f59e0b" />
        <SummaryTile label="% cumplimiento" value={`${Math.round(overall.overallRate * 100)}%`} color="#3b82f6" />
        <SummaryTile label="Mejor racha activa" value={`${overall.bestCurrentStreak} días`} color="#a855f7" />
      </View>

      <Text style={styles.header}>Por objetivo</Text>
      {activeGoals.map((goal) => {
        const stats = computeGoalStats(goal, entries);
        return (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeaderRow}>
              <Text style={{ fontSize: 20 }}>{goal.icon}</Text>
              <Text style={styles.goalName}>{goal.name}</Text>
            </View>
            <View style={styles.weekRow}>
              {stats.last7Days.map((done, idx) => (
                <View key={idx} style={styles.weekDay}>
                  <Text style={styles.weekDayLabel}>
                    {WEEKDAY_LABELS[(new Date().getDay() - (6 - idx) + 7) % 7]}
                  </Text>
                  <View style={[styles.dot, { backgroundColor: done ? goal.color : "#1f2937" }]} />
                </View>
              ))}
            </View>
            <View style={styles.statsGrid}>
              <Text style={styles.statText}>🔥 Racha actual: {stats.currentStreak} días</Text>
              <Text style={styles.statText}>🏆 Mejor racha: {stats.bestStreak} días</Text>
              <Text style={styles.statText}>✅ Completados: {stats.totalCompleted}</Text>
              <Text style={styles.statText}>⏭️ Saltados: {stats.totalSkipped}</Text>
              <Text style={styles.statText}>📊 Cumplimiento: {Math.round(stats.completionRate * 100)}%</Text>
              {goal.kind === "numeric" && (
                <Text style={styles.statText}>
                  Σ Total acumulado: {stats.totalProgress} {goal.unit ?? ""}
                </Text>
              )}
              {goal.kind === "money" && (
                <Text style={styles.statText}>
                  💰 Ahorrado: {goal.moneySaved ?? 0}€ / {goal.moneyTarget ?? 0}€
                </Text>
              )}
            </View>
          </View>
        );
      })}

      {activeGoals.length === 0 && <Text style={styles.empty}>Crea objetivos para ver tus estadísticas.</Text>}

      <Text style={styles.header}>Evaluación del día (IA)</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Cuéntale a tu coach cómo te sientes hoy (opcional)"
        placeholderTextColor="#64748b"
        multiline
      />
      <Pressable style={styles.aiButton} onPress={handleEvaluate} disabled={loading}>
        {loading ? <ActivityIndicator color="#052e14" /> : <Text style={styles.aiButtonText}>🧠 Evaluar mi día</Text>}
      </Pressable>
      {evaluation && (
        <View style={styles.aiBox}>
          <Text style={styles.aiText}>{evaluation}</Text>
        </View>
      )}
    </ScrollView>
  );
}

function SummaryTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.tile, { borderColor: `${color}55` }]}>
      <Text style={[styles.tileValue, { color }]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220" },
  header: { color: "#f8fafc", fontSize: 18, fontWeight: "700", marginTop: 20, marginBottom: 12 },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    flexBasis: "47%",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  tileValue: { fontSize: 22, fontWeight: "800" },
  tileLabel: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  goalCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  goalHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  goalName: { color: "#f8fafc", fontWeight: "700", fontSize: 15 },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  weekDay: { alignItems: "center", gap: 4 },
  weekDayLabel: { color: "#64748b", fontSize: 10 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  statsGrid: { gap: 4 },
  statText: { color: "#cbd5e1", fontSize: 12 },
  empty: { color: "#94a3b8", textAlign: "center", marginTop: 10 },
  input: {
    backgroundColor: "#111827",
    color: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  aiButton: {
    backgroundColor: "#a855f7",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  aiButtonText: { color: "#1e0533", fontWeight: "700" },
  aiBox: {
    backgroundColor: "#1e1033",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#a855f755",
  },
  aiText: { color: "#e9d5ff", lineHeight: 20 },
});
