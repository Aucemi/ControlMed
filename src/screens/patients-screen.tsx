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
    useNavigation,
} from "@react-navigation/native";
import { api } from "../services/api";
import { Patient } from "../types/patient";
import { Medication } from "../types/medication";
import { PatientCard } from "../components/patient-card";
import { cancelMedicationNotification } from "../services/notifications";
export function PatientsScreen() {
    const navigation = useNavigation<any>();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] =
        useState<Patient | null>(null);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [relationship, setRelationship] = useState("");
    async function fetchData() {
        try {
            setLoading(true);
            const patientsResponse = await api.get("/patients");
            const medicationsResponse = await api.get("/medications");
            setPatients(patientsResponse.data);
            setMedications(medicationsResponse.data);
        } catch (error) {
            setError("Erro ao carregar pacientes");
        } finally {
            setLoading(false);
        }
    }
    function clearForm() {
        setName("");
        setAge("");
        setRelationship("");
        setEditingPatient(null);
    }
    function handleEditPatient(patient: Patient) {
        setEditingPatient(patient);
        setName(patient.name);
        setAge(String(patient.age));
        setRelationship(patient.relationship);
        setShowForm(true);
    }
    async function handleSavePatient() {
        if (!name || !age || !relationship) {
            alert("Preencha todos os campos");
            return;
        }
        try {
            if (editingPatient) {
                await api.put(`/patients/${editingPatient.id}`, {
                    ...editingPatient,
                    name,
                    age: Number(age),
                    relationship,
                });
            } else {
                await api.post("/patients", {
                    name,
                    age: Number(age),
                    relationship,
                });
            }
            clearForm();
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert("Erro ao salvar paciente");
        }
    }
    function handleDeletePatient(id: string) {
        Alert.alert(
            "Remover paciente",
            "Tem certeza que deseja remover este paciente? Todos os medicamentos dele também serão removido",
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
                            const response = await api.get("/medications");
                            const patientMedications: Medication[] =
                                response.data.filter(
                                    (medication: Medication) =>
                                        medication.patientId === id
                                );
                            await Promise.all(
                                patientMedications.map(async (medication) => {
                                    await cancelMedicationNotification(
                                        medication.notificationId
                                    );
                                    await api.delete(
                                        `/medications/${medication.id}`
                                    );
                                })
                            );
                            await api.delete(`/patients/${id}`);
                            fetchData();
                        } catch (error) {
                            alert("Erro ao remover paciente");
                        }
                    },
                },
            ]

        );
    }
    function countMedications(patientId: string) {
        return medications.filter(
            (medication) => medication.patientId === patientId
        ).length;
    }
    useFocusEffect(
        useCallback(() => {
            fetchData();
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
                    Pacientes
                </Text>
                <Text style={styles.subtitle}>
                    {patients.length} cadastrado(s)
                </Text>
            </View>
            <Pressable
                style={styles.addButton}
                onPress={() => {
                    if (showForm) {
                        clearForm();
                        setShowForm(false);
                    } else {
                        clearForm();
                        setShowForm(true);
                    }
                }}
            >
                <Text style={styles.addButtonText}>
                    {showForm ? "Cancelar" : "+ Adicionar Paciente"}
                </Text>
            </Pressable>
            {showForm && (
                <View style={styles.form}>
                    <Text style={styles.formTitle}>
                        {editingPatient ? "Editar paciente" : "Novo paciente"}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do paciente"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Idade"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Parentesco. Ex: Mãe, Pai, Avó"
                        value={relationship}
                        onChangeText={setRelationship}
                    />
                    <Pressable
                        style={styles.saveButton}
                        onPress={handleSavePatient}
                    >
                        <Text style={styles.saveButtonText}>
                            {editingPatient
                                ? "Salvar alterações"
                                : "Salvar Paciente"}
                        </Text>
                    </Pressable>
                </View>
            )}
            {patients.map((patient) => (
                <PatientCard
                    key={patient.id}
                    patient={patient}
                    medicationsCount={countMedications(patient.id)}
                    onPress={() =>
                        navigation.navigate("Medicamentos", {
                            patient,
                        })
                    }
                    onEdit={() => handleEditPatient(patient)}
                    onDelete={() => handleDeletePatient(patient.id)}
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
        marginBottom: 20,
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
    errorText: {
        color: "red",
        fontSize: 18,
    },
});