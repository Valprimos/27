import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@/theme";
import { useWebViewportHeight } from "@/hooks/useWebViewportHeight";

export const ScreenBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const webHeight = useWebViewportHeight();

  return (
    <View style={[styles.container, Platform.OS === "web" && webHeight ? { height: webHeight } : null]}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
