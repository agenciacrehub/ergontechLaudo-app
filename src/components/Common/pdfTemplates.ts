// pdfTemplates.ts
// Geração HTML para exportação de PDF do formulário ergonômico
// Todas as seções, títulos e perguntas reais extraídas de form-ergon2.tsx

export const SECTION_TITLES = {
  company: 'Informações da Empresa',
  employee: 'Informações do Colaborador',
  biomechanical: 'Perigos Ergonômicos - Biomecânicos',
  furniture: 'Perigos Ergonômicos - Mobiliários e Equipamentos',
  organizational: 'Perigos Ergonômicos - Organizacionais',
  environmental: 'Perigos Ergonômicos - Ambientais',
  psychosocial: 'Perigos Ergonômicos - Psicossociais / Cognitivos',
};

export const BIOMECHANICAL_QUESTIONS = [
  { key: 'bio_postura', label: 'Exigência de posturas incômodas ou pouco confortável por longos períodos (posturas estáticas)', comment: 'p1_comentario', embasamento: ["ABNT NBR ISO 11226: 2013", "NR-17 item 17.4.2"] },
  { key: 'bio_cargas', label: 'Levantamento e transporte manual de cargas ou volumes e/ou pega pobre', comment: 'p2_comentario', embasamento: ["ISO 11228-1", "NR 17 item 17.5", "Manual de Aplicação"] },
  { key: 'bio_postura_sentada', label: 'Postura sentada ou postura em pé por longos períodos ou constante deslocamento a pé durante a jornada', comment: 'p14_comentario', embasamento: ["Nota técnica 060/2001 – MTE COUTO", "NR 17: 17.6.2", "CLT Art. 199"] },
  { key: 'bio_trabalho_duro', label: 'Trabalho com esforço físico intenso', comment: 'p13_comentario', embasamento: ["NR-17 item 17.4.3 letra c", "Escala de Borg"] },
  { key: 'bio_puxar', label: 'Frequente ação de puxar/empurrar cargas ou volumes', comment: 'p3_comentario', embasamento: ["NR-17 item 17.5.3", "Ferramenta Kim Puxar – Empurrar", "ABNT NBR ISO 11228-2"] },
  { key: 'bio_repetitivos', label: 'Frequente execução de movimentos repetitivos (incluindo digitação)', comment: 'p4_comentario', embasamento: ["OCRA/ COLOMBINI", "ABNT NBR ISO 11228-3"] },
  { key: 'bio_ferramentas', label: 'Manuseio de ferramentas e/ou objetos pesados por períodos prolongados', comment: 'p5_comentario', embasamento: ["NR-17 item 17.7.5", "ABNT NBR ISO 11228-3", "COLOMBINI / OCRA"] },
  { key: 'bio_compressao', label: 'Compressão de partes do corpo por superfícies rígidas ou com quinas', comment: 'p6_comentario', embasamento: ["NBR 13966"] },
  { key: 'bio_flexoes', label: 'Exigência de flexões de coluna vertebral frequentes', comment: 'p7_comentario', embasamento: ["NR-17 itens 17.4.2 e 17.4.3", "ABNT 11226", "ABNT 11228-1"] },
  { key: 'bio_pedais', label: 'Uso frequente de pedais', comment: 'p8_comentario', embasamento: ["NR 17 – 17.6.5", "ABNT NBR ISO 11226"] },
  { key: 'bio_elevacao', label: 'Exigência de elevação frequentes de membros superiores', comment: 'p9_comentario', embasamento: ["NR-17 item 17.4.3 letra d", "ABNT NBR ISO 11228-3"] },
  { key: 'bio_vibracao_corpo', label: 'Exposição a vibração de corpo inteiro (por tempo prolongado)', comment: 'p10_comentario', embasamento: ["NR-17 item 17.4.3 letra d"] },
  { key: 'bio_vibracao_localizada', label: 'Exposição a vibração localizada (por tempo prolongado)', comment: 'p11_comentario', embasamento: ["HAV: Health and Safety Executive", "ABNT NBR 11228-3", "COLOMBINI"] },
  { key: 'bio_torcao', label: 'Torções dos segmentos corporais', comment: 'p12_comentario', embasamento: ["TOR TOM"] }
];

export const MOBILIAEQUIP_QUESTIONS = [
  { key: 'mob_improvisado', label: 'Posto de trabalho improvisado', comment: 'mob_p1_comentario', embasamento: ["NR 17 Mobiliário/ ambiente/ equipamentos improvisados?"] },
  { key: 'mob_inadequado', label: 'Mobiliários e equipamentos inadequados ergonomicamente, sem meios de regulagem de ajuste ou sem condições de uso (assento, encosto, etc)', comment: 'mob_p2_comentario', embasamento: ["CLT: Art. 199", "NR-17: item 17.6", "ABNT NBR 13966: 2008", "ABNT NBR 13962: 2002"] },
  { key: 'mob_posto_trabalho', label: 'Posto de trabalho não planejado/adaptado para alternância de postura', comment: 'mob_p6_comentario', embasamento: ["NR-17 item 17.4.5", "ABNT NBR 13966: 2008", "ABNT NBR 13962: 2002", "Nota técnica 060/2001 MTE"] },
  { key: 'mob_espacos', label: 'Mobiliário ou equipamento sem espaço para movimentação dos segmentos corporais', comment: 'mob_p3_comentario', embasamento: ["NR-17 item 17.6.3 letras De E", "ABNT NBR 13966: 2008"] },
  { key: 'mob_alcance', label: 'Trabalho com necessidade de alcançar objetos, documentos, controles ou qualquer ponto além das zonas de alcance ideais para as características antropométricas do trabalhador', comment: 'mob_p4_comentario', embasamento: ["NR-17 item 17.6.3 letra c e 17.6.3.1", "Grandjean e Lida: Alcances Horizontal", "Grandjean: Tabela de Alcance Vertical"] },
  { key: 'mob_equipamentos_trabalhador', label: 'Equipamentos ou mobiliários não adaptados à antropometria do trabalhador', comment: 'mob_p5_comentario', embasamento: ["NR-17 item 17.6.1", "ABNT NBR 13966: 2008", "ABNT NBR 13962: 2002", "Tabela Antropométrica"] }
];

export const ORGANIZATIONAL_QUESTIONS = [
  { key: 'org_pausas', label: 'Trabalho realizado sem pausas pré definidas para descanso e/ ou desequilíbrio entre tempo de trabalho e tempo de repouso', comment: 'org_p1_comentario', embasamento: ["NR-17 item 17.4.3.1", "CLT/NR 17"] },
  { key: 'org_ritmos', label: 'Necessidade de manter ritmos intensos de trabalho', comment: 'org_p2_comentario', embasamento: ["NR-17 item 17.4.1 letra d"] },
  { key: 'org_monotonia', label: 'Monotonia', comment: 'org_p3_comentario', embasamento: ["Check List Ocra"] },
  { key: 'org_noturno', label: 'Trabalho noturno', comment: 'org_p4_comentario', embasamento: ["Entre 22:00 e 05:00 horas, se trabalhador urbano; entre 21:00 e 05:00 horas se trabalhador rural na lavoura e entre 20:00 e 04:00 horas se trabalhador rural na pecuária."] },
  { key: 'org_renumerado', label: 'Trabalho com utilização rigorosa de metas de produção ou trabalho remunerado por produção', comment: 'org_p5_comentario', embasamento: ["NR-17 item 17.4.4"] },
  { key: 'org_cadencia', label: 'Cadência do trabalho imposta por um equipamento', comment: 'org_p6_comentario', embasamento: ["CHECK LIST OCRA"] },
];

export const ENVIRONMENTAL_QUESTIONS = [
  { key: 'amb_sonora', label: 'Condições de trabalho com níveis de pressão sonora fora dos parâmetros de conforto', comment: 'amb_p1_comentario', embasamento: ["NR-17 item 17.8"] },
  { key: 'amb_temperatura', label: 'Condições de trabalho com índice de temperatura, velocidade do ar e umidade do ar fora dos parâmetros de conforto', comment: 'amb_p2_comentario', embasamento: ["NR-17 item 17.8"] },
  { key: 'amb_vibracao', label: 'Condições de trabalho com iluminação diurna e noturna inadequada ou presença de reflexos que causem desconforto', comment: 'amb_p3_comentario', embasamento: ["NHO-11", "NR-17 item 17.8"] },
];

