import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { PlanItem } from "@/types";
import { GlassCard } from "./GlassCard";
import { CATEGORY_LABEL, categoryGradient, colors } from "@/theme";
import { confirmAsync } from "@/utils/confirm";

interface Props {
  item: PlanItem;
  onPress: () => void;
  onCycleStatus: () => void;
  onDelete: () => void;
}

const STATUS_META = {
  pending: { icon: "", label: "" },
  done: { icon: "✓", label: "Completado" },
  partial: { icon: "½", label: "Parcial" },
};

export const PlanItemCard: React.FC<Props> = ({ item, onPress, onCycleStatus, onDelete }) => {
  const gradient = categoryGradient[item.category] ?? categoryGradient.otro;
  const status = STATUS_META[item.status];

  async function handleDelete() {
    const ok = await confirmAsync("Eliminar tarea", `¿Eliminar "${item.title}" del calendario?`);
    if (ok) onDelete();
  }

  return (
    <GlassCard accentGradient={gradient} style={[styles.card, item.status === "done" && styles.cardDone]}>
      <Pressable onPress={onPress} style={styles.row}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, item.status === "done" && styles.titleDone]}>{item.title}</Text>
          <Text style={styles.meta}>
            {CATEGORY_LABEL[item.category] ?? "Otro"}
            {item.targetValue ? ` · ${item.targetValue} ${item.unit ?? ""}` : ""}
            {item.status === "partial" ? " · Parcial" : ""}
          </Text>
          {!!item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onCycleStatus();
          }}
          style={[
            styles.checkbox,
            item.status === "done" && styles.checkboxDone,
            item.status === "partial" && styles.checkboxPartial,
          ]}
        >
          <Text style={styles.checkmark}>{status.icon}</Text>
        </Pressable>
      </Pressable>
      <Pressable onPress={handleDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </Pressable>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 10, gap: 4 },
  cardDone: { opacity: 0.6 },
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
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.cardBorderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#34d399", borderColor: "#34d399" },
  checkboxPartial: { backgroundColor: "#fbbf24", borderColor: "#fbbf24" },
  checkmark: { color: "#04140c", fontWeight: "800" },
  deleteBtn: { alignSelf: "flex-end", marginTop: 6 },
  deleteText: { color: colors.textFaint, fontSize: 11 },
});
