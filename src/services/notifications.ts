import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Medication } from "../types/medication";
import { Patient } from "../types/patient";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === "granted";
  }
  return true;
}
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
export async function cancelMedicationNotification(notificationId?: string) {
  if (!notificationId) {
    return;
  }
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
function isTreatmentFinished(treatmentEndDate: string) {
  const today = new Date();
  const endDate = new Date(treatmentEndDate);
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  return endDate < today;
}
export async function scheduleMedicationNotification(
  medication: Medication,
  patient: Patient,
) {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      alert("Permissão de notificação não concedida.");
      return null;
    }
    if (isTreatmentFinished(medication.treatmentEndDate)) {
      console.log("Tratamento finalizado. Notificação não agendada.");
      return null;
    }
    const [hour, minute] = medication.time.split(":").map(Number);
    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      alert("Horário inválido. Use o formato HH:mm. Exemplo: 08:00");
      return null;
    }
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("medications", {
        name: "Medicamentos",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora do medicamento ",
        body: `${patient.name} deve tomar ${medication.name} ${medication.dosage} agora.`,
        sound: "default",
        data: { medicationId: medication.id, patientId: patient.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    console.log(
      `Notificação diária agendada para ${hour}:${minute}`,
      notificationId,
    );
    return notificationId;
  } catch (error) {
    console.log("Erro ao agendar notificação:", error);
    return null;
  }
}