export const PSYCHOSOCIAL_QUESTIONS = [
  { key: 'psic_1', label: 'Seu trabalho exige muita concentração?', embasamento: ["NR-17, item 17.4.3", "Análise Cognitiva"] },
  { key: 'psic_2', label: 'Você precisa trabalhar muito rápido?', embasamento: ["NR-17, item 17.4.3", "Manual de Aplicação da NR-17"] },
  { key: 'psic_3', label: 'Seu trabalho exige que você tome decisões difíceis?', embasamento: ["NR-17, item 17.4.3", "Metodologia COPSOQ"] },
  { key: 'psic_4', label: 'Você tem tempo suficiente para realizar suas tarefas?', embasamento: ["NR-17, item 17.4.3"] },
  { key: 'psic_5', label: 'Você precisa esconder suas emoções no trabalho?' },
  { key: 'psic_6', label: 'Seu trabalho envolve lidar com situações emocionalmente difíceis?' },
  { key: 'psic_7', label: 'Você pode decidir como organizar seu trabalho?' },
  { key: 'psic_8', label: 'Você tem influência sobre decisões do setor?' },
  { key: 'psic_9', label: 'Seu trabalho permite que você desenvolva novas habilidades?' },
  { key: 'psic_10', label: 'Você recebe informações claras sobre mudanças na empresa?' },
  { key: 'psic_11', label: 'Você sabe o que se espera de você no trabalho?' },
  { key: 'psic_12', label: 'Você pode contar com seus colegas quando precisa de ajuda?' },
  { key: 'psic_13', label: 'O ambiente entre os funcionários é amigável?' },
  { key: 'psic_14', label: 'Seu gestor escuta suas preocupações e sugestões?' },
  { key: 'psic_15', label: 'Você recebe reconhecimento pelo seu trabalho?' },
  { key: 'psic_16', label: 'As decisões da empresa são tomadas de forma justa?' },
  { key: 'psic_17', label: 'Você sente que é tratado com respeito por seus superiores?' },
  { key: 'psic_18', label: 'Você já sofreu ou presenciou assédio moral?' },
  { key: 'psic_19', label: 'Você teme perder seu emprego nos próximos meses?' },
  { key: 'psic_20', label: 'Você se sente esgotado após o trabalho?' },
  { key: 'psic_21', label: 'O trabalho afeta negativamente sua saúde mental?' },
  { key: 'psic_22', label: 'Você consegue equilibrar sua vida pessoal e profissional?' },
  { key: 'psic_23', label: 'Tenho mais tarefas do que consigo realizar no tempo disponível.' },
  { key: 'psic_24', label: 'Trabalho frequentemente sob pressão e prazos curtos.' },
  { key: 'psic_25', label: 'Sinto-me exausto ao final do expediente.' },
  { key: 'psic_26', label: 'Tenho controle sobre como organizo minhas tarefas diárias.' },
  { key: 'psic_27', label: 'Posso tomar decisões sobre meu trabalho sem precisar de autorização constante.' },
  { key: 'psic_28', label: 'Tenho liberdade para sugerir melhorias no meu setor.' },
  { key: 'psic_29', label: 'Tenho uma boa relação com meus colegas de trabalho.' },
  { key: 'psic_30', label: 'Sinto-me apoiado pela minha liderança quando enfrento dificuldades.' },
  { key: 'psic_31', label: 'O clima organizacional da empresa é positivo e motivador.' },
  { key: 'psic_32', label: 'Meu trabalho é valorizado e reconhecido pela empresa.' },
  { key: 'psic_33', label: 'Recebo feedbacks construtivos sobre o meu desempenho.' },
  { key: 'psic_34', label: 'Sinto que minha remuneração e benefícios são justos em relação às minhas responsabilidades.' },
  { key: 'psic_35', label: 'O ambiente de trabalho me causa estresse e ansiedade frequentes.' },
  { key: 'psic_36', label: 'Já fui vítima de assédio moral ou tratamento injusto no trabalho.' },
  { key: 'psic_37', label: 'Sinto que há competitividade excessiva e pouco trabalho em equipe na empresa.' },
];

