import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { computeGoalStats, computeOverallStats } from "@/utils/stats";
import { effectiveStatus } from "@/utils/planItem";
import { WEEKDAY_LABELS, todayISODate } from "@/utils/dates";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { CATEGORY_LABEL, categoryGradient, colors, gradients } from "@/theme";
import { goalGradient } from "@/utils/color";
import { PlanCategory } from "@/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function StatsScreen({ navigation }: Props) {
  const { goals, entries, planItems } = useApp();
  const today = todayISODate();

  const activeGoals = goals.filter((g) => g.active);
  const overall = useMemo(() => computeOverallStats(goals, entries), [goals, entries]);

  const byCategory = useMemo(() => {
    const cats = Array.from(new Set(planItems.map((p) => p.category))) as PlanCategory[];
    return cats
      .map((cat) => {
        const items = planItems.filter((p) => p.category === cat);
        const done = items.filter((p) => effectiveStatus(p, today) === "done").length;
        const failed = items.filter((p) => effectiveStatus(p, today) === "failed").length;
        const missed = items.filter((p) => effectiveStatus(p, today) === "missed").length;
        const resolved = done + failed + missed;
        // "failed" cuenta como hecho: lo hiciste, solo que sin llegar al
        // objetivo marcado. Eso no es culpa tuya y no resta. Lo único que
        // baja el % es no haberlo hecho ese día ("missed").
        const score = resolved > 0 ? (done + failed) / resolved : 0;
        return { cat, total: items.length, done, failed, missed, score };
      })
      .sort((a, b) => b.total - a.total);
  }, [planItems, today]);

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
      <Text style={styles.hint}>Toca una categoría para ver sus estadísticas completas</Text>
      {byCategory.length === 0 && (
        <Text style={styles.empty}>Importa o añade tareas al calendario para verlas aquí.</Text>
      )}
      {byCategory.map(({ cat, total, done, failed, missed, score }) => (
        <Pressable key={cat} onPress={() => navigation.navigate("CategoryStats", { category: cat })}>
          <GlassCard accentGradient={categoryGradient[cat] ?? categoryGradient.otro} style={styles.categoryCard}>
            <View style={styles.categoryHeaderRow}>
              <Text style={styles.categoryName}>{CATEGORY_LABEL[cat] ?? cat}</Text>
              <Text style={styles.categoryScore}>{Math.round(score * 100)}% ›</Text>
            </View>
            <ProgressBar value={score} gradient={categoryGradient[cat] ?? categoryGradient.otro} />
            <Text style={styles.categoryBreakdown}>
              ✅ {done} al objetivo · 🟡 {failed} hecho, sin llegar · – {missed} perdidas · {total} en total
            </Text>
          </GlassCard>
        </Pressable>
      ))}

      <Text style={styles.header}>Objetivos recurrentes</Text>
      <Text style={styles.hint}>Toca un objetivo para ver su historial completo</Text>
      {activeGoals.map((goal) => {
        const stats = computeGoalStats(goal, entries);
        const gradient = goalGradient(goal.color);
        return (
          <Pressable key={goal.id} onPress={() => navigation.navigate("GoalStats", { goalId: goal.id })}>
            <GlassCard accentGradient={gradient} style={styles.goalCard}>
              <View style={styles.goalHeaderRow}>
                <Text style={{ fontSize: 20 }}>{goal.icon}</Text>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.chevron}>›</Text>
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
          </Pressable>
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
  header: { color: colors.text, fontSize: 22, fontWeight: "800", marginTop: 10, marginBottom: 4 },
  hint: { color: colors.textFaint, fontSize: 11, marginBottom: 12 },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { flexBasis: "47%" },
  tileValue: { fontSize: 24, fontWeight: "800", color: colors.text },
  tileLabel: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  categoryCard: { marginBottom: 10, gap: 8 },
  categoryHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryName: { color: colors.text, fontWeight: "700", fontSize: 15 },
  categoryScore: { color: colors.text, fontWeight: "800", fontSize: 15 },
  categoryBreakdown: { color: colors.textDim, fontSize: 11 },
  goalCard: { marginBottom: 12, gap: 4 },
  goalHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  goalName: { color: colors.text, fontWeight: "700", fontSize: 15, flex: 1 },
  chevron: { color: colors.textFaint, fontSize: 18 },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  weekDay: { alignItems: "center", gap: 4 },
  weekDayLabel: { color: colors.textFaint, fontSize: 10 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  statsGrid: { gap: 4 },
  statText: { color: colors.textDim, fontSize: 12 },
  empty: { color: colors.textDim, textAlign: "center", marginTop: 4, marginBottom: 10 },
});
