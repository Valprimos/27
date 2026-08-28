import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "@/context/AppContext";
import { ScreenBackground } from "@/components/ScreenBackground";
import MainTabs from "@/navigation/MainTabs";
import GoalsScreen from "@/screens/GoalsScreen";
import GoalFormScreen from "@/screens/GoalFormScreen";
import PlanItemFormScreen from "@/screens/PlanItemFormScreen";
import ImportPlanScreen from "@/screens/ImportPlanScreen";
import NoteFormScreen from "@/screens/NoteFormScreen";
import { RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "transparent",
    card: "#0d1220",
    border: colors.divider,
    text: colors.text,
    primary: "#22c55e",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ScreenBackground>
          <NavigationContainer theme={theme}>
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: colors.bgTop },
                headerTintColor: colors.text,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
            >
              <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="Goals" component={GoalsScreen} options={{ title: "" }} />
              <Stack.Screen
                name="GoalForm"
                component={GoalFormScreen}
                options={{ title: "Objetivo", presentation: "modal" }}
              />
              <Stack.Screen
                name="PlanItemForm"
                component={PlanItemFormScreen}
                options={{ title: "Añadir al calendario", presentation: "modal" }}
              />
              <Stack.Screen
                name="ImportPlan"
                component={ImportPlanScreen}
                options={{ title: "Importar plan", presentation: "modal" }}
              />
              <Stack.Screen
                name="NoteForm"
                component={NoteFormScreen}
                options={{ title: "Nota", presentation: "modal" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ScreenBackground>
      </AppProvider>
    </SafeAreaProvider>
  );
}
