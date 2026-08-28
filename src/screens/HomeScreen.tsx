import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { GoalCard } from "@/components/GoalCard";
import { PlanItemCard } from "@/components/PlanItemCard";
import { GradientButton } from "@/components/GradientButton";
import { formatFriendlyDate, isScheduledOn, todayISODate } from "@/utils/dates";
import { colors, gradients } from "@/theme";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function HomeScreen({ navigation }: Props) {
  const { goals, entries, getEntry, setEntryForToday, planItems, togglePlanItem, deletePlanItem, settings } =
    useApp();

  const today = todayISODate();
  const todaysGoals = useMemo(
    () => goals.filter((g) => g.active && isScheduledOn(g.activeDays, today)),
    [goals, today]
  );
  const todaysPlanItems = useMemo(
    () => planItems.filter((p) => p.date === today).sort((a, b) => Number(a.completed) - Number(b.completed)),
    [planItems, today]
  );

  const totalTasks = todaysGoals.length + todaysPlanItems.length;
  const doneTasks =
    todaysGoals.filter((g) => getEntry(g.id, today)?.completed).length +
    todaysPlanItems.filter((p) => p.completed).length;

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
      <Text style={styles.dateText}>{formatFriendlyDate(today)}</Text>
      <Text style={styles.greeting}>{settings.userName ? `Hola, ${settings.userName} 👋` : "Hoy"}</Text>
      <Text style={styles.headerText}>
        {doneTasks}/{totalTasks || 0} completados hoy
      </Text>

      <View style={styles.quickRow}>
        <GradientButton
          label="+ Añadir al calendario"
          gradient={gradients.purple}
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("PlanItemForm", { date: today })}
        />
        <GradientButton
          label="⬇ Importar plan"
          gradient={gradients.blue}
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("ImportPlan")}
        />
      </View>

      {totalTasks === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Hoy no tienes nada programado.</Text>
          <Text style={styles.emptyHint}>
            Habla con Claude sobre tu plan, pégalo en "Importar plan" o añade algo suelto con el botón de arriba.
          </Text>
        </View>
      )}

      {todaysPlanItems.map((item) => (
        <PlanItemCard
          key={item.id}
          item={item}
          onToggle={() => togglePlanItem(item.id)}
          onDelete={() => deletePlanItem(item.id)}
        />
      ))}

      {todaysGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          entry={getEntry(goal.id, today)}
          onMarkDone={(progress) => setEntryForToday(goal.id, { completed: true, skipped: false, progress })}
          onMarkSkipped={() => setEntryForToday(goal.id, { skipped: true, completed: false, progress: 0 })}
          onUndo={() => setEntryForToday(goal.id, { completed: false, skipped: false, progress: 0 })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateText: { color: colors.textDim, fontSize: 13, textTransform: "capitalize" },
  greeting: { color: colors.textDim, fontSize: 14, marginTop: 6 },
  headerText: { color: colors.text, fontSize: 26, fontWeight: "800", marginTop: 2, marginBottom: 16 },
  quickRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  emptyBox: { alignItems: "center", gap: 8, paddingVertical: 40, paddingHorizontal: 10 },
  emptyText: { color: colors.text, fontWeight: "600", fontSize: 15 },
  emptyHint: { color: colors.textDim, fontSize: 13, textAlign: "center", lineHeight: 18 },
});
