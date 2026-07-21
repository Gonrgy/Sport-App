import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "./screens/DashboardScreen";
import SelectedExercisesScreen from "./screens/SelectedExercisesScreen";
import ModalScreen from "./screens/ModalScreen";
import Tabs from "./screens/BottomTabNavigator";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect, useState } from "react";
import AllExercisesScreen from "./screens/AllExercisesScreen";
import {
  read_categories_data_handler,
  pragma_setzen,
  create_table_kategorie,
  create_table,
} from "./functions/functionsSqLite";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="sport.db"
      onInit={async (db) => {
        await pragma_setzen(db);
        await create_table_kategorie(db);
        await create_table(db);
      }}
    >
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#0b1220" },
          }}
        >
          <Stack.Screen
            name="Dashboard"
            component={Tabs}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            name="Modal"
            component={ModalScreen}
            options={{ cardStyle: { backgroundColor: "transparent" } }}
          />
          <Stack.Screen name="AllExercises" component={AllExercisesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  screenCenter: {
    flex: 1,
    backgroundColor: "#0b1220",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
