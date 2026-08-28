import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useApp } from "@/context/AppContext";
import { computeGoalStats, computeOverallStats } from "@/utils/stats";
import { WEEKDAY_LABELS } from "@/utils/dates";
import { GlassCard } from "@/components/GlassCard";
import { colors, gradients } from "@/theme";
import { goalGradient } from "@/utils/color";

export default function StatsScreen() {
  const { goals, entries, planItems } = useApp();

  const activeGoals = goals.filter((g) => g.active);
  const overall = useMemo(() => computeOverallStats(goals, entries), [goals, entries]);
  const planCompleted = planItems.filter((p) => p.completed).length;
  const planTotal = planItems.length;

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <Text style={styles.header}>Estadísticas</Text>

      <View style={styles.summaryRow}>
        <SummaryTile label="Completados" value={String(overall.totalCompleted)} gradient={gradients.green} />
        <SummaryTile label="Saltados" value={String(overall.totalSkipped)} gradient={gradients.orange} />
        <SummaryTile label="% cumplimiento" value={`${Math.round(overall.overallRate * 100)}%`} gradient={gradients.blue} />
        <SummaryTile label="Mejor racha activa" value={`${overall.bestCurrentStreak} días`} gradient={gradients.purple} />
      </View>

      <GlassCard accentGradient={gradients.cyan} style={{ marginTop: 14 }}>
        <Text style={styles.calendarStatText}>
          📅 Tareas del calendario: {planCompleted}/{planTotal} completadas
        </Text>
      </GlassCard>

      <Text style={styles.header}>Por objetivo</Text>
      {activeGoals.map((goal) => {
        const stats = computeGoalStats(goal, entries);
        const gradient = goalGradient(goal.color);
        return (
          <GlassCard key={goal.id} accentGradient={gradient} style={styles.goalCard}>
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
                  <View style={[styles.dot, { backgroundColor: done ? goal.color : "rgba(255,255,255,0.08)" }]} />
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
          </GlassCard>
        );
      })}

      {activeGoals.length === 0 && <Text style={styles.empty}>Crea objetivos recurrentes para ver sus rachas.</Text>}
    </ScrollView>
  );
}

function SummaryTile({ label, value, gradient }: { label: string; value: string; gradient: readonly [string, string] }) {
  return (
    <GlassCard accentGradient={gradient} style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: { color: colors.text, fontSize: 22, fontWeight: "800", marginTop: 10, marginBottom: 14 },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { flexBasis: "47%" },
  tileValue: { fontSize: 24, fontWeight: "800", color: colors.text },
  tileLabel: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  calendarStatText: { color: colors.text, fontWeight: "600" },
  goalCard: { marginBottom: 12, gap: 4 },
  goalHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  goalName: { color: colors.text, fontWeight: "700", fontSize: 15 },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  weekDay: { alignItems: "center", gap: 4 },
  weekDayLabel: { color: colors.textFaint, fontSize: 10 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  statsGrid: { gap: 4 },
  statText: { color: colors.textDim, fontSize: 12 },
  empty: { color: colors.textDim, textAlign: "center", marginTop: 10 },
});
