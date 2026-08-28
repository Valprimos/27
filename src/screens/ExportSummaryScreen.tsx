import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { KeyboardAvoidingScreen } from "@/components/KeyboardAvoidingScreen";
import { colors, gradients } from "@/theme";
import { generateRangeSummary } from "@/utils/exportSummary";
import { addDays, todayISODate } from "@/utils/dates";

export default function ExportSummaryScreen() {
  const { goals, entries, planItems, notes } = useApp();
  const [startDate, setStartDate] = useState(addDays(todayISODate(), -7));
  const [endDate, setEndDate] = useState(todayISODate());
  const [summary, setSummary] = useState<string | null>(null);

  function handleGenerate() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      Alert.alert("Fechas inválidas", "Usa el formato AAAA-MM-DD en ambas fechas.");
      return;
    }
    setSummary(generateRangeSummary({ startDate, endDate, goals, entries, planItems, notes }));
  }

  async function handleCopy() {
    if (!summary) return;
    await Clipboard.setStringAsync(summary);
    if (Platform.OS === "web") {
      // window.confirm/alert es más fiable que Alert.alert en react-native-web
      window.alert("Copiado al portapapeles. Ya puedes pegarlo en tu conversación con Claude.");
    } else {
      Alert.alert("Copiado", "Ya puedes pegarlo en tu conversación con Claude.");
    }
  }

  return (
    <KeyboardAvoidingScreen>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Exportar resumen</Text>
        <GlassCard accentGradient={gradients.red} style={{ marginBottom: 16 }}>
          <Text style={styles.introText}>
            Elige un tramo de fechas y genera un texto con todo lo que ha pasado en ese periodo (calendario,
            objetivos y notas) para pegárselo a Claude y que te ayude a entender cómo te ha ido.
          </Text>
        </GlassCard>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Desde</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-08-27"
              placeholderTextColor={colors.textFaint}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Hasta</Text>
            <TextInput
              style={styles.input}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="2026-09-04"
              placeholderTextColor={colors.textFaint}
            />
          </View>
        </View>

        <GradientButton label="Generar resumen" gradient={gradients.red} onPress={handleGenerate} style={{ marginTop: 18 }} />

        {summary && (
          <>
            <Text style={styles.label}>Resultado</Text>
            <View style={styles.summaryBox}>
              <Text selectable style={styles.summaryText}>
                {summary}
              </Text>
            </View>
            <GradientButton
              label="📋 Copiar al portapapeles"
              gradient={gradients.green}
              onPress={handleCopy}
              style={{ marginTop: 14 }}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingScreen>
  );
}

const styles = StyleSheet.create({
  header: { color: colors.text, fontSize: 24, fontWeight: "800", marginBottom: 14 },
  introText: { color: colors.textDim, fontSize: 13, lineHeight: 19 },
  row: { flexDirection: "row", gap: 10 },
  label: { color: colors.textDim, fontWeight: "600", marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryText: { color: colors.text, fontSize: 12, lineHeight: 18, fontFamily: "monospace" },
});
