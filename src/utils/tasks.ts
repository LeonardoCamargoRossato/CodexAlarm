import type { CodexTask, TaskStatus } from "../types";
export function parseCodexUrl(input: string) {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Informe uma URL válida do Codex.");
  }
  const match = url.pathname.match(/^\/local\/([a-zA-Z0-9_-]+)\/?$/);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "chatgpt.com" ||
    url.port ||
    url.username ||
    url.password ||
    !match
  )
    throw new Error("Use uma URL https://chatgpt.com/local/ID da tarefa.");
  return {
    codexUrl: url.href,
    codexTaskId: match[1],
    hostId: url.searchParams.get("hostId"),
  };
}
export function transitionTask(
  task: CodexTask,
  status: TaskStatus,
  now = Date.now(),
): CodexTask {
  if (task.status === status) return task;
  return {
    ...task,
    status,
    lastUpdatedAt: now,
    monitoringStartedAt:
      status === "MONITORING"
        ? (task.monitoringStartedAt ?? now)
        : task.monitoringStartedAt,
    completedAt: status === "COMPLETED" ? now : null,
    acknowledgedAt: null,
  };
}
export function elapsed(task: CodexTask, now: number) {
  const seconds = Math.max(
    0,
    Math.floor(
      ((task.completedAt ?? now) - (task.monitoringStartedAt ?? now)) / 1000,
    ),
  );
  return [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
