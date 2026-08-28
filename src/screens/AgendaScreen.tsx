import React, { useMemo } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { useApp } from "@/context/AppContext";
import { PlanItemCard } from "@/components/PlanItemCard";
import { GradientButton } from "@/components/GradientButton";
import { formatFriendlyDate, todayISODate } from "@/utils/dates";
import { colors, gradients } from "@/theme";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function AgendaScreen({ navigation }: Props) {
  const { planItems, cyclePlanItemStatus } = useApp();
  const today = todayISODate();

  const sections = useMemo(() => {
    const byDate = new Map<string, typeof planItems>();
    for (const item of planItems) {
      const list = byDate.get(item.date) ?? [];
      list.push(item);
      byDate.set(item.date, list);
    }
    const dates = Array.from(byDate.keys()).sort();
    return dates.map((date) => ({
      title: date,
      data: byDate.get(date)!.sort((a, b) => Number(a.status === "done") - Number(b.status === "done")),
    }));
  }, [planItems]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendario</Text>
        <GradientButton
          label="+ Añadir"
          gradient={gradients.purple}
          onPress={() => navigation.navigate("PlanItemForm", { date: today })}
          style={{ minWidth: 110 }}
        />
      </View>

      <SectionList
        contentContainerStyle={{ padding: 18, paddingTop: 6, paddingBottom: 60 }}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionTitle, section.title === today && styles.sectionTitleToday]}>
            {section.title === today ? "Hoy" : formatFriendlyDate(section.title)}
          </Text>
        )}
        renderItem={({ item }) => (
          <PlanItemCard
            item={item}
            onPress={() => navigation.navigate("PlanItemDetail", { planItemId: item.id })}
            onCycleStatus={() => cyclePlanItemStatus(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Tu calendario está vacío.</Text>
            <Text style={styles.emptyHint}>
              Importa un plan generado en conversación o añade tareas sueltas con fecha (entrenamientos,
              exámenes, lo que sea).
            </Text>
          </View>
        }
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
    paddingBottom: 6,
  },
  headerTitle: { color: colors.text, fontSize: 26, fontWeight: "800" },
  sectionTitle: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitleToday: { color: "#34d399" },
  emptyBox: { alignItems: "center", gap: 8, paddingVertical: 60, paddingHorizontal: 10 },
  emptyText: { color: colors.text, fontWeight: "600", fontSize: 15 },
  emptyHint: { color: colors.textDim, fontSize: 13, textAlign: "center", lineHeight: 18 },
});
