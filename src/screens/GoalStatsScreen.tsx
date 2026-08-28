import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { colors } from "@/theme";
import { goalGradient } from "@/utils/color";
import { computeGoalStats } from "@/utils/stats";
import { formatFriendlyDate } from "@/utils/dates";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "GoalStats">;

export default function GoalStatsScreen({ route }: Props) {
  const { goals, entries } = useApp();
  const goal = goals.find((g) => g.id === route.params.goalId);

  const goalEntries = useMemo(
    () => entries.filter((e) => e.goalId === route.params.goalId).sort((a, b) => b.date.localeCompare(a.date)),
    [entries, route.params.goalId]
  );

  if (!goal) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Este objetivo ya no existe.</Text>
      </View>
    );
  }

  const stats = computeGoalStats(goal, entries);
  const gradient = goalGradient(goal.color);

  const byMonth = useMemo(() => {
    const map = new Map<string, { completed: number; skipped: number; total: number; progress: number }>();
    for (const e of goalEntries) {
      const month = e.date.slice(0, 7);
      const entry = map.get(month) ?? { completed: 0, skipped: 0, total: 0, progress: 0 };
      entry.total++;
      if (e.completed) entry.completed++;
      if (e.skipped && !e.completed) entry.skipped++;
      entry.progress += e.progress || 0;
      map.set(month, entry);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [goalEntries]);

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 26 }}>{goal.icon}</Text>
        <Text style={styles.header}>{goal.name}</Text>
      </View>

      <View style={styles.summaryRow}>
        <SummaryTile label="Racha actual" value={`${stats.currentStreak}d`} gradient={gradient} />
        <SummaryTile label="Mejor racha" value={`${stats.bestStreak}d`} gradient={gradient} />
        <SummaryTile label="Cumplimiento" value={`${Math.round(stats.completionRate * 100)}%`} gradient={gradient} />
        <SummaryTile
          label={goal.kind === "money" ? "Ahorrado" : "Acumulado"}
          value={goal.kind === "money" ? `${goal.moneySaved ?? 0}€` : `${stats.totalProgress} ${goal.unit ?? ""}`}
          gradient={gradient}
        />
      </View>

      {goal.kind === "money" && goal.moneyTarget ? (
        <GlassCard accentGradient={gradient} style={{ marginTop: 14 }}>
          <Text style={styles.moneyLabel}>
            {goal.moneySaved ?? 0}€ de {goal.moneyTarget}€
          </Text>
          <ProgressBar value={(goal.moneySaved ?? 0) / goal.moneyTarget} gradient={gradient} />
        </GlassCard>
      ) : null}

      <Text style={styles.sectionHeader}>Por mes</Text>
      {byMonth.map(([month, m]) => (
        <GlassCard key={month} accentGradient={gradient} style={styles.monthCard}>
          <View style={styles.monthHeaderRow}>
            <Text style={styles.monthLabel}>{month}</Text>
            <Text style={styles.monthScore}>{Math.round((m.completed / m.total) * 100)}%</Text>
          </View>
          <ProgressBar value={m.completed / m.total} gradient={gradient} />
          <Text style={styles.monthBreakdown}>
            ✅ {m.completed} · ⏭️ {m.skipped} · {m.total} días registrados
            {goal.kind === "numeric" ? ` · Σ ${m.progress} ${goal.unit ?? ""}` : ""}
          </Text>
        </GlassCard>
      ))}
      {byMonth.length === 0 && <Text style={styles.empty}>Aún no hay historial para este objetivo.</Text>}

      <Text style={styles.sectionHeader}>Historial reciente</Text>
      {goalEntries.slice(0, 30).map((e) => (
        <GlassCard key={e.id} style={styles.historyCard}>
          <Text style={styles.historyDate}>{formatFriendlyDate(e.date)}</Text>
          <Text style={[styles.historyStatus, { color: e.completed ? "#34d399" : e.skipped ? "#fbbf24" : colors.textFaint }]}>
            {e.completed ? `✓ Hecho (${e.progress} ${goal.unit ?? ""})` : e.skipped ? "⏭️ Saltado" : "—"}
          </Text>
        </GlassCard>
      ))}
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  header: { color: colors.text, fontSize: 22, fontWeight: "800" },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { flexBasis: "47%" },
  tileValue: { fontSize: 20, fontWeight: "800", color: colors.text },
  tileLabel: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  moneyLabel: { color: colors.text, fontWeight: "700", marginBottom: 8 },
  sectionHeader: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 22, marginBottom: 10 },
  monthCard: { marginBottom: 10, gap: 8 },
  monthHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  monthLabel: { color: colors.text, fontWeight: "700" },
  monthScore: { color: colors.text, fontWeight: "800" },
  monthBreakdown: { color: colors.textDim, fontSize: 11 },
  historyCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  historyDate: { color: colors.textDim, fontSize: 12, textTransform: "capitalize" },
  historyStatus: { fontSize: 12, fontWeight: "600" },
  empty: { color: colors.textDim, textAlign: "center", marginTop: 10 },
});
