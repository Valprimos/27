import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { KeyboardAvoidingScreen } from "@/components/KeyboardAvoidingScreen";
import { colors, gradients } from "@/theme";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings } = useApp();
  const [userName, setUserName] = useState(settings.userName ?? "");

  return (
    <KeyboardAvoidingScreen>
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Ajustes</Text>

      <Text style={styles.label}>Tu nombre</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        onBlur={() => updateSettings({ userName })}
        placeholder="¿Cómo te llamas?"
        placeholderTextColor={colors.textFaint}
      />

      <Pressable onPress={() => navigation.navigate("ImportPlan")} style={{ marginTop: 20 }}>
        <GlassCard accentGradient={gradients.blue}>
          <Text style={styles.rowTitle}>⬇ Importar plan</Text>
          <Text style={styles.rowHint}>
            Pega el documento con tu plan (entrenamientos, notas, objetivos) que Claude te dé en la conversación.
          </Text>
        </GlassCard>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Goals")} style={{ marginTop: 12 }}>
        <GlassCard accentGradient={gradients.green}>
          <Text style={styles.rowTitle}>🎯 Objetivos recurrentes</Text>
          <Text style={styles.rowHint}>Hábitos, ahorro y metas numéricas que se repiten cada semana.</Text>
        </GlassCard>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ExportSummary")} style={{ marginTop: 12 }}>
        <GlassCard accentGradient={gradients.red}>
          <Text style={styles.rowTitle}>📤 Exportar resumen para Claude</Text>
          <Text style={styles.rowHint}>
            Elige un tramo de fechas y genera un texto para pegarle a Claude, contándole cómo te ha ido.
          </Text>
        </GlassCard>
      </Pressable>

      <Text style={styles.header}>Acerca de</Text>
      <GlassCard accentGradient={gradients.purple}>
        <Text style={styles.aboutText}>
          Mis Objetivos Diarios — app personal de seguimiento de hábitos, dinero, calendario y notas. Todos
          tus datos se guardan localmente en tu dispositivo. Sin cuentas, sin nube, sin IA de pago: el plan
          se importa como texto desde tu conversación con Claude.
        </Text>
      </GlassCard>
    </ScrollView>
    </KeyboardAvoidingScreen>
  );
}

const styles = StyleSheet.create({
  header: { color: colors.text, fontSize: 22, fontWeight: "800", marginTop: 14, marginBottom: 12 },
  label: { color: colors.textDim, fontWeight: "600" },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: 8,
  },
  rowTitle: { color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 4 },
  rowHint: { color: colors.textDim, fontSize: 12, lineHeight: 17 },
  aboutText: { color: colors.textDim, fontSize: 12, lineHeight: 18 },
});
