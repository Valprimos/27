import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

// Evita que el teclado tape los campos o desajuste el layout al abrirse,
// tanto en iOS (donde hay que desplazar el contenido) como en Android.
export const KeyboardAvoidingScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
