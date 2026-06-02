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
import { Alert } from "../types/alert";
import { generateAlerts } from "../services/generate-alerts";
export function AlertsScreen() {
  const [alerts, setAlerts] =
    useState<Alert[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  async function fetchAlerts() {
    try {
      setLoading(true);
      const response =
        await api.get("/medications");
      const medications: Medication[] =
        response.data;
      const generatedAlerts =
        generateAlerts(medications);
      setAlerts(generatedAlerts);
    } catch (error) {
      setError("Erro ao carregar alertas");
    } finally {
      setLoading(false);
    }
  }
  function getAlertIcon(type: string) {
    if (type === "expired") return "■■";
    if (type === "low_stock") return "■";
    if (type === "pending") return "■";
    if (type === "treatment_ending") return "■";
    return "■";
  }
  function getAlertLabel(type: string) {
    if (type === "expired") return "Vencido";
    if (type === "low_stock") return "Estoque baixo";
    if (type === "pending") return "Pendente";
    if (type === "treatment_ending") return "Tratamento";
    return "Alerta";
  }
  useFocusEffect(
    useCallback(() => {
      fetchAlerts();
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
          Alertas
        </Text>
        <Text style={styles.subtitle}>
          {alerts.length} alerta(s) ativo(s)
        </Text>
      </View>
      {alerts.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            Tudo certo!
          </Text>
          <Text style={styles.emptyText}>
            Nenhum alerta encontrado no momento.
          </Text>
        </View>
      )}
      {alerts.map((alert) => (
        <View
          key={alert.id}
          style={[
            styles.card,
            alert.type === "expired" &&
            styles.expiredCard,
            alert.type === "low_stock" &&
            styles.lowStockCard,
            alert.type === "pending" &&
            styles.pendingCard,
            alert.type === "treatment_ending" &&
            styles.treatmentCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.icon}>
              {getAlertIcon(alert.type)}
            </Text>
            <View style={styles.cardContent}>
              <Text style={styles.alertTitle}>
                {alert.title}
              </Text>
              <Text style={styles.alertMessage}>
                {alert.message}
              </Text>
            </View>
            <Text style={styles.badge}>
              {getAlertLabel(alert.type)}
            </Text>
          </View>
        </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 6,
  },
  expiredCard: {
    borderLeftColor: "#E74C3C",
  },
  lowStockCard: {
    borderLeftColor: "#F1C40F",
  },
  pendingCard: {
    borderLeftColor: "#4A90E2",
  },
  treatmentCard: {
    borderLeftColor: "#9B59B6",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  alertMessage: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
  badge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emptyCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ECC71",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
