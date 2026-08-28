import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, MainTabKey } from "./types";
import HomeScreen from "@/screens/HomeScreen";
import GoalsScreen from "@/screens/GoalsScreen";
import StatsScreen from "@/screens/StatsScreen";
import SettingsScreen from "@/screens/SettingsScreen";

const TABS: { key: MainTabKey; label: string; icon: string }[] = [
  { key: "home", label: "Hoy", icon: "🏠" },
  { key: "goals", label: "Objetivos", icon: "🎯" },
  { key: "stats", label: "Estadísticas", icon: "📊" },
  { key: "settings", label: "Ajustes", icon: "⚙️" },
];

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function MainTabs({ navigation }: Props) {
  const [tab, setTab] = useState<MainTabKey>("home");

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1220" }}>
      <View style={{ flex: 1 }}>
        {tab === "home" && <HomeScreen navigation={navigation} />}
        {tab === "goals" && <GoalsScreen navigation={navigation} />}
        {tab === "stats" && <StatsScreen />}
        {tab === "settings" && <SettingsScreen />}
      </View>
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabIcon, tab === t.key && styles.tabIconActive]}>{t.icon}</Text>
            <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    backgroundColor: "#0b1220",
    paddingBottom: 18,
    paddingTop: 8,
  },
  tabItem: { flex: 1, alignItems: "center", gap: 2 },
  tabIcon: { fontSize: 20, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabLabel: { color: "#64748b", fontSize: 11 },
  tabLabelActive: { color: "#f8fafc", fontWeight: "600" },
});
