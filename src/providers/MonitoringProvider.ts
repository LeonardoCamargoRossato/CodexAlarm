import type { CodexTask, TaskStatus } from "../types";
export type ConnectionStatus = "SIMULATION" | "NOT_CONNECTED";
export interface MonitoringProvider {
  connect(): Promise<ConnectionStatus>;
  disconnect(): void;
  getConnectionStatus(): ConnectionStatus;
  registerTask(task: CodexTask): Promise<void>;
  removeTask(id: string): Promise<void>;
  getTaskStatus(id: string): Promise<TaskStatus>;
}
export class MockMonitoringProvider implements MonitoringProvider {
  private tasks = new Map<string, TaskStatus>();
  async connect(): Promise<ConnectionStatus> {
    return "SIMULATION";
  }
  disconnect() {
    this.tasks.clear();
  }
  getConnectionStatus(): ConnectionStatus {
    return "SIMULATION";
  }
  async registerTask(task: CodexTask) {
    this.tasks.set(task.id, task.status);
  }
  async removeTask(id: string) {
    this.tasks.delete(id);
  }
  async getTaskStatus(id: string) {
    return this.tasks.get(id) ?? "UNKNOWN";
  }
  simulate(id: string, status: TaskStatus) {
    if (!this.tasks.has(id)) throw new Error("Tarefa não registrada.");
    this.tasks.set(id, status);
  }
}
export class LocalAgentMonitoringProvider implements MonitoringProvider {
  constructor(readonly endpoint: string) {}
  async connect(): Promise<ConnectionStatus> {
    return "NOT_CONNECTED";
  }
  disconnect() {}
  getConnectionStatus(): ConnectionStatus {
    return "NOT_CONNECTED";
  }
  async registerTask(_task: CodexTask): Promise<void> {
    throw new Error("Agente Local ainda não instalado.");
  }
  async removeTask(_id: string): Promise<void> {
    throw new Error("Agente Local ainda não instalado.");
  }
  async getTaskStatus(_id: string): Promise<TaskStatus> {
    return "UNKNOWN";
  }
}
