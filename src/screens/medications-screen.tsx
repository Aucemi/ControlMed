import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";

import {
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";

import { scheduleMedicationNotification, cancelMedicationNotification } from "../services/notifications";
import { api } from "../services/api";
import { Medication } from "../types/medication";
import { MedicationCard } from "../components/medication-card";

export function MedicationsScreen() {
  const route = useRoute<any>();
  const { patient } = route.params;
  const [medications, setMedications] =
    useState<Medication[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [showForm, setShowForm] =
    useState(false);
  const [editingMedication, setEditingMedication] =
    useState<Medication | null>(null);
  const [name, setName] =
    useState("");
  const [dosage, setDosage] =
    useState("");
  const [time, setTime] =
    useState("");
  const [stock, setStock] =
    useState("");
  const [expirationDate, setExpirationDate] =
    useState("");
  const [treatmentEndDate, setTreatmentEndDate] =
    useState("");
  async function fetchMedications() {
    try {
      setLoading(true);
      const response =
        await api.get("/medications");
      const patientMedications =
        response.data.filter(
          (medication: Medication) =>
            medication.patientId === patient.id
        );
      setMedications(patientMedications);
    } catch (error) {
      setError("Erro ao carregar medicamentos");
    } finally {
      setLoading(false);
    }
  }
  function clearForm() {
    setName("");
    setDosage("");
    setTime("");
    setStock("");
    setExpirationDate("");
    setTreatmentEndDate("");
    setEditingMedication(null);
  }
  function handleEditMedication(
    medication: Medication
  ) {
    setEditingMedication(medication);
    setName(medication.name);
    setDosage(medication.dosage);
    setTime(medication.time);
    setStock(String(medication.stock));
    setExpirationDate(medication.expirationDate);
    setTreatmentEndDate(
      medication.treatmentEndDate
    );
    setShowForm(true);
  }
  async function handleSaveMedication() {
    if (
      !name ||
      !dosage ||
      !time ||
      !stock ||
      !expirationDate ||
      !treatmentEndDate
    ) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      if (editingMedication) {
        await cancelMedicationNotification(
          editingMedication.notificationId
        );
        const updatedMedication: Medication = {
          ...editingMedication,
          name,
          dosage,
          time,
          stock: Number(stock),
          expirationDate,
          treatmentEndDate,
          notificationId: undefined,
        };
        const newNotificationId =
          await scheduleMedicationNotification(
            updatedMedication,
            patient
          );
        await api.put(
          `/medications/${editingMedication.id}`,
          {
            ...updatedMedication,
            notificationId:
              newNotificationId || undefined,
          }
        );
      } else {
        const medicationData = {
          patientId: patient.id,
          name,
          dosage,
          time,
          stock: Number(stock),
          expirationDate,
          treatmentEndDate,
          taken: false,
        };
        const response =
          await api.post(
            "/medications",
            medicationData
          );
        const createdMedication: Medication =
          response.data;
        const notificationId =
          await scheduleMedicationNotification(
            createdMedication,
            patient
          );
        if (notificationId) {
          await api.put(
            `/medications/${createdMedication.id}`,
            {
              ...createdMedication,
              notificationId,
            }
          );
        }
      }
      clearForm();
      setShowForm(false);
      fetchMedications();
    } catch (error) {
      alert("Erro ao salvar medicamento");
    }
  }
  async function handleToggleTaken(
    medication: Medication
  ) {
    try {
      await api.put(
        `/medications/${medication.id}`,
        {
          ...medication,
          taken: !medication.taken,
        }
      );
      fetchMedications();
    } catch (error) {
      alert("Erro ao atualizar status do medicamento");
    }
  }
  function handleDeleteMedication(
    medication: Medication
  ) {
    Alert.alert(
      "Remover medicamento",
      "Tem certeza que deseja remover este medicamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelMedicationNotification(
                medication.notificationId
              );
              await api.delete(
                `/medications/${medication.id}`
              );
              fetchMedications();
            } catch (error) {
              alert("Erro ao remover medicamento");
            }
          },
        },
      ]
    );
  }
  function handleCancelEdit() {
    clearForm();
    setShowForm(false);
  }
  useFocusEffect(
    useCallback(() => {
      fetchMedications();
    }, [])
  );
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Medicamentos
        </Text>
        <Text style={styles.subtitle}>
          {patient.name}
        </Text>
      </View>
      <Pressable
        style={styles.addButton}
        onPress={() => {
          if (showForm) {
            handleCancelEdit();
          } else {
            clearForm();
            setShowForm(true);
          }
        }}
      >
        <Text style={styles.addButtonText}>
          {showForm
            ? "Cancelar"
            : "+ Adicionar Medicamento"}
        </Text>
      </Pressable>
      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingMedication
              ? "Editar medicamento"
              : "Novo medicamento"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do medicamento"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Dosagem. Ex: 500mg"
            value={dosage}
            onChangeText={setDosage}
          />
          <TextInput
            style={styles.input}
            placeholder="Horário. Ex: 08:00"
            value={time}
            onChangeText={setTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Estoque. Ex: 30"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Validade. Ex: 2026-12-01"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Tomar até. Ex: 2026-12-01"
            value={treatmentEndDate}
            onChangeText={setTreatmentEndDate}
          />
          <Pressable
            style={styles.saveButton}
            onPress={handleSaveMedication}
          >
            <Text style={styles.saveButtonText}>
              {editingMedication
                ? "Salvar alterações"
                : "Salvar Medicamento"}
            </Text>
          </Pressable>
        </View>
      )}
      {medications.length === 0 && (
        <Text style={styles.emptyText}>
          Nenhum medicamento cadastrado.
        </Text>
      )}
      {medications.map((medication) => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          onToggleTaken={() =>
            handleToggleTaken(medication)
          }
          onEdit={() =>
            handleEditMedication(medication)
          }
          onDelete={() =>
            handleDeleteMedication(medication)
          }
        />
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  form: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F1F1F1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#2ECC71",
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});