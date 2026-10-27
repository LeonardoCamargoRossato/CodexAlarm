# Protocolo proposto do CodexAlarm Local Agent

**Documento de projeto; nenhum endpoint está implementado na V0.1.** Endpoint sugerido: `http://127.0.0.1:43117`. O campo no dashboard não cria um servidor.

## Transporte e endpoints futuros

JSON UTF-8, versão de protocolo negociada pelo health check. Datas em ISO 8601 UTC. IDs opacos gerados pelo agente. Operações de mutação exigirão token de pareamento e consentimento. O frontend traduzirá os estados minúsculos do protocolo para o enum maiúsculo da aplicação.

| Método | Caminho             | Uso                                           |
| ------ | ------------------- | --------------------------------------------- |
| GET    | `/health`           | Saúde e capacidades (200)                     |
| GET    | `/tasks`            | Somente tarefas autorizadas (200)             |
| POST   | `/tasks`            | Registrar URL autorizada (201; duplicata 409) |
| GET    | `/tasks/:id/status` | Estado e timestamps (200; ausente 404)        |
| DELETE | `/tasks/:id`        | Revogar monitoramento (204)                   |

Health:

```json
{ "service": "CodexAlarm Agent", "status": "ok", "version": "0.1.0" }
```

Registro e resposta de tarefa (exemplo):

```json
{
  "id": "opaque-local-id",
  "name": "Cities Comparing",
  "codexUrl": "https://chatgpt.com/local/01a1783e-bc31-75c4-b94a-e092b370203f?hostId=local",
  "codexTaskId": "01a1783e-bc31-75c4-b94a-e092b370203f",
  "hostId": "local",
  "status": "monitoring"
}
```

Resposta de status proposta:

```json
{
  "id": "opaque-local-id",
  "status": "monitoring",
  "monitoringStartedAt": "2026-01-01T12:00:00Z",
  "lastUpdatedAt": "2026-01-01T12:05:00Z",
  "completedAt": null,
  "revision": 2
}
```

Estados: `waiting`, `monitoring`, `completed`, `error`, `attention`, `unknown`. Não inferir conclusão por ausência de resposta. Se a observação falhar, retornar erro/desconhecido e preservar o último timestamp verificado. `lastUpdatedAt` não deve fingir uma verificação bem-sucedida. Polling futuro com backoff, jitter e limite de frequência; eventos SSE/WebSocket são uma extensão possível, não implementada. Erros estruturados: `{"error":{"code":"NOT_AUTHORIZED","message":"..."}}`, sem dados de sessão. Usar 400/401/403/404/409/429/503 conforme o caso. Idempotência e revisões impedirão alertas duplicados.

## Segurança obrigatória

- Escutar somente loopback por padrão, nunca `0.0.0.0`.
- Monitorar somente URLs registradas explicitamente; validar host, protocolo e formato novamente no agente. Revogar ao remover.
- Não aceitar execução arbitrária de comandos nem parâmetros de shell.
- Nunca pedir senha OpenAI/ChatGPT, guardar senhas, capturar credenciais, extrair cookies ou expor sessões.
- Não vasculhar conversas ou abas não autorizadas.
- Pareamento local explícito e token de curta duração entre dashboard e agente; credenciais não devem ir para repositório, URLs ou logs. Armazenamento seguro do token precisa ser projetado antes da integração real.
- Validar `Origin` e `Host`, rejeitar origens desconhecidas e aplicar CORS restrito, sem `*`. Pages compartilha a origem com outros projetos do mesmo domínio: CORS sozinho não autentica aplicações, portanto token de pareamento é indispensável.
- Proteção contra CSRF/DNS rebinding, limites de tamanho e rate limiting por origem/token. Responder a preflight apenas de origens permitidas.
- Acesso de um site HTTPS a HTTP loopback depende das políticas de conteúdo misto, Private/Local Network Access e permissões do navegador. Validar Edge/Chrome/Firefox e versões reais antes de prometer suporte. Pode exigir transporte local seguro ou relay HTTPS.
- Relay opcional precisa de autenticação própria, criptografia em trânsito, consentimento por canal e retenção mínima. Não expor o agente diretamente à internet.

A forma de observar Codex permanece uma decisão técnica futura. Este protocolo não concede acesso à conta e não promete monitoramento com o navegador fechado.
