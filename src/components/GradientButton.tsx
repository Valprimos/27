import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, radius } from "@/theme";

interface Props {
  label: string;
  onPress: () => void;
  gradient?: readonly [string, string];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

export const GradientButton: React.FC<Props> = ({
  label,
  onPress,
  gradient = gradients.green,
  disabled,
  style,
  textColor = "#04140c",
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.pressable, disabled && { opacity: 0.5 }, style]}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
        <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: { borderRadius: radius.pill, overflow: "hidden" },
  fill: { paddingVertical: 13, alignItems: "center", justifyContent: "center", borderRadius: radius.pill },
  text: { fontWeight: "700", fontSize: 15 },
});
