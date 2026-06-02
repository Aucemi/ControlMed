export type AlertType =
  | "expired"
  | "low_stock"
  | "pending"
  | "treatment_ending";
export type Alert = {
  id: string;
  type: AlertType;
  title: string;
  message: string;
};