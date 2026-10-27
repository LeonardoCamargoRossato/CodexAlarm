export function AgentGuide() {
  return (
    <article className="agent-guide" aria-labelledby="agent-guide-title">
      <div className="intro">
        <div>
          <span className="eyebrow">
            AGENTE WINDOWS · INSTALAÇÃO E PRIVACIDADE
          </span>
          <h1 id="agent-guide-title">Você decide quando monitorar.</h1>
          <p>Como preparar o uso do CodexAlarm em um computador da empresa.</p>
        </div>
        <a className="button" href="#dashboard">
          ← Voltar ao dashboard
        </a>
      </div>
      <div className="notice">
        <strong>Planejado — ainda não há instalador .exe disponível.</strong>
        <p>
          Esta página descreve os requisitos da futura integração. A V0.1
          continua com monitoramento simulado e Agente Local desconectado.
          Nenhum programa é instalado ou iniciado por esta página.
        </p>
      </div>
      <section className="guide-section">
        <h2>Antes de instalar no PC corporativo</h2>
        <p>
          Peça aprovação à TI/Segurança e ao responsável por privacidade ou
          encarregado de dados da empresa. A autorização individual no dashboard
          não substitui a política da empresa nem define, sozinha, a base legal
          exigida pela LGPD.
        </p>
        <ol>
          <li>
            Apresente a finalidade: receber alertas de tarefas Codex que você
            cadastrou e autorizou.
          </li>
          <li>
            Informe os dados mínimos: identificador/URL da tarefa, nome
            opcional, estado e horários. Nomes e URLs também podem conter dados
            pessoais ou informações confidenciais.
          </li>
          <li>
            Defina com a empresa quem é o controlador e quais fornecedores
            poderão ser operadores, conforme a operação real; registre base
            legal, retenção, exclusão e responsáveis por incidentes.
          </li>
          <li>
            Mantenha e-mail, push e relay desabilitados até aprovar
            destinatários, fornecedores, acesso, retenção e eventual
            transferência internacional.
          </li>
        </ol>
        <p>
          Rodar localmente reduz compartilhamentos, mas não garante conformidade
          com a LGPD. Não desative antivírus, SmartScreen ou controles
          corporativos para instalar.
        </p>
      </section>
      <section className="guide-section">
        <h2>Como a instalação deverá funcionar</h2>
        <ol>
          <li>
            Após aprovação da empresa, obtenha o instalador pela distribuição
            oficial aprovada pela TI. A versão futura deverá informar versão,
            origem, assinatura e verificação de integridade.
          </li>
          <li>
            Instale com as permissões mínimas aprovadas. O desenho proposto não
            exige serviço permanente, inicialização com o Windows ou privilégios
            de administrador; restrições da empresa podem exigir distribuição
            pela TI.
          </li>
          <li>
            Abra o dashboard e inicie manualmente o agente instalado, por atalho
            aprovado. Faça o pareamento local e selecione as tarefas
            autorizadas.
          </li>
          <li>
            Clique em <strong>Ativar monitoramento</strong> no dashboard. Só uma
            sessão autenticada, uma autorização válida e uma fonte Codex
            conectada poderão liberar a observação.
          </li>
          <li>
            Para parar, use <strong>Desativar monitoramento</strong>. O agente
            também deverá expirar a autorização se a aba fechar ou parar de
            responder.
          </li>
        </ol>
        <p>
          Um site comum não inicia nem encerra um .exe arbitrário do Windows.
          Abertura por link especial ou extensão exigiria uma integração
          instalada e aprovada; não existe nesta versão. Se o agente encerrar,
          será preciso iniciá-lo novamente.
        </p>
        <button disabled>
          Instalador indisponível — integração em desenvolvimento
        </button>
      </section>
      <section className="guide-section">
        <h2>Dupla autorização para monitorar</h2>
        <div className="guide-flow" aria-label="Condições para monitoramento">
          <div>
            <strong>1. Dashboard autorizado</strong>
            <p>
              Aba aberta, ativação explícita e autorização temporária renovada.
            </p>
          </div>
          <span aria-hidden="true">+</span>
          <div>
            <strong>2. Codex conectado</strong>
            <p>
              Integração autenticada responde para a tarefa que você autorizou.
            </p>
          </div>
          <span aria-hidden="true">=</span>
          <div>
            <strong>Monitoramento permitido</strong>
            <p>Somente enquanto ambas as condições forem válidas.</p>
          </div>
        </div>
        <p>
          Ter o site do GPT aberto, um processo do navegador em execução ou um
          botão “ativo” salvo no localStorage não prova que o Codex está
          conectado. A fonte de eventos deverá confirmar a conexão; não haverá
          inspeção de abas, cookies ou conversas alheias. Uma tarefa pode
          continuar executando sem a aba do GPT aberta, dependendo da
          integração.
        </p>
        <p>
          Reabrir ou recarregar o dashboard não deverá reativar o monitoramento
          automaticamente. A autorização deverá existir somente na sessão atual,
          limitada às tarefas selecionadas, sem ser restaurada do armazenamento
          local.
        </p>
      </section>
      <section className="guide-section">
        <h2>Ao desativar ou fechar a aba</h2>
        <p>
          <strong>Botão Desativar:</strong> o dashboard solicitará revogação
          autenticada; só mostrará “Desativado” após confirmação. Sem resposta,
          mostrará “Revogação pendente”, até a autorização expirar.
        </p>
        <p>
          <strong>Fechar a aba, travamento ou perda da conexão:</strong> não é
          possível garantir uma última mensagem ao Windows. A proposta é renovar
          a autorização a cada 5 segundos e fazê-la expirar após 15 segundos sem
          renovação, usando o relógio monotônico do agente. Os valores ainda
          precisam de validação na implementação.
        </p>
        <p>
          Ao expirar, o agente deverá parar a observação e os alarmes, cancelar
          envios pendentes e encerrar seu processo. Mensagens já entregues a
          terceiros não podem ser retiradas. Um processo bloqueado ou falha do
          sistema pode atrasar a execução; isso exige validação e supervisão no
          agente real.
        </p>
        <p>
          Abas suspensas, PC em suspensão e restrições do navegador podem
          interromper as renovações mesmo com a aba aberta. Nesse caso, a
          prioridade será parar o monitoramento. Minimizar a janela ou trocar de
          aba não revoga por si só; a autorização só continua se as renovações
          chegarem a tempo. Ao retomar, uma autorização vencida exigirá nova
          ativação.
        </p>
        <p>
          Somente uma aba poderá controlar a sessão. Fechar a aba controladora
          revogará a autorização por expiração; outra aba não poderá renová-la
          automaticamente. Esta política abre mão de alertas com o dashboard
          fechado.
        </p>
      </section>
      <section className="guide-section">
        <h2>Dados, permissões e exclusão</h2>
        <ul>
          <li>
            <strong>Hoje:</strong> tarefas e preferências ficam no localStorage
            deste navegador. O carregamento do site faz requisições ao GitHub
            Pages; isso não equivale a enviar suas tarefas para um relay. Não há
            telemetria adicionada pela aplicação.
          </li>
          <li>
            <strong>Futuro agente:</strong> somente metadados mínimos das
            tarefas autorizadas; sem senhas OpenAI, cookies, conteúdo de
            prompts, respostas, arquivos corporativos ou credenciais nos logs.
            Qualquer ampliação exigirá nova avaliação.
          </li>
          <li>
            <strong>Conexão local:</strong> loopback, pareamento autenticado,
            validação de origem e limites de requisições. Um serviço ouvindo em
            localhost ainda precisa de proteção contra outros sites e processos.
          </li>
          <li>
            <strong>Excluir:</strong> remova a tarefa no cartão ou limpe os
            dados do site no navegador para apagar o cadastro local. O agente e
            futuros fornecedores precisarão ter mecanismos próprios de revogação
            e exclusão; desinstalar o .exe não limpa o navegador nem dados
            remotos.
          </li>
          <li>
            <strong>Alertas externos:</strong> preferir mensagem genérica, sem
            URL ou conteúdo da tarefa, especialmente na tela bloqueada de um
            celular pessoal.
          </li>
        </ul>
        <p>
          Para análise formal, apresente à empresa a{" "}
          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            LGPD (Lei nº 13.709/2018)
          </a>
          , o fluxo de dados e os documentos técnicos do projeto. Esta página é
          orientação técnica, não certificação de conformidade nem parecer
          jurídico.
        </p>
      </section>
    </article>
  );
}
