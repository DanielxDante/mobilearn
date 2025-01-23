export default interface notification {
  notification_type: "success" | "info" | "warning";
  title: string;
  timestamp: string;
  body: string;
  id: number;
}
