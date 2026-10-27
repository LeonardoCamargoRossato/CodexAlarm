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

## Autorização temporária vinculada ao dashboard (requisito futuro)

Não implementado na V0.1. O agente será um processo iniciado manualmente e aprovado pela TI, sem serviço permanente ou inicialização automática por padrão. Antes de autorizar, o processo poderá apenas realizar o pareamento/controle; não observará tarefas. Se a exigência for que nenhum processo exista antes de abrir o dashboard, o usuário precisará abrir a página primeiro e executar o atalho depois. O site não consegue impor a ordem de abertura de um executável arbitrário nem lançar/encerrar um processo sem integração instalada.

A autorização de observar exige cumulativamente sessão autenticada com o dashboard, ativação explícita, tarefas na lista de autorização, lease válido e conexão confirmada com uma integração Codex para essas tarefas. A mera presença da aba GPT ou de um processo não é evidência da conexão. A definição de atividade é a disponibilidade da fonte autorizada, não estar digitando ou manter a aba GPT aberta.

Endpoints propostos adicionais (todos autenticados, inclusive health/controle com informações sensíveis):

| Método | Caminho                          | Uso                                                        |
| ------ | -------------------------------- | ---------------------------------------------------------- |
| POST   | `/monitoring-sessions`           | Criar lease por consentimento explícito e lista de tarefas |
| POST   | `/monitoring-sessions/:id/renew` | Renovar lease da sessão proprietária                       |
| DELETE | `/monitoring-sessions/:id`       | Revogar lease e solicitar encerramento                     |

Requisitos de implementação:

- Proposta inicial: heartbeat a cada 5 s, TTL máximo de 15 s, a validar em Edge/Windows sob throttling. O agente usa relógio monotônico próprio, nunca timestamps controlados pelo browser. Rejeita renovações atrasadas, repetidas, de sessão expirada ou de outro proprietário. Reinício, suspensão ou retomada do PC invalidam a sessão; watchdog e testes de falha são necessários para sustentar os limites.
- Uma aba proprietária, sem posse automática por outra aba. Pareamento e autorização são distintos; um token pareado não libera monitoramento. Lease/estado ativo não são restaurados por localStorage, reload, reinício ou reconexão. A expiração exige novo consentimento explícito.
- Sem conexão Codex válida, parar observação, invalidar autorização e informar falha. Não inferir conclusão por desconexão. Validar autorização em cada coleta, processamento de evento e envio de alerta, inclusive eventos atrasados.
- Desativação explícita retorna confirmação somente após invalidar o lease, parar observadores/áudio e cancelar filas ainda não enviadas. O dashboard não mostra “Desativado” antes da confirmação; em falha mostra revogação pendente. Depois da confirmação, o processo encerra e fecha o listener local. Não existe endpoint de execução arbitrária de comandos.
- Ao perder heartbeat/expirar: mesma limpeza e encerramento. Falhas do processo/SO podem atrasar o encerramento; não prometer garantia absoluta de término em 15 s sem supervisão e validação reais. Um processo inicialmente não pareado encerra após um prazo curto de configuração, também a definir.
- Fechar aba, crash ou corte da rede não garantem aviso. `pagehide`/beacon podem ser auxiliares, nunca a base da revogação. Abas abertas suspensas podem perder lease; parar é o comportamento esperado. Ocultar/minimizar não revoga imediatamente, desde que haja heartbeat válido. Reabertura requer novo início manual do processo se já encerrado.
- Mensagens já entregues ao relay/provedor não são canceláveis por encerrar o agente. Canais futuros precisam de controle de fila e minimização próprios. Este modo não mantém alarmes após fechar o dashboard.

Critérios de aceitação antes de liberar: sem monitoramento antes de ativar; tarefas fora da lista ignoradas; desativar com confirmação; fechar/crash da aba e queda da rede; aba suspensa; suspensão/retomada do Windows; Codex desconectado; duas abas; reload sem reativação; eventos atrasados após revogação; nenhum envio pendente após expiração; processo encerra e exige abertura manual seguinte. A página de ajuda não implementa esses controles.
