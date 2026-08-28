import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, radius, shadow } from "@/theme";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accentGradient?: readonly [string, string];
}

export const GlassCard: React.FC<Props> = ({ children, style, accentGradient }) => {
  return (
    <View style={[styles.wrapper, shadow.card, style]}>
      <LinearGradient colors={gradients.glass} style={StyleSheet.absoluteFill} />
      {accentGradient && (
        <LinearGradient
          colors={accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  accentBar: { height: 3, width: "100%" },
  content: { padding: 14 },
});
