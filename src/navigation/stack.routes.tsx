import { NavigationContainer }
from "@react-navigation/native";
import {
  createNativeStackNavigator
} from "@react-navigation/native-stack";
import { TabRoutes }
from "./tab.routes";
import { MedicationsScreen }
from "../screens/medications-screen";
const Stack =
  createNativeStackNavigator();
export function StackRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabRoutes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Medicamentos"
          component={MedicationsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}