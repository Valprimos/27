import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@/theme";

export const ScreenBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
