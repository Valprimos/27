import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { CATEGORY_LABEL, categoryGradient, colors, STATUS_META } from "@/theme";
import { effectiveStatus } from "@/utils/planItem";
import { formatFriendlyDate, todayISODate } from "@/utils/dates";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "CategoryStats">;

export default function CategoryStatsScreen({ route, navigation }: Props) {
  const { planItems, notes } = useApp();
  const { category } = route.params;
  const today = todayISODate();
  const gradient = categoryGradient[category] ?? categoryGradient.otro;

  const items = useMemo(
    () => planItems.filter((p) => p.category === category).sort((a, b) => b.date.localeCompare(a.date)),
    [planItems, category]
  );

  const resolved = items.filter((i) => i.date <= today || i.status !== "pending");
  const done = resolved.filter((i) => effectiveStatus(i) === "done").length;
  const failed = resolved.filter((i) => effectiveStatus(i) === "failed").length;
  const missed = resolved.filter((i) => effectiveStatus(i) === "missed").length;
  const upcoming = items.length - resolved.length;
  // "failed" cuenta como hecho (lo hiciste, sin llegar al objetivo marcado):
  // no resta nada. Solo "missed" (no lo hiciste ese día) baja el %.
  const score = resolved.length > 0 ? (done + failed) / resolved.length : 0;

  const byMonth = useMemo(() => {
    const map = new Map<string, { done: number; failed: number; missed: number; total: number }>();
    for (const i of resolved) {
      const month = i.date.slice(0, 7);
      const entry = map.get(month) ?? { done: 0, failed: 0, missed: 0, total: 0 };
      entry.total++;
      const s = effectiveStatus(i);
      if (s === "done") entry.done++;
      else if (s === "failed") entry.failed++;
      else if (s === "missed") entry.missed++;
      map.set(month, entry);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [resolved]);

  const englishExams = useMemo(
    () =>
      category === "ingles"
        ? notes.filter((n) => n.area === "ingles" && n.examScore).sort((a, b) => a.date.localeCompare(b.date))
        : [],
    [notes, category]
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <Text style={styles.header}>{CATEGORY_LABEL[category] ?? category}</Text>

      <View style={styles.summaryRow}>
        <SummaryTile label="Éxito" value={`${Math.round(score * 100)}%`} gradient={gradient} />
        <SummaryTile label="Al objetivo" value={String(done)} gradient={["#34d399", "#059669"] as const} />
        <SummaryTile label="Sin llegar" value={String(failed)} gradient={["#fcd34d", "#d97706"] as const} />
        <SummaryTile label="Perdidas" value={String(missed)} gradient={["#94a3b8", "#475569"] as const} />
      </View>
      {upcoming > 0 && <Text style={styles.upcomingText}>+ {upcoming} programadas para más adelante</Text>}

      {category === "ingles" && englishExams.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Progreso en exámenes</Text>
          <GlassCard accentGradient={categoryGradient.ingles}>
            {englishExams.map((exam, idx) => {
              const pct = Math.round((exam.examScore!.correct / exam.examScore!.total) * 100);
              const prev = englishExams[idx - 1];
              const prevPct = prev ? Math.round((prev.examScore!.correct / prev.examScore!.total) * 100) : null;
              const trend = prevPct === null ? "" : pct > prevPct ? " ▲" : pct < prevPct ? " ▼" : " =";
              return (
                <View key={exam.id} style={styles.examRow}>
                  <Text style={styles.examDate}>{formatFriendlyDate(exam.date)}</Text>
                  <Text style={styles.examName} numberOfLines={1}>
                    {exam.title}
                  </Text>
                  <Text style={styles.examScore}>
                    {pct}%<Text style={pct >= (prevPct ?? 0) ? styles.trendUp : styles.trendDown}>{trend}</Text>
                  </Text>
                </View>
              );
            })}
          </GlassCard>
        </>
      )}

      {byMonth.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Por mes</Text>
          {byMonth.map(([month, m]) => (
            <GlassCard key={month} accentGradient={gradient} style={styles.monthCard}>
              <View style={styles.monthHeaderRow}>
                <Text style={styles.monthLabel}>{month}</Text>
                <Text style={styles.monthScore}>{Math.round(((m.done + m.failed) / m.total) * 100)}%</Text>
              </View>
              <ProgressBar value={(m.done + m.failed) / m.total} gradient={gradient} />
              <Text style={styles.monthBreakdown}>
                ✅ {m.done} al objetivo · 🟡 {m.failed} hecho, sin llegar · – {m.missed} perdidas · {m.total} en total
              </Text>
            </GlassCard>
          ))}
        </>
      )}

      <Text style={styles.sectionHeader}>Historial</Text>
      {items.map((item) => {
        const s = effectiveStatus(item, today);
        const meta = STATUS_META[s];
        return (
          <Pressable key={item.id} onPress={() => navigation.navigate("PlanItemDetail", { planItemId: item.id })}>
            <GlassCard style={styles.historyCard}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyDate}>{formatFriendlyDate(item.date)}</Text>
              </View>
              <Text style={[styles.historyStatus, { color: meta.color }]}>
                {meta.icon || "•"} {meta.label}
              </Text>
            </GlassCard>
          </Pressable>
        );
      })}
      {items.length === 0 && <Text style={styles.empty}>Todavía no hay tareas en esta categoría.</Text>}
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
  header: { color: colors.text, fontSize: 24, fontWeight: "800", marginBottom: 14 },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { flexBasis: "47%" },
  tileValue: { fontSize: 22, fontWeight: "800", color: colors.text },
  tileLabel: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  upcomingText: { color: colors.textFaint, fontSize: 12, marginTop: 10 },
  sectionHeader: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 22, marginBottom: 10 },
  examRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  examDate: { color: colors.textFaint, fontSize: 11, width: 60, textTransform: "capitalize" },
  examName: { color: colors.textDim, fontSize: 12, flex: 1 },
  examScore: { color: colors.text, fontWeight: "700", fontSize: 12 },
  trendUp: { color: "#34d399" },
  trendDown: { color: "#f87171" },
  monthCard: { marginBottom: 10, gap: 8 },
  monthHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  monthLabel: { color: colors.text, fontWeight: "700" },
  monthScore: { color: colors.text, fontWeight: "800" },
  monthBreakdown: { color: colors.textDim, fontSize: 11 },
  historyCard: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  historyTitle: { color: colors.text, fontWeight: "600", fontSize: 13 },
  historyDate: { color: colors.textFaint, fontSize: 11, textTransform: "capitalize" },
  historyStatus: { fontSize: 11, fontWeight: "700" },
  empty: { color: colors.textDim, textAlign: "center", marginTop: 10 },
});
