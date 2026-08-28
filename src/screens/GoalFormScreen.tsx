import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { GoalKind, WeekDay } from "@/types";
import { WEEKDAY_LABELS } from "@/utils/dates";
import { GradientButton } from "@/components/GradientButton";
import { colors } from "@/theme";
import { goalGradient } from "@/utils/color";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "GoalForm">;

const KIND_OPTIONS: { kind: GoalKind; label: string; icon: string }[] = [
  { kind: "habit", label: "Hábito (sí/no)", icon: "✅" },
  { kind: "numeric", label: "Numérico (minutos, páginas...)", icon: "🔢" },
  { kind: "money", label: "Dinero / ahorro", icon: "💰" },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#a855f7", "#06b6d4"];
const ICONS = ["🎯", "📚", "🏃", "💪", "🧘", "💰", "😴", "💧", "🥗", "🎸", "🧠"];

export default function GoalFormScreen({ route, navigation }: Props) {
  const { goals, addGoal, updateGoal } = useApp();
  const editing = route.params?.goalId ? goals.find((g) => g.id === route.params.goalId) : undefined;

  const [name, setName] = useState(editing?.name ?? "");
  const [kind, setKind] = useState<GoalKind>(editing?.kind ?? "habit");
  const [icon, setIcon] = useState(editing?.icon ?? ICONS[0]);
  const [color, setColor] = useState(editing?.color ?? COLORS[0]);
  const [dailyTarget, setDailyTarget] = useState(editing?.dailyTarget ? String(editing.dailyTarget) : "");
  const [unit, setUnit] = useState(editing?.unit ?? "");
  const [moneyTarget, setMoneyTarget] = useState(editing?.moneyTarget ? String(editing.moneyTarget) : "");
  const [activeDays, setActiveDays] = useState<WeekDay[]>(editing?.activeDays ?? [0, 1, 2, 3, 4, 5, 6]);
  const [notes, setNotes] = useState(editing?.notes ?? "");

  function toggleDay(day: WeekDay) {
    setActiveDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Falta el nombre", "Ponle un nombre a tu objetivo.");
      return;
    }
    const payload = {
      name: name.trim(),
      kind,
      icon,
      color,
      dailyTarget: dailyTarget ? Number(dailyTarget) : undefined,
      unit: unit || undefined,
      moneyTarget: kind === "money" ? Number(moneyTarget) || 0 : undefined,
      moneySaved: editing?.moneySaved ?? 0,
      activeDays,
      notes: notes || undefined,
    };

    if (editing) {
      await updateGoal({ ...editing, ...payload });
    } else {
      await addGoal(payload);
    }
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
      <Text style={styles.label}>Nombre del objetivo</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej. Estudiar inglés"
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.wrapRow}>
        {KIND_OPTIONS.map((opt) => (
          <Pressable
            key={opt.kind}
            style={[styles.chip, kind === opt.kind && styles.chipActive]}
            onPress={() => setKind(opt.kind)}
          >
            <Text style={styles.chipText}>
              {opt.icon} {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {kind !== "money" && (
        <>
          <Text style={styles.label}>Cantidad diaria objetivo</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={dailyTarget}
              onChangeText={setDailyTarget}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor={colors.textFaint}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={unit}
              onChangeText={setUnit}
              placeholder="minutos, páginas..."
              placeholderTextColor={colors.textFaint}
            />
          </View>
        </>
      )}

      {kind === "money" && (
        <>
          <Text style={styles.label}>Meta total (€)</Text>
          <TextInput
            style={styles.input}
            value={moneyTarget}
            onChangeText={setMoneyTarget}
            keyboardType="numeric"
            placeholder="1000"
            placeholderTextColor={colors.textFaint}
          />
        </>
      )}

      <Text style={styles.label}>Icono</Text>
      <View style={styles.wrapRow}>
        {ICONS.map((i) => (
          <Pressable key={i} style={[styles.iconBtn, icon === i && styles.chipActive]} onPress={() => setIcon(i)}>
            <Text style={{ fontSize: 22 }}>{i}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.wrapRow}>
        {COLORS.map((c) => (
          <Pressable
            key={c}
            style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <Text style={styles.label}>Días activos</Text>
      <View style={styles.wrapRow}>
        {WEEKDAY_LABELS.map((label, idx) => (
          <Pressable
            key={label}
            style={[styles.dayChip, activeDays.includes(idx as WeekDay) && styles.chipActive]}
            onPress={() => toggleDay(idx as WeekDay)}
          >
            <Text style={styles.chipText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Por qué es importante este objetivo para ti..."
        placeholderTextColor={colors.textFaint}
      />

      <GradientButton
        label={editing ? "Guardar cambios" : "Crear objetivo"}
        gradient={goalGradient(color)}
        onPress={handleSave}
        style={{ marginTop: 26 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textDim, fontWeight: "600", marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  row: { flexDirection: "row", gap: 10 },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipActive: { backgroundColor: "rgba(34,197,94,0.2)", borderColor: "#22c55e" },
  chipText: { color: colors.text, fontSize: 13 },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDot: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: "transparent" },
  colorDotActive: { borderColor: colors.text },
  dayChip: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
});
