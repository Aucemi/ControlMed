import { View, Text, StyleSheet } from "react-native";
export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ControlMed</Text>
      <Text style={styles.subtitle}>Controle de medicamentos</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
});