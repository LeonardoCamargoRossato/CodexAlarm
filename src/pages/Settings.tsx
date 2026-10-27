import { useModal } from "../hooks/useModal";
import { useState } from "react";
import type { Settings as SettingsType } from "../types";
import { alarmService } from "../services/AlarmService";
import { LocalAgentMonitoringProvider } from "../providers/MonitoringProvider";
export function Settings({
  value,
  onChange,
  onClose,
}: {
  value: SettingsType;
  onChange: (v: SettingsType) => void;
  onClose: () => void;
}) {
  const modalRef = useModal(onClose);
  const [message, setMessage] = useState("");
  const update = (patch: Partial<SettingsType>) =>
    onChange({ ...value, ...patch });
  return (
    <div className="overlay">
      <section
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="section-heading">
          <h2 id="settings-title">Configurações</h2>
          <button onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <h3>Notificações</h3>
        <label className="check">
          <input
            type="checkbox"
            checked={value.sound}
            onChange={(e) => update({ sound: e.target.checked })}
          />{" "}
          Som
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={value.browser}
            onChange={async (e) => {
              if (!e.target.checked) return update({ browser: false });
              try {
                const result = await alarmService.requestPermission();
                update({ browser: result === "granted" });
                setMessage(
                  result === "granted"
                    ? "Notificações autorizadas."
                    : "Permissão não concedida. Verifique as permissões do navegador.",
                );
              } catch (e) {
                setMessage(String(e));
              }
            }}
          />{" "}
          Notificações do navegador
        </label>
        <p className="muted">
          E-mail e push no celular: Requer CodexAlarm Relay — em breve.
        </p>
        <label>
          Som do alarme
          <select
            value={value.tone}
            onChange={(e) =>
              update({ tone: e.target.value as SettingsType["tone"] })
            }
          >
            <option value="default">Padrão</option>
            <option value="beep">Beep</option>
            <option value="urgent">Urgente</option>
          </select>
        </label>
        <label>
          Volume · {Math.round(value.volume * 100)}%
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={value.volume}
            onChange={(e) => update({ volume: Number(e.target.value) })}
          />
        </label>
        <label>
          Repetição
          <select
            value={String(value.repeat)}
            onChange={(e) => update({ repeat: e.target.value === "true" })}
          >
            <option value="false">Tocar uma vez</option>
            <option value="true">Repetir até reconhecer</option>
          </select>
        </label>
        <div className="actions">
          <button
            onClick={async () => {
              try {
                await alarmService.unlock();
                alarmService.sound(value);
                setMessage("Teste iniciado. Use Parar teste para interromper.");
              } catch {
                setMessage("Não foi possível ativar o áudio.");
              }
            }}
          >
            Testar alarme
          </button>
          <button onClick={() => alarmService.stop()}>Parar teste</button>
        </div>
        <p className="muted">
          Ative o áudio por interação nesta página. Alarmes locais exigem a
          página aberta; abas suspensas e navegadores fechados não são
          confiáveis. Em alguns celulares, notificações exigem uma futura
          integração de push.
        </p>
        <hr />
        <h3>
          Agente Local <span className="badge">Desconectado</span>
        </h3>
        <label>
          Endpoint
          <input
            type="url"
            value={value.agentEndpoint}
            onChange={(e) => update({ agentEndpoint: e.target.value })}
          />
        </label>
        <button
          onClick={async () => {
            const provider = new LocalAgentMonitoringProvider(
              value.agentEndpoint,
            );
            await provider.connect();
            setMessage(
              "Agente Local ainda não instalado. Integração não disponível na V0.1; nenhuma conexão de rede foi realizada.",
            );
          }}
        >
          Testar conexão
        </button>
        <hr />
        <label className="check">
          <input
            type="checkbox"
            checked={value.simulation}
            onChange={(e) => update({ simulation: e.target.checked })}
          />{" "}
          Modo de Simulação
        </label>
        <p className="muted">
          Libera controles manuais de desenvolvimento. Nenhum status real é
          consultado.
        </p>
        {message && (
          <p role="status" className="notice">
            {message}
          </p>
        )}
        <button className="primary full" onClick={onClose}>
          Concluir
        </button>
      </section>
    </div>
  );
}
