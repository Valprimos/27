import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { colors, gradients } from "@/theme";
import { formatFriendlyDate } from "@/utils/dates";
import { confirmAsync } from "@/utils/confirm";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function NotesScreen({ navigation }: Props) {
  const { notes, deleteNote } = useApp();
  const [query, setQuery] = useState("");

  const englishExams = useMemo(
    () =>
      notes
        .filter((n) => n.examScore && n.tags.some((t) => t.toLowerCase().includes("ingl")))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [notes]
  );

  const filtered = notes.filter((n) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
  const sorted = [...filtered].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));

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
        placeholder="Buscar por título, contenido o etiqueta (ej. examen)"
        placeholderTextColor={colors.textFaint}
      />

      <FlatList
        contentContainerStyle={{ padding: 18, paddingTop: 10, paddingBottom: 60 }}
        data={sorted}
        keyExtractor={(n) => n.id}
        ListHeaderComponent={
          englishExams.length > 0 ? (
            <GlassCard accentGradient={gradients.cyan} style={styles.progressCard}>
              <Text style={styles.progressTitle}>🇬🇧 Progreso en inglés</Text>
              {englishExams.map((exam, idx) => {
                const pct = Math.round((exam.examScore!.correct / exam.examScore!.total) * 100);
                const prev = englishExams[idx - 1];
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
            <Text style={styles.emptyText}>Aún no tienes notas.</Text>
            <Text style={styles.emptyHint}>
              Guarda aquí apuntes de exámenes, ideas o lo que quieras recordar. Marca una nota como examen para
              seguir tu progreso en inglés.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("NoteForm", { noteId: item.id })}>
            <GlassCard accentGradient={gradients.pink} style={styles.card}>
              <View style={styles.cardHeader}>
                {item.pinned && <Text style={{ marginRight: 6 }}>📌</Text>}
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
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