// Função utilitária para gerar HTML de uma seção de perguntas
export function generateSectionHTML(sectionTitle: string, questions: any[], respostas: any, showComments = true) {
  return `
    <div class="section">
      <div class="section-title">${sectionTitle}</div>
      <div class="questions">
        ${questions.map(q => `
          <div class="question">
            <div class="question-label">${q.label}</div>
            <div class="answer">${respostas[q.key] || '<span style=\'color:#aaa\'>Não respondido</span>'}</div>
            ${showComments && q.comment ? `<div class="comment"><b>Comentário:</b> ${respostas[q.comment] || '<span style=\'color:#aaa\'>Nenhum comentário</span>'}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
export function generateAEPHTMLFromConteudo(conteudo: any) {
  const now = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');

  const safe = (v: any) => (v === undefined || v === null || v === '' ? '<span style="color:#aaa">Não informado</span>' : String(v));
  // const arr = (v: any) => Array.isArray(v) ? v : [];

  const {
    formData = {},
    setores = [],
    riscoseSolucoes = [],
    embasamentosBiomecanicos = [],
    embasamentosMobiliarios = [],
    embasamentosMobiliarioEquipamento = [],
    embasamentosOrganizacionais = [],
    embasamentosAmbientais = [],
    embasamentosPsicossociais = [],
    motivosPorLinha = {},
    acoesCronograma = [],
    classificacoesAmbientais = [],
    classificacoesBiomecanicos = [],
    classificacoesMobilarios = [],
    classificacoesMobiliario = [],
    classificacoesOrganizacionais = [],
    classificacoesPsicossociais = [],
    detalhesLinhasAmbientais = {},
    detalhesLinhasBiomecanicos = {},
    detalhesLinhasMobiliario = {},
    detalhesLinhasOrganizacionais = {},
    detalhesLinhasPsicossociais = {},
    logoEmpresa = null,
    imagensPostoTrabalho = {},
    timestamp = null,
  } = conteudo || {};

  // Aliases e fallbacks para manter compatibilidade com estruturas antigas
  const mobEmbas: any[] = (embasamentosMobiliarioEquipamento as any[])?.length
    ? (embasamentosMobiliarioEquipamento as any[])
    : ((embasamentosMobiliarios as any[]) || []);
  const mobClassArr: any[] = (classificacoesMobiliario as any[])?.length
    ? (classificacoesMobiliario as any[])
    : ((classificacoesMobilarios as any[]) || []);
  const mobDetalhes: Record<string, any> = (detalhesLinhasMobiliario as any) || {};

  const empresaLogoSrc = logoEmpresa?.imageData || '';

  const header = `
  <div class="pdf-header" style="width: 100%;">
      <div style="display: flex; flex-direction: column; align-items: flex-start; flex: 1;">
        <div style="display: flex; align-items: center; gap: 12px; margin-left: 40%; margin-right: 30%;">
          <img src="https://ergontech.net/images/Logo_ErgonTech.png" alt="Logo ErgonTech" style="height: 48px; width: 48px; object-fit: contain;" />
          <div>
            <span style="font-size: 1.7rem; font-weight: bold; color: #079DAB; line-height: 1;">ErgonTech</span><br />
            <span style="font-size: 1rem; color: #444;">CNPJ: 51.317.376/0001-65</span>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <div style="font-size: 2rem; font-weight: bold; color: #222; margin-bottom: 6px;">AVALIAÇÃO ERGONÔMICA PRELIMINAR (AEP)</div>
          <div style="font-size: 1rem; color: #079dab; font-weight: 500;">METODOLOGIA ERGONTECH PARA EMPRESAS</div>
          <div style="font-size: 0.97rem; color: #dc2626; font-weight: bold; margin-top: 2px;">
            MATERIAL DISPONIBILIZADO SOMENTE PARA USO DA EMPRESA SENDO PROIBIDA A REPRODUÇÃO
          </div>
        </div>
      </div>
      <div style="flex-shrink: 0; margin-left: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="border-radius: 50% 50% 50% 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px #0001;">
          ${empresaLogoSrc
      ? `<img src="${empresaLogoSrc}" alt="Logo da Empresa" style="width: 74px; height: 74px; object-fit: contain; border-radius: 12px; background: #fff;" />`
      : `<span style="font-size: 1.7rem; color: #222; font-weight: bold;">LOGO</span>`}
        </div>
      </div>
  </div>
`;

  const legislacaoSection = `
  <div class="section section-card">
        <section id="legislacao">
            <h2 class="section-title">CONSIDERAÇÕES LEGISLATIVAS, NORMATIVAS E TÉCNICAS</h2>
            <ul class="list-disc list-inside space-y-2 p-3 bg-gray-50 rounded">
                <div style="padding: 1rem; border-left: 4px solid #6FADFB; background-color: #DBEAFE; border-radius: 4px;">
                    <strong>Esta AEP foi elaborada com base nas normas NR-17 (Ergonomia) e NR-01 (GRO/PGR), que
                        estabelecem
                        diretrizes para a adaptação das condições de trabalho e gerenciamento de riscos ergonômicos.
                        Foram aplicadas as ferramentas Check-list de Ergonomia NR-17, Método RULA (avaliação postural) e
                        Matriz de Risco Ergonômico para identificação e análise dos riscos, com foco nos setores de
                        vendas, estoque, caixa e administrativos. O objetivo é atender às exigências legais, identificar
                        riscos e propor melhorias que promovam a saúde ocupacional e a segurança no trabalho.
                    </strong>
                </div>
                <div style="padding: 1rem; border-left: 4px ; background-color: #F9FAFB; border-radius: 4px;">
                <li>
                    <a href="https://www.planalto.gov.br/ccivil_03/leis/l6514.htm" target="_blank" style="color: black;">Lei nº 6.514, de 22
                        de dezembro de 1977</a>: Sanciona o Capítulo V do Título II
                    da Consolidação das Leis do Trabalho (CLT), relativo à segurança e medicina do trabalho.
                </li>
                <li>
                    <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/1978/portaria_3-214_aprova_as_nrs.pdf"
                        target="_blank" style="color: black;">Portaria nº 3.214, de 08 de junho de 1978</a>: Aprova as Normas Regulamentadoras
                    (NRs).
                </li>
                <li>
                    <a href="https://www.normaslegais.com.br/legislacao/portaria_mtp_423_2021.htm"
                        target="_blank" style="color: black;">Portaria/MPT nº 423, de 07 de outubro de 2021</a>: Aprova a nova redação da
                    NR-17.
                </li>
                <li>
                    <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-01-atualizada-2024.pdf"
                        target="_blank" style="color: black;">Norma Regulamentadora 01 (NR-01)</a>: Disposições Gerais e Gerenciamento de
                    Riscos Ocupacionais, exige a identificação de perigos e riscos ergonômicos.
                </li>
                <li>
                    <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/nr-17-atualizada-2022.pdf"
                        target="_blank" style="color: black;">Norma Regulamentadora 17 (NR-17) - Ergonomia</a>: Visa estabelecer parâmetros
                    que permitam a adaptação das condições de trabalho às características psicofisiológicas dos
                    trabalhadores, proporcionando conforto, segurança e desempenho eficiente.
                </li>
                <li>
                    <a href="https://www.target.com.br/produtos/normas-tecnicas/35546/nbr13966-moveis-para-escritorio-mesas-classificacao-e-caracteristicas-fisicas-dimensionais-e-requisitos-e-metodos-de-ensaio"
                        target="_blank" style="color: black;">Norma ABNT NBR
                        13966/2008</a>: Móveis para escritório – Mesas. Classifica, estabelece características físicas e
                    dimensionais, e especifica as dimensões, requisitos mecânicos, de segurança e ergonômicos para mesas
                    de escritório de uso geral, incluindo mesas de reuniões, e define os métodos de ensaio.
                </li>
                <li>
                    <a href="https://www.normas.com.br/visualizar/abnt-nbr-nm/25945/abnt-nbr13962-moveis-para-escritorio-cadeiras-requisitos-e-metodos-de-ensaio"
                        target="_blank" style="color: black;">Norma ABNT NBR
                        13962/2002</a>: Móveis para escritório – Cadeiras. Especifica as características físicas e
                    dimensionais, classifica cadeiras para escritório e estabelece métodos para determinar a
                    estabilidade, resistência e durabilidade.
                </li>
                <li>
                    <a href="https://www.unicesumar.edu.br/biblioteca/wp-content/uploads/sites/50/2019/06/NHO-11_f.pdf"
                        target="_blank" style="color: black;">Norma NHO 11</a>: Avaliação do nível de iluminamento em ambientes internos.
                    Aborda outros aspectos e parâmetros para detecção de não conformidades que possam comprometer
                    requisitos de segurança e desempenho eficiente do trabalho.
                </li>
                <li>
                    <a href="https://www.normas.com.br/visualizar/artigo-tecnico/2123/nbr-iso-11226-a-avaliacao-de-posturas-estaticas-de-trabalho"
                        target="_blank" style="color: black;">Norma ABNT NBR ISO
                        11226</a>: Ergonomia – Avaliação de posturas estáticas no trabalho. Contém uma abordagem para
                    determinar a aceitabilidade de posturas estáticas de trabalho, especificando limites recomendados
                    sem esforço ou com mínimo esforço, considerando ângulos posturais e tempo.
                </li>
                <li>
                    <a href="https://www.normas.com.br/visualizar/abnt-nbr-nm/11914/abnt-nbriso11228-1-ergonomia-movimentacao-manual-parte-1-levantamento-e-transporte-de-cargas"
                        target="_blank" style="color: black;">Norma ABNT NBR ISO
                        11228-1</a>: Ergonomia – Movimentação manual – Parte 1: Levantamento e transporte. Especifica os
                    limites recomendados para o levantamento manual e transporte de cargas, considerando intensidade,
                    frequência e duração da tarefa.
                </li>
                <li>
                    <a href="https://www.normas.com.br/visualizar/abnt-nbr-nm/11987/abnt-nbriso11228-2-ergonomia-movimentacao-manual-parte-2-empurrar-e-puxar"
                        target="_blank" style="color: black;">Norma ABNT NBR ISO
                        11228-2</a>: Ergonomia – Movimentação manual – Parte 2: Empurrar e puxar. Fornece dois métodos
                    para avaliar perigos e riscos associados e especifica os limites recomendados para puxar e empurrar
                    cargas, considerando intensidade, frequência e duração da tarefa.
                </li>
                <li>
                    <a href="https://www.normas.com.br/visualizar/artigo-tecnico/2259/nbr-iso-11228-3-ergonomia-para-o-trabalho-repetitivo-de-movimentacao-de-cargas-leves"
                        target="_blank" style="color: black;">Norma ABNT NBR ISO
                        11228-3</a>: Ergonomia – Movimentação manual – Parte 3: Movimentação de cargas leves em alta
                    frequência de repetição. Fornece recomendações ergonômicas para tarefas de trabalho repetitivo que
                    envolvem movimentação manual de cargas leves em alta frequência, com orientações sobre a
                    identificação e avaliação de fatores de risco.
                </li>
                <li>
                    <a href="https://www.cdc.gov/niosh/docs/94-110/default.html" target="_blank" style="color: black;">NIOSH (National
                        Institute for Occupational Safety and Health)</a>: Método que permite o cálculo do limite de
                    peso a ser levantado em condições seguras pelo trabalhador.
                </li>
            </ul>
            </div>
        </section>
      </div>
  `;

  const etapas = `
  <div class="section section-card">
        <section id="etapas">
        <h2 class="section-title">ETAPAS</h2>
            <div>
            <p class="mb-4 p-3 bg-gray-50 rounded">
                Foram realizadas as visitas técnicas, entrevistas com os colaboradores e identificação dos perigos e
                riscos no mês de [Mês de 2025], com acompanhamento de [Pessoa e Cargo] e Francineide Dias Fisioterapeuta
                ergonômica, que prestou as informações pertinentes junto aos colaboradores.
            </p>
            </div>
            <div>
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
                <thead>
                    <tr>
                        <th>FASE 1: COLETA</th>
                        <th>FASE 2: AVALIAÇÃO</th>
                        <th>FASE 3: DOCUMENTO À SER ENTREGUE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <ul class="list-disc list-inside">
                                <li>Visita e inspeção dos postos de trabalho</li>
                                <li>Entrevista com os colaboradores</li>
                                <li>Registro de foto e vídeo das atividades</li>
                                <li>Descrição das atividades (prescrita x real)</li>
                                <li>Descrição de turnos, horários, pausas</li>
                                <li>Anotações de queixas/desconfortos/melhorias</li>
                            </ul>
                        </td>
                        <td>
                            <ul class="list-disc list-inside">
                                <li>Identificação dos perigos/riscos biomecânicos</li>
                                <li>Identificação dos perigos/riscos de mobiliário e equipamentos</li>
                                <li>Identificação dos perigos/riscos organizacionais</li>
                                <li>Identificação dos perigos/riscos ambientais</li>
                                <li>Identificação dos perigos/riscos psicossociais e cognitivos</li>
                                <li>Fundamentação legal, técnica e normativa</li>
                            </ul>
                        </td>
                        <td>
                            <ul class="list-disc list-inside">
                                <li>Descrição das funções e tarefas</li>
                                <li>Avaliação e diagnóstico dos GHE</li>
                                <li>Perigos/fatores de riscos existentes x Riscos Existentes</li>
                                <li>Resumo da avaliação</li>
                                <li>Recomendações de melhoria e cronograma</li>
                                <li>Encerramento e referências</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </section>
      </div>
`;

  // Seção: Setores e Funções (dados do laudo + setores avaliados)
  const setoresFuncoesSection = `
    <div class="section section-card">
      <div class="section-title">DESCRIÇÃO DAS TAREFAS E ATIVIDADES</div>
      ${setores.length ? `
        <div class="table-wrapper">
          <table class="table tarefas">
            <thead>
              <tr>
                <th>FUNÇÃO(ÕES)</th>
                <th>TAREFA PRESCRITA</th>
                <th>TAREFA REAL</th>
              </tr>
            </thead>
            <tbody>
              ${setores.map((s: any) => `
                <tr>
                  <td>${safe(s.funcoes)}</td>
                  <td>${safe(s.setor)}</td>
                  <td>${safe(s.tarefaReal)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<p style="color:#666; font-style:italic;">Nenhum setor cadastrado</p>'}
    </div>
  `;

  // Quadro de Setores e Funções analisadas (mantido como seção separada)
  const setoresQuadroSection = `
    <div class=\"section section-card\">
      <div class=\"section-title\">QUADRO DE SETORES E FUNÇÕES ANALISADAS</div>
      ${setores.length ? `
        <div class=\"table-wrapper\">
          <table class=\"table\">
            <thead>
              <tr>
                <th>UN. OPERACIONAL / GHE DE ERGONOMIA</th>
                <th>SETOR</th>
                <th>FUNÇÕES</th>
                <th>COLABORADORES</th>
              </tr>
            </thead>
            <tbody>
              ${setores.map((s: any) => `
                <tr>
                  <td>${safe(s.unidade)}</td>
                  <td>${safe(s.setor)}</td>
                  <td>${safe(s.funcoes)}</td>
                  <td>${safe(s.colaboradores)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<p style=\"color:#666; font-style:italic;\">Nenhum setor cadastrado</p>'}
    </div>
  `;

  // Seção: Cronograma de Ações (riscos e soluções com prazos)
  const cronogramaAcoesSection = `
    <div class="section section-card">
              <!-- Avaliação dos Perigos -->
        <section id="avaliacao_perigos">
            <h2 class="section-title">AVALIAÇÃO DOS PERIGOS (FATORES DE RISCO) E DOS RISCOS ERGONÔMICOS</h2>

            <!-- Biomecânicos -->
            <h3 style="font-weight: bold; font-size: 16px; margin: 16px 0 8px; padding: 8px 16px; background-color: #f5f5f5; border-radius: 4px;">PERIGOS - BIOMECÂNICOS</h3>
            <table class="table cols-3">
              <thead>
                <tr>
                  <th>PERIGO ERGONÔMICO/FATOR DE RISCO</th>
                  <th>RISCO ERGONÔMICO (ENTREVISTA/MOTIVO)</th>
                  <th>EMBASAMENTO</th>
                </tr>
              </thead>
              <tbody>
                ${BIOMECHANICAL_QUESTIONS.map((perigo, idx) => {
                  const key = `biomecanicos_${idx}`;
                  const motivos = (motivosPorLinha && (motivosPorLinha as any)[key]) ? (motivosPorLinha as any)[key] : [];
                  // Classificação para cor (usa array direto ou detalhes por linha)
                  const clsDetail = String(((detalhesLinhasBiomecanicos as any)?.[key]?.classificacao) || '').toLowerCase();
                  const clsArr = (classificacoesBiomecanicos as any) || [];
                  const clsDirect = String(clsArr[idx] || '').toLowerCase();
                  const cls = (clsDetail || clsDirect);
                  const bg = cls === 'alto' ? '#FEE2E2' : (cls === 'medio' || cls === 'médio') ? '#FEF3C7' : (cls === 'baixo' ? '#DCFCE7' : '');
                  const motivoFallback = ((detalhesLinhasBiomecanicos as any)?.[key]?.observacoes) || '';
                  const motivosHtml = motivos.length
                    ? `<div class=\"motivo-list\">${motivos.map((m: any) => `<div class=\\\"motivo-text\\\">${safe(m.label || m.value)}</div>`).join('')}</div>`
                    : (motivoFallback ? `<div class=\"motivo-list\"><div class=\\\"motivo-text\\\">${safe(motivoFallback)}</div></div>` : '<span style=\"color:#444\">-</span>');
                  const emb = (embasamentosBiomecanicos as any)?.[idx]
                    || (perigo.embasamento && perigo.embasamento.length ? perigo.embasamento.map((e: any) => `<div>${safe(e)}</div>`).join('') : '');
                  return `
                  <tr>
                    <td>${perigo.label}</td>
                    <td style="background:${bg};">${motivosHtml}</td>
                    <td>${emb || ''}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>

            <!-- Mobiliários e Equipamentos -->
            <h3 style="font-weight: bold; font-size: 16px; margin: 16px 0 8px; padding: 8px 16px; background-color: #f5f5f5; border-radius: 4px;">PERIGOS - MOBILIÁRIOS E EQUIPAMENTOS</h3>
            <table class="table cols-3">
              <thead>
                <tr>
                  <th>PERIGO ERGONÔMICO/FATOR DE RISCO</th>
                  <th>RISCO ERGONÔMICO (ENTREVISTA/MOTIVO)</th>
                  <th>EMBASAMENTO</th>
                </tr>
              </thead>
              <tbody>
                ${MOBILIAEQUIP_QUESTIONS.map((perigo, idx) => {
                  const key = `mobiliario_${idx}`;
                  const motivos = (motivosPorLinha && (motivosPorLinha as any)[key]) ? (motivosPorLinha as any)[key] : [];
                  // Classificação (usa detalhes por linha ou array direto) e cor de fundo
                  const clsDetail = String((mobDetalhes?.[key]?.classificacao || '')).toLowerCase();
                  const clsDirect = String((mobClassArr?.[idx] || '')).toLowerCase();
                  const cls = (clsDetail || clsDirect);
                  const bg = cls === 'alto' ? '#FEE2E2' : (cls === 'medio' || cls === 'médio') ? '#FEF3C7' : (cls === 'baixo' ? '#DCFCE7' : '');
                  const motivoFallback = (mobDetalhes?.[key]?.observacoes) || '';
                  const motivosHtml = motivos.length
                    ? `<div class=\"motivo-list\">${motivos.map((m: any) => `<div class=\\\"motivo-text\\\">${safe(m.label || m.value)}</div>`).join('')}</div>`
                    : (motivoFallback ? `<div class=\"motivo-list\"><div class=\\\"motivo-text\\\">${safe(motivoFallback)}</div></div>` : '<span style=\"color:#444\">-</span>');
                  const emb = (mobEmbas as any)?.[idx]
                    || (perigo.embasamento && perigo.embasamento.length ? perigo.embasamento.map((e: any) => `<div>${safe(e)}</div>`).join('') : '');
                  return `
                  <tr>
                    <td>${perigo.label}</td>
                    <td style="background:${bg};">${motivosHtml}</td>
                    <td>${emb || ''}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>

            <!-- Organizacional -->
            <h3 style="font-weight: bold; font-size: 16px; margin: 16px 0 8px; padding: 8px 16px; background-color: #f5f5f5; border-radius: 4px;">PERIGOS - ORGANIZACIONAL</h3>
            <table class="table cols-3">
              <thead>
                <tr>
                  <th>PERIGO ERGONÔMICO/FATOR DE RISCO</th>
                  <th>RISCO ERGONÔMICO (ENTREVISTA/MOTIVO)</th>
                  <th>EMBASAMENTO</th>
                </tr>
              </thead>
              <tbody>
                ${ORGANIZATIONAL_QUESTIONS.map((perigo, idx) => {
                  const key = `organizacionais_${idx}`;
                  const motivos = (motivosPorLinha && (motivosPorLinha as any)[key]) ? (motivosPorLinha as any)[key] : [];
                  const clsDetail = String(((detalhesLinhasOrganizacionais as any)?.[key]?.classificacao) || '').toLowerCase();
                  const clsArr = (classificacoesOrganizacionais as any) || [];
                  const clsDirect = String(clsArr[idx] || '').toLowerCase();
                  const cls = (clsDetail || clsDirect);
                  const bg = cls === 'alto' ? '#FEE2E2' : (cls === 'medio' || cls === 'médio') ? '#FEF3C7' : (cls === 'baixo' ? '#DCFCE7' : '');
                  const motivoFallback = ((detalhesLinhasOrganizacionais as any)?.[key]?.observacoes) || '';
                  const motivosHtml = motivos.length
                    ? `<div class=\"motivo-list\">${motivos.map((m: any) => `<div class=\\\"motivo-text\\\">${safe(m.label || m.value)}</div>`).join('')}</div>`
                    : (motivoFallback ? `<div class=\"motivo-list\"><div class=\\\"motivo-text\\\">${safe(motivoFallback)}</div></div>` : '<span style=\"color:#444\">-</span>');
                  const emb = (embasamentosOrganizacionais as any)?.[idx]
                    || (perigo.embasamento && perigo.embasamento.length ? perigo.embasamento.map((e: any) => `<div>${safe(e)}</div>`).join('') : '');
                  return `
                  <tr>
                    <td>${perigo.label}</td>
                    <td style="background:${bg};">${motivosHtml}</td>
                    <td>${emb || ''}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>

            <!-- Ambientais -->
            <h3 style="font-weight: bold; font-size: 16px; margin: 16px 0 8px; padding: 8px 16px; background-color: #f5f5f5; border-radius: 4px;">PERIGOS - AMBIENTAIS</h3>
            <table class="table cols-3">
              <thead>
                <tr>
                  <th>PERIGO ERGONÔMICO/FATOR DE RISCO</th>
                  <th>RISCO ERGONÔMICO (ENTREVISTA/MOTIVO)</th>
                  <th>EMBASAMENTO</th>
                </tr>
              </thead>
              <tbody>
                ${ENVIRONMENTAL_QUESTIONS.map((perigo, idx) => {
                  const key = `ambientais_${idx}`;
                  const motivos = (motivosPorLinha && (motivosPorLinha as any)[key]) ? (motivosPorLinha as any)[key] : [];
                  const clsDetail = String(((detalhesLinhasAmbientais as any)?.[key]?.classificacao) || '').toLowerCase();
                  const clsArr = (classificacoesAmbientais as any) || [];
                  const clsDirect = String(clsArr[idx] || '').toLowerCase();
                  const cls = (clsDetail || clsDirect);
                  const bg = cls === 'alto' ? '#FEE2E2' : cls === 'medio' || cls === 'médio' ? '#FEF3C7' : cls === 'baixo' ? '#DCFCE7' : '';
                  const motivoFallback = ((detalhesLinhasAmbientais as any)?.[key]?.observacoes) || '';
                  const motivosHtml = motivos.length
                    ? `<div class=\"motivo-list\">${motivos.map((m: any) => `<div class=\\\"motivo-text\\\">${safe(m.label || m.value)}</div>`).join('')}</div>`
                    : (motivoFallback ? `<div class=\"motivo-list\"><div class=\\\"motivo-text\\\">${safe(motivoFallback)}</div></div>` : '<span style=\"color:#444\">-</span>');
                  const emb = (embasamentosAmbientais as any)?.[idx]
                    || (perigo.embasamento && perigo.embasamento.length ? perigo.embasamento.map((e: any) => `<div>${safe(e)}</div>`).join('') : '');
                  return `
                  <tr>
                    <td>${perigo.label}</td>
                    <td style="background:${bg};">${motivosHtml}</td>
                    <td>${emb || ''}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>

            <!-- Psicosociais -->
            <h3 style="font-weight: bold; font-size: 16px; margin: 16px 0 8px; padding: 8px 16px; background-color: #f5f5f5; border-radius: 4px;">PERIGOS ERGONÔMICOS - PSICOSSOCIAIS/COGNITIVOS</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>PERIGO ERGONÔMICO/FATOR DE RISCO</th>
                  <th>RISCO ERGONÔMICO (ENTREVISTA/MOTIVO)</th>
                  <th>EMBASAMENTO</th>
                </tr>
              </thead>
              <tbody>
                ${PSYCHOSOCIAL_QUESTIONS.map((perigo, idx) => {
                  const key = `psicossociais_${idx}`;
                  const motivos = (motivosPorLinha && (motivosPorLinha as any)[key]) ? (motivosPorLinha as any)[key] : [];
                  const clsDetail = String(((detalhesLinhasPsicossociais as any)?.[key]?.classificacao) || '').toLowerCase();
                  const clsArr = (classificacoesPsicossociais as any) || [];
                  const clsDirect = String(clsArr[idx] || '').toLowerCase();
                  const cls = (clsDetail || clsDirect);
                  const bg = cls === 'alto' ? '#FEE2E2' : (cls === 'medio' || cls === 'médio') ? '#FEF3C7' : (cls === 'baixo' ? '#DCFCE7' : '');
                  const motivoFallback = ((detalhesLinhasPsicossociais as any)?.[key]?.observacoes) || '';
                  const motivosHtml = motivos.length
                    ? `<div class=\"motivo-list\">${motivos.map((m: any) => `<div class=\\\"motivo-text\\\">${safe(m.label || m.value)}</div>`).join('')}</div>`
                    : (motivoFallback ? `<div class=\"motivo-list\"><div class=\\\"motivo-text\\\">${safe(motivoFallback)}</div></div>` : '<span style=\"color:#444\">-</span>');
                  const emb = (embasamentosPsicossociais as any)?.[idx]
                    || (perigo.embasamento && perigo.embasamento.length ? perigo.embasamento.map((e: any) => `<div>${safe(e)}</div>`).join('') : '<span style=\\\"color:#6b7280\\\">-</span>');
                  return `
                  <tr>
                    <td>${perigo.label}</td>
                    <td style="background:${bg};">${motivosHtml}</td>
                    <td>${emb || ''}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>

        </section>
    </div>
  `;

  const resumoRisco = `
    <div class=\"section section-card\">
        <section id=\"resumo_solucoes\">
            <h2 class=\"section-title\">TABELA RESUMO DE RISCOS X SOLUÇÕES ERGONÔMICAS / SUGESTÕES DE MELHORIAS</h2>
            <div class=\"table-wrapper\">
              <table class=\"table resumo-riscos\" style=\"width: 100%; border-collapse: collapse; margin-top: 16px;\">
                <thead>
                  <tr>
                    <th>Risco Identificado</th>
                    <th>Solução/Medida</th>
                    <th>Prazo</th>
                    <th>Gravidade</th>
                    <th>Probabilidade</th>
                    <th>Nível de Risco</th>
                  </tr>
                </thead>
                <tbody>
                  ${Array.isArray(riscoseSolucoes) && riscoseSolucoes.length ? riscoseSolucoes.map((r: any) => `
                    <tr>
                      <td>${safe(r.risco)}</td>
                      <td>${safe(r.solucao)}</td>
                      <td>${safe(r.prazo)}</td>
                      <td>${safe(r.gravidade)}</td>
                      <td>${safe(r.probabilidade)}</td>
                      <td>${safe(r.nivelRisco)}</td>
                    </tr>
                  `).join('') : '<tr><td colspan=\"6\" style=\"color:#666; font-style:italic;\">Sem dados cadastrados</td></tr>'}
                </tbody>
              </table>
            </div>
        </section>
    </div>
`;

  const matrizrisco = `
    <div class="section section-card">
           <!-- Matriz de Risco -->
        <section id="matriz_risco">
            <h2 class="section-title">MATRIZ DE RISCO ERGONÔMICO</h2>
            <p class="text-sm italic p-3 bg-gray-50 rounded mb-4">Esta matriz foi elaborada conforme as diretrizes da
                NR-01 e NR-17...</p>
            <table class="table matriz-risco" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <thead>
                    <tr>
                        <th>Nº</th>
                        <th>Risco Erg. Identificado</th>
                        <th>Gravidade</th>
                        <th>Probabilidade</th>
                        <th>Nível de Risco / Classificação</th>
                        <th>Medidas Propostas</th>
                    </tr>
                </thead>
                <tbody>
                  ${Array.isArray(riscoseSolucoes) && riscoseSolucoes.length ? riscoseSolucoes.map((r: any, idx: number) => {
                    const nivel = String(r.nivelRisco || '').toLowerCase();
                    const bg = nivel.includes('alto') || nivel.includes('crítico') ? '#EF4444'
                              : nivel.includes('médio') || nivel.includes('moderado') ? '#F59E0B'
                              : '#84CC16';
                    return `
                      <tr>
                        <td>${idx + 1}</td>
                        <td>${safe(r.risco)}</td>
                        <td>${safe(r.gravidade)}</td>
                        <td>${safe(r.probabilidade)}</td>
                        <td style="background-color:${bg};">${safe(r.nivelRisco)}</td>
                        <td>${safe(r.solucao)}</td>
                      </tr>`;
                  }).join('') : '<tr><td colspan="6" style="color:#666; font-style:italic;">Sem dados</td></tr>'}
                </tbody>
            </table>
            <h3 class="font-semibold text-lg my-4">LEGENDA DE PRIORIDADE POR CORES</h3>
            <table class="table" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <thead>
                    <tr>
                        <th>Cor</th>
                        <th>Significado</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="background-color: #EF4444;"></td>
                        <td>Crítico (Ação Imediata)</td>
                        <td>Necessário agir imediatamente.</td>
                    </tr>
                    <tr>
                        <td style="background-color:#F97316;"></td>
                        <td>Alto (Ação Prioritária)</td>
                        <td>Ação deve ser priorizada no curto prazo.</td>
                    </tr>
                    <tr>
                        <td style="background-color:#F59E0B;"></td>
                        <td>Moderado (Ação Programada)</td>
                        <td>Programar ação no médio prazo.</td>
                    </tr>
                    <tr>
                        <td style="background-color:#84CC16;"></td>
                        <td>Baixo (Monitoramento)</td>
                        <td>Monitorar regularmente.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
`;

  const sugestaoGeral = (() => {
    const itens: { label: string; valor: string }[] = [];
    const addIfPresent = (label: string, valor: any) => {
      if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        itens.push({ label, valor: String(valor) });
      }
    };
    addIfPresent('Treinamentos', (formData as any).treinamentosRecomendacoes);
    addIfPresent('Pausas e Ginástica Laboral', (formData as any).pausasGinasticaRecomendacoes);
    addIfPresent('Mobiliário e Equipamentos', (formData as any).mobiliarioEquipamentosRecomendacoes);
    addIfPresent('Aspectos Organizacionais', (formData as any).aspectosOrganizacionaisRecomendacoes);

    const listaHtml = itens.length
      ? `<ul class=\"list-disc list-inside space-y-2\">${itens
          .map((i) => `<li><b>${i.label}:</b> ${safe(i.valor)}</li>`)
          .join('')}</ul>`
      : '<div style="color:#6b7280; font-style:italic;">Sem recomendações registradas</div>';

    return `
    <div class="section section-card">
        <section id="sugestoes_gerais">
            <h2 class="section-title">SUGESTÕES DE MELHORIAS GERAIS (ORGANIZACIONAIS E TÉCNICAS)</h2>
            <div class="p-4 bg-gray-50 rounded">
                ${listaHtml}
            </div>
        </section>
    </div>
    `;
  })();

  const cronogramaresposta = `
    <div class="section section-card">
            <!-- Cronograma -->
        <section id="cronograma">
            <h2 class="section-title">CRONOGRAMA DE AÇÕES (18 MESES) [2025 - 2026]</h2>
            <div class="overflow-x-auto">
                <table class="table cronograma" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                    <thead>
                        <tr>
                            <th>AÇÃO</th>
                            <th>1º Trimestre</th>
                            <th>2º Trimestre</th>
                            <th>3º Trimestre</th>
                            <th>4º Trimestre</th>
                            <th>5º Trimestre</th>
                            <th>6º Trimestre</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${Array.isArray(acoesCronograma) && acoesCronograma.length ? acoesCronograma.map((a: any) => `
                        <tr>
                          <td>${safe(a.acao)}</td>
                          <td style="text-align:center;">${a.trimestre1 ? 'X' : ''}</td>
                          <td style="text-align:center;">${a.trimestre2 ? 'X' : ''}</td>
                          <td style="text-align:center;">${a.trimestre3 ? 'X' : ''}</td>
                          <td style="text-align:center;">${a.trimestre4 ? 'X' : ''}</td>
                          <td style="text-align:center;">${a.trimestre5 ? 'X' : ''}</td>
                          <td style="text-align:center;">${a.trimestre6 ? 'X' : ''}</td>
                        </tr>
                      `).join('') : '<tr><td colspan="7" style="color:#666; font-style:italic;">Sem ações no cronograma</td></tr>'}
                    </tbody>
                </table>
            </div>
        </section>
    </div>
`;

  const encerramento = `
    <div class="section section-card">
        <!-- Encerramento -->
        <section id="encerramento" class="mt-8 pt-6 border-t">
            <h2 class="section-title">ENCERRAMENTO</h2>
            <div style="background-color: #F9FAFB; border-radius: 16px; padding: 5px;">
            <p class="mb-4 p-3 bg-gray-50 rounded">Esta Avaliação Ergonômica Preliminar (AEP) contém [Número] páginas, devidamente numeradas. Validade: [Data], ou até haver qualquer alteração no modo operatório...</p>
            </div>
            <div style="text-align: center;">
            <p class="text-center my-6 ">Teresina - PI, [${safe(timestamp)}].</p>
            </div>

            <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start; background: #079DAB; border-radius: 20px; box-shadow: 0 6px 32px #0002; padding: 28px 36px 20px 28px; max-width: 820px; margin: 0 auto 24px auto; min-height: 120px;">
                <img src="https://ergontech.net/images/perfil-neide.png" alt="Foto da Fisioterapeuta"
                    style="width: 120px; height: 120px; border-radius: 50%; border: 5px solid #fff; object-fit: cover; margin-right: 36px; background: #fff; box-shadow: 0 2px 8px #0001;">
                <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
                    <div style="color: #fff; font-size: 2rem; font-weight: bold; line-height: 1.1; margin-bottom: 2px;">Dra. Francineide Dias</div>
                    <div style="color: #fff; font-size: 1.2rem; font-weight: 500; line-height: 1.2;">Fisioterapeuta Ergonomista</div>
                    <div style="color: #fff; font-size: 1.1rem; margin-top: 4px;">CREFITO: 329866-FPI</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center; margin-left: 36px; min-width: 260px;">
                    <div style="width: 220px; height: 2px; background: #fff; margin-bottom: 8px; margin-top: 10px;"></div>
                    <div style="color: #fff; font-size: 1.18rem; font-weight: 500;">Assinatura Digital</div>
                </div>
            </div>
        </section>
    </div>
`;

  // Seção: Postos de Trabalho (fotos organizadas)
  const postosTrabalhoSection = (() => {
    const imgs = [
      { src: imagensPostoTrabalho?.imagem1?.data, label: 'Foto Posto 1' },
      { src: imagensPostoTrabalho?.imagem2?.data, label: 'Foto Posto 2' },
      { src: imagensPostoTrabalho?.imagem3?.data, label: 'Foto Posto 3' },
      { src: imagensPostoTrabalho?.imagem4?.data, label: 'Foto Posto 4' }
    ].filter(img => img.src);

    if (!imgs.length) return '';

    return `
      <div class="section section-card">
        <div class="section-title">POSTOS DE TRABALHO</div>
        <div class="image-grid">
          ${imgs.map((img) => `
            <div class="image-item">
              <img src="${img.src}" alt="${img.label}" />
              <div class="image-caption">${img.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  })();

  const legendasSection = `
    <div class="section section-card">
      <section id="legendas_avaliacao">
        <h2 class="section-title">LEGENDAS DOS RESULTADOS DAS AVALIAÇÕES</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div style="padding: 1rem; border-left: 4px solid #22C55E; background-color: #DCFCE7; border-radius: 8px; margin-bottom: 1rem;"><strong>AUSÊNCIA / SEM FATOR E/OU RISCO ERGONÔMICO</strong></div>
            <div style="padding: 1rem; border-left: 4px solid #FBBF24; background-color: #FEF3C7; border-radius: 8px; margin-bottom: 1rem;"><strong>PRESENÇA / FATOR E/OU RISCO ERGONÔMICO BAIXO</strong></div>
            <div style="padding: 1rem; border-left: 4px solid #EF4444; background-color: #FEE2E2; border-radius: 8px; margin-bottom: 1rem;"><strong>PRESENÇA DE RISCO ERGONÔMICO MÉDIO / ALTO</strong></div>
        </div>
      </section>
    </div>
  `;

  const footer = `
        <footer style="text-align: center; margin-top: 12px; padding-top: 6px; border-top: 1px solid #ccc;">
          <p>ErgonTech - CNPJ: 51.317.376/0001-65</p>
          <address>Rua Professor Elenir Costa Largo, Nº 4515, Bairro Angelim, CEP 64034-170</address>
          <p>Email: atendimento@ergontech.net | Telefone: (86) 99451-6516 | Website: ergontech.net</p>
        </footer>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>AEP - Avaliação Ergonômica Preliminar</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', 'Roboto', Arial, sans-serif;
          margin: 0 auto;
          background: #f4f8fa;
          color: #222;
          max-width: 980px;
          padding: 32px 16px 80px 16px;
        }
        .motivo-list { display: block; }
        .motivo-text {
          padding: 2px 0;
          border: 0;
          background: transparent;
          color: #111827;
          border-radius: 0;
          margin: 2px 0;
          line-height: 1.4;
          font-size: 0.98rem;
          word-break: break-word;
          white-space: pre-wrap;
        }
        .pdf-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 36px;
          border-bottom: 2px solid #079DAB;
          padding-bottom: 18px;
        }
        .pdf-header-logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #079DAB 70%, #22D3EE 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .pdf-header-logo img { width: 100%; height: 100%; object-fit: cover; }
        .pdf-header-title {
          font-size: 1.9rem;
          font-weight: 700;
          background: linear-gradient(90deg, #079DAB 60%, #22D3EE 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #079DAB; /* Fallback para impressão */
        }
        .section { margin-bottom: 38px; }
        .section-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 1px 8px 0 rgba(7,157,171,0.07), 0 0.5px 1.5px 0 rgba(34,211,238,0.04);
          border: 1px solid #e5e7eb; /* Fallback para impressão */
          padding: 22px 24px 18px 18px;
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #079DAB;
          margin-bottom: 16px;
          background: linear-gradient(90deg, #079DAB 60%, #22D3EE 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .kv-grid { display: grid; grid-template-columns: repeat(2, minmax(240px, 1fr)); gap: 10px 26px; }
        .kv {
          background: #f3f4f6; 
          border-left: 4px solid #22D3EE; 
          border-radius: 8px; 
          padding: 8px 12px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .kv b { color: #333; display: inline-block; min-width: 160px; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { 
          background: #e0f7fa; /* Cor sólida ao invés de gradiente */ 
          color: #055c65; 
          border: 1px solid #22D3EE; 
          padding: 6px 12px; 
          border-radius: 20px; 
          font-size: 0.9rem; 
          font-weight: 500; 
          box-shadow: 0 1px 3px rgba(7,157,171,0.1);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .bullets { margin: 0; padding-left: 20px; }
        .bullets li { margin: 6px 0; }
        .motivos-grid { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 14px; }
        .motivos-card { 
          background: #f8fafc; 
          border-left: 4px solid #22D3EE; 
          border-radius: 10px; 
          padding: 12px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .motivos-title { font-weight: 600; color: #333; margin-bottom: 8px; }
        .table-wrapper { overflow-x: auto; }
        table.table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #cbd5e1; }
        table.table th, table.table td { 
          text-align: left; 
          padding: 12px 8px; 
          border: 1px solid #cbd5e1; 
          vertical-align: top;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
          line-height: 1.4;
          font-size: 0.95rem;
        }
        table.table thead th { 
          background: #e0f7fa; 
          color: #055c65; 
          border: 1.5px solid #22D3EE;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        /* Larguras padrão para 3 colunas (Perigo, Motivo, Embasamento) */
        .cols-3 th:nth-child(1), .cols-3 td:nth-child(1) { width: 34%; }
        .cols-3 th:nth-child(2), .cols-3 td:nth-child(2) { width: 38%; }
        .cols-3 th:nth-child(3), .cols-3 td:nth-child(3) { width: 28%; }
        /* Larguras para a tabela de tarefas (Função, Prescrita, Real) */
        .tarefas th:nth-child(1), .tarefas td:nth-child(1) { width: 26%; }
        .tarefas th:nth-child(2), .tarefas td:nth-child(2) { width: 37%; }
        .tarefas th:nth-child(3), .tarefas td:nth-child(3) { width: 37%; }
        /* Larguras para tabela de resumo de riscos (6 colunas) */
        .resumo-riscos th:nth-child(1), .resumo-riscos td:nth-child(1) { width: 25%; } /* Risco Identificado */
        .resumo-riscos th:nth-child(2), .resumo-riscos td:nth-child(2) { width: 25%; } /* Solução/Medida */
        .resumo-riscos th:nth-child(3), .resumo-riscos td:nth-child(3) { width: 12%; } /* Prazo */
        .resumo-riscos th:nth-child(4), .resumo-riscos td:nth-child(4) { width: 12%; } /* Gravidade */
        .resumo-riscos th:nth-child(5), .resumo-riscos td:nth-child(5) { width: 12%; } /* Probabilidade */
        .resumo-riscos th:nth-child(6), .resumo-riscos td:nth-child(6) { width: 14%; } /* Nível de Risco */
        
        /* Larguras para matriz de risco (6 colunas) */
        .matriz-risco th:nth-child(1), .matriz-risco td:nth-child(1) { width: 6%; }  /* Nº */
        .matriz-risco th:nth-child(2), .matriz-risco td:nth-child(2) { width: 26%; } /* Risco Erg. Identificado */
        .matriz-risco th:nth-child(3), .matriz-risco td:nth-child(3) { width: 12%; } /* Gravidade */
        .matriz-risco th:nth-child(4), .matriz-risco td:nth-child(4) { width: 12%; } /* Probabilidade */
        .matriz-risco th:nth-child(5), .matriz-risco td:nth-child(5) { width: 16%; } /* Nível de Risco */
        .matriz-risco th:nth-child(6), .matriz-risco td:nth-child(6) { width: 28%; } /* Medidas Propostas */
        
        /* Padding específico para células das tabelas de risco */
        .resumo-riscos td, .matriz-risco td {
          padding: 10px 6px !important;
          font-size: 0.9rem !important;
          line-height: 1.3 !important;
        }
        
        /* Células de texto longo precisam de mais espaço */
        .resumo-riscos td:nth-child(1), .resumo-riscos td:nth-child(2),
        .matriz-risco td:nth-child(2), .matriz-risco td:nth-child(6) {
          padding: 10px 4px !important;
          font-size: 0.85rem !important;
        }
        
        /* Larguras para a tabela de cronograma (Ação + 6 trimestres = 7 colunas) */
        .cronograma th:nth-child(1), .cronograma td:nth-child(1) { width: 28%; }
        .cronograma th:nth-child(2), .cronograma td:nth-child(2),
        .cronograma th:nth-child(3), .cronograma td:nth-child(3),
        .cronograma th:nth-child(4), .cronograma td:nth-child(4),
        .cronograma th:nth-child(5), .cronograma td:nth-child(5),
        .cronograma th:nth-child(6), .cronograma td:nth-child(6),
        .cronograma th:nth-child(7), .cronograma td:nth-child(7) { width: 12%; }
        .image-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 12px; }
        .image-item { 
          background: #fff; 
          border-radius: 14px; 
          overflow: hidden; 
          border: 2px solid #e0f7fa; 
          box-shadow: 0 2px 8px rgba(7,157,171,0.08); 
          transition: transform 0.2s, box-shadow 0.2s;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .image-item:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(7,157,171,0.15); }
        .image-item img { width: 100%; height: 280px; object-fit: cover; display: block; }
        .image-caption { 
          padding: 10px 12px; 
          font-size: 0.95rem; 
          font-weight: 600; 
          color: #055c65; 
          background: #e0f7fa; /* Cor sólida ao invés de gradiente */
          border-top: 2px solid #22D3EE; 
          text-align: center;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .image-description { padding: 6px 12px; font-size: 0.85rem; color: #666; background: #f8fafc; text-align: center; font-style: italic; }
        .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
        .badge-alto { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
        .badge-medio { background: #fef3c7; color: #d97706; border: 1px solid #fcd34d; }
        .badge-baixo { background: #d1fae5; color: #059669; border: 1px solid #6ee7b7; }
        .badge-default { background: #f3f4f6; color: #6b7280; border: 1px solid #d1d5db; }
        .badge-prazo { background: #ddd6fe; color: #7c3aed; border: 1px solid #c4b5fd; }
        .subsection { margin: 16px 0; }
        .subsection-title { font-size: 1.1rem; font-weight: 600; color: #079DAB; margin-bottom: 8px; border-bottom: 1px solid #e0f7fa; padding-bottom: 4px; }
        .pdf-footer { position: fixed; left: 0; right: 0; bottom: 0; background: #079DAB; color: #fff; padding: 12px 0 10px 0; text-align: center; font-size: 0.98rem; letter-spacing: 0.01em; border-top-left-radius: 18px; border-top-right-radius: 18px; box-shadow: 0 -1px 8px 0 rgba(7,157,171,0.09); }
        @media print { 
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body { 
            background: #fff !important; 
            color: #000 !important;
            font-size: 12pt !important;
          }
          
          .pdf-header { 
            border-bottom: 2px solid #079DAB !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .section-card { 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
            border: 1px solid #e5e7eb !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          
          .section-title {
            color: #079DAB !important;
            -webkit-print-color-adjust: exact !important;
            background: none !important;
            -webkit-background-clip: initial !important;
            -webkit-text-fill-color: #079DAB !important;
          }
          
          table.table th {
            background: #e0f7fa !important;
            color: #055c65 !important;
            border: 1px solid #22D3EE !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          table.table td {
            border: 1px solid #cbd5e1 !important;
            -webkit-print-color-adjust: exact !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          
          /* Garantir larguras corretas na impressão */
          .resumo-riscos th:nth-child(1), .resumo-riscos td:nth-child(1) { width: 25% !important; }
          .resumo-riscos th:nth-child(2), .resumo-riscos td:nth-child(2) { width: 25% !important; }
          .resumo-riscos th:nth-child(3), .resumo-riscos td:nth-child(3) { width: 12% !important; }
          .resumo-riscos th:nth-child(4), .resumo-riscos td:nth-child(4) { width: 12% !important; }
          .resumo-riscos th:nth-child(5), .resumo-riscos td:nth-child(5) { width: 12% !important; }
          .resumo-riscos th:nth-child(6), .resumo-riscos td:nth-child(6) { width: 14% !important; }
          
          .matriz-risco th:nth-child(1), .matriz-risco td:nth-child(1) { width: 6% !important; }
          .matriz-risco th:nth-child(2), .matriz-risco td:nth-child(2) { width: 26% !important; }
          .matriz-risco th:nth-child(3), .matriz-risco td:nth-child(3) { width: 12% !important; }
          .matriz-risco th:nth-child(4), .matriz-risco td:nth-child(4) { width: 12% !important; }
          .matriz-risco th:nth-child(5), .matriz-risco td:nth-child(5) { width: 16% !important; }
          .matriz-risco th:nth-child(6), .matriz-risco td:nth-child(6) { width: 28% !important; }
          
          /* Reduzir fonte na impressão para caber melhor */
          .resumo-riscos td, .matriz-risco td {
            font-size: 10pt !important;
            line-height: 1.2 !important;
            padding: 6px 3px !important;
          }
          
          .kv {
            background: #f3f4f6 !important;
            border-left: 4px solid #22D3EE !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .chip {
            background: #e0f7fa !important;
            color: #055c65 !important;
            border: 1px solid #22D3EE !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .motivos-card {
            background: #f8fafc !important;
            border-left: 4px solid #22D3EE !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .badge-alto { 
            background: #fee2e2 !important; 
            color: #dc2626 !important; 
            border: 1px solid #fca5a5 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .badge-medio { 
            background: #fef3c7 !important; 
            color: #d97706 !important; 
            border: 1px solid #fcd34d !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .badge-baixo { 
            background: #d1fae5 !important; 
            color: #059669 !important; 
            border: 1px solid #6ee7b7 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .image-item {
            border: 2px solid #e0f7fa !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .image-caption {
            background: #e0f7fa !important;
            color: #055c65 !important;
            border-top: 2px solid #22D3EE !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .pdf-footer { 
            display: none !important; 
          }
          
          /* Forçar cores de fundo nas células da tabela com classificação */
          td[style*="background:#FEE2E2"] {
            background: #fee2e2 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          td[style*="background:#FEF3C7"] {
            background: #fef3c7 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          td[style*="background:#DCFCE7"] {
            background: #dcfce7 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          /* Forçar cores de fundo na matriz de risco */
          td[style*="background-color:#EF4444"] {
            background-color: #ef4444 !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          td[style*="background-color:#F59E0B"] {
            background-color: #f59e0b !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          td[style*="background-color:#84CC16"] {
            background-color: #84cc16 !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>

      ${header}

      <div class="section section-card">
        <div class="section-title">Informações da Empresa</div>
        <div class="kv-grid">
          <div class="kv"><b>Nome da Empresa:</b> ${safe(formData.nomeEmpresa)}</div>
          <div class="kv"><b>CNPJ:</b> ${safe(formData.cnpj)}</div>
          <div class="kv"><b>Endereço:</b> ${safe(formData.endereco)}</div>
          <div class="kv"><b>Cidade:</b> ${safe(formData.cidade)}</div>
          <div class="kv"><b>Data do Laudo:</b> ${safe(formData.dataLaudo)}</div>
          <div class="kv"><b>CNAE:</b> ${safe(formData.cnae)}</div>
          <div class="kv"><b>Grau de Risco:</b> ${safe(formData.grauRisco)}</div>
        </div>
      </div>

      ${(formData.tituloDemanda || formData.textoDemanda) ? `
      <div class="section section-card">
        <div class="section-title">Demanda</div>
        ${formData.textoDemanda ? `<div style="margin-top:8px; white-space:pre-line;">${safe(formData.tituloDemanda)}.${safe(formData.textoDemanda)}</div>` : ''}
      </div>` : ''}

      ${(formData.tituloObjetivos || formData.textoObjetivos) ? `
      <div class="section section-card">
        <div class="section-title">Objetivos da AEP</div>
        ${formData.textoObjetivos ? `<div style="margin-top:8px; white-space:pre-line;">${safe(formData.tituloObjetivos)}.${safe(formData.textoObjetivos)}</div>` : ''}
      </div>` : ''}

      ${setoresQuadroSection}

      ${legislacaoSection}

      ${etapas}
      
      ${setoresFuncoesSection}

      ${postosTrabalhoSection}

      ${legendasSection}
      
      ${cronogramaAcoesSection}
      
      ${resumoRisco}
      
      ${matrizrisco}
      
      ${sugestaoGeral}
      
      ${cronogramaresposta}
      
      ${encerramento}
      
      ${(formData.referenciasTecnicas || formData.referenciasBibliograficas) ? `
      <div class="section section-card">
        <div class="section-title">Referências</div>
        ${formData.referenciasTecnicas ? `<div><b>Referências Técnicas</b></div><div style="white-space:pre-line; margin:6px 0 14px 0;">${safe(formData.referenciasTecnicas)}</div>` : ''}
        ${formData.referenciasBibliograficas ? `<div><b>Referências Bibliográficas</b></div><div style="white-space:pre-line; margin-top:6px;">${safe(formData.referenciasBibliograficas)}</div>` : ''}
      </div>` : ''}

      ${footer}

      <div class="pdf-footer">
        <span>ErgonTech &copy; ${now.getFullYear()} — PDF gerado em ${formatDate(now)}${timestamp ? ` — Dados salvos em ${safe(timestamp)}` : ''}</span>
      </div>
    </body>
    </html>
  `;
}

// Função utilitária para gerar HTML das perguntas psicossociais (sem comentários)
export function generatePsychosocialSectionHTML(sectionTitle: string, questions: any[], respostas: any) {
  return `
    <div class="section">
      <div class="section-title">${sectionTitle}</div>
      <div class="questions">
        ${questions.map(q => `
          <div class="question">
            <div class="question-label">${q.label}</div>
            <div class="answer">${respostas[q.key] || '<span style=\'color:#aaa\'>Não respondido</span>'}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Função principal para gerar HTML completo do formulário
export function generateFormularioHTML(respostas: any) {
  const now = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Respostas do Formulário Ergonômico</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', 'Roboto', Arial, sans-serif;
          margin: 0 auto;
          background: #f4f8fa;
          color: #222;
          max-width: 900px;
          padding: 32px 16px 80px 16px;
        }
        .pdf-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 36px;
          border-bottom: 2px solid #079DAB;
          padding-bottom: 18px;
        }
        .pdf-header-logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, #079DAB 70%, #22D3EE 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdf-header-logo svg {
          width: 38px;
          height: 38px;
          color: #fff;
        }
        .pdf-header-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(90deg, #079DAB 60%, #22D3EE 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .section {
          margin-bottom: 38px;
        }
        .section-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 1px 8px 0 rgba(7,157,171,0.07), 0 0.5px 1.5px 0 rgba(34,211,238,0.04);
          padding: 22px 24px 16px 18px;
          margin-bottom: 24px;
          transition: box-shadow 0.2s;
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #079DAB;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(90deg, #079DAB 60%, #22D3EE 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .section-title svg {
          width: 1.4em;
          height: 1.4em;
          color: #079DAB;
        }
        .questions {
          display: flex;
          flex-wrap: wrap;
          gap: 0 40px;
        }
        .question {
          flex: 1 1 350px;
          min-width: 270px;
          max-width: 420px;
          margin-bottom: 18px;
          background: linear-gradient(90deg, #f8fafc 80%, #e0f7fa 100%);
          border-radius: 8px;
          padding: 10px 16px 10px 12px;
          box-shadow: 0 0.5px 2px 0 rgba(7,157,171,0.06);
          border-left: 4px solid #22D3EE;
          position: relative;
          animation: fadein 0.6s;
        }
        .question:nth-child(even) {
          background: linear-gradient(90deg, #e0f7fa 80%, #f8fafc 100%);
        }
        .question-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
          font-size: 1.04rem;
        }
        .answer {
          margin-left: 2px;
          color: #222;
          font-size: 1rem;
          margin-bottom: 1px;
        }
        .comment {
          margin-left: 2px;
          color: #666;
          font-size: 0.97rem;
          margin-top: 2px;
        }
        .pdf-footer {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          background: #079DAB;
          color: #fff;
          padding: 12px 0 10px 0;
          text-align: center;
          font-size: 0.98rem;
          letter-spacing: 0.01em;
          border-top-left-radius: 18px;
          border-top-right-radius: 18px;
          box-shadow: 0 -1px 8px 0 rgba(7,157,171,0.09);
        }
        .pdf-footer-logo {
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body { 
            background: #fff !important; 
            color: #000 !important;
            font-size: 12pt !important;
          }
          
          .pdf-header { 
            border-bottom: 2px solid #079DAB !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .section-card { 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
            border: 1px solid #e5e7eb !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          
          .section-title {
            color: #079DAB !important;
            -webkit-print-color-adjust: exact !important;
            background: none !important;
            -webkit-background-clip: initial !important;
            -webkit-text-fill-color: #079DAB !important;
          }
          
          .question {
            background: #f8fafc !important;
            border-left: 4px solid #22D3EE !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .question:nth-child(even) {
            background: #e0f7fa !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .pdf-footer { 
            display: none !important; 
          }
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      </style>
    </head>
    <body>
      <div class="pdf-header">
        <div class="pdf-header-logo">
          <svg fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#079DAB"/><path d="M13 23c2-4 7-8 14-7" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="20" r="6" fill="#22D3EE"/></svg>
        </div>
        <div class="pdf-header-title">Relatório de Avaliação Ergonômica</div>
      </div>
      <div class="section section-card">
        ${generateSectionHTML(SECTION_TITLES.company, [
    { key: 'razao_social', label: 'Razão Social' },
    { key: 'cnpj', label: 'CNPJ' },
  ], respostas, false)}
      </div>
      <div class="section section-card">
        ${generateSectionHTML(SECTION_TITLES.employee, [
    { key: 'nome_completo', label: 'Nome Completo' },
    { key: 'setor', label: 'Setor / Departamento' },
    { key: 'cargo', label: 'Cargo / Função' },
    { key: 'data_coleta', label: 'Data da Coleta' },
  ], respostas, false)}
      </div>
      <div class="section section-card">
        ${generateSectionHTML(SECTION_TITLES.biomechanical, BIOMECHANICAL_QUESTIONS, respostas)}
      </div>
      <div class="section section-card">
        ${generateSectionHTML(SECTION_TITLES.furniture, MOBILIAEQUIP_QUESTIONS, respostas)}
      </div>
      <div class="section section-card">
        ${generateSectionHTML(SECTION_TITLES.organizational, ORGANIZATIONAL_QUESTIONS, respostas)}
      </div>
      <div class="section section-card">
        ${generateSectionHTML(SECTION_TITLES.environmental, ENVIRONMENTAL_QUESTIONS, respostas)}
      </div>
      <div class="section section-card">
        ${generatePsychosocialSectionHTML(SECTION_TITLES.psychosocial, PSYCHOSOCIAL_QUESTIONS, respostas)}
      </div>
      <div class="pdf-footer">
        <span class="pdf-footer-logo">
          <svg fill="none" viewBox="0 0 28 28" width="22" height="22"><circle cx="14" cy="14" r="14" fill="#fff"/><path d="M9.5 16c1.2-2.4 4.2-4.8 8.4-4.2" stroke="#079DAB" stroke-width="1.8" stroke-linecap="round"/><circle cx="14" cy="14" r="3.5" fill="#22D3EE"/></svg>
        </span>
        <span>ErgonTech &copy; ${now.getFullYear()} &mdash; PDF gerado em ${formatDate(now)}</span>
      </div>
    </body>
    </html>
  `;
}
