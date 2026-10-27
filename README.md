# CodexAlarm

**Saiba quando o Codex terminou.**

Dashboard leve para organizar tarefas Codex longas e preparar alertas de conclusão. Interface em português, React + TypeScript estrito + Vite, sem backend ou serviços pagos na V0.1.

> **Não existe monitoramento real nesta versão.** GitHub Pages não pode consultar páginas autenticadas do ChatGPT/Codex. Estados só mudam pelos controles explícitos do **Modo de Simulação**. Uma tarefa registrada começa em “Aguardando”. O Agente Local permanece desconectado.

## Executar

Requer Node.js 22.12+ (ou 24) e npm.

```sh
git clone https://github.com/LeonardoCamargoRossato/CodexAlarm.git
cd CodexAlarm
npm install
npm run dev
```

Se o cache padrão do npm estiver indisponível no ambiente cloud, use `npm install --cache /workspace/.npm-cache`. Depois da instalação inicial, use `npm ci` para reproduzir o lockfile.

```sh
npm test
npm run build
npm run preview
```

O build fica em `dist/`, com base `/CodexAlarm/`. Abra o caminho `/CodexAlarm/` no servidor de desenvolvimento ou preview.

## Implementado na V0.1

- Cadastro explícito de URLs `https://chatgpt.com/local/ID`, extração de task ID e `hostId`.
- Dashboard responsivo, cartões, indicadores e estado vazio sem tarefas falsas.
- Persistência de tarefas, preferências, estados simulados, datas e reconhecimento no localStorage.
- Timer derivado de timestamps, resistente a recarregamentos; pausa na conclusão.
- Simulação manual de Monitorando, Concluído, Erro e Atenção, sempre identificada.
- Alarme sonoro via Web Audio, três tons, volume e repetição até reconhecer.
- Notificação de conclusão simulada pela API do navegador quando suportada e autorizada.
- Alerta visual com “Abrir Codex” e “Desligar Alarme”.
- Contrato de provider e placeholder do Agente Local, sem conexão fictícia.

## Como testar o fluxo

1. Clique em **Monitorar meu primeiro Codex**, informe nome e uma URL válida e registre.
2. A tarefa aparece em **Aguardando**. Recarregue para confirmar a persistência.
3. Abra Configurações e habilite **Modo de Simulação**.
4. Ative áudio por interação nesta sessão. Nas configurações, autorize notificações e marque também a opção da tarefa ao cadastrá-la.
5. Use **Monitorando** no cartão: o timer começa. Recarregue e confira o tempo.
6. Use **Concluído**: veja o alerta e, conforme as preferências globais e da tarefa, o alarme e a notificação.
7. Clique em **Desligar Alarme**. O reconhecimento fica salvo.

Os controles de preferências globais e por tarefa precisam estar habilitados para cada canal. Autoplay exige interação; recarregar a página exige reativar o áudio. Alertas visuais pendentes persistem, mas não há reenvio automático de som ou notificações após recarregar. Testes de alarme são explícitos e podem ser interrompidos em “Parar teste”.

A página precisa continuar aberta para alarmes locais. O navegador pode suspender abas e bloquear notificações, especialmente em dispositivos móveis. **Fechar o Edge encerra este dashboard; a V0.1 não promete alarmes em segundo plano.** Não há push móvel nem envio de e-mail. Dados são locais ao navegador/origem, sem sincronização; limpar os dados do site apaga o cadastro. Evite cadastrar URLs sensíveis em computadores compartilhados.

## Arquitetura

- `src/components`: formulário e cartões reutilizáveis.
- `src/pages`: configurações.
- `src/hooks`: estado e coordenação do dashboard.
- `src/providers`: `MonitoringProvider`, `MockMonitoringProvider` e `LocalAgentMonitoringProvider`.
- `src/services`: armazenamento e `AlarmService`.
- `src/types`: modelos tipados.
- `src/utils`: parsing, transições, timer e testes.

O mock não faz polling, scraping nem transições automáticas. O provider local é um contrato futuro: o botão de teste informa que a integração ainda não existe e não faz requisições. Veja [arquitetura](docs/ARCHITECTURE.md), [protocolo proposto](docs/LOCAL_AGENT_PROTOCOL.md) e [segurança](SECURITY.md).

## Planejado

Windows Local Agent; monitoramento real autorizado (ou integração oficial Codex/API/eventos); relay opcional; e-mail; push para celular; sincronização e reconhecimento remoto. Esses recursos não fazem parte da V0.1.

## GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` instala com `npm ci`, executa testes, compila, publica o artefato e usa o deploy oficial do Pages em pushes para `main` ou execução manual.

1. Envie o commit para `main` no GitHub.
2. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
3. Verifique permissões do Actions e eventuais aprovações do ambiente `github-pages`.
4. Acompanhe o workflow **Deploy CodexAlarm to GitHub Pages**.

URL esperada após um deploy bem-sucedido: **https://leonardocamargorossato.github.io/CodexAlarm/**.

O build local não publica o site. HTTPS do Pages é necessário para a API de notificações; permissões e suporte continuam dependendo do navegador.
