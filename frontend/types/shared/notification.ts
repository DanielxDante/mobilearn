export default interface notification {
  type: "success" | "failure" | "completed";
  title: string;
  subtitle: string;
  timestamp: string;
}
