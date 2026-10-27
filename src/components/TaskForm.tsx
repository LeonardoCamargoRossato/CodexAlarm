import { useModal } from "../hooks/useModal";
import { useState } from "react";
import type { CodexTask } from "../types";
import { parseCodexUrl } from "../utils/tasks";
export function TaskForm({
  onAdd,
  onClose,
}: {
  onAdd: (t: CodexTask) => Promise<void>;
  onClose: () => void;
}) {
  const modalRef = useModal(onClose);
  const [error, setError] = useState("");
  return (
    <div className="overlay">
      <section
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="section-heading">
          <h2 id="form-title">Monitorar Codex</h2>
          <button onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <p>Registre somente tarefas que você autoriza monitorar.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            try {
              const parsed = parseCodexUrl(String(f.get("url")));
              const now = Date.now();
              await onAdd({
                id: crypto.randomUUID(),
                name: String(f.get("name")).trim(),
                repository: String(f.get("repository")).trim(),
                ...parsed,
                status: "WAITING",
                createdAt: now,
                lastUpdatedAt: now,
                monitoringStartedAt: null,
                completedAt: null,
                acknowledgedAt: null,
                notifications: {
                  sound: f.has("sound"),
                  browser: f.has("browser"),
                  email: false,
                  mobilePush: false,
                },
              });
              onClose();
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Falha ao registrar tarefa.",
              );
            }
          }}
        >
          <label>
            Nome da tarefa
            <input
              name="name"
              required
              maxLength={120}
              autoFocus
              placeholder="Cities Comparing - Upgrade UI"
              pattern=".*\S.*"
            />
          </label>
          <label>
            Codex URL
            <input
              name="url"
              required
              type="url"
              placeholder="https://chatgpt.com/local/..."
            />
          </label>
          <label>
            Projeto / Repositório <small>opcional</small>
            <input
              name="repository"
              maxLength={160}
              placeholder="LeonardoCamargoRossato/CitiesComparing"
            />
          </label>
          <fieldset>
            <legend>Notificações desta tarefa</legend>
            <label className="check">
              <input type="checkbox" name="sound" defaultChecked /> Alarme
              sonoro
            </label>
            <label className="check">
              <input type="checkbox" name="browser" /> Notificação do navegador
            </label>
            <label className="check muted">
              <input type="checkbox" disabled /> E-mail
            </label>
            <label className="check muted">
              <input type="checkbox" disabled /> Push no celular
            </label>
            <small>Requer CodexAlarm Relay — em breve</small>
          </fieldset>
          <p className="notice">
            A tarefa ficará aguardando. Na V0.1, os estados só mudam por
            simulação explícita.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <div className="actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary">Monitorar</button>
          </div>
        </form>
      </section>
    </div>
  );
}
