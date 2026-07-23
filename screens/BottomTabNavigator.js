import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "./DashboardScreen";
import SelectedExercisesScreen from "./SelectedExercisesScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Übungen") {
            iconName = focused ? "barbell" : "barbell-outline";
          } else if (route.name === "Workout") {
            iconName = focused
              ? "checkmark-done-circle"
              : "checkmark-done-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0b1220",
        tabBarInactiveTintColor: "#0b1220",
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Übungen" component={DashboardScreen} />
      <Tab.Screen name="Workout" component={SelectedExercisesScreen} />
    </Tab.Navigator>
  );
}
