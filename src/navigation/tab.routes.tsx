import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../screens/home-screen";
import { PatientsScreen } from "../screens/patients-screen";
import { AlertsScreen } from "../screens/alerts-screen";
const Tab = createBottomTabNavigator();
export function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#FFF",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "people"
            | "people-outline"
            | "notifications"
            | "notifications-outline" = "home-outline";
          if (route.name === "Início") {
            iconName = color === "#4A90E2" ? "home" : "home-outline";
          }
          if (route.name === "Pacientes") {
            iconName = color === "#4A90E2" ? "people" : "people-outline";
          }
          if (route.name === "Alertas") {
            iconName =
              color === "#4A90E2"
                ? "notifications"
                : "notifications-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Pacientes"
        component={PatientsScreen}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertsScreen}
      />
    </Tab.Navigator>
  );
}