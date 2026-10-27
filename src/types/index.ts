export const statuses = [
  "WAITING",
  "MONITORING",
  "COMPLETED",
  "ERROR",
  "ATTENTION",
  "UNKNOWN",
] as const;
export type TaskStatus = (typeof statuses)[number];
export const labels: Record<TaskStatus, string> = {
  WAITING: "Aguardando",
  MONITORING: "Monitorando",
  COMPLETED: "Concluído",
  ERROR: "Erro",
  ATTENTION: "Atenção",
  UNKNOWN: "Desconhecido",
};
export interface Notifications {
  sound: boolean;
  browser: boolean;
  email: boolean;
  mobilePush: boolean;
}
export interface CodexTask {
  id: string;
  name: string;
  codexUrl: string;
  codexTaskId: string;
  hostId: string | null;
  repository: string;
  status: TaskStatus;
  createdAt: number;
  monitoringStartedAt: number | null;
  completedAt: number | null;
  acknowledgedAt: number | null;
  lastUpdatedAt: number;
  notifications: Notifications;
}
export interface Settings {
  simulation: boolean;
  sound: boolean;
  browser: boolean;
  tone: "default" | "beep" | "urgent";
  volume: number;
  repeat: boolean;
  agentEndpoint: string;
}
export interface AppData {
  tasks: CodexTask[];
  settings: Settings;
}
