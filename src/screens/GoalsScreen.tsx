import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { colors, gradients } from "@/theme";
import { goalGradient } from "@/utils/color";
import { confirmAsync } from "@/utils/confirm";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Goals">;

export default function GoalsScreen({ navigation }: Props) {
  const { goals, deleteGoal } = useApp();
  const activeGoals = goals.filter((g) => g.active);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Objetivos recurrentes</Text>
        <GradientButton
          label="+ Nuevo"
          gradient={gradients.green}
          style={{ minWidth: 100 }}
          onPress={() => navigation.navigate("GoalForm", {})}
        />
      </View>
      <FlatList
        contentContainerStyle={{ padding: 18, paddingTop: 10, paddingBottom: 60 }}
        data={activeGoals}
        keyExtractor={(g) => g.id}
        ListEmptyComponent={<Text style={styles.empty}>No tienes objetivos recurrentes todavía.</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("GoalForm", { goalId: item.id })}>
            <GlassCard accentGradient={goalGradient(item.color)} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.icon}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.kind === "money"
                      ? `Meta: ${item.moneyTarget ?? 0}€`
                      : `${item.dailyTarget ?? "—"} ${item.unit ?? ""} / día`}
                  </Text>
                </View>
                <Pressable
                  onPress={async (e) => {
                    e.stopPropagation();
                    const ok = await confirmAsync("Eliminar objetivo", `¿Seguro que quieres eliminar "${item.name}"?`);
                    if (ok) deleteGoal(item.id);
                  }}
                  style={styles.deleteBtn}
                  hitSlop={10}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>
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
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: "800", flexShrink: 1, marginRight: 10 },
  empty: { color: colors.textDim, textAlign: "center", marginTop: 40 },
  card: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { fontSize: 24 },
  name: { color: colors.text, fontSize: 16, fontWeight: "700" },
  meta: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  deleteBtn: { padding: 6 },
  deleteText: { fontSize: 18 },
});
