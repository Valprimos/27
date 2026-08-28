import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { PlanItem } from "@/types";
import { GlassCard } from "./GlassCard";
import { CATEGORY_LABEL, categoryGradient, colors, STATUS_META } from "@/theme";
import { effectiveStatus } from "@/utils/planItem";

interface Props {
  item: PlanItem;
  onPress: () => void;
  onCycleStatus: () => void;
}

export const PlanItemCard: React.FC<Props> = ({ item, onPress, onCycleStatus }) => {
  const gradient = categoryGradient[item.category] ?? categoryGradient.otro;
  const status = effectiveStatus(item);
  const statusMeta = STATUS_META[status];
  const done = item.status === "done";

  return (
    <GlassCard accentGradient={gradient} style={[styles.card, done && styles.cardDone]}>
      <Pressable onPress={onPress} style={styles.row}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, done && styles.titleDone]}>{item.title}</Text>
          <Text style={styles.meta}>
            {CATEGORY_LABEL[item.category] ?? "Otro"}
            {item.targetValue ? ` · ${item.targetValue} ${item.unit ?? ""}` : ""}
            {status !== "pending" ? ` · ${statusMeta.label}` : ""}
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
          style={[styles.checkbox, { borderColor: statusMeta.color }, status !== "pending" && { backgroundColor: statusMeta.color }]}
        >
          <Text style={styles.checkmark}>{item.status === "pending" ? "" : STATUS_META[item.status].icon}</Text>
        </Pressable>
      </Pressable>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 10, gap: 4 },
  cardDone: { opacity: 0.75 },
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
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#04140c", fontWeight: "800" },
});
