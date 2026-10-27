import type { CodexTask, Settings } from "../types";
class AlarmService {
  private context: AudioContext | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  async unlock() {
    this.context ??= new AudioContext();
    await this.context.resume();
  }
  async requestPermission() {
    if (!("Notification" in window))
      throw new Error("Este navegador não oferece notificações.");
    return Notification.requestPermission();
  }
  private play(settings: Settings) {
    if (!this.context || this.context.state !== "running") return;
    const ctx = this.context;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value =
      settings.tone === "urgent" ? 880 : settings.tone === "beep" ? 660 : 440;
    gain.gain.setValueAtTime(settings.volume * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.65);
  }
  sound(settings: Settings) {
    this.stop();
    this.play(settings);
    if (settings.repeat)
      this.timer = setInterval(() => this.play(settings), 1800);
  }
  notify(task: CodexTask, settings: Settings) {
    if (settings.sound && task.notifications.sound) this.sound(settings);
    if (
      settings.browser &&
      task.notifications.browser &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification("Codex terminou — SIMULAÇÃO", {
          body: task.name,
          tag: task.id,
        });
      } catch {
        /* Some mobile browsers require a future service worker. */
      }
    }
  }
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
export const alarmService = new AlarmService();
