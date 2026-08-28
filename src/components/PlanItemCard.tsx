import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { PlanItem } from "@/types";
import { GlassCard } from "./GlassCard";
import { categoryGradient, colors } from "@/theme";

interface Props {
  item: PlanItem;
  onToggle: () => void;
  onDelete: () => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  entrenamiento: "Entrenamiento",
  estudio: "Estudio",
  dinero: "Dinero",
  examen: "Examen",
  otro: "Otro",
};

export const PlanItemCard: React.FC<Props> = ({ item, onToggle, onDelete }) => {
  const gradient = categoryGradient[item.category] ?? categoryGradient.otro;
  return (
    <GlassCard accentGradient={gradient} style={[styles.card, item.completed && styles.cardDone]}>
      <Pressable onPress={onToggle} style={styles.row}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, item.completed && styles.titleDone]}>{item.title}</Text>
          <Text style={styles.meta}>
            {CATEGORY_LABEL[item.category] ?? "Otro"}
            {item.targetValue ? ` · ${item.targetValue} ${item.unit ?? ""}` : ""}
          </Text>
          {!!item.description && <Text style={styles.description}>{item.description}</Text>}
        </View>
        <View style={[styles.checkbox, item.completed && styles.checkboxDone]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>
      <Pressable onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </Pressable>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 10, gap: 4 },
  cardDone: { opacity: 0.55 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: colors.text, fontWeight: "700", fontSize: 15 },
  titleDone: { textDecorationLine: "line-through", color: colors.textDim },
  meta: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  description: { color: colors.textFaint, fontSize: 12, marginTop: 4 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.cardBorderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#34d399", borderColor: "#34d399" },
  checkmark: { color: "#04140c", fontWeight: "800" },
  deleteBtn: { alignSelf: "flex-end", marginTop: 6 },
  deleteText: { color: colors.textFaint, fontSize: 11 },
});
