import {
    View,
    Text,
    StyleSheet,
    Pressable,
} from "react-native";

import { Medication } from "../types/medication";
type Props = {
    medication: Medication;
    onToggleTaken: () => void;
    onEdit: () => void;
    onDelete: () => void;
    showActions?: boolean;
    patientName?: string;
};

export function MedicationCard({
    medication,
    onToggleTaken,
    onEdit,
    onDelete,
    showActions = true,
    patientName,
}: Props) {
    const isExpired =
        new Date(medication.expirationDate) < new Date();
    const isLowStock =
        Number(medication.stock) <= 5;

    function getStatusText() {
        if (isExpired) return "Vencido";
        if (isLowStock) return "Estoque baixo";
        if (medication.taken) return "Tomado";
        return "Pendente";
    }
    function getStatusStyle() {
        if (isExpired) return styles.expiredStatus;
        if (isLowStock) return styles.lowStockStatus;
        if (medication.taken) return styles.takenStatus;
        return styles.okStatus;
    }
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <Text style={styles.icon}>💊</Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.name}>
                        {medication.name}
                    </Text>
                    <Text style={styles.dosage}>
                        {medication.dosage}
                    </Text>
                    {patientName && (
                        <Text style={styles.patientName}>
                            👤 {patientName}
                        </Text>
                    )}
                </View>
                <Text
                    style={[
                        styles.status,
                        getStatusStyle(),
                    ]}
                >
                    {getStatusText()}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                        🕒 Horário
                    </Text>
                    <Text style={styles.infoValue}>
                        {medication.time}
                    </Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                        📦 Estoque
                    </Text>
                    <Text
                        style={[
                            styles.infoValue,
                            isLowStock && styles.lowStockText,
                        ]}
                    >
                        {medication.stock} unidades
                    </Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                       📅 Validade
                    </Text>
                    <Text
                        style={[
                            styles.infoValue,
                            isExpired && styles.expiredText,
                        ]}
                    >
                        {medication.expirationDate}
                    </Text>
                </View>
            </View>
            <Text style={styles.treatment}>
                Tomar até: {medication.treatmentEndDate}
            </Text>
            {showActions && (
                <View style={styles.actions}>
                    <Pressable
                        style={[
                            styles.actionButton,
                            medication.taken
                                ? styles.undoButton
                                : styles.takeButton,
                        ]}
                        onPress={onToggleTaken}
                    >
                        <Text style={styles.actionButtonText}>
                            {medication.taken
                                ? "Desfazer"
                                : "Marcar como tomado"}
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.actionButton,
                            styles.editButton,
                        ]}
                        onPress={onEdit}
                    >
                        <Text style={styles.editButtonText}>
                           ✏️ Editar
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.actionButton,
                            styles.deleteButton,
                        ]}
                        onPress={onDelete}
                    >
                        <Text style={styles.deleteText}>
                          🗑️ Remover
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 14,
        marginBottom: 14,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#F1F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    icon: {
        fontSize: 22,
    },
    titleContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },
    dosage: {
        fontSize: 14,
        color: "#777",
        marginTop: 2,
    },
    patientName: {
        fontSize: 13,
        color: "#4A90E2",
        marginTop: 2,
    },
    status: {
        fontSize: 12,
        fontWeight: "bold",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: "hidden",
    },
    okStatus: {
        color: "#2ECC71",
        backgroundColor: "#EAFBF0",
    },
    takenStatus: {
        color: "#2ECC71",
        backgroundColor: "#EAFBF0",
    },
    lowStockStatus: {
        color: "#B8860B",
        backgroundColor: "#FFF6D8",
    },
    expiredStatus: {
        color: "#E74C3C",
        backgroundColor: "#FDEDEC",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    infoBox: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: "#777",
    },
    infoValue: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#333",
        marginTop: 2,
    },
    lowStockText: {
        color: "#B8860B",
    },
    expiredText: {
        color: "#E74C3C",
    },
    treatment: {
        fontSize: 13,
        color: "#666",
        marginBottom: 12,
    },
    actions: {
        gap: 8,
    },
    actionButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    takeButton: {
        backgroundColor: "#4A90E2",
    },
    undoButton: {
        backgroundColor: "#8E44AD",
    },
    actionButtonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 13,
    },
    editButton: {
        backgroundColor: "#FFF6D8",
    },
    editButtonText: {
        color: "#B8860B",
        fontWeight: "bold",
        fontSize: 13,
    },
    deleteButton: {
        backgroundColor: "#FDEDEC",
    },
    deleteText: {
        color: "#E74C3C",
        fontWeight: "bold",
        fontSize: 13,
    },
});