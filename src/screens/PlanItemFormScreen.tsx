import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { useApp } from "@/context/AppContext";
import { PlanCategory } from "@/types";
import { GradientButton } from "@/components/GradientButton";
import { confirmAsync } from "@/utils/confirm";
import { KeyboardAvoidingScreen } from "@/components/KeyboardAvoidingScreen";
import { categoryGradient, colors } from "@/theme";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PlanItemForm">;

const CATEGORIES: { key: PlanCategory; label: string; icon: string }[] = [
  { key: "entrenamiento", label: "Entrenamiento", icon: "🏋️" },
  { key: "ingles", label: "Inglés", icon: "🇬🇧" },
  { key: "estudio", label: "Estudio", icon: "📚" },
  { key: "examen", label: "Examen", icon: "📝" },
  { key: "dinero", label: "Dinero", icon: "💰" },
  { key: "otro", label: "Otro", icon: "🗓️" },
];

export default function PlanItemFormScreen({ route, navigation }: Props) {
  const { planItems, addPlanItem, updatePlanItem, deletePlanItem } = useApp();
  const editing = route.params?.planItemId ? planItems.find((p) => p.id === route.params.planItemId) : undefined;

  const [date, setDate] = useState(editing?.date ?? route.params?.date ?? "");
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [category, setCategory] = useState<PlanCategory>(editing?.category ?? "entrenamiento");
  const [targetValue, setTargetValue] = useState(editing?.targetValue ? String(editing.targetValue) : "");
  const [unit, setUnit] = useState(editing?.unit ?? "");

  async function handleSave() {
    if (!title.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert("Faltan datos", "Ponle un título y una fecha en formato AAAA-MM-DD.");
      return;
    }
    const cat = CATEGORIES.find((c) => c.key === category)!;
    if (editing) {
      await updatePlanItem({
        ...editing,
        date,
        title: title.trim(),
        description: description || undefined,
        category,
        icon: editing.icon || cat.icon,
        targetValue: targetValue ? Number(targetValue) : undefined,
        unit: unit || undefined,
      });
    } else {
      await addPlanItem({
        date,
        title: title.trim(),
        description: description || undefined,
        category,
        icon: cat.icon,
        targetValue: targetValue ? Number(targetValue) : undefined,
        unit: unit || undefined,
      });
    }
    navigation.goBack();
  }

  async function handleDelete() {
    if (!editing) return;
    const ok = await confirmAsync("Eliminar tarea", `¿Eliminar "${editing.title}" del calendario?`);
    if (ok) {
      await deletePlanItem(editing.id);
      navigation.goBack();
    }
  }

  return (
    <KeyboardAvoidingScreen>
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Fecha (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="2026-05-17"
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Entrenamiento de piernas"
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.wrapRow}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.key}
            style={[styles.chip, category === c.key && styles.chipActive]}
            onPress={() => setCategory(c.key)}
          >
            <Text style={styles.chipText}>
              {c.icon} {c.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Cantidad (opcional)</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={targetValue}
          onChangeText={setTargetValue}
          keyboardType="numeric"
          placeholder="45"
          placeholderTextColor={colors.textFaint}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={unit}
          onChangeText={setUnit}
          placeholder="minutos, series..."
          placeholderTextColor={colors.textFaint}
        />
      </View>

      <Text style={styles.label}>Descripción (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 90 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Detalles, series, temario..."
        placeholderTextColor={colors.textFaint}
      />

      <GradientButton
        label={editing ? "Guardar cambios" : "Guardar en el calendario"}
        gradient={categoryGradient[category]}
        onPress={handleSave}
        style={{ marginTop: 26 }}
      />

      {editing && (
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Eliminar tarea</Text>
        </Pressable>
      )}
    </ScrollView>
    </KeyboardAvoidingScreen>
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
  chipActive: { backgroundColor: "rgba(124,58,237,0.25)", borderColor: "#a855f7" },
  chipText: { color: colors.text, fontSize: 13 },
  deleteBtn: { alignItems: "center", marginTop: 18 },
  deleteText: { color: "#f87171", fontWeight: "600" },
});
