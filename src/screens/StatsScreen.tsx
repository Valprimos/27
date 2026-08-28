import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useApp } from "@/context/AppContext";
import { computeGoalStats, computeOverallStats } from "@/utils/stats";
import { WEEKDAY_LABELS } from "@/utils/dates";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { CATEGORY_LABEL, categoryGradient, colors, gradients } from "@/theme";
import { goalGradient } from "@/utils/color";
import { PlanCategory } from "@/types";

export default function StatsScreen() {
  const { goals, entries, planItems } = useApp();

  const activeGoals = goals.filter((g) => g.active);
  const overall = useMemo(() => computeOverallStats(goals, entries), [goals, entries]);

  const byCategory = useMemo(() => {
    const cats = Array.from(new Set(planItems.map((p) => p.category))) as PlanCategory[];
    return cats
      .map((cat) => {
        const items = planItems.filter((p) => p.category === cat);
        const done = items.filter((p) => p.status === "done").length;
        const partial = items.filter((p) => p.status === "partial").length;
        const pending = items.filter((p) => p.status === "pending").length;
        const score = items.length > 0 ? (done + partial * 0.5) / items.length : 0;
        return { cat, total: items.length, done, partial, pending, score };
      })
      .sort((a, b) => b.total - a.total);
  }, [planItems]);

  const planTotal = planItems.length;
  const planDone = planItems.filter((p) => p.status === "done").length;
  const planPartial = planItems.filter((p) => p.status === "partial").length;

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <Text style={styles.header}>Estadísticas</Text>

      <View style={styles.summaryRow}>
        <SummaryTile label="Completados" value={String(overall.totalCompleted)} gradient={gradients.green} />
        <SummaryTile label="Saltados" value={String(overall.totalSkipped)} gradient={gradients.orange} />
        <SummaryTile label="% cumplimiento" value={`${Math.round(overall.overallRate * 100)}%`} gradient={gradients.blue} />
        <SummaryTile label="Mejor racha activa" value={`${overall.bestCurrentStreak} días`} gradient={gradients.purple} />
      </View>

      <Text style={styles.header}>Calendario por categoría</Text>
      {byCategory.length === 0 && <Text style={styles.empty}>Importa o añade tareas al calendario para verlas aquí.</Text>}
      {byCategory.map(({ cat, total, done, partial, pending, score }) => (
        <GlassCard key={cat} accentGradient={categoryGradient[cat] ?? categoryGradient.otro} style={styles.categoryCard}>
          <View style={styles.categoryHeaderRow}>
            <Text style={styles.categoryName}>{CATEGORY_LABEL[cat] ?? cat}</Text>
            <Text style={styles.categoryScore}>{Math.round(score * 100)}%</Text>
          </View>
          <ProgressBar value={score} gradient={categoryGradient[cat] ?? categoryGradient.otro} />
          <Text style={styles.categoryBreakdown}>
            ✅ {done} completadas · ½ {partial} parciales · ⏳ {pending} pendientes · {total} en total
          </Text>
        </GlassCard>
      ))}

      {planTotal > 0 && (
        <GlassCard accentGradient={gradients.cyan} style={{ marginTop: 4 }}>
          <Text style={styles.calendarStatText}>
            📅 Total calendario: {planDone}/{planTotal} completadas
            {planPartial > 0 ? ` (+${planPartial} parciales)` : ""}
          </Text>
        </GlassCard>
      )}

      <Text style={styles.header}>Objetivos recurrentes</Text>
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
  categoryCard: { marginBottom: 10, gap: 8 },
  categoryHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryName: { color: colors.text, fontWeight: "700", fontSize: 15 },
  categoryScore: { color: colors.text, fontWeight: "800", fontSize: 15 },
  categoryBreakdown: { color: colors.textDim, fontSize: 11 },
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
  empty: { color: colors.textDim, textAlign: "center", marginTop: 4, marginBottom: 10 },
});
