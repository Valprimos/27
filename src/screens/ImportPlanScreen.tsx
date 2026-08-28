import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { GradientButton } from "@/components/GradientButton";
import { GlassCard } from "@/components/GlassCard";
import { colors, gradients } from "@/theme";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { ImportDocument } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "ImportPlan">;

const EXAMPLE = `{
  "version": 1,
  "planItems": [
    { "date": "2026-05-17", "title": "Entrenamiento de piernas",
      "category": "entrenamiento", "icon": "🏋️", "targetValue": 60, "unit": "minutos" },
    { "date": "2026-05-10", "title": "British Council - C1",
      "category": "ingles", "icon": "🇬🇧", "status": "done" }
  ],
  "notes": [
    { "title": "Examen Cambridge C1", "body": "Repasar listening y writing.",
      "tags": ["examen", "inglés"], "date": "2026-05-10",
      "examScore": { "correct": 42, "total": 50 } }
  ]
}`;

export default function ImportPlanScreen({ navigation }: Props) {
  const { importDocument } = useApp();
  const [text, setText] = useState("");

  async function handleImport() {
    let parsed: ImportDocument;
    try {
      parsed = JSON.parse(text);
    } catch {
      Alert.alert("JSON inválido", "Revisa que hayas pegado el documento completo, tal cual te lo di.");
      return;
    }
    if (!parsed || parsed.version !== 1) {
      Alert.alert("Formato no reconocido", 'El documento debe incluir "version": 1.');
      return;
    }
    try {
      const summary = await importDocument(parsed);
      Alert.alert(
        "Plan importado",
        `Añadido:\n· ${summary.planItemsAdded} eventos al calendario\n· ${summary.notesAdded} notas\n· ${summary.goalsAdded} objetivos nuevos (${summary.goalsUpdated} actualizados)`
      );
      setText("");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error al importar", err.message ?? "Revisa el formato del documento.");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <GlassCard accentGradient={gradients.blue} style={{ marginBottom: 16 }}>
        <Text style={styles.introTitle}>Cómo funciona</Text>
        <Text style={styles.introText}>
          Sin conexión a ninguna IA de pago: habla con Claude en el chat sobre tus objetivos o tu plan de
          entrenamiento, pídele el "documento para importar" y pega aquí el JSON que te dé. La app lo lee
          localmente y actualiza tu calendario, notas y objetivos al instante.
        </Text>
      </GlassCard>

      <Text style={styles.label}>Pega aquí el documento</Text>
      <TextInput
        style={styles.textarea}
        value={text}
        onChangeText={setText}
        multiline
        placeholder={EXAMPLE}
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <GradientButton label="Importar" gradient={gradients.blue} onPress={handleImport} style={{ marginTop: 18 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  introTitle: { color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 6 },
  introText: { color: colors.textDim, fontSize: 13, lineHeight: 19 },
  label: { color: colors.textDim, fontWeight: "600", marginBottom: 8 },
  textarea: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 14,
    padding: 14,
    minHeight: 220,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    fontFamily: "monospace",
    fontSize: 12,
    textAlignVertical: "top",
  },
});
