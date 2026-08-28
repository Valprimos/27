import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function GoalsScreen({ navigation }: Props) {
  const { goals, deleteGoal } = useApp();
  const activeGoals = goals.filter((g) => g.active);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        data={activeGoals}
        keyExtractor={(g) => g.id}
        ListEmptyComponent={<Text style={styles.empty}>No tienes objetivos todavía.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => navigation.navigate("GoalForm", { goalId: item.id })}>
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
              onPress={() =>
                Alert.alert("Eliminar objetivo", `¿Seguro que quieres eliminar "${item.name}"?`, [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Eliminar", style: "destructive", onPress: () => deleteGoal(item.id) },
                ])
              }
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </Pressable>
          </Pressable>
        )}
      />
      <Pressable style={styles.fab} onPress={() => navigation.navigate("GoalForm", {})}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220" },
  empty: { color: "#94a3b8", textAlign: "center", marginTop: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  icon: { fontSize: 24 },
  name: { color: "#f8fafc", fontSize: 16, fontWeight: "600" },
  meta: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  deleteBtn: { padding: 6 },
  deleteText: { fontSize: 18 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "#22c55e",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#052e14", fontSize: 30, fontWeight: "700", marginTop: -2 },
});
