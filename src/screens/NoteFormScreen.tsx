import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { GradientButton } from "@/components/GradientButton";
import { colors, gradients } from "@/theme";
import { todayISODate } from "@/utils/dates";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NoteForm">;

export default function NoteFormScreen({ route, navigation }: Props) {
  const { notes, addNote, updateNote } = useApp();
  const editing = route.params?.noteId ? notes.find((n) => n.id === route.params.noteId) : undefined;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  const [date, setDate] = useState(editing?.date ?? todayISODate());
  const [tagsText, setTagsText] = useState(editing?.tags.join(", ") ?? "");
  const [pinned, setPinned] = useState(editing?.pinned ?? false);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Falta el título", "Ponle un título a la nota.");
      return;
    }
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editing) {
      await updateNote({ ...editing, title: title.trim(), body, date, tags, pinned });
    } else {
      await addNote({ title: title.trim(), body, date, tags, pinned });
    }
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Examen de Cálculo II"
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Fecha de referencia (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder={todayISODate()}
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Etiquetas (separadas por comas)</Text>
      <TextInput
        style={styles.input}
        value={tagsText}
        onChangeText={setTagsText}
        placeholder="examen, cálculo"
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Contenido</Text>
      <TextInput
        style={[styles.input, { height: 220 }]}
        value={body}
        onChangeText={setBody}
        multiline
        placeholder="Escribe aquí tus apuntes..."
        placeholderTextColor={colors.textFaint}
      />

      <Pressable style={styles.pinRow} onPress={() => setPinned((p) => !p)}>
        <View style={[styles.checkbox, pinned && styles.checkboxOn]}>{pinned && <Text>📌</Text>}</View>
        <Text style={styles.pinLabel}>Fijar arriba</Text>
      </Pressable>

      <GradientButton
        label={editing ? "Guardar cambios" : "Guardar nota"}
        gradient={gradients.pink}
        onPress={handleSave}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textDim, fontWeight: "600", marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    textAlignVertical: "top",
  },
  pinRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 20 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.cardBorderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: "rgba(236,72,153,0.25)", borderColor: "#ec4899" },
  pinLabel: { color: colors.text, fontWeight: "600" },
});
