import {
  statuses,
  type AppData,
  type CodexTask,
  type Settings,
} from "../types";
export const defaultSettings: Settings = {
  simulation: false,
  sound: true,
  browser: false,
  tone: "default",
  volume: 0.5,
  repeat: false,
  agentEndpoint: "http://127.0.0.1:43117",
};
const key = "codexalarm:v0.1";
function validTask(t: unknown): t is CodexTask {
  if (!t || typeof t !== "object") return false;
  const v = t as CodexTask;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.repository === "string" &&
    typeof v.codexUrl === "string" &&
    /^https:\/\/chatgpt\.com\/local\/[a-zA-Z0-9_-]+(?:[/?#]|$)/.test(
      v.codexUrl,
    ) &&
    typeof v.codexTaskId === "string" &&
    statuses.includes(v.status) &&
    Number.isFinite(v.createdAt) &&
    Number.isFinite(v.lastUpdatedAt) &&
    [v.monitoringStartedAt, v.completedAt, v.acknowledgedAt].every(
      (n) => n === null || Number.isFinite(n),
    ) &&
    !!v.notifications &&
    ["sound", "browser", "email", "mobilePush"].every(
      (k) =>
        typeof v.notifications[k as keyof typeof v.notifications] === "boolean",
    )
  );
}
export const storage = {
  load(): AppData {
    const raw = localStorage.getItem(key);
    if (!raw) return { tasks: [], settings: { ...defaultSettings } };
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.tasks) || !data.tasks.every(validTask))
      throw new Error(
        "Dados locais inválidos. Preserve ou remova os dados deste site nas configurações do navegador.",
      );
    const s = data.settings ?? {};
    return {
      tasks: data.tasks,
      settings: {
        ...defaultSettings,
        ...Object.fromEntries(
          ["simulation", "sound", "browser", "repeat"]
            .filter((k) => typeof s[k] === "boolean")
            .map((k) => [k, s[k]]),
        ),
        ...(typeof s.volume === "number" && s.volume >= 0 && s.volume <= 1
          ? { volume: s.volume }
          : {}),
        ...(["default", "beep", "urgent"].includes(s.tone)
          ? { tone: s.tone }
          : {}),
        ...(typeof s.agentEndpoint === "string"
          ? { agentEndpoint: s.agentEndpoint }
          : {}),
      },
    };
  },
  save(data: AppData) {
    localStorage.setItem(key, JSON.stringify(data));
  },
};
