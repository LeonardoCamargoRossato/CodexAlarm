import { useEffect, useState } from "react";
import { useDashboard } from "./hooks/useDashboard";
import { TaskForm } from "./components/TaskForm";
import { TaskCard } from "./components/TaskCard";
import { Settings } from "./pages/Settings";
import { AgentGuide } from "./pages/AgentGuide";
import { alarmService } from "./services/AlarmService";
export default function App() {
  const dashboard = useDashboard();
  const [guide, setGuide] = useState(() => window.location.hash === "#agente");
  useEffect(() => {
    const update = () => {
      setGuide(window.location.hash === "#agente");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const [modal, setModal] = useState<"task" | "settings" | null>(null);
  const [now, setNow] = useState(Date.now());
  const [audio, setAudio] = useState(false);
  const [audioError, setAudioError] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const alerts = dashboard.tasks.filter(
    (t) => t.status === "COMPLETED" && !t.acknowledgedAt,
  );
  return (
    <div className="app">
      <header>
        <a className="brand" href="./">
          <span className="brand-icon">◉</span>
          <div>
            <strong>
              Codex<span>Alarm</span>
            </strong>
            <small>Saiba quando o Codex terminou.</small>
          </div>
        </a>
        <div className="header-actions">
          <a className="guide-link" href="#agente">
            Agente e privacidade
          </a>
          <span className="connection">
            <i /> Agente desconectado
          </span>
          <button onClick={() => setModal("settings")}>
            ⚙ <span>Configurações</span>
          </button>
        </div>
      </header>
      <main>
        {guide ? (
          <AgentGuide />
        ) : (
          <>
            <div className="intro">
              <div>
                <span className="eyebrow">SEU CENTRO DE CONTROLE</span>
                <h1>Cada tarefa. No seu radar.</h1>
                <p>Organize seus Codex e prepare o próximo passo.</p>
              </div>
              <button className="primary" onClick={() => setModal("task")}>
                + Monitorar Codex
              </button>
            </div>
            <div
              className={`notice banner ${dashboard.settings.simulation ? "simulation" : ""}`}
            >
              <span>◈</span>
              <div>
                <strong>
                  {dashboard.settings.simulation
                    ? "Modo de Simulação ativado"
                    : "Pronto para conectar. Transparente por padrão."}
                </strong>
                <p>
                  {dashboard.settings.simulation
                    ? "Todos os estados são simulados manualmente. Nenhuma tarefa real está sendo monitorada."
                    : "A V0.1 registra suas tarefas. O monitoramento real depende do futuro Agente Local."}
                </p>
              </div>
              <button
                onClick={() =>
                  dashboard.updateSettings({
                    ...dashboard.settings,
                    simulation: !dashboard.settings.simulation,
                  })
                }
              >
                {dashboard.settings.simulation
                  ? "Desativar simulação"
                  : "Explorar simulação"}
              </button>
            </div>
            {dashboard.error && (
              <p className="error" role="alert">
                {dashboard.error}
              </p>
            )}
            <section className="summary" aria-label="Resumo">
              <div>
                <span>
                  Monitorando <small>simulado</small>
                </span>
                <strong>
                  {
                    dashboard.tasks.filter((t) => t.status === "MONITORING")
                      .length
                  }
                </strong>
                <i className="teal" />
              </div>
              <div>
                <span>
                  Concluídos <small>simulado</small>
                </span>
                <strong>
                  {
                    dashboard.tasks.filter((t) => t.status === "COMPLETED")
                      .length
                  }
                </strong>
                <i className="blue" />
              </div>
              <div>
                <span>
                  Atenção <small>simulado</small>
                </span>
                <strong>
                  {
                    dashboard.tasks.filter((t) =>
                      ["ERROR", "ATTENTION"].includes(t.status),
                    ).length
                  }
                </strong>
                <i className="amber" />
              </div>
              <div>
                <span>Agente Local</span>
                <strong className="agent-value">Desconectado</strong>
                <small>Integração em breve</small>
              </div>
            </section>
            {alerts.map((t) => (
              <section className="completion" role="alert" key={t.id}>
                <span className="eyebrow">SIMULAÇÃO · CODEX TERMINOU</span>
                <h2>{t.name}</h2>
                <div className="actions">
                  <a
                    className="button"
                    href={t.codexUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir Codex ↗
                  </a>
                  <button
                    className="primary"
                    onClick={() => dashboard.acknowledge(t.id)}
                  >
                    Desligar Alarme
                  </button>
                </div>
              </section>
            ))}
            <div className="section-heading tasks-heading">
              <h2>
                Tarefas registradas{" "}
                <span className="count">{dashboard.tasks.length}</span>
              </h2>
              <button
                onClick={async () => {
                  try {
                    await alarmService.unlock();
                    setAudio(true);
                    setAudioError("");
                  } catch {
                    setAudioError("Áudio indisponível neste navegador.");
                  }
                }}
              >
                {audio
                  ? "♫ Áudio ativado nesta sessão"
                  : "♫ Ativar áudio nesta sessão"}
              </button>
            </div>
            {audioError && <p role="alert">{audioError}</p>}
            {dashboard.tasks.length ? (
              <section className="task-grid">
                {dashboard.tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    now={now}
                    simulation={dashboard.settings.simulation}
                    onStatus={dashboard.simulate}
                    onRemove={dashboard.remove}
                  />
                ))}
              </section>
            ) : (
              <section className="empty">
                <div className="empty-icon">◎</div>
                <span className="eyebrow">ESPAÇO PARA O SEU PRÓXIMO CODEX</span>
                <h2>Nenhum Codex sendo monitorado.</h2>
                <p>
                  Adicione uma tarefa autorizada para começar.
                  <br />
                  Seus dados ficam apenas neste navegador.
                </p>
                <button className="primary" onClick={() => setModal("task")}>
                  + Monitorar meu primeiro Codex
                </button>
                <div className="empty-foot">
                  ⌁ Sem credenciais · Sem acesso à sua conta · Sem monitoramento
                  oculto
                </div>
              </section>
            )}
            <div className="bottom-note">
              <span>◌ Monitoramento real em construção</span>
              <span>Dashboard local · Nenhum backend necessário</span>
            </div>
          </>
        )}
      </main>
      <footer>
        <span>CodexAlarm V0.1</span>
        <a href="#agente">Instalação, LGPD e Agente Windows</a>
        <a
          href="https://github.com/LeonardoCamargoRossato/CodexAlarm"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </footer>
      {modal === "task" && (
        <TaskForm onAdd={dashboard.add} onClose={() => setModal(null)} />
      )}
      {modal === "settings" && (
        <Settings
          value={dashboard.settings}
          onChange={dashboard.updateSettings}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
