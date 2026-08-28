import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@/theme";

export const ProgressBar: React.FC<{ value: number; gradient?: readonly [string, string] }> = ({
  value,
  gradient = gradients.green,
}) => {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={styles.track}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { width: `${pct * 100}%` }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
