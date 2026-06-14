import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainMenuScreen from "./screens/MainMenuScreen";
import ProgressScreen from "./screens/ProgressScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#0b0b0d",
              borderTopColor: "rgba(255,255,255,0.08)",
              height: 72,
              paddingBottom: 10,
              paddingTop: 6,
            },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#7d7d87",
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "700",
            },
          }}
        >
          <Tab.Screen name="Übungen" component={MainMenuScreen} />
          <Tab.Screen name="Fortschritt" component={ProgressScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
