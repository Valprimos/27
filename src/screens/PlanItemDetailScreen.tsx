import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { useApp } from "@/context/AppContext";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { KeyboardAvoidingScreen } from "@/components/KeyboardAvoidingScreen";
import { CATEGORY_LABEL, categoryGradient, colors, STATUS_META } from "@/theme";
import { formatFriendlyDate } from "@/utils/dates";
import { effectiveStatus } from "@/utils/planItem";
import { confirmAsync } from "@/utils/confirm";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { PlanItemStatus } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "PlanItemDetail">;

const STATUS_OPTIONS: { key: PlanItemStatus; label: string; emoji: string }[] = [
  { key: "done", label: "Lo hice y llegué al objetivo", emoji: "✅" },
  { key: "failed", label: "Lo hice, pero sin llegar al objetivo", emoji: "🟡" },
  { key: "pending", label: "No lo hice / sin marcar", emoji: "⚪️" },
];

export default function PlanItemDetailScreen({ route, navigation }: Props) {
  const { planItems, setPlanItemStatus, recordPlanItemResult, deletePlanItem } = useApp();
  const item = planItems.find((p) => p.id === route.params.planItemId);

  const [pendingChoice, setPendingChoice] = useState<PlanItemStatus | null>(null);
  const [resultValue, setResultValue] = useState(item?.resultValue ? String(item.resultValue) : "");
  const [resultNote, setResultNote] = useState(item?.resultNote ?? "");

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
  const editingChoice = pendingChoice ?? item.status;
  const showResultFields = editingChoice === "done" || editingChoice === "failed";

  async function handleDelete() {
    const ok = await confirmAsync("Eliminar tarea", `¿Eliminar "${item!.title}" del calendario?`);
    if (ok) {
      await deletePlanItem(item!.id);
      navigation.goBack();
    }
  }

  async function handleSaveResult() {
    if (!pendingChoice) return;
    await recordPlanItemResult(item!.id, {
      status: pendingChoice,
      resultValue: resultValue ? Number(resultValue) : undefined,
      resultNote: resultNote || undefined,
    });
    setPendingChoice(null);
  }

  return (
    <KeyboardAvoidingScreen>
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
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
        {(item.resultValue !== undefined || item.resultNote) && !pendingChoice && (
          <View style={styles.resultSummary}>
            {item.resultValue !== undefined && (
              <Text style={styles.resultSummaryText}>
                Resultado: {item.resultValue} {item.unit ?? ""}
              </Text>
            )}
            {item.resultNote && <Text style={styles.resultSummaryText}>“{item.resultNote}”</Text>}
          </View>
        )}
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
            style={[styles.statusOption, editingChoice === opt.key && styles.statusOptionActive]}
            onPress={() => {
              if (opt.key === "pending") {
                setPendingChoice(null);
                setPlanItemStatus(item!.id, "pending");
              } else {
                setPendingChoice(opt.key);
              }
            }}
          >
            <Text style={styles.statusOptionEmoji}>{opt.emoji}</Text>
            <Text style={styles.statusOptionLabel}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>

      {showResultFields && pendingChoice && (
        <View style={styles.resultForm}>
          <Text style={styles.label}>
            Resultado {item.unit ? `(en ${item.unit})` : "(opcional)"}
          </Text>
          <TextInput
            style={styles.input}
            value={resultValue}
            onChangeText={setResultValue}
            keyboardType="numeric"
            placeholder={item.targetValue ? `Objetivo: ${item.targetValue}` : "Ej. 68"}
            placeholderTextColor={colors.textFaint}
          />
          <Text style={styles.label}>Sensaciones / notas (opcional)</Text>
          <TextInput
            style={[styles.input, { height: 90 }]}
            value={resultNote}
            onChangeText={setResultNote}
            multiline
            placeholder="Cómo te sentiste, qué notaste, qué cambiarías..."
            placeholderTextColor={colors.textFaint}
          />
          <GradientButton label="Guardar resultado" gradient={gradient} onPress={handleSaveResult} style={{ marginTop: 12 }} />
        </View>
      )}

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
    </KeyboardAvoidingScreen>
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
  resultSummary: { marginTop: 10, alignItems: "center", gap: 2 },
  resultSummaryText: { color: colors.textDim, fontSize: 12, textAlign: "center" },
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
  resultForm: { marginTop: 16 },
  label: { color: colors.textDim, fontWeight: "600", marginTop: 12, marginBottom: 8 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    textAlignVertical: "top",
  },
  deleteBtn: { alignItems: "center", marginTop: 16 },
  deleteText: { color: "#f87171", fontWeight: "600" },
});
