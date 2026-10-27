# Política de segurança

CodexAlarm V0.1 não acessa sua conta OpenAI. Não pede senha, não armazena credenciais ou cookies e não consulta conversas. Nenhum segredo deve ser adicionado ao código, ao localStorage ou ao histórico Git.

O usuário autoriza cada tarefa ao registrar sua URL. A V0.1 apenas guarda a URL, nome, timestamps, estado simulado e preferências no navegador. Quem usa o mesmo perfil pode acessar esses dados. Limpar o armazenamento do site remove as tarefas. Não cole URLs contendo tokens ou dados sensíveis em parâmetros.

O futuro agente deve limitar-se às tarefas registradas, não raspar credenciais ou conversas alheias, não executar comandos remotos e aplicar pareamento autenticado, loopback, CORS restrito e rate limiting. Veja [o protocolo](docs/LOCAL_AGENT_PROTOCOL.md). E-mail, push e relay dependerão de consentimento e controles próprios.

Links cadastrados aceitam apenas HTTPS no host exato `chatgpt.com`, caminho `/local/ID` e não permitem credenciais embutidas. Abrem em nova aba com `noopener noreferrer`. React escapa texto dos campos; não há HTML de usuário nem scripts externos carregados pelo app.

Ao reportar vulnerabilidades, não publique senhas, cookies, tokens ou dados pessoais em issues. Use o mecanismo privado de reporte de segurança do GitHub quando habilitado; caso indisponível, solicite um canal privado ao mantenedor sem revelar detalhes exploráveis publicamente.

## Uso corporativo e LGPD

Instalação em equipamento da empresa depende da aprovação de TI/Segurança e das regras da organização. Consentimento no dashboard não substitui base legal, autorização corporativa nem análise de fornecedores. A empresa deve avaliar finalidade, necessidade, papéis de controlador/operador, retenção, direitos dos titulares, incidentes e eventuais transferências internacionais conforme o fluxo real. Identificadores, URLs e nomes podem ser dados pessoais ou sigilosos, mesmo sem prompts ou cookies.

O modo futuro controlado pelo dashboard exigirá autorização temporária de sessão e conexão Codex confirmada. Sem renovação, o agente deve interromper observação/envios e encerrar. Ainda não há executável, controle de processo ou garantia de prazo implementados. Leia a página `#agente` do dashboard e o protocolo para as limitações de fechamento da aba, suspensão e reinício. A existência desta documentação não certifica conformidade com a LGPD.
