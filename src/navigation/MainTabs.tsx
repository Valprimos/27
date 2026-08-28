import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, MainTabKey } from "./types";
import HomeScreen from "@/screens/HomeScreen";
import AgendaScreen from "@/screens/AgendaScreen";
import NotesScreen from "@/screens/NotesScreen";
import StatsScreen from "@/screens/StatsScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { colors, gradients } from "@/theme";

const TABS: { key: MainTabKey; label: string; icon: string }[] = [
  { key: "home", label: "Hoy", icon: "🏠" },
  { key: "agenda", label: "Calendario", icon: "🗓️" },
  { key: "notes", label: "Notas", icon: "📝" },
  { key: "stats", label: "Estadísticas", icon: "📊" },
  { key: "settings", label: "Ajustes", icon: "⚙️" },
];

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
}

export default function MainTabs({ navigation }: Props) {
  const [tab, setTab] = useState<MainTabKey>("home");

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {tab === "home" && <HomeScreen navigation={navigation} />}
        {tab === "agenda" && <AgendaScreen navigation={navigation} />}
        {tab === "notes" && <NotesScreen navigation={navigation} />}
        {tab === "stats" && <StatsScreen />}
        {tab === "settings" && <SettingsScreen navigation={navigation} />}
      </View>
      <View style={styles.tabBarWrapper}>
        <LinearGradient colors={gradients.header} style={StyleSheet.absoluteFill} />
        <View style={styles.tabBar}>
          {TABS.map((t) => (
            <Pressable key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
              <Text style={[styles.tabIcon, tab === t.key && styles.tabIconActive]}>{t.icon}</Text>
              <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  tabBar: {
    flexDirection: "row",
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: "center", gap: 3 },
  tabIcon: { fontSize: 19, opacity: 0.45 },
  tabIconActive: { opacity: 1 },
  tabLabel: { color: colors.textFaint, fontSize: 10 },
  tabLabelActive: { color: colors.text, fontWeight: "700" },
});
