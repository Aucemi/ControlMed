import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { Medication } from "../types/medication";
import { Patient } from "../types/patient";
import { MedicationCard } from "../components/medication-card";

export function HomeScreen() {
  const [medications, setMedications] =
    useState<Medication[]>([]);
  const [patients, setPatients] =
    useState<Patient[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  async function fetchData() {
    try {
      setLoading(true);
      const medicationsResponse =
        await api.get("/medications");
      const patientsResponse =
        await api.get("/patients");
      setMedications(medicationsResponse.data);
      setPatients(patientsResponse.data);
    } catch (error) {
      setError("Erro ao carregar dados da Home");
    } finally {
      setLoading(false);
    }
  }
  function getPatientName(patientId: string) {
    const patient = patients.find(
      (item) => item.id === patientId
    );
    return patient
      ? patient.name
      : "Paciente não encontrado";
  }
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const takenMedications =
    medications.filter(
      (medication) => medication.taken
    );
  const pendingMedications =
    medications.filter(
      (medication) => !medication.taken
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
        <Text style={styles.greeting}>
          Bom dia! 👋
        </Text>
        <Text style={styles.date}>
          Controle dos medicamentos de hoje
        </Text>
      </View>
      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>
          Progresso de hoje
        </Text>
        <Text style={styles.progressNumber}>
          {takenMedications.length} / {medications.length}
        </Text>
        <Text style={styles.progressText}>
          medicamentos tomados
        </Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width:
                  medications.length === 0
                    ? "0%"
                    : `${(takenMedications.length / medications.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
      <Text style={styles.sectionTitle}>
        ⏰ Pendentes
      </Text>
      {pendingMedications.length === 0 && (
        <Text style={styles.emptyText}>
          Nenhum medicamento pendente.
        </Text>
      )}
      {pendingMedications.map((medication) => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          patientName={getPatientName(medication.patientId)}
          showActions={false}
          onToggleTaken={() => { }}
          onEdit={() => { }}
          onDelete={() => { }}
        />
      ))}
      <Text style={styles.sectionTitle}>
        ✅ Tomados
      </Text>
      {takenMedications.length === 0 && (
        <Text style={styles.emptyText}>
          Nenhum medicamento tomado ainda.
        </Text>
      )}
      {takenMedications.map((medication) => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          patientName={getPatientName(medication.patientId)}
          showActions={false}
          onToggleTaken={() => { }}
          onEdit={() => { }}
          onDelete={() => { }}
        />
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 20,
    paddingTop: 32,
  },
  greeting: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    color: "#EAF2FF",
    fontSize: 14,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: "#FFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  progressLabel: {
    color: "#777",
    fontSize: 15,
  },
  progressNumber: {
    color: "#4A90E2",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 8,
  },
  progressText: {
    color: "#555",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#DDE8F7",
    borderRadius: 8,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    color: "#333",
  },
  emptyText: {
    color: "#777",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
