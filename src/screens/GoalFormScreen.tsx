import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { Goal, GoalKind, WeekDay } from "@/types";
import { WEEKDAY_LABELS } from "@/utils/dates";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "GoalForm">;

const KIND_OPTIONS: { kind: GoalKind; label: string; icon: string }[] = [
  { kind: "habit", label: "Hábito (sí/no)", icon: "✅" },
  { kind: "numeric", label: "Numérico (minutos, páginas...)", icon: "🔢" },
  { kind: "money", label: "Dinero / ahorro", icon: "💰" },
  { kind: "notes", label: "Notas / diario", icon: "📝" },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#a855f7", "#06b6d4"];
const ICONS = ["🎯", "📚", "🏃", "💪", "🧘", "💰", "📝", "😴", "💧", "🥗", "🎸", "🧠"];

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
  const [activeDays, setActiveDays] = useState<WeekDay[]>(
    editing?.activeDays ?? [0, 1, 2, 3, 4, 5, 6]
  );
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
      <Text style={styles.label}>Nombre del objetivo</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej. Estudiar inglés"
        placeholderTextColor="#64748b"
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

      {kind !== "notes" && kind !== "money" && (
        <>
          <Text style={styles.label}>Cantidad diaria objetivo</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={dailyTarget}
              onChangeText={setDailyTarget}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor="#64748b"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={unit}
              onChangeText={setUnit}
              placeholder="minutos, páginas..."
              placeholderTextColor="#64748b"
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
            placeholderTextColor="#64748b"
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
        placeholderTextColor="#64748b"
      />

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{editing ? "Guardar cambios" : "Crear objetivo"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220" },
  label: { color: "#cbd5e1", fontWeight: "600", marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: "#111827",
    color: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  row: { flexDirection: "row", gap: 10 },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  chipActive: { backgroundColor: "#22c55e33", borderColor: "#22c55e" },
  chipText: { color: "#e2e8f0", fontSize: 13 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "transparent" },
  colorDotActive: { borderColor: "#f8fafc" },
  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  saveBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
  },
  saveBtnText: { color: "#052e14", fontWeight: "700", fontSize: 16 },
});
