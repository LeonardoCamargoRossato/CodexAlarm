# Arquitetura — CodexAlarm V0.1

Fluxo conceitual futuro:

```text
Codex (somente tarefas explicitamente autorizadas)
  ↓ integração oficial ou observação autorizada a definir
CodexAlarm Local Agent (Windows)
  ↓
CodexAlarm Relay (futuro, opcional)
  ↓
GitHub Pages Dashboard
  ↓
PC / Mobile / Email
```

O agente também poderá comunicar-se diretamente com o dashboard local e acionar som no Windows, sem exigir relay. O relay será necessário para entrega remota, sincronização e canais como e-mail/push. Não há contratação de serviço nesta versão.

## Situação atual

Somente o dashboard existe. React renderiza o estado persistido; `useDashboard` coordena cadastro e transições; `MonitoringProvider` isola o transporte. O `MockMonitoringProvider` aceita apenas mudanças manuais, disponíveis no Modo de Simulação, e nunca consulta Codex. Cada estado alterado é identificado como simulado mesmo após desativar esse modo. Não há tarefas pré-carregadas.

`LocalAgentMonitoringProvider` implementa o mesmo contrato, mas retorna `NOT_CONNECTED`; registro e remoção nele falham explicitamente. O endpoint editável é apenas uma preferência persistida. Nenhuma requisição é realizada ao testar a conexão na V0.1.

`AlarmService` controla Web Audio e a API Notification. Preferências globais e da tarefa devem autorizar o canal. O reconhecimento grava `acknowledgedAt`. O serviço mantém um loop de áudio compartilhado: reconhecer ou remover uma tarefa interrompe o som atual; outros alertas visuais pendentes continuam disponíveis. O timer usa `monitoringStartedAt`, `completedAt` e o relógio do dispositivo, sem acumular ticks. Uma transição de volta a Monitorando preserva a data de início original.

localStorage contém apenas dados da aplicação, não credenciais. Não é um banco compartilhado nem uma forma de sincronizar dispositivos. Erros de persistência aparecem na UI; dados locais inválidos não são sobrescritos automaticamente.

## Limitações técnicas

GitHub Pages entrega arquivos estáticos e não acessa sessões autenticadas do ChatGPT. Não há polling, scraper ou API de status Codex nesta versão. Monitoramento real depende de agente futuro ou API/eventos oficiais. Um agente independente do navegador poderá continuar ativo com Edge fechado, mas a viabilidade de observar determinada tarefa depende da integração disponível; isso não está garantido.

A página aberta pode tocar alarmes após ativação do áudio e emitir notificações com permissão. Abas suspensas, navegador fechado e restrições móveis impedem garantias de entrega. Permissões são solicitadas por gesto explícito, nunca no carregamento. O relay futuro poderá usar push/service workers e e-mail; nenhum desses mecanismos foi implementado aqui.

## Evolução

Definir o mecanismo autorizado de observação antes de implementar o agente; negociar capacidades e autenticação; registrar apenas tarefas autorizadas; consumir eventos ou polling de status autenticado; validar o payload no limite do provider; adicionar relay opcional com idempotência e reconhecimento remoto. O dashboard não deve conhecer detalhes de cookies ou sessões Codex.
