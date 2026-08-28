import { Alert, Platform } from "react-native";

// En react-native-web, Alert.alert con varios botones no funciona (no hay
// forma de pulsar "Eliminar"), así que en web usamos window.confirm.
export function confirmAsync(title: string, message: string): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(typeof window !== "undefined" ? window.confirm(`${title}\n\n${message}`) : true);
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
      { text: "Eliminar", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}
