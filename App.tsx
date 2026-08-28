import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "@/context/AppContext";
import MainTabs from "@/navigation/MainTabs";
import GoalFormScreen from "@/screens/GoalFormScreen";
import { RootStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0b1220",
    card: "#0b1220",
    border: "#1f2937",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#0b1220" }, headerTintColor: "#f8fafc" }}>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="GoalForm"
              component={GoalFormScreen}
              options={{ title: "Objetivo", presentation: "modal" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
