import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { NoteArea } from "@/types";
import { GradientButton } from "@/components/GradientButton";
import { KeyboardAvoidingScreen } from "@/components/KeyboardAvoidingScreen";
import { AREA_LABEL, areaGradient, colors } from "@/theme";
import { todayISODate } from "@/utils/dates";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NoteForm">;

const AREAS: NoteArea[] = ["ingles", "instituto", "otro"];

export default function NoteFormScreen({ route, navigation }: Props) {
  const { notes, addNote, updateNote } = useApp();
  const editing = route.params?.noteId ? notes.find((n) => n.id === route.params.noteId) : undefined;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  const [date, setDate] = useState(editing?.date ?? todayISODate());
  const [tagsText, setTagsText] = useState(editing?.tags.join(", ") ?? "");
  const [pinned, setPinned] = useState(editing?.pinned ?? false);
  const [area, setArea] = useState<NoteArea>(editing?.area ?? "otro");
  const [subject, setSubject] = useState(editing?.subject ?? "");
  const [isExam, setIsExam] = useState(!!editing?.examScore);
  const [scoreCorrect, setScoreCorrect] = useState(editing?.examScore ? String(editing.examScore.correct) : "");
  const [scoreTotal, setScoreTotal] = useState(editing?.examScore ? String(editing.examScore.total) : "");

  const knownSubjects = useMemo(
    () =>
      Array.from(new Set(notes.filter((n) => n.area === "instituto" && n.subject).map((n) => n.subject as string))),
    [notes]
  );

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Falta el título", "Ponle un título a la nota.");
      return;
    }
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const examScore =
      isExam && scoreCorrect && scoreTotal
        ? { correct: Number(scoreCorrect), total: Number(scoreTotal) }
        : undefined;

    const payload = {
      title: title.trim(),
      body,
      date,
      tags,
      pinned,
      area,
      subject: area === "instituto" ? subject.trim() || undefined : undefined,
      examScore,
    };

    if (editing) {
      await updateNote({ ...editing, ...payload });
    } else {
      await addNote(payload);
    }
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingScreen>
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Examen de Cálculo II"
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Área</Text>
      <View style={styles.wrapRow}>
        {AREAS.map((a) => (
          <Pressable
            key={a}
            style={[styles.chip, area === a && { backgroundColor: `${areaGradient[a][1]}33`, borderColor: areaGradient[a][1] }]}
            onPress={() => setArea(a)}
          >
            <Text style={styles.chipText}>{AREA_LABEL[a]}</Text>
          </Pressable>
        ))}
      </View>

      {area === "instituto" && (
        <>
          <Text style={styles.label}>Asignatura</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Matemáticas, Física, Historia..."
            placeholderTextColor={colors.textFaint}
          />
          {knownSubjects.length > 0 && (
            <View style={[styles.wrapRow, { marginTop: 8 }]}>
              {knownSubjects.map((s) => (
                <Pressable key={s} style={styles.subjectChip} onPress={() => setSubject(s)}>
                  <Text style={styles.chipText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </>
      )}

      <Text style={styles.label}>Fecha de referencia (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder={todayISODate()}
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Etiquetas (separadas por comas, opcional)</Text>
      <TextInput
        style={styles.input}
        value={tagsText}
        onChangeText={setTagsText}
        placeholder="repaso, dudas..."
        placeholderTextColor={colors.textFaint}
      />

      <Pressable style={styles.pinRow} onPress={() => setIsExam((v) => !v)}>
        <View style={[styles.checkbox, isExam && styles.checkboxOn]}>{isExam && <Text>🎯</Text>}</View>
        <Text style={styles.pinLabel}>Es un examen — guardar puntuación para seguir el progreso</Text>
      </Pressable>

      {isExam && (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Aciertos</Text>
            <TextInput
              style={styles.input}
              value={scoreCorrect}
              onChangeText={setScoreCorrect}
              keyboardType="numeric"
              placeholder="42"
              placeholderTextColor={colors.textFaint}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Sobre un total de</Text>
            <TextInput
              style={styles.input}
              value={scoreTotal}
              onChangeText={setScoreTotal}
              keyboardType="numeric"
              placeholder="50"
              placeholderTextColor={colors.textFaint}
            />
          </View>
        </View>
      )}

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
        gradient={areaGradient[area]}
        onPress={handleSave}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
    </KeyboardAvoidingScreen>
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
  row: { flexDirection: "row", gap: 10 },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  subjectChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  chipText: { color: colors.text, fontSize: 13 },
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
  pinLabel: { color: colors.text, fontWeight: "600", flexShrink: 1 },
});
