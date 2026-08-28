import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { AREA_LABEL, areaGradient, colors, gradients } from "@/theme";
import { formatFriendlyDate } from "@/utils/dates";
import { confirmAsync } from "@/utils/confirm";
import { NoteArea } from "@/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

type AreaFilter = "todas" | NoteArea;

export default function NotesScreen({ navigation }: Props) {
  const { notes, deleteNote } = useApp();
  const [query, setQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("todas");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  const subjects = useMemo(
    () => Array.from(new Set(notes.filter((n) => n.area === "instituto" && n.subject).map((n) => n.subject as string))),
    [notes]
  );

  const examProgress = useMemo(() => {
    let pool = notes.filter((n) => n.examScore);
    if (areaFilter === "ingles") pool = pool.filter((n) => n.area === "ingles");
    else if (areaFilter === "instituto") {
      pool = pool.filter((n) => n.area === "instituto" && (!subjectFilter || n.subject === subjectFilter));
    } else {
      return [];
    }
    return pool.sort((a, b) => a.date.localeCompare(b.date));
  }, [notes, areaFilter, subjectFilter]);

  const filtered = notes.filter((n) => {
    if (areaFilter !== "todas" && n.area !== areaFilter) return false;
    if (areaFilter === "instituto" && subjectFilter && n.subject !== subjectFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
  const sorted = [...filtered].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));

  const progressGradient =
    areaFilter === "ingles" ? areaGradient.ingles : areaFilter === "instituto" ? areaGradient.instituto : gradients.cyan;
  const progressTitle =
    areaFilter === "ingles"
      ? "🇬🇧 Progreso en inglés"
      : areaFilter === "instituto"
      ? `🏫 Progreso${subjectFilter ? ` en ${subjectFilter}` : " en instituto"}`
      : "";

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notas</Text>
        <GradientButton
          label="+ Nueva"
          gradient={gradients.pink}
          style={{ minWidth: 100 }}
          onPress={() => navigation.navigate("NoteForm", {})}
        />
      </View>

      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por título, contenido o etiqueta"
        placeholderTextColor={colors.textFaint}
      />

      <View style={styles.filterRow}>
        {(["todas", "ingles", "instituto", "otro"] as AreaFilter[]).map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, areaFilter === f && styles.filterChipActive]}
            onPress={() => {
              setAreaFilter(f);
              setSubjectFilter(null);
            }}
          >
            <Text style={styles.filterChipText}>{f === "todas" ? "Todas" : AREA_LABEL[f]}</Text>
          </Pressable>
        ))}
      </View>

      {areaFilter === "instituto" && subjects.length > 0 && (
        <View style={[styles.filterRow, { marginTop: 0 }]}>
          <Pressable
            style={[styles.filterChip, !subjectFilter && styles.filterChipActive]}
            onPress={() => setSubjectFilter(null)}
          >
            <Text style={styles.filterChipText}>Todas las asignaturas</Text>
          </Pressable>
          {subjects.map((s) => (
            <Pressable
              key={s}
              style={[styles.filterChip, subjectFilter === s && styles.filterChipActive]}
              onPress={() => setSubjectFilter(s)}
            >
              <Text style={styles.filterChipText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <FlatList
        contentContainerStyle={{ padding: 18, paddingTop: 10, paddingBottom: 60 }}
        data={sorted}
        keyExtractor={(n) => n.id}
        ListHeaderComponent={
          examProgress.length > 0 ? (
            <GlassCard accentGradient={progressGradient} style={styles.progressCard}>
              <Text style={styles.progressTitle}>{progressTitle}</Text>
              {examProgress.map((exam, idx) => {
                const pct = Math.round((exam.examScore!.correct / exam.examScore!.total) * 100);
                const prev = examProgress[idx - 1];
                const prevPct = prev ? Math.round((prev.examScore!.correct / prev.examScore!.total) * 100) : null;
                const trend = prevPct === null ? "" : pct > prevPct ? " ▲" : pct < prevPct ? " ▼" : " =";
                return (
                  <View key={exam.id} style={styles.progressRow}>
                    <Text style={styles.progressDate}>{formatFriendlyDate(exam.date)}</Text>
                    <Text style={styles.progressName} numberOfLines={1}>
                      {exam.title}
                    </Text>
                    <Text style={styles.progressScore}>
                      {exam.examScore!.correct}/{exam.examScore!.total} · {pct}%
                      <Text style={pct >= (prevPct ?? 0) ? styles.trendUp : styles.trendDown}>{trend}</Text>
                    </Text>
                  </View>
                );
              })}
            </GlassCard>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No hay notas aquí todavía.</Text>
            <Text style={styles.emptyHint}>
              Clasifícalas por área (inglés / instituto / otro) y, si son de instituto, por asignatura.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("NoteForm", { noteId: item.id })}>
            <GlassCard accentGradient={areaGradient[item.area] ?? gradients.purple} style={styles.card}>
              <View style={styles.cardHeader}>
                {item.pinned && <Text style={{ marginRight: 6 }}>📌</Text>}
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.areaBadge}>
                {AREA_LABEL[item.area]}
                {item.area === "instituto" && item.subject ? ` · ${item.subject}` : ""}
              </Text>
              {item.examScore && (
                <Text style={styles.scoreBadge}>
                  🎯 {item.examScore.correct}/{item.examScore.total} (
                  {Math.round((item.examScore.correct / item.examScore.total) * 100)}%)
                </Text>
              )}
              <Text style={styles.body} numberOfLines={3}>
                {item.body}
              </Text>
              <View style={styles.footerRow}>
                <Text style={styles.date}>{formatFriendlyDate(item.date)}</Text>
                <View style={styles.tagsRow}>
                  {item.tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Pressable
                onPress={async (e) => {
                  e.stopPropagation();
                  const ok = await confirmAsync("Eliminar nota", `¿Eliminar "${item.title}"?`);
                  if (ok) deleteNote(item.id);
                }}
                style={styles.deleteBtn}
                hitSlop={10}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </GlassCard>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  headerTitle: { color: colors.text, fontSize: 26, fontWeight: "800" },
  search: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    fontSize: 13,
  },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginHorizontal: 18, marginTop: 10 },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterChipActive: { backgroundColor: "rgba(236,72,153,0.2)", borderColor: "#ec4899" },
  filterChipText: { color: colors.text, fontSize: 12, fontWeight: "600" },
  progressCard: { marginBottom: 16, gap: 8 },
  progressTitle: { color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 4 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  progressDate: { color: colors.textFaint, fontSize: 11, width: 60, textTransform: "capitalize" },
  progressName: { color: colors.textDim, fontSize: 12, flex: 1 },
  progressScore: { color: colors.text, fontWeight: "700", fontSize: 12 },
  trendUp: { color: "#34d399" },
  trendDown: { color: "#f87171" },
  card: { marginBottom: 12, gap: 6 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  title: { color: colors.text, fontWeight: "700", fontSize: 16, flexShrink: 1 },
  areaBadge: { color: colors.textFaint, fontSize: 11, fontWeight: "600" },
  scoreBadge: { color: "#67e8f9", fontWeight: "700", fontSize: 12 },
  body: { color: colors.textDim, fontSize: 13, lineHeight: 18 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  date: { color: colors.textFaint, fontSize: 11, textTransform: "capitalize" },
  tagsRow: { flexDirection: "row", gap: 6 },
  tag: { backgroundColor: "rgba(236,72,153,0.18)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { color: "#f9a8d4", fontSize: 10, fontWeight: "600" },
  deleteBtn: { alignSelf: "flex-end", marginTop: 4 },
  deleteText: { color: colors.textFaint, fontSize: 11 },
  emptyBox: { alignItems: "center", gap: 8, paddingVertical: 60 },
  emptyText: { color: colors.text, fontWeight: "600", fontSize: 15 },
  emptyHint: { color: colors.textDim, fontSize: 13, textAlign: "center", lineHeight: 18, paddingHorizontal: 20 },
});
