import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, MainTabKey } from "./types";
import HomeScreen from "@/screens/HomeScreen";
import AgendaScreen from "@/screens/AgendaScreen";
import NotesScreen from "@/screens/NotesScreen";
import StatsScreen from "@/screens/StatsScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { colors, gradients, tabGradient } from "@/theme";

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
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View style={{ flex: 1 }}>
        {tab === "home" && <HomeScreen navigation={navigation} />}
        {tab === "agenda" && <AgendaScreen navigation={navigation} />}
        {tab === "notes" && <NotesScreen navigation={navigation} />}
        {tab === "stats" && <StatsScreen navigation={navigation} />}
        {tab === "settings" && <SettingsScreen navigation={navigation} />}
      </View>
      <View style={styles.tabBarWrapper}>
        <LinearGradient colors={gradients.header} style={StyleSheet.absoluteFill} />
        <View style={[styles.tabBar, { paddingBottom: 10 + insets.bottom }]}>
          {TABS.map((t) => {
            const active = tab === t.key;
            const accent = tabGradient[t.key][1];
            return (
              <Pressable key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
                {active && <View style={[styles.activePill, { backgroundColor: `${accent}33` }]} />}
                <Text style={[styles.tabIcon, active && { opacity: 1 }]}>{t.icon}</Text>
                <Text style={[styles.tabLabel, active && { color: accent, fontWeight: "800" }]}>{t.label}</Text>
              </Pressable>
            );
          })}
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
    paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: "center", gap: 3 },
  activePill: {
    position: "absolute",
    top: -6,
    width: "70%",
    height: 34,
    borderRadius: 14,
  },
  tabIcon: { fontSize: 19, opacity: 0.5 },
  tabLabel: { color: colors.textFaint, fontSize: 10 },
});
