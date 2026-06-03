import { View, Text, StyleSheet, Pressable } from "react-native";
import { Patient } from "../types/patient";
type Props = {
  patient: Patient;
  medicationsCount?: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};
export function PatientCard({
  patient,
  medicationsCount = 0,
  onPress,
  onEdit,
  onDelete,
}: Props) {
  const initials = patient.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.info}>
          {patient.age} anos · {patient.relationship}
        </Text>
        <Text style={styles.medications}>
          💊 {medicationsCount} medicamento(s)
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={onEdit}>
            <Text style={styles.editText}>
              ✏️ Editar</Text>
          </Pressable>
          <Pressable onPress={onDelete}>
            <Text style={styles.deleteText}>
              🗑️ Remover</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#BBD7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E5C91",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  medications: {
    fontSize: 14,
    color: "#4A90E2",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 18,
    marginTop: 12,
  },
  editText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  deleteText: {
    color: "#E74C3C",
    fontWeight: "600",
  },
  arrow: {
    fontSize: 28,
    color: "#AAA",
  },
});
