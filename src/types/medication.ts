export type Medication = {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  time: string;
  stock: number;
  expirationDate: string;
  treatmentEndDate: string;
  taken: boolean;
  notificationId?: string;
};