import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { colors, gradients } from "@/theme";
import { formatFriendlyDate } from "@/utils/dates";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function NotesScreen({ navigation }: Props) {
  const { notes, deleteNote } = useApp();
  const [query, setQuery] = useState("");

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
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aún no tienes notas.</Text>
            <Text style={styles.emptyHint}>Guarda aquí apuntes de exámenes, ideas o lo que quieras recordar.</Text>
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
                onPress={() =>
                  Alert.alert("Eliminar nota", `¿Eliminar "${item.title}"?`, [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Eliminar", style: "destructive", onPress: () => deleteNote(item.id) },
                  ])
                }
                style={styles.deleteBtn}
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
  card: { marginBottom: 12, gap: 6 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  title: { color: colors.text, fontWeight: "700", fontSize: 16, flexShrink: 1 },
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
