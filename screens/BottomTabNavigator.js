import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./DashboardScreen";
import SelectedExercisesScreen from "./SelectedExercisesScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen
        name="Selected Exercises"
        component={SelectedExercisesScreen}
      />
    </Tab.Navigator>
  );
}
