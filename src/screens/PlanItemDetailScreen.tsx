import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { CATEGORY_LABEL, categoryGradient, colors, STATUS_META } from "@/theme";
import { formatFriendlyDate } from "@/utils/dates";
import { effectiveStatus } from "@/utils/planItem";
import { confirmAsync } from "@/utils/confirm";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { PlanItemStatus } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "PlanItemDetail">;

const STATUS_OPTIONS: { key: PlanItemStatus; label: string; emoji: string }[] = [
  { key: "done", label: "Lo hice bien", emoji: "✅" },
  { key: "failed", label: "Lo intenté, no lo conseguí", emoji: "🟠" },
  { key: "pending", label: "Sin marcar", emoji: "⚪️" },
];

export default function PlanItemDetailScreen({ route, navigation }: Props) {
  const { planItems, setPlanItemStatus, deletePlanItem } = useApp();
  const item = planItems.find((p) => p.id === route.params.planItemId);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.missingText}>Esta tarea ya no existe.</Text>
      </View>
    );
  }

  const gradient = categoryGradient[item.category] ?? categoryGradient.otro;
  const status = effectiveStatus(item);
  const statusMeta = STATUS_META[status];

  async function handleDelete() {
    const ok = await confirmAsync("Eliminar tarea", `¿Eliminar "${item!.title}" del calendario?`);
    if (ok) {
      await deletePlanItem(item!.id);
      navigation.goBack();
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <GlassCard accentGradient={gradient} style={styles.heroCard}>
        <View style={styles.heroIconCircle}>
          <Text style={{ fontSize: 36 }}>{item.icon}</Text>
        </View>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroMeta}>
          {CATEGORY_LABEL[item.category] ?? "Otro"} · {formatFriendlyDate(item.date)}
        </Text>
        {item.targetValue ? (
          <Text style={styles.heroTarget}>
            Objetivo: {item.targetValue} {item.unit ?? ""}
          </Text>
        ) : null}
        <View style={[styles.statusBadge, { borderColor: statusMeta.color }]}>
          <Text style={[styles.statusBadgeText, { color: statusMeta.color }]}>
            {statusMeta.icon ? `${statusMeta.icon} ` : ""}
            {statusMeta.label}
          </Text>
        </View>
      </GlassCard>

      {!!item.description && (
        <GlassCard style={{ marginTop: 14 }}>
          <Text style={styles.descriptionLabel}>Detalle</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </GlassCard>
      )}

      <Text style={styles.sectionLabel}>¿Qué tal te fue?</Text>
      <View style={{ gap: 10 }}>
        {STATUS_OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            style={[styles.statusOption, item.status === opt.key && styles.statusOptionActive]}
            onPress={() => setPlanItemStatus(item!.id, opt.key)}
          >
            <Text style={styles.statusOptionEmoji}>{opt.emoji}</Text>
            <Text style={styles.statusOptionLabel}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>

      <GradientButton
        label="Editar tarea"
        gradient={gradient}
        onPress={() => navigation.navigate("PlanItemForm", { date: item!.date, planItemId: item!.id })}
        style={{ marginTop: 24 }}
      />
      <Pressable onPress={handleDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Eliminar tarea</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  missingText: { color: colors.textDim },
  heroCard: { alignItems: "center", gap: 8, paddingVertical: 22 },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heroTitle: { color: colors.text, fontSize: 20, fontWeight: "800", textAlign: "center" },
  heroMeta: { color: colors.textDim, fontSize: 13, textTransform: "capitalize" },
  heroTarget: { color: colors.textDim, fontSize: 13 },
  statusBadge: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  statusBadgeText: { fontWeight: "700", fontSize: 12 },
  descriptionLabel: { color: colors.textDim, fontWeight: "700", fontSize: 12, marginBottom: 6 },
  descriptionText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  sectionLabel: { color: colors.textDim, fontWeight: "700", marginTop: 22, marginBottom: 10 },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  statusOptionActive: { borderColor: colors.cardBorderStrong, backgroundColor: "rgba(255,255,255,0.09)" },
  statusOptionEmoji: { fontSize: 18 },
  statusOptionLabel: { color: colors.text, fontWeight: "600", flexShrink: 1 },
  deleteBtn: { alignItems: "center", marginTop: 16 },
  deleteText: { color: "#f87171", fontWeight: "600" },
});
