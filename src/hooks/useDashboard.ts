import { useEffect, useRef, useState } from "react";
import type { AppData, CodexTask, Settings, TaskStatus } from "../types";
import { storage, defaultSettings } from "../services/storage";
import { MockMonitoringProvider } from "../providers/MonitoringProvider";
import { alarmService } from "../services/AlarmService";
import { transitionTask } from "../utils/tasks";
export function useDashboard() {
  const [error, setError] = useState("");
  const [data, setData] = useState<AppData>(() => {
    try {
      return storage.load();
    } catch (e) {
      queueMicrotask(() => setError(String(e)));
      return { tasks: [], settings: { ...defaultSettings } };
    }
  });
  const [storageBlocked] = useState(() => {
    try {
      storage.load();
      return false;
    } catch {
      return true;
    }
  });
  const provider = useRef(new MockMonitoringProvider()).current;
  useEffect(() => {
    if (storageBlocked) return;
    try {
      storage.save(data);
    } catch {
      setError(
        "Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado; mantenha esta página aberta.",
      );
    }
  }, [data, storageBlocked]);
  useEffect(() => {
    void provider.connect();
    return () => {
      provider.disconnect();
      alarmService.stop();
    };
  }, [provider]);
  async function add(task: CodexTask) {
    await provider.registerTask(task);
    setData((d) => ({ ...d, tasks: [...d.tasks, task] }));
  }
  async function remove(id: string) {
    await provider.removeTask(id);
    alarmService.stop();
    setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
  }
  async function simulate(id: string, status: TaskStatus) {
    if (!data.settings.simulation) return;
    const task = data.tasks.find((t) => t.id === id);
    if (!task || task.status === status) return;
    await provider.registerTask(task);
    provider.simulate(id, status);
    const changed = transitionTask(task, await provider.getTaskStatus(id));
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === id ? changed : t)),
    }));
    if (status === "COMPLETED") alarmService.notify(changed, data.settings);
  }
  function settings(value: Settings) {
    if (!value.sound) alarmService.stop();
    setData((d) => ({ ...d, settings: value }));
  }
  function acknowledge(id: string) {
    alarmService.stop();
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) =>
        t.id === id ? { ...t, acknowledgedAt: Date.now() } : t,
      ),
    }));
  }
  return {
    ...data,
    error,
    add,
    remove,
    simulate,
    updateSettings: settings,
    acknowledge,
  };
}
