import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Pressable, Alert } from "react-native";
import { useApp } from "@/context/AppContext";

export default function SettingsScreen() {
  const { settings, updateSettings } = useApp();
  const [apiKey, setApiKey] = useState(settings.aiApiKey ?? "");
  const [userName, setUserName] = useState(settings.userName ?? "");

  async function handleSaveApiKey() {
    await updateSettings({ aiApiKey: apiKey || undefined });
    Alert.alert("Guardado", "Tu clave de IA se ha guardado de forma segura en este dispositivo.");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
      <Text style={styles.header}>Perfil</Text>
      <Text style={styles.label}>Tu nombre</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        onBlur={() => updateSettings({ userName })}
        placeholder="¿Cómo te llamas?"
        placeholderTextColor="#64748b"
      />

      <Text style={styles.header}>Asistente inteligente</Text>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Activar IA (Claude)</Text>
        <Switch
          value={settings.aiEnabled}
          onValueChange={(v) => updateSettings({ aiEnabled: v })}
          trackColor={{ true: "#a855f7" }}
        />
      </View>
      <Text style={styles.hint}>
        Introduce tu propia clave de la API de Anthropic (Claude) para recibir planes diarios y
        evaluaciones personalizadas. Se guarda cifrada solo en tu dispositivo, nunca sale de aquí salvo
        para llamar directamente a la API de Anthropic.
      </Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="sk-ant-..."
        placeholderTextColor="#64748b"
        secureTextEntry
        autoCapitalize="none"
      />
      <Pressable style={styles.saveBtn} onPress={handleSaveApiKey}>
        <Text style={styles.saveBtnText}>Guardar clave</Text>
      </Pressable>

      <Text style={styles.header}>Acerca de</Text>
      <Text style={styles.hint}>
        Mis Objetivos Diarios — app personal de seguimiento de hábitos, dinero y notas. Todos tus datos
        se guardan localmente en tu móvil.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220" },
  header: { color: "#f8fafc", fontSize: 18, fontWeight: "700", marginTop: 22, marginBottom: 10 },
  label: { color: "#cbd5e1", fontWeight: "600" },
  hint: { color: "#94a3b8", fontSize: 12, marginVertical: 10, lineHeight: 18 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  input: {
    backgroundColor: "#111827",
    color: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginTop: 8,
  },
  saveBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  saveBtnText: { color: "#052e14", fontWeight: "700" },
});
