import React from "react";
import { View, StyleSheet } from "react-native";

export const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = "#22c55e" }) => {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1e293b",
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
