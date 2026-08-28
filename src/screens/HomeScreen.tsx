import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { GoalCard } from "@/components/GoalCard";
import { formatFriendlyDate, isScheduledOn, todayISODate } from "@/utils/dates";
import { generateDailyPlan } from "@/services/ai";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function HomeScreen({ navigation }: Props) {
  const { goals, entries, getEntry, setEntryForToday, settings } = useApp();
  const [aiText, setAiText] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const today = todayISODate();
  const todaysGoals = useMemo(
    () => goals.filter((g) => g.active && isScheduledOn(g.activeDays, today)),
    [goals, today]
  );

  const doneCount = todaysGoals.filter((g) => getEntry(g.id, today)?.completed).length;

  async function handleAiPlan() {
    if (!settings.aiEnabled || !settings.aiApiKey) {
      Alert.alert(
        "IA no configurada",
        "Activa la IA y añade tu clave de API en Ajustes para recibir un plan inteligente del día."
      );
      return;
    }
    setLoadingAi(true);
    try {
      const text = await generateDailyPlan({ apiKey: settings.aiApiKey, goals, entries });
      setAiText(text);
    } catch (err: any) {
      Alert.alert("Error de IA", err.message ?? "No se pudo generar el plan.");
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.dateText}>{formatFriendlyDate(today)}</Text>
      <Text style={styles.headerText}>
        {doneCount}/{todaysGoals.length} objetivos completados hoy
      </Text>

      <Pressable style={styles.aiButton} onPress={handleAiPlan} disabled={loadingAi}>
        {loadingAi ? (
          <ActivityIndicator color="#052e14" />
        ) : (
          <Text style={styles.aiButtonText}>✨ Generar plan inteligente del día</Text>
        )}
      </Pressable>

      {aiText && (
        <View style={styles.aiBox}>
          <Text style={styles.aiText}>{aiText}</Text>
        </View>
      )}

      {todaysGoals.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Aún no tienes objetivos para hoy.</Text>
          <Pressable style={styles.btnPrimary} onPress={() => navigation.navigate("GoalForm", {})}>
            <Text style={styles.btnPrimaryText}>Crear mi primer objetivo</Text>
          </Pressable>
        </View>
      )}

      {todaysGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          entry={getEntry(goal.id, today)}
          onMarkDone={(progress) =>
            setEntryForToday(goal.id, {
              completed: true,
              skipped: false,
              progress,
            })
          }
          onMarkSkipped={() => setEntryForToday(goal.id, { skipped: true, completed: false, progress: 0 })}
          onUndo={() => setEntryForToday(goal.id, { completed: false, skipped: false, progress: 0 })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220" },
  dateText: { color: "#94a3b8", fontSize: 13, textTransform: "capitalize" },
  headerText: { color: "#f8fafc", fontSize: 22, fontWeight: "700", marginTop: 4, marginBottom: 16 },
  aiButton: {
    backgroundColor: "#a855f7",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  aiButtonText: { color: "#1e0533", fontWeight: "700" },
  aiBox: {
    backgroundColor: "#1e1033",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#a855f755",
  },
  aiText: { color: "#e9d5ff", lineHeight: 20 },
  emptyBox: { alignItems: "center", gap: 12, paddingVertical: 30 },
  emptyText: { color: "#94a3b8" },
  btnPrimary: { backgroundColor: "#22c55e", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  btnPrimaryText: { color: "#052e14", fontWeight: "700" },
});
