import { Medication } from "../types/medication";
import { Alert } from "../types/alert";
export function generateAlerts(
    medications: Medication[]
): Alert[] {
    const alerts: Alert[] = [];
    const today = new Date();
    medications.forEach((medication) => {
        const expirationDate =
            new Date(medication.expirationDate);
        const treatmentEndDate =
            new Date(medication.treatmentEndDate);
        const daysToTreatmentEnd =
            Math.ceil(
                (
                    treatmentEndDate.getTime() -
                    today.getTime()
                ) /
                (1000 * 60 * 60 * 24)
            );
        if (expirationDate < today) {
            alerts.push({
                id: `${medication.id}-expired`,
                type: "expired",
                title: medication.name,
                message: "Medicamento vencido",
            });
        }
        if (Number(medication.stock) <= 5) {
            alerts.push({
                id: `${medication.id}-low-stock`,
                type: "low_stock",
                title: medication.name,
                message: `Estoque baixo: ${medication.stock} unidades`,
            });
        }
        if (!medication.taken) {
            alerts.push({
                id: `${medication.id}-pending`,
                type: "pending",
                title: medication.name,
                message: `Pendente para ${medication.time}`,
            });
        }
        if (
            daysToTreatmentEnd >= 0 &&
            daysToTreatmentEnd <= 3
        ) {
            alerts.push({
                id: `${medication.id}-treatment-ending`,
                type: "treatment_ending",
                title: medication.name,
                message: `Tratamento termina em ${daysToTreatmentEnd} dia(s)`,
            });
        }
    });
    return alerts;
}
