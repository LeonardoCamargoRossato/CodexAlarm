import type { CodexTask, TaskStatus } from "../types";
import { labels } from "../types";
import { elapsed } from "../utils/tasks";
const date = (n: number) => new Date(n).toLocaleString("pt-BR");
export function TaskCard({
  task,
  now,
  simulation,
  onStatus,
  onRemove,
}: {
  task: CodexTask;
  now: number;
  simulation: boolean;
  onStatus: (id: string, status: TaskStatus) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <article className="task-card">
      <div className="section-heading">
        <span className={`badge ${task.status.toLowerCase()}`}>
          ● {labels[task.status]}
        </span>
        <button
          className="icon-button"
          onClick={() => {
            if (confirm(`Remover “${task.name}”?`)) onRemove(task.id);
          }}
          aria-label={`Remover ${task.name}`}
        >
          ✕
        </button>
      </div>
      <h3>{task.name}</h3>
      <p className="repository">{task.repository || "Sem projeto associado"}</p>
      <div className="timer">{elapsed(task, now)}</div>
      <span className="eyebrow">
        TEMPO DESDE O INÍCIO{" "}
        {task.monitoringStartedAt ? "SIMULADO" : "— AGUARDANDO"}
      </span>
      <dl>
        <dt>Adicionado</dt>
        <dd>{date(task.createdAt)}</dd>
        <dt>Última atualização</dt>
        <dd>{date(task.lastUpdatedAt)}</dd>
        <dt>Agente Local</dt>
        <dd>Desconectado</dd>
        <dt>Task ID</dt>
        <dd className="mono">{task.codexTaskId}</dd>
        {task.hostId && (
          <>
            <dt>Host ID</dt>
            <dd>{task.hostId}</dd>
          </>
        )}
      </dl>
      <p className="task-url">{task.codexUrl}</p>
      <p className="notification-tags">
        {task.notifications.sound ? "♫ Som habilitado" : "Som desligado"} ·{" "}
        {task.notifications.browser
          ? "Notificação habilitada"
          : "Notificação desligada"}
      </p>
      <a
        className="button open"
        href={task.codexUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir Codex ↗
      </a>
      {task.status !== "WAITING" && (
        <p className="simulation-note">
          Estado simulado · não representa o Codex real
        </p>
      )}
      {simulation && (
        <div className="simulation-controls">
          <span className="eyebrow">SIMULAR ESTADO</span>
          <div className="actions">
            {(
              ["MONITORING", "COMPLETED", "ERROR", "ATTENTION"] as TaskStatus[]
            ).map((s) => (
              <button
                key={s}
                disabled={task.status === s}
                onClick={() => onStatus(task.id, s)}
              >
                {labels[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
