import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { toastSuccess, toastError } from '../../utils/toast';

import { Save, FileText, Plus, Trash2, AlertTriangle, BarChart3, ClipboardList, MapPin, Calendar, RotateCcw, UserCheck, BookOpen, Building2, Info, MessageSquare, Target, Users, BookText, ChevronDown, Loader2 } from 'lucide-react';

// Logger silencioso para desativar console.* em produção
const debugLog: (..._args: unknown[]) => void = () => {};

interface Setor {
    id: string;
    unidade: string;
    setor: string;
    funcoes: string;
    colaboradores: string;
    tarefaReal: string;
}

interface RiscoSolucao {
    id: string;
    risco: string;
    classificacao: string;
    solucao: string;
    prazo: string;
    gravidade: string;
    probabilidade: string;
    nivelRisco: string;
}

interface AcaoCronograma {
    id: string;
    acao: string;
    trimestre1: boolean;
    trimestre2: boolean;
    trimestre3: boolean;
    trimestre4: boolean;
    trimestre5: boolean;
    trimestre6: boolean;
}

// Constante com 3 soluções específicas para cada perigo identificado
const SOLUCOES_POR_PERIGO = {
    // Fatores Biomecânicos
    "As atividades permitem a alternância de posturas e a movimentação corporal, não sendo identificada a permanência em posturas estáticas ou incômodas por períodos prolongados.": [
        "A = Crie Pausas Ativas: Implemente pausas curtas e regulares para que os funcionários possam se levantar, caminhar e alongar.",
        "A = Ajuste o Mobiliário: Forneça cadeiras e mesas reguláveis que permitam ao trabalhador manter uma postura neutra e confortável.",
        "A =Treinamento ergonômico: Capacite os trabalhadores sobre as posturas corretas e a importância da movimentação e dos alongamentos."
    ],
    "Identificada a permanência em postura estática (sentada ou em pé) por períodos que podem exceder o recomendado, porém com possibilidade de pausas informais e breves alternâncias, resultando em um risco de nível baixo.": [
        "B = Otimize o Layout: Organize o posto de trabalho para que ferramentas e materiais essenciais estejam sempre ao alcance fácil, evitando posturas forçadas"
    ],
    "Constatada a exigência de manutenção de posturas estáticas e/ou incômodas (sentado, em pé, com torções) por longos períodos da jornada, sem pausas adequadas ou possibilidade de alternância, configurando risco ergonômico significativo.": [
        "C = Ajuste o Mobiliário: Forneça cadeiras e mesas reguláveis que permitam ao trabalhador manter uma postura neutra e confortável."
    ],
    "Postura sentada ou postura em pé por longos períodos ou constante deslocamento a pé durante a jornada": [
        ""
    ],
    "Trabalho com esforço físico intenso": [
        ""
    ],
    "As tarefas executadas não envolvem o levantamento ou transporte manual de cargas, ou, quando ocorrem, são com objetos de peso e volume insignificantes e com condições de pega seguras": [
        "A= Redução do Peso e Volume: Revise processos para dividir cargas pesadas em volumes menores e mais leves que possam ser manuseados com segurança, ou utilize contentores com capacidade limitada."
    ],
    "Ocorre levantamento e transporte manual de cargas de forma eventual, com peso dentro dos limites aceitáveis para a população trabalhadora e condições de pega favoráveis. O risco é considerado baixo.": [
        "B= Melhoria das Pegas: Adapte caixas, embalagens ou produtos para incluir alças ergonômicas ou pontos de pega adequados, facilitando o manuseio e prevenindo pegas inadequadas.",
        "B =Melhoria das Pegas: Adapte caixas, embalagens ou produtos para incluir alças ergonômicas ou pontos de pega adequados, facilitando o manuseio e prevenindo pegas inadequadas.Mecanização e Automação: Implemente o uso de equipamentos como carrinhos hidráulicos, paleteiras, empilhadeiras ou talhas para movimentação de cargas, reduzindo a necessidade de esforço manual."
    ],
    "Identificado levantamento e transporte manual de cargas com frequência, peso e/ou condições de pega (pobre/difícil) que excedem os limites recomendados (NIOSH, ISO 11228-1), gerando sobrecarga musculoesquelética e risco elevado.": [
        "C= Redução do Peso e Volume: Revise processos para dividir cargas pesadas em volumes menores e mais leves que possam ser manuseados com segurança, ou utilize contentores com capacidade limitada; Redução do Peso e Volume: Revise processos para dividir cargas pesadas em volumes menores e mais leves que possam ser manuseados com segurança, ou utilize contentores com capacidade limitada."
    ],
    "Constatada a necessidade frequente de puxar e/ou empurrar cargas, exigindo esforço físico intenso devido ao peso, características do piso ou manutenção inadequada dos equipamentos, o que representa um risco ergonômico médio/alto.": [
        "C=Utilização de Ferramentas Auxiliares: Forneça alavancas, barras ou outros dispositivos que multipliquem a força e diminuam o esforço de puxar/empurrar.",
        "C= Otimização do Trajeto: Mantenha os pisos limpos, nivelados e livres de obstáculos, facilitando o deslocamento das cargas e evitando a necessidade de força excessiva.",
        "C=Treinamento em Força e Postura: Oriente sobre a postura correta ao empurrar ou puxar, utilizando o peso corporal e as pernas para gerar movimento, em vez de sobrecarregar a coluna e os braços."
    ],
    "As tarefas executadas não envolvem o levantamento ou transporte manual de cargas, ou, quando ocorrem, são com objetos de peso e volume insignificantes e com condições de pega seguras.": [
        "A = Manutenção de Equipamentos: Garanta a manutenção preventiva e corretiva de carrinhos, macas e outros equipamentos de transporte para que rodem livremente, com rodas limpas e rolamentos em bom estado, minimizando o atrito."
    ],
    "As ações de puxar e/ou empurrar cargas ocorrem de forma esporádica, com esforço moderado e em distâncias curtas, utilizando equipamentos com manutenção adequada. O risco associado é baixo.": [
        "B = Manutenção de Equipamentos: Garanta a manutenção preventiva e corretiva de carrinhos, macas e outros equipamentos de transporte para que rodem livremente, com rodas limpas e rolamentos em bom estado, minimizando o atrito; Utilização de Ferramentas Auxiliares: Forneça alavancas, barras ou outros dispositivos que multipliquem a força e diminuam o esforço de puxar/empurrar."
    ],
    "Identificada a presença de movimentos repetitivos (ex: digitação), porém com tempo de ciclo superior a 30 segundos ou com pausas suficientes que permitem a recuperação muscular, classificando o risco como baixo.": [
        "B =  Pausas Programadas e Micro-Pausas: Implemente pausas regulares e ativas ao longo da jornada, complementadas por micro-pausas de segundos para alongar os músculos envolvidos.",
        "B= Ginástica Laboral: Ofereça sessões de ginástica laboral focadas em alongamento e fortalecimento dos membros superiores, punhos e mãos."
    ],
    "A tarefa exige a execução de movimentos repetitivos de membros superiores com alta frequência (ciclos curtos, <30s) e/ou por mais de 50% da jornada, sem pausas adequadas, configurando um risco significativo para LER/DORT.": [
        "C - Pausas Programadas e Micro-Pausas: Implemente pausas regulares e ativas ao longo da jornada, complementadas por micro-pausas de segundos para alongar os músculos envolvidos.",
        "C= Rodízio de Tarefas: Estabeleça um sistema de rodízio entre tarefas que exigem movimentos repetitivos e outras que permitam o uso de diferentes grupos musculares e posturas.",
        "C= Ferramentas Ergonômicas: Forneça teclados, mouses e demais periféricos ergonômicos que minimizem a tensão e o esforço de movimentos repetitivos, além de apoios de punho adequados."
    ],
    "Ocorre o manuseio de ferramentas ou objetos com peso moderado, porém por curtos períodos e de forma não contínua, com pausas que previnem a fadiga muscular localizada. Risco baixo.": [
        "B = Automação e Ferramentas Auxiliares: Se possível, automatize o uso de ferramentas pesadas ou utilize dispositivos de balanceamento e suspensão (como balancins) para aliviar o peso suportado pelo trabalhador.",
        "B= Seleção de Ferramentas Leves e Ergonômicas: Priorize a aquisição de ferramentas mais leves, com design ergonômico que se encaixe bem na mão e distribua o peso de forma equilibrada.",
        "B= Organização do Posto de Trabalho: Disponha as ferramentas e objetos de forma a minimizar a distância e a altura do alcance, reduzindo a necessidade de levantamento e manuseio prolongado em posturas inadequadas.",
    ],
    "Verificado o manuseio de ferramentas ou objetos pesados por períodos prolongados, exigindo contração muscular estática e esforço contínuo dos membros superiores, o que representa um risco ergonômico elevado.": [
        "C= Seleção de Ferramentas Leves e Ergonômicas: Priorize a aquisição de ferramentas mais leves, com design ergonômico que se encaixe bem na mão e distribua o peso de forma equilibrada.",
        "C=Treinamento e Rotação: Treine os trabalhadores sobre o manuseio correto de ferramentas pesadas e implemente a rotação de tarefas para evitar a sobrecarga prolongada de um mesmo grupo muscular."
    ],
    "Identificados pontos de contato do corpo com superfícies rígidas ou quinas vivas (ex: borda da mesa), porém o contato é breve e não contínuo, resultando em um risco baixo de lesão por compressão.": [
        "B = Redesenho do Posto de Trabalho: Avalie e, se necessário, redesenhe o layout do posto de trabalho para eliminar pontos de contato de compressão ou ajustar as alturas para evitar que partes do corpo fiquem apoiadas em quinas.",
        "B= Ajuste de Ferramentas/Equipamentos: Verifique se as ferramentas e equipamentos não possuem pontos que possam causar compressão em mãos ou outras partes do corpo e, se sim, modifique-os ou adicione proteções.",
        "B= Uso de EPIs Adequados: Em alguns casos, o uso de luvas acolchoadas ou protetores específicos pode ser necessário para amortecer o contato e evitar a compressão."
    ],
    "Ocorre a necessidade de flexão da coluna vertebral de forma eventual e com angulação moderada para alcançar objetos, não sendo uma exigência constante da tarefa. O risco é considerado baixo.": [
        "B = Ajuste da Altura do Trabalho: Ajuste a altura da bancada, esteira ou máquina para que a tarefa seja realizada na altura ideal para o trabalhador, minimizando a necessidade de flexão da coluna.",
        "B=  Utilização de Ferramentas de Cabo Longo/Extensão: Forneça ferramentas com cabos mais longos ou extensores para alcançar objetos no chão ou em locais baixos, evitando a flexão excessiva da coluna."
    ],
    "A atividade exige flexões e/ou torções frequentes e/ou acentuadas da coluna vertebral para manuseio de materiais ou operação de equipamentos, gerando sobrecarga significativa na região lombar e dorsal.": [
        "C= Organização do Layout: Mantenha objetos e materiais de uso frequente em alturas acessíveis, entre a cintura e os ombros, para reduzir a necessidade de flexões para pegar itens no chão ou em prateleiras baixas.",
        "C = Treinamento em Técnicas de Levantamento: Reforce o treinamento em técnicas seguras de levantamento, utilizando as pernas e mantendo a coluna reta, mesmo para objetos leves, para criar o hábito correto."
    ],
    "O uso de pedais é eventual e requer baixo esforço de acionamento, com o posto de trabalho permitindo um posicionamento adequado dos membros inferiores. O risco associado é baixo.": [
        "B = Ajuste Ergonômico dos Pedais: Posicionar os pedais de forma que o trabalhador possa operá-los com o pé totalmente apoiado no chão ou em um suporte adequado, evitando a suspensão constante da perna ou flexão excessiva do tornozelo.",
        "B= Garantir que a resistência dos pedais seja mínima e que o curso de acionamento seja o menor possível para reduzir o esforço muscular repetitivo."
    ],
    "O acionamento de pedais é frequente e/ou exige força elevada, podendo levar a posturas inadequadas dos membros inferiores e sobrecarga muscular, configurando um risco médio/alto.": [
        "C= Ajuste Ergonômico dos Pedais: Posicionar os pedais de forma que o trabalhador possa operá-los com o pé totalmente apoiado no chão ou em um suporte adequado, evitando a suspensão constante da perna ou flexão excessiva do tornozelo."
    ],
    "Identificada a necessidade eventual de elevação dos braços acima do nível dos ombros para alcançar objetos de uso pouco frequente. A curta duração e baixa frequência da ação resultam em um risco baixo.": [
        "B = Ajustar altura de trabalho: Elevar ou rebaixar bancadas e máquinas para reduzir o alcance vertical. Utilizar auxílios mecânicos: Fornecer talhas, braços articulados ou manipuladores para elevação. Otimizar layout: Posicionar itens de uso frequente entre a cintura e os ombros do trabalhador. Treinar em técnicas: Capacitar sobre o uso correto dos membros superiores, evitando sobrecarga."

    ],
    "Constatada a exigência de elevação frequente e/ou sustentada dos membros superiores acima da linha dos ombros, gerando sobrecarga na articulação do ombro e musculatura associada, o que representa um risco ergonômico elevado.": [
        "C - Fornecer talhas, braços articulados ou manipuladores para elevação. Otimizar layout: Posicionar itens de uso frequente entre a cintura e os ombros do trabalhador. Treinar em técnicas: Capacitar sobre o uso correto dos membros superiores, evitando sobrecarga."
    ],
    "Não há exposição a fontes de vibração de corpo inteiro, como operação de veículos de grande porte ou plataformas vibratórias": [
        "A= Disponibilizar EPIs adequados para absorver a vibração. Reduzir tempo de uso: Implementar rodízio de tarefas e pausas para o descanso das mãos. Manter ferramentas: Realizar manutenção regular para evitar que ferramentas desgastadas vibrem mais."
    ],
    "A exposição à VCI ocorre por curtos períodos e está abaixo do nível de ação definido pela NHO 09, não representando um risco significativo, mas um fator de atenção": [
        "B  = Selecionar ferramentas com baixa vibração: Adquirir ferramentas com sistemas antivibratórios.Fornecer luvas antivibratórias: Disponibilizar EPIs adequados para absorver a vibração. Reduzir tempo de uso: Implementar rodízio de tarefas e pausas para o descanso das mãos. Manter ferramentas: Realizar manutenção regular para evitar que ferramentas desgastadas vibrem mais.",
        "B = Disponibilizar EPIs adequados para absorver a vibração. Reduzir tempo de uso: Implementar rodízio de tarefas e pausas para o descanso das mãos. Manter ferramentas: Realizar manutenção regular para evitar que ferramentas desgastadas vibrem mais."
    ],
    "O manuseio de ferramentas vibratórias ocorre por curtos períodos, com níveis de vibração abaixo do nível de ação definido pela NHO 10, representando um fator de atenção, mas com risco baixo": [
        "B  = Selecionar ferramentas com baixa vibração: Adquirir ferramentas com sistemas antivibratórios. Fornecer luvas antivibratórias: Disponibilizar EPIs adequados para absorver a vibração. Reduzir tempo de uso: Implementar rodízio de tarefas e pausas para o descanso das mãos. Manter ferramentas: Realizar manutenção regular para evitar que ferramentas desgastadas vibrem mais."
    ],
    "Constatada a exposição à vibração em mãos e braços por períodos prolongados e/ou com níveis que excedem o limite de exposição, representando risco para o desenvolvimento de desordens vasculares e neurológicas": [
        "C - Implementar rodízio de tarefas e pausas para o descanso das mãos. Manter ferramentas: Realizar manutenção regular para evitar que ferramentas desgastadas vibrem mais."
    ],
    "O posto de trabalho é organizado para evitar a necessidade de torções de tronco, pescoço ou punhos, mantendo os itens de maior uso em posição frontal ao trabalhador.": [
        "A - Capacitar sobre mover os pés e o corpo todo, em vez de torcer a coluna. Redesenhar processos: Reavaliar tarefas para eliminar ou reduzir a frequência de torções.",
    ],
    "Ocorrem torções de segmentos corporais (tronco, pescoço) de forma eventual e com pequena amplitude para visualização ou alcance de objetos, não sendo um requisito constante da tarefa. Risco baixo.": [
        "B = Otimizar layout de trabalho: Organizar o espaço para evitar a necessidade de torções excessivas. Utilizar dispositivos auxiliares: Introduzir mesas ou plataformas giratórias que eliminem a torção. Treinar movimentação: Capacitar sobre mover os pés e o corpo todo, em vez de torcer a coluna. Redesenhar processos: Reavaliar tarefas para eliminar ou reduzir a frequência de torções."
    ],
    "A execução da tarefa exige torções frequentes e/ou de grande amplitude do tronco, pescoço ou punhos, gerando sobrecarga assimétrica nas articulações e músculos, o que configura um risco ergonômico significativo.": [
        "C - Otimizar layout de trabalho: Organizar o espaço para evitar a necessidade de torções excessivas. Utilizar dispositivos auxiliares:"
    ],

    //Mobiliário e Equipamentos
    "O posto de trabalho é projetado e adequado para a função, com mobiliário e equipamentos específicos para a tarefa, atendendo às normas de ergonomia.": [
        "A = Aquisição e Substituição de Mobiliário Ergonômico. Adquirir e substituir imediatamente o mobiliário improvisado por cadeiras e mesas que atendam à NR-17, com regulagens de altura do assento, encosto lombar, braços e dimensões compatíveis com a tarefa e o biotipo do trabalhador: Ajuste e Personalização do Posto. Realizar um ajuste individualizado do posto de trabalho para cada colaborador, garantindo que o mobiliário regulável seja configurado corretamente para as suas necessidades específicas e tipo de atividade."
    ],
    "O posto de trabalho apresenta pequenas inadequações ou adaptações que não comprometem a segurança e o conforto do trabalhador de forma significativa.": [
        "B = Aquisição e Substituição de Mobiliário Ergonômico. Adquirir e substituir imediatamente o mobiliário improvisado por cadeiras e mesas que atendam à NR-17, com regulagens de altura do assento, encosto lombar, braços e dimensões compatíveis com a tarefa e o biotipo do trabalhador: Reorganizar os processos de abastecimento do posto de trabalho para que os materiais cheguem na altura e posição ideais para o manuseio, eliminando a necessidade de o trabalhador se curvar, torcer ou esticar para pegá-los."
    ],
    "O posto de trabalho é improvisado, utilizando mobiliário não apropriado para a função, o que gera posturas inadequadas e potencial risco de lesões.": [
        "C = Aquisição e Substituição de Mobiliário Ergonômico. Adquirir e substituir imediatamente o mobiliário improvisado por cadeiras e mesas que atendam à NR-17, com regulagens de altura do assento, encosto lombar, braços e dimensões compatíveis com a tarefa e o biotipo do trabalhador: Treinamento em Economia de Movimentos. Capacitar os colaboradores sobre os princípios da economia de movimentos e a importância de evitar movimentos desnecessários de flexão, torção ou elevação de braços, incentivando o ajuste do corpo ao "
    ],
    "O mobiliário (cadeiras, mesas) e os equipamentos atendem aos requisitos da NR-17, possuindo regulagens que permitem o ajuste às características antropométricas do usuário e estão em bom estado de conservação.": [
        "A= Aquisição e Substituição de Mobiliário Ergonômico. Adquirir e substituir imediatamente o mobiliário improvisado por cadeiras e mesas que atendam à NR-17, com regulagens de altura do assento, encosto lombar, braços e dimensões compatíveis com a tarefa e o biotipo do trabalhador."
    ],
    "O mobiliário possui algumas limitações de ajuste ou características que não atendem plenamente às normas, mas permite uma adaptação razoável, resultando em um risco baixo.": [
        "B= Aquisição e Substituição de Mobiliário Ergonômico. Adquirir e substituir imediatamente o mobiliário improvisado por cadeiras e mesas que atendam à NR-17, com regulagens de altura do assento, encosto lombar, braços e dimensões compatíveis com a tarefa e o biotipo do trabalhador:Ajuste e Personalização do Posto. Realizar um ajuste individualizado do posto de trabalho para cada colaborador, garantindo que o mobiliário regulável seja configurado corretamente para as suas necessidades específicas e tipo de atividade."
    ],
    "O mobiliário é inadequado, não possui regulagens essenciais (altura do assento, apoio lombar), está em mau estado de conservação ou suas dimensões são incompatíveis com a tarefa, gerando risco elevado.": [
        "C = Aquisição e Substituição de Mobiliário Ergonômico. Adquirir e substituir imediatamente o mobiliário improvisado por cadeiras e mesas que atendam à NR-17, com regulagens de altura do assento, encosto lombar, braços e dimensões compatíveis com a tarefa e o biotipo do trabalhador: Manutenção Preventiva e Corretiva. Implementar um plano de manutenção regular para todo o mobiliário, garantindo que as regulagens funcionem corretamente e que não haja peças danificadas que comprometam a ergonomia ou a segurança."
    ],
    "O posto de trabalho é planejado para permitir a alternância entre as posturas sentada e em pé, ou a dinâmica da tarefa naturalmente promove essa variação.": [
        "A=Implementação de Pausas Ativas Obrigatórias. Criar e fiscalizar a aplicação de pausas programadas e obrigatórias ao longo da jornada (ex: a cada 1 a 2 horas), incentivando que o trabalhador mude completamente de postura, se movimente e realize alongamentos: Programa de Ginástica Laboral. Implementar um programa de ginástica laboral regular focado em alongamentos e exercícios que compensem a manutenção prolongada de uma mesma postura, aliviando tensões e promovendo a circulação."
    ],
    "Embora o posto seja predominantemente para uma única postura, a organização do trabalho permite pausas e a realização de outras tarefas que favorecem a alternância postural.": [
        "B= Implementação de Pausas Ativas Obrigatórias. Criar e fiscalizar a aplicação de pausas programadas e obrigatórias ao longo da jornada (ex: a cada 1 a 2 horas), incentivando que o trabalhador mude completamente de postura, se movimente e realize alongamentos: Programa de Ginástica Laboral. Implementar um programa de ginástica laboral regular focado em alongamentos e exercícios que compensem a manutenção prolongada de uma mesma postura, aliviando tensões e promovendo a circulação."
    ],
    "O posto de trabalho e a organização da tarefa confinam o trabalhador a uma única postura (sentado ou em pé) por toda a jornada, sem possibilidade de alternância, elevando o risco de distúrbios musculoesqueléticos.": [
        "C = Implementação de Pausas Ativas Obrigatórias. Criar e fiscalizar a aplicação de pausas programadas e obrigatórias ao longo da jornada (ex: a cada 1 a 2 horas), incentivando que o trabalhador mude completamente de postura, se movimente e realize alongamentos: Programa de Ginástica Laboral. Implementar um programa de ginástica laboral regular focado em alongamentos e exercícios que compensem a manutenção prolongada de uma mesma postura, aliviando tensões e promovendo a circulação."
    ],
    "O posto de trabalho oferece espaço suficiente para a livre movimentação dos segmentos corporais, permitindo o posicionamento adequado de pernas, braços e o acesso fácil aos itens de trabalho.": [
        "A= Readequação do Layout do Posto. Realizar um redesenho ou reconfiguração do layout do posto de trabalho para garantir espaço suficiente para as pernas (sob a mesa ou bancada) e para a movimentação livre do tronco e membros:  Análise Ergonômica Detalhada. Conduzir uma Análise Ergonômica do Trabalho (AET) específica para esses postos, que identifique as dimensões ideais e as barreiras físicas que impedem a movimentação adequada, propondo soluções de engenharia."
    ],
    "O espaço para movimentação é um pouco restrito, podendo causar contatos eventuais com o mobiliário, mas não impede a execução da tarefa de forma segura.": [
        "B = Readequação do Layout do Posto. Realizar um redesenho ou reconfiguração do layout do posto de trabalho para garantir espaço suficiente para as pernas (sob a mesa ou bancada) e para a movimentação livre do tronco e membros:  Análise Ergonômica Detalhada. Conduzir uma Análise Ergonômica do Trabalho (AET) específica para esses postos, que identifique as dimensões ideais e as barreiras físicas que impedem a movimentação adequada, propondo soluções de engenharia. Análise Ergonômica Detalhada. Conduzir uma Análise Ergonômica do Trabalho (AET) específica para esses postos, que identifique as dimensões ideais e as barreiras físicas que impedem a movimentação adequada, propondo soluções de engenharia."
    ],
    "O espaço do posto de trabalho é insuficiente, restringindo a movimentação das pernas, impedindo o ajuste postural e forçando o trabalhador a adotar posturas inadequadas.": [
        "C= Readequação do Layout do Posto. Realizar um redesenho ou reconfiguração do layout do posto de trabalho para garantir espaço suficiente para as pernas (sob a mesa ou bancada) e para a movimentação livre do tronco e membros:  Análise Ergonômica Detalhada. Conduzir uma Análise Ergonômica do Trabalho (AET) específica para esses postos, que identifique as dimensões ideais e as barreiras físicas que impedem a movimentação adequada, propondo soluções de engenharia."
    ],
    "Todos os objetos, controles e documentos de uso frequente estão localizados dentro da zona de alcance ótimo (horizontal e vertical), evitando a necessidade de esticar ou torcer o corpo.": [
        " A =Reorganização da Zona de Alcance. Realizar um planejamento da zona de alcance ótimo no posto de trabalho, garantindo que todos os objetos, ferramentas e controles de uso constante estejam posicionados na zona primária de alcance (próximo ao corpo, entre os cotovelos)."
    ],
    "Alguns objetos de uso menos frequente estão localizados fora da zona de alcance ideal, exigindo um esforço postural eventual para serem alcançados.": [
        "B = Reorganização da Zona de Alcance. Realizar um planejamento da zona de alcance ótimo no posto de trabalho, garantindo que todos os objetos, ferramentas e controles de uso constante estejam posicionados na zona primária de alcance (próximo ao corpo, entre os cotovelos) :Treinamento em Economia de Movimentos. Capacitar os colaboradores sobre os princípios da economia de movimentos e a importância de evitar movimentos desnecessários de flexão, torção ou elevação de braços, incentivando o ajuste do corpo ao Treinamento em Economia de Movimentos. Capacitar os colaboradores sobre os princípios da economia de movimentos e a importância de evitar movimentos desnecessários de flexão, torção ou elevação de braços, incentivando o ajuste do corpo ao Treinamento em Economia de Movimentos."
    ],
    "Objetos de uso constante estão posicionados fora da zona de alcance ideal, forçando o trabalhador a realizar movimentos de flexão, torção ou elevação dos braços repetidamente, o que configura risco elevado.": [
        "C: Reorganização da Zona de Alcance. Realizar um planejamento da zona de alcance ótimo no posto de trabalho, garantindo que todos os objetos, ferramentas e controles de uso constante estejam posicionados na zona primária de alcance (próximo ao corpo, entre os cotovelos).Treinamento em Economia de Movimentos. Capacitar os colaboradores sobre os princípios da economia de movimentos e a importância de evitar movimentos desnecessários de flexão, torção ou elevação de braços, incentivando o ajuste do corpo ao Treinamento em Economia de Movimentos."

    ],
    "O mobiliário e os equipamentos são ajustáveis e compatíveis com as diversas características antropométricas (altura, peso, dimensões) dos trabalhadores que os utilizam": [
        "A = Realizar uma análise ergonômica detalhada para definir as dimensões ideais e os ajustes necessários para cada tipo de posto, considerando a variabilidade antropométrica da população de trabalhadores."
    ],
    "O posto de trabalho permite uma adaptação razoável para a maioria dos trabalhadores, mas pode apresentar pequenas incompatibilidades para indivíduos com características antropométricas extremas.": [
        "B = Realizar uma análise ergonômica detalhada para definir as dimensões ideais e os ajustes; necessários para cada tipo de posto, considerando a variabilidade antropométrica da população de trabalhadores: Priorizar a compra e instalação de mobiliário (mesas, cadeiras, bancadas) e equipamentos com amplas capacidades de ajuste e regulagem de altura e profundidade, permitindo que cada trabalhador personalize seu espaço para uma postura neutra e confortável."
    ],
    "O posto de trabalho possui dimensões fixas e inadequadas, não se adaptando às características antropométricas dos trabalhadores e impondo posturas de risco para a maioria dos usuários.": [
        "C = Realizar uma análise ergonômica detalhada para definir as dimensões ideais e os ajustes necessários para cada tipo de posto, considerando a variabilidade antropométrica da população de trabalhadores."
    ],

    //Organizacionais
    "A jornada de trabalho inclui pausas formais e informais, com equilíbrio adequado entre os períodos de trabalho e repouso, conforme a legislação e as necessidades da tarefa.": [
        "A = Monitoramento Contínuo da Carga de Trabalho. Implementar um sistema para monitorar a frequência, duração e intensidade dos picos de trabalho, garantindo que não excedam a capacidade física e mental dos trabalhadores de forma sustentada:"
    ],
    "Não há pausas definidas para descanso além dos intervalos legais, ou o ritmo de trabalho impede sua utilização, resultando em desequilíbrio entre esforço e recuperação e risco elevado de fadiga.": [
        "C = Monitoramento Contínuo da Carga de Trabalho. Implementar um sistema para monitorar a frequência, duração e intensidade dos picos de trabalho, garantindo que não excedam a capacidade física e mental dos trabalhadores de forma sustentada: Planejamento Flexível da Produção. Desenvolver um planejamento de produção que permita flexibilidade para absorver os picos de intensidade sem sobrecarregar continuamente a mesma equipe ou indivíduo, talvez com remanejamento de pessoal ou horas extras planejadas."
    ],
    "O ritmo de trabalho é determinado pelo próprio trabalhador, permitindo a adequação da cadência às suas capacidades e às demandas da tarefa, sem imposição de velocidade.": [
        "A = Criar e treinar a equipe em estratégias que permitam absorver os picos de forma eficiente, como o uso de equipes de apoio, treinamento cruzado para que mais pessoas possam auxiliar, ou a flexibilização do planejamento de tarefas para distribuir a carga."
    ],
    "O ritmo de trabalho é moderado, com picos de intensidade ocasionais que são gerenciáveis e não se estendem por longos períodos.": [
        "B = O ritmo de trabalho é moderado, com picos de intensidade ocasionais que são gerenciáveis e não se estendem por longos períodos. Promover ativamente a importância do autogerenciamento do ritmo pelos trabalhadores, incentivando-os a fazer micro-pausas estratégicas e a usar as pausas formais para recuperação efetiva, mesmo quando o ritmo geral é moderado."
    ],
    "O trabalho exige a manutenção de um ritmo intenso e constante, com alta pressão por produtividade e sem possibilidade de autorregulação, o que eleva o risco de estresse e exaustão.": [
        "C = O ritmo de trabalho é moderado, com picos de intensidade ocasionais que são gerenciáveis e não se estendem por longos períodos. Promover ativamente a importância do autogerenciamento do ritmo pelos trabalhadores, incentivando-os a fazer micro-pausas estratégicas e a usar as pausas formais para recuperação efetiva, mesmo quando o ritmo geral é moderado."

    ],
    "As tarefas são diversificadas, com conteúdo significativo e ciclos de trabalho longos, o que previne a monotonia e o desinteresse.": [
        "A = Analisar as atividades secundárias existentes para garantir que elas realmente proporcionem uma variação motora e cognitiva eficaz. Buscar formas de enriquecê-las ou introduzir novas atividades que desafiem diferentes grupos musculares e áreas cerebrais, maximizando o efeito de quebra da monotonia."
    ],
    "A tarefa possui certo grau de repetitividade, mas inclui atividades secundárias que quebram a monotonia e permitem variação cognitiva e motora.": [
        "B = Analisar as atividades secundárias existentes para garantir que elas realmente proporcionem uma variação motora e cognitiva eficaz. Buscar formas de enriquecê-las ou introduzir novas atividades que desafiem diferentes grupos musculares e áreas cerebrais, maximizando o efeito de quebra da monotonia."
    ],
    "A tarefa é extremamente monótona e repetitiva, com ciclos de trabalho muito curtos e conteúdo pobre, gerando desmotivação, queda de atenção e risco de erros e acidentes.": [
        "C= Capacitar os trabalhadores para que desenvolvam consciência corporal e saibam como variar ativamente seus movimentos e posturas mesmo dentro da tarefa principal, aproveitando ao máximo as oportunidades de variação oferecidas pelas atividades secundárias. "
    ],
    "As atividades são realizadas integralmente em período diurno.": [
        "A = Crie e implemente um programa de treinamento ergonômico que seja contínuo, não apenas pontual. Isso inclui módulos na integração de novos colaboradores e reciclagens periódicas (ex: anuais ou bienais) para todos. O conteúdo deve ser específico para as funções e riscos de cada setor da empresa"
    ],
    "Treinamento ergonômico: Capacite os trabalhadores sobre as posturas corretas e a importância da movimentação e dos alongamentos.": [
        "B = Crie e implemente um programa de treinamento ergonômico que seja contínuo, não apenas pontual. Isso inclui módulos na integração de novos colaboradores e reciclagens periódicas (ex: anuais ou bienais) para todos. O conteúdo deve ser específico para as funções e riscos de cada setor da empresa ;  Foque em sessões de treinamento que sejam práticas e interativas, com demonstrações em tempo real das posturas corretas para as tarefas específicas da empresa. Inclua sessões guiadas de alongamentos e exercícios compensatórios que possam ser realizados no próprio posto de trabalho ou durante as pausas. Impacto: Ajuda os colaboradores a internalizar e aplicar o conhecimento de forma efetiva, transformando teoria em prática diária."
    ],
    "O trabalho é realizado em turno noturno de forma fixa ou com trocas de turno inadequadas, impactando o ciclo circadiano e aumentando o risco de fadiga, sonolência e problemas de saúde.": [
        "C = Crie e implemente um programa de treinamento ergonômico que seja contínuo, não apenas pontual. Isso inclui módulos na integração de novos colaboradores e reciclagens periódicas (ex: anuais ou bienais) para todos. O conteúdo deve ser específico para as funções e riscos de cada setor da empresa :  Foque em sessões de treinamento que sejam práticas e interativas, com demonstrações em tempo real das posturas corretas para as tarefas específicas da empresa. Inclua sessões guiadas de alongamentos e exercícios compensatórios que possam ser realizados no próprio posto de trabalho ou durante as pausas."
    ],
    "As metas de produção são claras, realistas e negociadas, servindo como um fator de orientação e não de pressão. O sistema de remuneração não está atrelado diretamente à produção individual.": [
        "A =  Implementar um sistema de monitoramento regular da percepção dos colaboradores sobre as metas e a pressão do trabalho. Isso pode ser feito através de pesquisas anônimas, caixas de sugestões ou reuniões periódicas de feedback. Identificação rápida de mudanças na percepção da pressão, permitindo ajustes proativos antes que o risco se agrave.Identificação rápida de mudanças na percepção da pressão, permitindo ajustes proativos antes que o risco se agrave."
    ],
    "Existem metas de produção, mas são consideradas atingíveis e há flexibilidade para lidar com imprevistos, gerando uma pressão moderada e controlada.": [
        "B =  Implementar um sistema de monitoramento regular da percepção dos colaboradores sobre as metas e a pressão do trabalho. Isso pode ser feito através de pesquisas anônimas, caixas de sugestões ou reuniões periódicas de feedback.  Estabelecer um canal aberto para que os colaboradores reportem rapidamente qualquer dificuldade em atingir as metas de forma saudável ou em lidar com imprevistos, garantindo que a flexibilidade seja percebida e utilizada. Identificação rápida de mudanças na percepção da pressão, permitindo ajustes proativos antes que o risco se agrave."
    ],
    "As metas de produção são rigorosas, de difícil alcance e utilizadas como forma de pressão contínua, ou a remuneração é por produção, incentivando um ritmo excessivo e a negligência de pausas e segurança.": [
        "C =  Implementar um sistema de monitoramento regular da percepção dos colaboradores sobre as metas e a pressão do trabalho. Isso pode ser feito através de pesquisas anônimas, caixas de sugestões ou reuniões periódicas de feedback.  Estabelecer um canal aberto para que os colaboradores reportem rapidamente qualquer dificuldade em atingir as metas de forma saudável ou em lidar com imprevistos, garantindo que a flexibilidade seja percebida e utilizada. Identificação rápida de mudanças na percepção da pressão, permitindo ajustes proativos antes que o risco se agrave."
    ],
    "O trabalhador tem controle sobre a velocidade do equipamento ou processo, podendo iniciar, parar e regular a cadência da produção.": [
        "A =  Implementar um regime de pausas curtas e frequentes (ex: a cada 30-60 minutos), obrigatórias e cronometradas, para que o trabalhador possa se afastar da máquina, alongar-se e recuperar-se. Além disso, estabelecer um rodízio rigoroso de trabalhadores ou de tarefas (se possível com atividades de menor cadência ou sem imposição) para limitar o tempo de exposição individual à imposição total: Oferecer suporte psicossocial aos trabalhadores, com canais para expressar o estresse e a pressão, e realizar treinamentos sobre estratégias de coping. Ao mesmo tempo, revisar aspectos da organização do trabalho (ex: metas de produção, comunicação) para garantir que não haja pressão adicional àquela já imposta pela máquina."
    ],
    "A cadência é parcialmente imposta por um equipamento, mas existem áreas de 'pulmão' ou mecanismos que permitem ao trabalhador uma margem de controle sobre o fluxo de trabalho.": [
        "B =  Implementar um regime de pausas curtas e frequentes (ex: a cada 30-60 minutos), obrigatórias e cronometradas, para que o trabalhador possa se afastar da máquina, alongar-se e recuperar-se. Além disso, estabelecer um rodízio rigoroso de trabalhadores ou de tarefas (se possível com atividades de menor cadência ou sem imposição) para limitar o tempo de exposição individual à imposição total. Oferecer suporte psicossocial aos trabalhadores, com canais para expressar o estresse e a pressão, e realizar treinamentos sobre estratégias de coping. Ao mesmo tempo, revisar aspectos da organização do trabalho (ex: metas de produção, comunicação) para garantir que não haja pressão adicional àquela já imposta pela máquina."
    ],
    "A cadência do trabalho é totalmente imposta por uma máquina ou esteira, sem que o trabalhador tenha qualquer controle sobre o ritmo, configurando um fator de risco psicossocial e biomecânico elevado.": [
        "C =  Implementar um regime de pausas curtas e frequentes (ex: a cada 30-60 minutos), obrigatórias e cronometradas, para que o trabalhador possa se afastar da máquina, alongar-se e recuperar-se. Além disso, estabelecer um rodízio rigoroso de trabalhadores ou de tarefas (se possível com atividades de menor cadência ou sem imposição) para limitar o tempo de exposição individual à imposição total. Oferecer suporte psicossocial aos trabalhadores, com canais para expressar o estresse e a pressão, e realizar treinamentos sobre estratégias de coping. Ao mesmo tempo, revisar aspectos da organização do trabalho (ex: metas de produção, comunicação) para garantir que não haja pressão adicional àquela já imposta pela máquina."
    ],

    //Ambientais
    "O ambiente de trabalho é silencioso ou os níveis de pressão sonora estão dentro da faixa de conforto acústico recomendada pela NBR 10152 para a atividade exercida.": [
        "A= Implementar medidas de engenharia para reduzir o ruído diretamente na sua origem. Isso pode incluir o uso de equipamentos mais silenciosos, manutenção preventiva de máquinas (para reduzir ruídos de atrito ou vibração), enclausuramento de fontes ruidosas ou instalação de silenciadores e amortecedores de vibração:: Instalar barreiras acústicas, painéis absorventes de ruído nas paredes e teto, e realizar o isolamento acústico de ambientes. O objetivo é interromper a propagação do som no ambiente de trabalho."

    ],
    "O ruído no ambiente está ligeiramente acima do nível de conforto, mas não interfere na comunicação e não causa incômodo significativo, representando um risco baixo.": [
        "B = Implementar medidas de engenharia para reduzir o ruído diretamente na sua origem. Isso pode incluir o uso de equipamentos mais silenciosos, manutenção preventiva de máquinas (para reduzir ruídos de atrito ou vibração), enclausuramento de fontes ruidosas ou instalação de silenciadores e amortecedores de vibração. Instalar barreiras acústicas, painéis absorventes de ruído nas paredes e teto, e realizar o isolamento acústico de ambientes. O objetivo é interromper a propagação do som no ambiente de trabalho."
    ],
    "O nível de pressão sonora no ambiente é elevado e constante, causando desconforto, dificultando a comunicação e a concentração, e representando um risco para a saúde auditiva e mental.": [
        "C = Implementar medidas de engenharia para reduzir o ruído diretamente na sua origem. Isso pode incluir o uso de equipamentos mais silenciosos, manutenção preventiva de máquinas (para reduzir ruídos de atrito ou vibração), enclausuramento de fontes ruidosas ou instalação de silenciadores e amortecedores de vibração. Instalar barreiras acústicas, painéis absorventes de ruído nas paredes e teto, e realizar o isolamento acústico de ambientes. O objetivo é interromper a propagação do som no ambiente de trabalho."
    ],
    "As condições de temperatura, umidade e velocidade do ar estão dentro dos parâmetros de conforto estabelecidos pela NR-17, proporcionando um ambiente termicamente agradável.": [
        "A = Realize uma revisão e ajuste fino dos sistemas existentes de climatização, aquecimento ou ventilação. Verifique a calibração de termostatos, a eficiência de filtros e o direcionamento das correntes de ar para otimizar a distribuição da temperatura no ambiente"
    ],
    "As condições de temperatura apresentam pequenas variações, causando um leve desconforto ocasional, mas sem representar um risco à saúde ou ao desempenho.": [
        "B = Realize uma revisão e ajuste fino dos sistemas existentes de climatização, aquecimento ou ventilação. Verifique a calibração de termostatos, a eficiência de filtros e o direcionamento das correntes de ar para otimizar a distribuição da temperatura no ambiente :Forneça recursos simples de conforto individual em áreas onde as variações são mais notáveis. Isso pode incluir ventiladores portáteis pequenos, aquecedores de baixo consumo para áreas frias, ou bebedouros com água fresca e quente acessíveis."
    ],
    "As condições de temperatura, umidade ou velocidade do ar estão fora dos limites de conforto, causando estresse térmico (calor ou frio excessivo) e impactando negativamente o bem-estar e a produtividade.": [
        "C = Avaliar e implementar melhorias no isolamento térmico da edificação. Isso pode incluir a aplicação de isolantes em paredes e telhados, vedação de frestas em janelas e portas, ou a instalação de películas de controle solar."
    ],
    "A iluminação do ambiente (natural e/ou artificial) é suficiente, uniformemente distribuída e adequada à tarefa visual, sem causar ofuscamento, reflexos ou sombras que prejudiquem a visão.": [
        "A = Maximizar o uso da iluminação natural ajustando a posição das estações de trabalho e limpando janelas. Ao mesmo tempo, instalar ou ajustar persianas e cortinas para controlar o excesso de luz solar direta ou brilho refletido, que podem causar ofuscamento:  Incentive o uso de persianas ou cortinas nas janelas para controlar a entrada de luz solar direta e evitar o ofuscamento. Além disso, verifique se há superfícies muito brilhantes ou reflexivas no posto de trabalho que possam causar desconforto e, se possível, substitua-as ou reposicione-as."
    ],
    "A iluminação apresenta pequenas deficiências, como pontos de sombra ou leve ofuscamento, que causam um desconforto visual mínimo, mas não impedem a execução da tarefa": [
        "B = Realizar uma revisão e reposicionamento estratégico das luminárias existentes para eliminar pontos de sombra e reduzir o ofuscamento direto. Isso pode incluir a mudança de ângulo, altura ou até mesmo a adição de algumas luminárias de apoio em áreas críticas: Maximizar o uso da iluminação natural ajustando a posição das estações de trabalho e limpando janelas. Ao mesmo tempo, instalar ou ajustar persianas e cortinas para controlar o excesso de luz solar direta ou brilho refletido, que podem causar ofuscamento."
    ],
    "A iluminação é inadequada (insuficiente ou excessiva), mal distribuída ou causa ofuscamento e reflexos incômodos em telas e superfícies, gerando fadiga visual, dores de cabeça e aumentando o risco de erros": [
        "C = Instalar sistemas de controle de iluminação inteligentes que incluam sensores de presença, sensores de luz natural (dimerização automática conforme a luz do dia) e programação de cenas. Isso permite que a iluminação artificial se adapte dinamicamente às condições do ambiente, evitando ofuscamento por excesso de luz e garantindo níveis ideais."
    ],

    //Psicosociais
    "A carga de trabalho mental é adequada, com tempo suficiente para a realização das tarefas com qualidade. As demandas de concentração e memória são compatíveis com a capacidade humana e intercaladas com tarefas mais leves.": [
        "A = Manter o ambiente com baixo nível de ruído e interrupções.",
        "A = Incentivar pausas regulares para descanso mental.",
        "B = Realizar análise ergonômica para identificar e reduzir fontes de distração.",
        "B = Oferecer treinamento em técnicas de foco e gestão de atenção.",
        "B = Criar 'zonas de silêncio' no escritório."
    ],
    "A tarefa exige um estado de concentração intenso e contínuo durante a maior parte da jornada, elevando o risco de fadiga mental, estresse e erros.": [
        "C = Reavaliar a complexidade das tarefas e, se possível, simplificar processos.",
        "C = Implementar rodízio de tarefas para alternar entre atividades de alta e baixa concentração.",
        "C = Reduzir a jornada em atividades de alta exigência.",
        "C = Oferecer fones de ouvido com cancelamento de ruído.",
        "C = Aumentar a frequência e duração das pausas."
    ],
    "O ritmo de trabalho é autogerenciado e permite a execução das tarefas com qualidade e segurança, sem pressão por velocidade.": [
        "A = Manter o planejamento de prazos realista.",
        "A = Reconhecer o cumprimento de metas sem a necessidade de correria."
    ],
    "Ocasionalmente, picos de demanda exigem um ritmo mais acelerado, mas são eventos pontuais e não uma condição crônica de trabalho.": [
        "B = Revisar o fluxo de trabalho para identificar gargalos.",
        "B = Treinar a equipe em gestão de tempo e priorização.",
        "B = Negociar prazos mais flexíveis com clientes e stakeholders.",
        "B = Analisar a necessidade de contratar mais pessoal."

    ],
    "A pressão por um ritmo de trabalho rápido é constante, comprometendo a qualidade e a segurança, e elevando o risco de estresse e erros.": [
        "C = Ação Urgente: Suspender ou renegociar todos os prazos irrealistas. ",
        "C = Realizar uma análise aprofundada da carga de trabalho (dimensionamento da equipe). ",
        "C = Implementar um sistema de gestão de tarefas com prioridades claras (Ex: Matriz de Eisenhower).",
        "C = Proibir o contato para demandas de trabalho fora do horário de expediente. ",
        "C = Contratar pessoal de apoio ou temporário."
    ],
    "As decisões a serem tomadas são de baixa complexidade ou, se complexas, há suporte, tempo e informação adequados para a tomada de decisão.": [
        "A = Oferecer suporte da liderança para validação das decisões",
        "A = Manter canais de comunicação abertos para consulta."
    ],
    "Eventualmente, é necessário tomar decisões de maior complexidade, mas existe autonomia e suporte da gestão para lidar com essas situações.": [
        "B = Revisar o fluxo de trabalho para identificar gargalos.",
        "B = Oferecer treinamento em resolução de problemas complexos.",
        "B = Implementar sessões de mentoria com profissionais mais experientes."
    ],
    "O trabalho exige a tomada de decisões difíceis de forma frequente, muitas vezes com informações insuficientes ou sob pressão de tempo, gerando alta carga cognitiva.": [
        "C = Estabelecer um comitê ou grupo de apoio para decisões de alto impacto.",
        "C = Reduzir a responsabilidade individual sobre decisões críticas, tornando-as colegiadas.",
        "C = Oferecer apoio psicológico para lidar com o estresse pós-decisão.",
        "C = Garantir que o erro (tomado com base nas informações disponíveis) seja tratado como aprendizado, não como falha"
    ],
    "O volume de trabalho é compatível com a jornada, permitindo que todas as tarefas sejam realizadas com qualidade, sem a necessidade de horas extras.": [
        "A = Monitorar periodicamente a carga de trabalho. ",
        "A = Elogiar a eficiência e a qualidade, não apenas o volume."
    ],
    "Geralmente o tempo é suficiente, mas em períodos específicos (ex: fechamentos de mês), o volume de tarefas aumenta, exigindo uma gestão de tempo mais rigorosa.": [
        "B = Realizar reuniões semanais para alinhamento de prioridades e distribuição de tarefas. ",
        "B = Automatizar tarefas repetitivas.",
        "B = Avaliar a necessidade de horas extras e compensá-las adequadamente. "
    ],
    "O volume de tarefas é consistentemente maior do que o tempo disponível, gerando pressão constante, necessidade de horas extras e risco de esgotamento.": [
        "C = Ação Urgente: Priorizar todas as tarefas e suspender as não essenciais.",
        "C = Fazer um mapeamento completo de processos para eliminar retrabalho e ineficiências.",
        "C = Redistribuir tarefas de forma equitativa na equipe. ",
        "C = Contratar novos colaboradores. ",
        "C = Proibir a atribuição de novas tarefas antes da finalização das atuais."
    ],
    "Você precisa esconder suas emoções no trabalho?": [
        ""
    ],
    "Seu trabalho envolve lidar com situações emocionalmente difíceis?": [
        ""
    ],
    "O trabalhador possui alta autonomia para definir a ordem, o método e o ritmo de suas próprias tarefas, promovendo o engajamento e a responsabilidade.": [
        "A = Incentivar e elogiar a organização e a iniciativa pessoal.",
        "A = Manter a flexibilidade existente."
    ],
    "O trabalhador pode organizar a ordem de suas tarefas dentro de um método de trabalho pré-definido, possuindo um nível de autonomia moderado.": [
        "B = Aumentar gradualmente a delegação de tarefas com autonomia.",
        "B = Definir metas claras, mas permitir que o colaborador escolha o método para alcançá-las.",
        "B = Criar um ambiente seguro para a experimentação."
    ],
    "O trabalho é totalmente prescrito, com pouca ou nenhuma margem para o trabalhador decidir como organizar suas atividades, o que limita o uso de suas competências.": [
        "C = Implementar sistemas de trabalho com maior autonomia (Ex: squads, gestão por objetivos).",
        "C = Reduzir a microgestão através de treinamento intensivo das lideranças.",
        "C = Permitir horários de trabalho flexíveis.",
        "C = Confiar na equipe para gerir seu próprio fluxo de trabalho, focando nos resultados."
    ],
    "A participação nas decisões do setor é incentivada, e as opiniões dos trabalhadores são consideradas na definição de metas e processos.": [
        "A = Manter canais de sugestões abertos e agradecer publicamente liberdade para sugerir melhorias. pelas contribuições."
    ],
    "É possível dar sugestões e opiniões, mas a influência nas decisões finais do setor é limitada ou restrita a assuntos operacionais.": [
        "B = Criar um programa de sugestões com recompensas para as ideias implementadas. ",
        "B = Realizar reuniões de brainstorming com a participação de todos"
    ],
    "As decisões são centralizadas na gestão, sem consulta ou espaço para a participação dos trabalhadores, gerando um sentimento de baixa influência.": [
        "C = Formar comitês de melhoria contínua com membros da equipe. ",
        "C = Dar autonomia para que as equipes implementem pequenas melhorias sem necessidade de aprovação superior. ",
        "C = Garantir que a liderança forneça feedback sobre todas as sugestões, mesmo as não implementadas."
    ],
    "O trabalho oferece constantes oportunidades de aprendizado e desenvolvimento de novas competências, sendo um fator de motivação e crescimento profissional.": [
        "A = Oferecer acesso a cursos e workshops.",
        "A = Incentivar a participação em projetos desafiadores."
    ],
    "O desenvolvimento de novas habilidades é possível, mas depende principalmente da iniciativa do próprio trabalhador, com pouco incentivo formal da empresa.": [
        "B = Criar um Plano de Desenvolvimento Individual (PDI) para cada colaborador.",
        "B = Implementar um programa de mentoria interna.",
        "B = Oferecer subsídios para educação formal (graduação, pós-graduação)."
    ],
    "A tarefa é rotineira e não oferece oportunidades para aprender ou desenvolver novas habilidades, podendo levar à estagnação e desmotivação.": [
        "C = Implementar uma política de 'job rotation' (rodízio de funções).",
        "C = Criar um 'orçamento de inovação' para que os funcionários desenvolvam projetos próprios.",
        "C = Vincular o desenvolvimento de novas habilidades ao plano de carreira e promoções."
    ],
    "Você recebe informações claras sobre mudanças na empresa?": [
        ""
    ],
    "Você sabe o que se espera de você no trabalho?": [
        ""
    ],
    "Você pode contar com seus colegas quando precisa de ajuda?": [
        ""
    ],
    "O ambiente entre os funcionários é amigável?": [
        ""
    ],
    "A gestão mantém canais de comunicação abertos, escutando ativamente as preocupações e sugestões da equipe e dando o devido encaminhamento.": [
        "A =  Manter a política de 'portas abertas'.",
        "A = Elogiar os gestores que demonstram escuta ativa."
    ],
    "A gestão escuta as preocupações e sugestões, mas nem sempre há um retorno claro sobre as ações tomadas, ou a abertura é limitada a certos assuntos.": [
        "B = Treinar a liderança em feedback e escuta ativa.",
        "B = Implementar reuniões 1:1 (one-on-one) periódicas e estruturadas.",
        "B = Realizar pesquisas de satisfação anônimas sobre a liderança."
    ],
    "Há uma percepção clara de que a gestão não escuta ou não valoriza as preocupações e sugestões dos trabalhadores, gerando um sentimento de descaso.": [
        "C = Realizar uma avaliação 360º da liderança.",
        "C = Afastar ou substituir gestores com avaliação consistentemente negativa.",
        "C = Criar um canal de comunicação direto com o RH ou um nível hierárquico superior para questões não resolvidas com o gestor direto."

    ],
    "O reconhecimento pelo bom desempenho é uma prática cultural na empresa, ocorrendo de forma frequente e genuína por parte de gestores e colegas.": [
        "A = Manter práticas de elogio público e privado.",
        "A = Celebrar as conquistas da equipe."
    ],
    "O reconhecimento ocorre de forma esporádica, geralmente associado a grandes projetos ou resultados excepcionais, mas não é uma prática regular na rotina.": [
        "B = Estruturar um programa de reconhecimento (Ex: funcionário do mês, bônus por desempenho). ",
        "B = Treinar líderes para que ofereçam reconhecimento de forma genuína e constante.",
        "B = Vincular o reconhecimento a metas claras."
    ],
    "Há uma percepção clara de falta de reconhecimento pelo esforço e pelos resultados alcançados, gerando sentimentos de desvalorização e injustiça.": [
        "C = Revisar completamente a cultura organizacional para focar em valorização.",
        "C = Criar um plano de carreira transparente.",
        "C = Garantir que o reconhecimento verbal seja acompanhado de recompensas tangíveis (financeiras ou não)."
    ],
    "Os processos de tomada de decisão (promoções, alocação de tarefas) são percebidos como transparentes, imparciais e justos por todos.": [
        "A = Manter a transparência sobre os critérios de decisão.",
        "A = Realizar pesquisas salariais de mercado periodicamente."
    ],
    "A maioria das decisões é percebida como justa, mas pode haver questionamentos ou falta de clareza em situações pontuais.": [
        "B = Criar e comunicar uma política clara de cargos e salários.",
        "B = Estabelecer critérios objetivos para promoções e aumentos.",
        "B = Abrir um canal para que os funcionários possam questionar decisões de forma segura."
    ],
    "Há uma percepção generalizada de que as decisões são tomadas de forma parcial, injusta ou baseada em favoritismo, minando a confiança na gestão.": [
        "C = Realizar uma auditoria de equidade salarial para corrigir discrepâncias (gênero, raça, etc.).",
        "C = Criar um comitê de ética para avaliar a justiça das decisões corporativas.",
        "C = Publicar relatórios de transparência sobre as principais decisões da empresa."
    ],
    "Você sente que é tratado com respeito por seus superiores?": [
        ""
    ],
    "O ambiente de trabalho é seguro e não há relatos ou percepção de assédio moral ou qualquer forma de violência psicológica.": [
        "A = Manter uma política de tolerância zero clara e visível.",
        "A = Realizar treinamentos preventivos anuais. "
    ],
    "Não há relatos diretos de assédio, mas podem existir comentários ou 'brincadeiras' inadequadas que criam um ambiente desconfortável.": [
        "B = Criar um canal de denúncias anônimo e de fácil acesso. ",
        "B = Investigar todas as alegações de forma rápida e imparcial. ",
        "B = Oferecer apoio psicológico imediato à vítima. "
    ],
    "Foram identificados relatos ou uma percepção clara da ocorrência de assédio moral (humilhações, isolamento, perseguição), indicando um ambiente de trabalho tóxico.": [
        "C = Ação Urgente: Afastar o agressor imediatamente durante a investigação. ",
        "C = Aplicar sanções severas e exemplares aos culpados, incluindo demissão por justa causa. ",
        "C = Oferecer todo o suporte jurídico e psicológico à vítima. ",
        "C = Realizar uma intervenção profunda na cultura do setor onde ocorreu o assédio."
    ],
    "Você teme perder seu emprego nos próximos meses?": [
        ""
    ],
    "Ao final do expediente, o sentimento é de cansaço natural, mas não de esgotamento. A energia para atividades pessoais é preservada.": [
        "A = Incentivar o 'direito à desconexão' após o expediente.",
        "A = Promover um bom equilíbrio entre vida pessoal e profissional."
    ],
    "Sentir-se esgotado é algo que ocorre ocasionalmente, após dias de demanda atípica, mas não é um sentimento crônico.": [
        "B = Avaliar a carga de trabalho e a duração das jornadas. ",
        "B = Oferecer palestras e workshops sobre prevenção ao burnout. ",
        "B = Incentivar o uso completo dos períodos de férias."
    ],
    "O sentimento de esgotamento físico e mental ao final do expediente é frequente ou diário, indicando uma sobrecarga crônica e risco de burnout.": [
        "C = Encaminhar os funcionários para avaliação médica e psicológica (diagnóstico de Burnout). ",
        "C = Reduzir drasticamente a carga de trabalho do indivíduo ou da equipe. ",
        "C = Oferecer licença remunerada para recuperação da saúde. ",
        "C = Reestruturar completamente as tarefas e responsabilidades que levaram ao esgotamento"
    ],
    "O trabalho é percebido como uma fonte de satisfação e realização, contribuindo positivamente para a saúde mental.": [
        "A = Promover um ambiente de trabalho positivo e de apoio.",
        "A = Divulgar materiais sobre bem-estar e saúde mental."
    ],
    "O trabalho, em si, não afeta a saúde mental, mas a pressão ocasional pode gerar estresse temporário.": [
        "B =Oferecer acesso a programas de apoio psicológico (terapia, etc.).",
        "B = Treinar líderes para que saibam identificar sinais de sofrimento psíquico na equipe.",
        "B = Promover práticas de relaxamento no ambiente de trabalho (meditação, ginástica laboral). "
    ],
    "O ambiente ou a carga de trabalho são fontes constantes de estresse, ansiedade ou outros impactos negativos na saúde mental do trabalhador.": [
        "C = Realizar um diagnóstico organizacional para identificar as causas raiz do estresse. ",
        "C = Implementar um programa robusto de saúde mental, com psicólogos disponíveis na empresa. ",
        "C = Mudar radicalmente os fatores ambientais identificados como estressores (ex: liderança tóxica, metas abusivas)."
    ],
    "Você consegue equilibrar sua vida pessoal e profissional?": [
        ""
    ],
    "O volume de trabalho é adequado à jornada, permitindo a realização das tarefas com qualidade e sem sobrecarga.": [
        "A = Monitorar periodicamente a carga de trabalho. ",
        "A = Elogiar a eficiência e a qualidade, não apenas o volume."
    ],
    "Ocasionalmente, o volume de tarefas excede o tempo disponível, mas são situações pontuais e gerenciáveis.": [
        "B = Realizar reuniões semanais para alinhamento de prioridades e distribuição de tarefas. ",
        "B = Automatizar tarefas repetitivas.",
        "B = Avaliar a necessidade de horas extras e compensá-las adequadamente. "
    ],
    "A sobrecarga quantitativa é uma condição crônica, com um volume de trabalho consistentemente superior à capacidade de realização no tempo previsto.": [
        "C = Ação Urgente: Priorizar todas as tarefas e suspender as não essenciais.",
        "C = Fazer um mapeamento completo de processos para eliminar retrabalho e ineficiências.",
        "C = Redistribuir tarefas de forma equitativa na equipe. ",
        "C = Contratar novos colaboradores. ",
        "C = Proibir a atribuição de novas tarefas antes da finalização das atuais."
    ],
    "AO planejamento das tarefas permite a execução com prazos realistas e sem pressão indevida.": [
        "A = Manter o planejamento de prazos realista.",
        "A = Reconhecer o cumprimento de metas sem a necessidade de correria."
    ],
    "A pressão por prazos ocorre em situações específicas e previsíveis, não sendo uma característica constante do ambiente de trabalho.": [
        "B = Revisar o fluxo de trabalho para identificar gargalos.",
        "B = Treinar a equipe em gestão de tempo e priorização.",
        "B = Negociar prazos mais flexíveis com clientes e stakeholders.",
        "B = Analisar a necessidade de contratar mais pessoal."
    ],
    "A pressão por prazos curtos é uma exigência constante, gerando um ambiente de alta tensão e risco de estresse.": [
        "C = Ação Urgente: Suspender ou renegociar todos os prazos irrealistas. ",
        "C = Realizar uma análise aprofundada da carga de trabalho (dimensionamento da equipe). ",
        "C = Implementar um sistema de gestão de tarefas com prioridades claras (Ex: Matriz de Eisenhower).",
        "C = Proibir o contato para demandas de trabalho fora do horário de expediente. ",
        "C = Contratar pessoal de apoio ou temporário."
    ],
    "O cansaço ao final do dia é normal e compatível com o esforço despendido, sem comprometer a recuperação para o dia seguinte.": [
        "A = Incentivar o 'direito à desconexão' após o expediente.",
        "A = Promover um bom equilíbrio entre vida pessoal e profissional."
    ],
    "O sentimento de exaustão é raro, ocorrendo apenas em dias de esforço atípico.": [
        "B = Avaliar a carga de trabalho e a duração das jornadas. ",
        "B = Oferecer palestras e workshops sobre prevenção ao burnout. ",
        "B = Incentivar o uso completo dos períodos de férias."
    ],
    "A exaustão ao final do expediente é um sentimento frequente ou diário, indicando que a carga de trabalho excede a capacidade de recuperação.": [
        "C = Encaminhar os funcionários para avaliação médica e psicológica (diagnóstico de Burnout). ",
        "C = Reduzir drasticamente a carga de trabalho do indivíduo ou da equipe. ",
        "C = Oferecer licença remunerada para recuperação da saúde. ",
        "C = Reestruturar completamente as tarefas e responsabilidades que levaram ao esgotamento"
    ],
    "Há total autonomia para planejar e organizar a sequência e o método de execução das próprias tarefas.": [
        "A = Incentivar e elogiar a organização e a iniciativa pessoal.",
        "A = Manter a flexibilidade existente."
    ],
    "É possível organizar as tarefas diárias dentro de um escopo e método de trabalho pré-definidos pela gestão.": [
        "B = Aumentar gradualmente a delegação de tarefas com autonomia.",
        "B = Definir metas claras, mas permitir que o colaborador escolha o método para alcançá-las.",
        "B = Criar um ambiente seguro para a experimentação."
    ],
    "As tarefas são rigidamente definidas e sequenciadas pela gestão, com pouca ou nenhuma margem para o trabalhador organizar seu próprio trabalho.": [
        "C = Implementar sistemas de trabalho com maior autonomia (Ex: squads, gestão por objetivos).",
        "C = Reduzir a microgestão através de treinamento intensivo das lideranças.",
        "C = Permitir horários de trabalho flexíveis.",
        "C = Confiar na equipe para gerir seu próprio fluxo de trabalho, focando nos resultados."
    ],
    "Posso tomar decisões sobre meu trabalho sem precisar de autorização constante?": [
        ""
    ],
    "A empresa possui canais formais e informais que incentivam ativamente as sugestões de melhoria, e elas são valorizadas e consideradas.": [
        "A = Manter canais de sugestões abertos e agradecer publicamente liberdade para sugerir melhorias. pelas contribuições.",
    ],
    "É possível dar sugestões, mas não há um processo formal para isso, e a implementação depende da iniciativa da gestão.": [
        "B = Criar um programa de sugestões com recompensas para as ideias implementadas. ",
        "B = Realizar reuniões de brainstorming com a participação de todos",
    ],
    "Não há espaço ou canais para sugerir melhorias, ou as sugestões feitas são consistentemente ignoradas pela gestão.": [
        "C = Formar comitês de melhoria contínua com membros da equipe. ",
        "C = Dar autonomia para que as equipes implementem pequenas melhorias sem necessidade de aprovação superior. ",
        "C = Garantir que a liderança forneça feedback sobre todas as sugestões, mesmo as não implementadas."
    ],
    "Tenho uma boa relação com meus colegas de trabalho": [
        ""
    ],
    "A liderança demonstra apoio ativo e oferece os recursos necessários para que a equipe supere as dificuldades e desafios.": [
        "A =  Manter a política de 'portas abertas'.",
        "A = Elogiar os gestores que demonstram escuta ativa."
    ],
    "O apoio da liderança existe, mas precisa ser solicitado pelo trabalhador, não sendo uma atitude proativa da gestão.": [
        "B = Treinar a liderança em feedback e escuta ativa.",
        "B = Implementar reuniões 1:1 (one-on-one) periódicas e estruturadas.",
        "B = Realizar pesquisas de satisfação anônimas sobre a liderança."
    ],
    "Há uma percepção clara de falta de apoio por parte da liderança diante de dificuldades, gerando sentimentos de desamparo.": [
        "C = Realizar uma avaliação 360º da liderança.",
        "C = Afastar ou substituir gestores com avaliação consistentemente negativa.",
        "C = Criar um canal de comunicação direto com o RH ou um nível hierárquico superior para questões não resolvidas com o gestor direto."
    ],
    "O clima organizacional da empresa é positivo e motivador": [
        ""
    ],
    "O reconhecimento pelo esforço e pelos resultados é uma prática consistente na cultura da empresa.": [
        "A = Manter práticas de elogio público e privado.",
        "A = Celebrar as conquistas da equipe."
    ],
    "O reconhecimento ocorre de forma pontual, geralmente ligado a metas específicas, mas não é uma prática difundida na rotina.": [
        "B = Estruturar um programa de reconhecimento (Ex: funcionário do mês, bônus por desempenho). ",
        "B = Treinar líderes para que ofereçam reconhecimento de forma genuína e constante.",
        "B = Vincular o reconhecimento a metas claras."
    ],
    "Há um sentimento generalizado de que o trabalho não é valorizado nem reconhecido pela empresa, gerando desmotivação.": [
        "C = Revisar completamente a cultura organizacional para focar em valorização.",
        "C = Criar um plano de carreira transparente.",
        "C = Garantir que o reconhecimento verbal seja acompanhado de recompensas tangíveis (financeiras ou não)."
    ],
    "Recebo feedbacks construtivos sobre o meu desempenho": [
        ""
    ],
    "Há um forte sentimento de que a remuneração e os benefícios são injustos ou insuficientes para as responsabilidades exigidas": [
        "C = Realizar uma auditoria de equidade salarial para corrigir discrepâncias (gênero, raça, etc.).",
        "C = Criar um comitê de ética para avaliar a justiça das decisões corporativas.",
        "C = Publicar relatórios de transparência sobre as principais decisões da empresa."
    ],
    "Há uma percepção clara de que a remuneração e os benefícios são justos e competitivos em relação às responsabilidades do cargo e ao mercado": [
        "A = Manter a transparência sobre os critérios de decisão.",
        "A = Realizar pesquisas salariais de mercado periodicamente."
    ],
    "A remuneração é percebida como aceitável, embora não seja considerada um grande diferencial ou fator de motivação": [
        "B = Criar e comunicar uma política clara de cargos e salários.",
        "B = Estabelecer critérios objetivos para promoções e aumentos.",
        "B = Abrir um canal para que os funcionários possam questionar decisões de forma segura."
    ],

    "O ambiente de trabalho é percebido como psicologicamente seguro e não é uma fonte de estresse ou ansiedade.": [
        "A = Promover um ambiente de trabalho positivo e de apoio.",
        "A = Divulgar materiais sobre bem-estar e saúde mental.",

    ],
    "O estresse e a ansiedade são reações pontuais a situações específicas de trabalho, não sendo um estado emocional crônico.": [
        "B =Oferecer acesso a programas de apoio psicológico (terapia, etc.).",
        "B = Treinar líderes para que saibam identificar sinais de sofrimento psíquico na equipe.",
        "B = Promover práticas de relaxamento no ambiente de trabalho (meditação, ginástica laboral). "
    ],
    "O ambiente de trabalho é uma fonte constante de estresse e ansiedade, impactando a saúde mental e o bem-estar do trabalhador.": [
        "C = Realizar um diagnóstico organizacional para identificar as causas raiz do estresse. ",
        "C = Implementar um programa robusto de saúde mental, com psicólogos disponíveis na empresa. ",
        "C = Mudar radicalmente os fatores ambientais identificados como estressores (ex: liderança tóxica, metas abusivas)."
    ],
    "Não há percepção ou relatos de assédio moral ou tratamento injusto. O ambiente é de total respeito.": [
        "A = Manter uma política de tolerância zero clara e visível.",
        "A = Realizar treinamentos preventivos anuais. "
    ],
    "Não há relatos de assédio, mas podem ocorrer situações percebidas como tratamento injusto de forma pontual e isolada.": [
        "B = Criar um canal de denúncias anônimo e de fácil acesso. ",
        "B = Investigar todas as alegações de forma rápida e imparcial. ",
        "B = Oferecer apoio psicológico imediato à vítima. "
    ],
    "Há relatos ou uma percepção clara da ocorrência de assédio moral ou tratamento injusto sistemático, indicando um ambiente de trabalho hostil.": [
        "C = Ação Urgente: Afastar o agressor imediatamente durante a investigação. ",
        "C = Aplicar sanções severas e exemplares aos culpados, incluindo demissão por justa causa. ",
        "C = Oferecer todo o suporte jurídico e psicológico à vítima. ",
        "C = Realizar uma intervenção profunda na cultura do setor onde ocorreu o assédio."
    ],
    "Sinto que há competitividade excessiva e pouco trabalho em equipe na empresa": [
        ""
    ]
};

// Função auxiliar para obter soluções baseadas no nome do risco
const getSolucoesParaRisco = (nomeRisco: string): string[] => {
    // Normaliza textos para comparação robusta (ignora acentos, espaços extras e caixa)
    const normalize = (s: string) =>
        (s || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

    // 1) Tentativa de match exato pelo objeto (performance O(1))
    if (SOLUCOES_POR_PERIGO[nomeRisco as keyof typeof SOLUCOES_POR_PERIGO]) {
        return SOLUCOES_POR_PERIGO[nomeRisco as keyof typeof SOLUCOES_POR_PERIGO];
    }

    const alvo = normalize(nomeRisco);
    const entradas = Object.entries(SOLUCOES_POR_PERIGO) as [string, string[]][];

    // 2) Match exato normalizado entre as chaves existentes
    for (const [chave, solucoes] of entradas) {
        if (normalize(chave) === alvo) {
            return solucoes;
        }
    }

    // 3) Match parcial: inclui/contem (cobre todos os itens atuais sem precisar de vários ifs)
    for (const [chave, solucoes] of entradas) {
        const chaveNorm = normalize(chave);
        if (chaveNorm.includes(alvo) || alvo.includes(chaveNorm)) {
            return solucoes;
        }
    }

    // 4) Fallback genérico
    return [
        "Implementar medidas de controle adequadas",
        "Realizar avaliação específica do risco",
        "Consultar especialista em ergonomia"
    ];
};

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export default function ReportUp() {
    // Estado para motivos da linha 1 (Entrevista/Motivo)
    const [motivosLinha, setMotivosLinha] = useState<{ value: string, label: string }[]>([]);
    // Estado por linha para "Entrevista/Motivo" na Seção 7
    const [motivosPorLinha, setMotivosPorLinha] = useState<Record<string, { value: string, label: string }[]>>({});
    const location = useLocation();
    const navigate = useNavigate();
    // Estado para embasamentos dos fatores biomecânicos (pode expandir para múltiplas linhas se necessário)
    const [embasamentosBiomecanicos, setEmbasamentosBiomecanicos] = useState([
        "ABNT NBR ISO 11226: 2013 NR-17 item 17.4.2",
        "ISO 11228-1 FERRAMENTA NIOSH NR 17 item 17.5 + Manual de Aplicação ISO 11228-1",
        "Nota técnica 060/2001 – MTE COUTO NR 17: 17.6.2 e CLT Art. 199: Quando o trabalho deva ser executado de pé, os empregados terão à sua disposição assentos para serem utilizados nas pausas",
        "NR-17 item 17.4.3 letra c Escala de Borg: ≥5 >10% do tempo de ciclo (risco relevante) Escala de Borg: ≥8 (esforço intenso)",
        "NR-17 item 17.5.3 Ferramenta Kim Puxar – Empurrar ABNT NBR ISO 11228-2",
        "OCRA/ COLOMBINI > 40 ações técnicas/min/MS ABNT NBR ISO 11228-3 Menor que 1h/dia ou 5h/semana: insignificante De 1h a 2h por dia: atenção Maior que 2 horas: longos períodos (risco)",
        "NR-17 item 17.7.5 ABNT NBR ISO 11228-3/ COLOMBINI / OCRA >1kg em pinça ou >3kg em preensão palmar >2h (por dia)",
        "NBR 13966: Raio da borda de contato com o usuário: mínimo 2,5mm",
        "NR-17 itens 17.4.2 e 17.4.3 ABNT 11226 >20º e ≤60° de flexão ABNT 11228-1 ≤15 flexões / min (até 1h/dia) ≤ 12 flexões / min (de 1h a 2h/dia)",
        "NR 17 – 17.6.5 e ABNT NBR ISO 11226 Grandjean: Tornozelos: 90°e 100° Distância entre pedais: entre 5 e 10 cm Curso do pedal: para pesados: 5 a 15 cm Para leves: até 6 cm ISO: Sentado: Ângulo dos joelhos: 90° a 135° Em pé: permite alternância de perna?",
        "NR-17 item 17.4.3 letra d ABNT NBR ISO 11228-3 Risco quando: Braço quase na altura do ombro (80º) em flexão ou abdução: >10 % do tempo do ciclo e/ou  >2 ações/min Risco quando: Em abdução ou flexão moderada (entre 45° e 80°): > 1/3 do tempo do ciclo e/ou >10 ações/min. Desde que por mais que 1h/dia ou 5h/semana",
        "NR-17 item 17.4.3 letra d Entrevista: análise qualitativa Causa desconforto? Diminui produtividade?",
        "HAV: Health and Safety Executive  ABNT NBR 11228-3/ COLOMBINI Até 1/3 tempo de ciclo: risco baixo 2/3 tempo de ciclo: risco médio 3/3 tempo de ciclo: risco alto",
        "TOR TOM Punhos em desvios extremos quase todo o tempo de ciclo>70° de flexão ou  >50° de extensão ou  >20° em desvios laterais"
    ]);

    const [embasamentosMobiliarioEquipamento, setEmbasamentosMobiliarioEquipamento] = useState([
        "NR 17 Mobiliário/ ambiente/ equipamentos improvisados?",
        "CLT: Art. 199 NR-17: item 17.6 ABNT NBR 13966: 2008 ABNT NBR 13962: 2002",
        "NR-17 item 17.4.5 ABNT NBR 13966: 2008 ABNT NBR 13962: 2002 Nota técnica 060/2001 MTE",
        "NR-17 item 17.6.3 letras De E ABNT NBR 13966: 2008",
        "	NR-17 item 17.6.3 letra c e 17.6.3.1 Grandjean e Lida: Alcances Horizontal Alcance ótimo: 35-45cm (uso frequente) Alcance máximo: 55-65cm (uso eventual) Grandjean: Tabela de Alcance Vertical",
        "NR-17 item 17.6.1 ABNT NBR 13966: 2008 ABNT NBR 13962: 2002 Tabela Antropométrica"
    ]);

    const [embasamentosOrganizacionais, setEmbasamentosOrganizacionais] = useState([

        "NR-17 item 17.4.3.1 Descrição dos colaboradores: Pausas formais/ informais/ fisiológicas/ pré definidas/voluntárias/lanche CLT/NR 17 Intervalo Repouso: Intrajornada: Até 4 horas: 0 min, Acima de 4h até 6h: 15 min",
        "NR-17 item 17.4.1 letra d Descrição dos trabalhadores / entrevista Ritmo Muito Leve - Leve - Moderado - Alto - Intenso",
        "Check List Ocra: estereotipia Grau Moderado - Tempo de ciclo entre 8 e 15 segundos e/ou Grau Elevado - Mesmas ações técnicas $2/3$ tempo de ciclo (51-80%)",
        "Entre 22:00 e 05:00 horas, se trabalhador urbano; entre 21:00 e 05:00 horas se trabalhador rural na lavoura e entre 20:00 e 04:00 horas se trabalhador rural na pecuária.",
        "NR-17 item 17.4.4 Descrição dos colaboradores/ entrevista NÃO POSSUI O PERIGO / FATOR DE RISCO ERGONÔMICO",
        "CHECK LIST OCRA Risco baixo: possui área de pulmão Risco moderado: ritmo imposto com fluxo lento Risco alto: ritmo imposto com fluxo alto"

    ]);

    const [embasamentosAmbientais, setEmbasamentosAmbientais] = useState([
        "$NR-17$ item 17.8: nível de conforto: 65dB",
        "NR-17 item 17.8: temperatura entre 18ºC e 25ºC",
        "NHO-11 e NR-17 item 17.8"
    ]);

    const [embasamentosPsicossociais, setEmbasamentosPsicossociais] = useState([
        "NR-17, item 17.4.3: A organização do trabalho deve considerar o conteúdo das tarefas e os modos operatórios. Análise Cognitiva: Avaliação da demanda de atenção, memória e concentração para a execução segura e eficiente do trabalho.",
        "NR-17, item 17.4.3: A organização do trabalho deve considerar as normas de produção e o ritmo de trabalho. Manual de Aplicação da NR-17: Veda o estímulo pecuniário ou de outra natureza que obrigue o trabalhador a acelerar a cadência em detrimento da saúde.",
        "NR-17, item 17.4.3: A organização do trabalho deve considerar a demanda de tempo e as normas de produção para que sejam compatíveis com as capacidades do trabalhador.",
        "NR-17, item 17.4.3: Avaliação do ritmo de trabalho e da pressão temporal como fatores de risco psicossocial. Metodologia COPSOQ: Dimensão Ritmo de Trabalho",
        "NR-17, item 17.4.3: Análise do conteúdo das tarefas e do nível de responsabilidade. Metodologia COPSOQ: Dimensão Influência no Trabalho e Sentido do Trabalho.",
        "NR-17, item 17.4.3: A determinação das normas de produção e da demanda de tempo deve ser compatível com a saúde do trabalhador.",
        "NR-17, item 17.1.2: As condições de trabalho devem se adaptar às características psicofisiológicas dos trabalhadores. Metodologia COPSOQ: Dimensão Demandas Emocionais.",
        "NR-17: Avaliação da natureza do trabalho e do seu impacto emocional, buscando medidas de suporte. Metodologia COPSOQ: Dimensão Demandas Emocionais",
        "NR-17, item 17.4.3: A organização do trabalho deve permitir ao trabalhador regular seu modo operatório. Metodologia COPSOQ: Dimensão Influência no Trabalho",
        "NR-17, item 17.4.3: Avaliação da autonomia e da possibilidade de regulação do ritmo e modo de trabalho pelo empregado.",
        "NR-17, item 17.4.3: O conteúdo das tarefas e o modo operatório devem favorecer a autonomia. Metodologia COPSOQ: Dimensão Influência no Trabalho",
        "NR-17: Um ambiente de trabalho participativo é um fator de proteção psicossocial. Gestão Participativa: Práticas que incentivam a participação dos trabalhadores na melhoria contínua.",
        "NR-17: Avaliação do grau de participação dos trabalhadores nas decisões que afetam seu trabalho. Metodologia COPSOQ: Dimensão Influência no Trabalho",
        "NR-17, item 17.4.3: O conteúdo das tarefas deve ser adequado ao conhecimento e habilidades do trabalhador, permitindo seu desenvolvimento. Metodologia COPSOQ: Dimensão Desenvolvimento de Habilidades",
        "NR-17: Análise das relações socioprofissionais como fator de risco ou proteção. Metodologia COPSOQ: Dimensão Apoio Social dos Colegas",
        "NR-17: A análise das relações interpessoais no ambiente de trabalho faz parte da avaliação ergonômica. Clima Organizacional: Um bom relacionamento entre pares é um indicador de saúde organizacional.",
        "NR-17: Avaliação do clima organizacional. Prevenção ao Assédio: Um ambiente hostil pode ser um indicativo de assédio moral difuso",
        "NR-17: Avaliação da qualidade da liderança e do apoio social da chefia. Metodologia COPSOQ: Dimensão Apoio Social do Superior",
        "NR-17: A qualidade da supervisão é um fator psicossocial chave. Metodologia COPSOQ: Dimensão Qualidade da Liderança e Apoio Social do Superior",
        "NR-17, item 17.4.3: A organização do trabalho não deve fomentar antagonismos entre os trabalhadores. Prevenção ao Assédio Moral: A instigação da competitividade excessiva é uma das formas de assédio.",
        "NR-17: A previsibilidade e a clareza na comunicação são fatores de proteção psicossocial. Metodologia COPSOQ: Dimensão Previsibilidade",
        "NR-17: A clareza de papéis e responsabilidades é fundamental para a saúde mental. Metodologia COPSOQ: Dimensão Clareza do Papel",
        "NR-17: O desequilíbrio entre esforço e recompensa (reconhecimento) é um fator de risco psicossocial. Metodologia COPSOQ: Dimensão Reconhecimento",
        "Modelo Esforço-Recompensa (Siegrist): O reconhecimento é um pilar da recompensa, e seu desequilíbrio com o esforço gera estresse. Metodologia COPSOQ: Dimensão Reconhecimento",
        "Qualidade da Liderança (COPSOQ): O feedback sobre o desempenho é uma das facetas da qualidade da liderança. NR-17: A comunicação entre gestor e trabalhador é parte da organização do trabalho.",
        "Modelo Esforço-Recompensa (Siegrist): Avalia o equilíbrio entre o esforço despendido (demandas) e as recompensas recebidas (salário, estima, segurança). Justiça Organizacional: Percepção de justiça distributiva.",
        "Justiça Organizacional: Percepção sobre a justiça dos procedimentos (justiça procedural) e das relações (justiça interpessoal). NR-17: Um ambiente percebido como injusto é fonte de estresse.",
        "Constituição Federal, Art. 1º, III: Princípio da Dignidade da Pessoa Humana. Convenção 190 da OIT: Direito a um ambiente de trabalho livre de violência e assédio.",
        "Lei nº 14.457/2022: Obrigatoriedade de canais de denúncia e ações de combate ao assédio nas empresas com CIPA. Convenção 190 da OIT: Define e estabelece a necessidade de políticas para eliminar a violência e o assédio no trabalho.",
        "Lei nº 14.457/2022 e CIPA: A empresa deve ter procedimentos para recebimento e acompanhamento de denúncias. MPT (Ministério Público do Trabalho): Define assédio moral como conduta abusiva e repetitiva que atenta contra a dignidade do trabalhador.",
        "NR-17: A insegurança no trabalho é um importante estressor psicossocial a ser considerado na análise do trabalho. Metodologia COPSOQ: Dimensão Insegurança no Emprego",
        "CID-11 (OMS): A Síndrome de Burnout é um fenômeno ocupacional ligado ao estresse crônico não gerenciado. O esgotamento é sua principal dimensão.",
        "NR-17: O objetivo da norma é evitar o adoecimento, incluindo o esgotamento. CID-11 (OMS): Sintoma central da Síndrome de Burnout (Esgotamento).",
        "	NR-17, item 17.1.2: O objetivo da norma é estabelecer diretrizes para adaptar o trabalho às características psicofisiológicas e prevenir o adoecimento.",
        "	NR-17 e NR-1: A organização deve gerenciar todos os riscos ocupacionais, incluindo os psicossociais que levam ao estresse e à ansiedade.",
        "NR-17: Jornadas de trabalho, sobrecarga e pressão excessiva impactam diretamente o conflito trabalho-família. Metodologia COPSOQ: Dimensão Conflito Trabalho-Família",
        "NR-17: A avaliação do ambiente psicossocial é parte da análise ergonômica. Um clima negativo é um fator de risco generalizado."
    ]);


    const [formData, setFormData] = useState({
        // Identificação da Empresa
        nomeEmpresa: '',
        cnpj: '',
        endereco: '',
        cnae: '',
        grauRisco: '',

        // Informações Gerais
        cidade: '',
        dataLaudo: '',

        // Demanda
        tituloDemanda: '',
        textoDemanda: 'Essa AEP foi realizada para atendimento da norma regulamentadora NR-17 de Ergonomia que visa estabelecer as diretrizes e os requisitos que permitam a adaptação das condições de trabalho às características psicofisiológicas dos trabalhadores, de modo a proporcionar conforto, segurança, saúde e desempenho eficiente no trabalho.',

        // Objetivos da AEP
        tituloObjetivos: '',
        textoObjetivos: 'A AEP – Avaliação Ergonômica Preliminar é uma avaliação de cunho obrigatório de acordo com a NR-17 vigente e visa à preservação da saúde e da integridade dos trabalhadores, através da antecipação, reconhecimento, avaliação e recomendações para minimização ou eliminação dos perigos e riscos ergonômicos existentes, a partir da avaliação realizada. \nEsta AEP tem por objetivo avaliar ergonomicamente os postos, funções, tarefas e atividades dos trabalhadores, diagnosticar os possíveis perigos e riscos encontrados e mostrar medidas e caminhos corretivos para tais situações de trabalho, sendo elas mobiliárias, posturais, antropométricas, organizacionais, cognitivas, produtivas, dentre outras, a fim de promover produtividade, conforto e segurança no trabalho. \nAs informações advindas da AEP enriquecem o Programa de Controle Médico de Saúde Ocupacional – PCMSO e colabora também para o gerenciamento de possíveis riscos ergonômicos dentro do GRO(Gerenciamento de Riscos Ocupacionais) e do PGR(Programa de Gerenciamento de Riscos), para a gestão ser eficaz junto de uma equipe multidisciplinar.',

        // Referências Técnicas
        referenciasTecnicas: '• Lei nº 6.514 de 22 de dezembro de 1977 que sanciona o Capítulo V do Título II da Consolidação das Leis do Trabalho, relativo a segurança e medicina do trabalho. \n• Portaria n° 3.214 de 08 de junho de 1978 que aprova as normas regulamentadoras e Portaria/MPT n° 423 de 07 de Outubro de 2021 que aprova a nova redação da NR-17 \n• Norma Regulamentadora 01: Que além de outras atribuições, exige a identificação de perigos e riscos ergonômicos. \n• Norma regulamentadora 17: Ergonomia que visa estabelecer parâmetros que permitam a adaptação das condições de trabalho às características psicofisiológicas dos trabalhadores, de modo a proporcionar um máximo de conforto, segurança e desempenho eficiente. \n• Norma ABNT NBR 13966/2008: móveis para escritório – mesas que faz a classificação, características físicas dimensionais e especifica as dimensões de mesas de escritório de uso geral, inclusive mesas de reuniões, os requisitos mecânicos, de segurança e ergonômicos para mesas de escritório, bem como define os métodos de ensaio para o atendimento destes requisitos. \n• Norma ABNT NBR 13962/2002: móveis para escritório – cadeiras que especifica as características físicas e dimensionais e classifica as cadeiras para escritório, bem como estabelece os métodos para a determinação da estabilidade, da resistência e da durabilidade de cadeiras de escritório, de qualquer material. \n• Norma NHO 11: Esta NHO se aplica à avaliação do nível de iluminamento em ambientes internos. Aborda também outros aspectos e parâmetros para detecção de não conformidades que possam comprometer requisitos de segurança e desempenho eficiente do trabalho.\n • Norma ABNT NBR ISO 11226: Ergonomia – Avaliação de posturas estáticas no trabalho: Esta norma contém uma abordagem para determinar a aceitabilidade de posturas estáticas de trabalho.\n• Norma ISO 11228-1: Ergonomia – Movimentação manual – parte 1: Esta Parte da NBR ISO 11228 especifica os limites recomendados para o levantamento manual e transporte de cargas. \n• Norma ISO 11228-2: Ergonomia – Movimentação manual – parte 2: Empurrar e Puxar.\n• Norma ABNT NBR ISO 11228-3: Ergonomia - Movimentação manual Parte 3: Movimentação de cargas leves em alta frequência de repetição. \n• NIOSH, método que permite o cálculo do limite de peso a ser levantado em condições seguras pelo trabalhador.',

        // Referências Bibliográficas
        referenciasBibliograficas: '• NR 17 atualizada em 2022 \n• MANUAL DE APLICAÇÃO DA NORMA REGULAMENTADORA Nº 17. – 2º ED. – BRASÍLIA: MTE, SIT, 2002. \n• Norma ABNT NBR 13966: 2008 \n• Norma ABNT NBR 13962: 2002 \n• Norma ABNT ISO 8995-1: 2013 \n• Norma ABNT NBR ISO 11226 \n• Norma ISO 11228 \n• Norma NHO-11',

        // Recomendações Gerais
        treinamentosRecomendacoes: '',
        mobiliarioEquipamentosRecomendacoes: '',
        pausasGinasticaRecomendacoes: '',
        aspectosOrganizacionaisRecomendacoes: '',

        // Encerramento
        dataEncerramento: '',
        validadeLaudo: '',
        conclusao: '',

        // Responsável Técnico
        responsavelTecnicoNome: '',
        responsavelTecnicoRegistro: '',
        responsavelTecnicoFormacao: '',
        responsavelTecnicoEspecializacao: ''


    });

    // Capturar laudoId e preencher campos do formulário
    useEffect(() => {

        // Capturar laudoId da URL ou state
        const urlParams = new URLSearchParams(window.location.search);
        const laudoIdFromUrl = urlParams.get('laudoId');
        const laudoIdFromState = location.state?.laudoId;

        const currentLaudoId = laudoIdFromUrl || laudoIdFromState;

        if (currentLaudoId) {
            setLaudoId(currentLaudoId);
        } else {
            // Se não encontrou laudoId, mostrar aviso mas não bloquear o formulário
            // Aviso silencioso removido dos logs de console
        }

        // Verificar se está em modo de edição
        if (location.state?.isEditing) {
            setIsEditing(true);
            setReportUpId(location.state.reportUpId);

            const data = location.state;
            // Alguns fluxos enviam os dados dentro de `conteudo`. Padroniza a origem aqui.
            const contentData: any = (data as any)?.conteudo || data;

            // Carregar dados básicos da empresa (sempre atualizados)
            setFormData((prev: any) => ({
                ...prev,
                // Dados básicos da empresa
                nomeEmpresa: data.nomeEmpresa || prev.nomeEmpresa,
                cnpj: data.cnpj || prev.cnpj,
                endereco: data.endereco || prev.endereco,
                cnae: data.cnae || prev.cnae,
                cidade: data.cidade || prev.cidade,
                dataLaudo: data.dataLaudo || prev.dataLaudo,

                // Dados salvos do formulário (se existirem)
                ...(contentData?.formData || data.formData)
            }));

            // Carregar dados das tabelas dinâmicas
            if ((contentData.setores && contentData.setores.length > 0) || (data.setores && data.setores.length > 0)) {
                setSetores(contentData.setores || data.setores);
            }

            if ((contentData.riscoseSolucoes && contentData.riscoseSolucoes.length > 0) || (data.riscoseSolucoes && data.riscoseSolucoes.length > 0)) {
                // Garantir que todos os riscos tenham os novos campos obrigatórios
                const baseRiscos = contentData.riscoseSolucoes || data.riscoseSolucoes;
                const riscosComCamposCompletos = baseRiscos.map((risco: any) => ({
                    ...risco,
                    gravidade: risco.gravidade || '',
                    probabilidade: risco.probabilidade || '',
                    nivelRisco: risco.nivelRisco || ''
                }));
                setRiscoseSolucoes(riscosComCamposCompletos);
            }

            // Carregar cronograma de ações, se existir
            if ((contentData.acoesCronograma && contentData.acoesCronograma.length > 0) || (data.acoesCronograma && data.acoesCronograma.length > 0)) {
                setAcoesCronograma(contentData.acoesCronograma || data.acoesCronograma);
            }

            if ((contentData.motivosLinha && contentData.motivosLinha.length > 0) || (data.motivosLinha && data.motivosLinha.length > 0)) {
                setMotivosLinha(contentData.motivosLinha || data.motivosLinha);
            }

            if (contentData.motivosPorLinha || data.motivosPorLinha) {
                setMotivosPorLinha(contentData.motivosPorLinha || data.motivosPorLinha);
            }

            if ((contentData.embasamentosBiomecanicos && contentData.embasamentosBiomecanicos.length > 0) || (data.embasamentosBiomecanicos && data.embasamentosBiomecanicos.length > 0)) {
                setEmbasamentosBiomecanicos(contentData.embasamentosBiomecanicos || data.embasamentosBiomecanicos);
            }
            if (data.embasamentosMobiliarioEquipamento && data.embasamentosMobiliarioEquipamento.length > 0) {
                setEmbasamentosMobiliarioEquipamento(data.embasamentosMobiliarioEquipamento);
                
            }

            if ((contentData.embasamentosOrganizacionais && contentData.embasamentosOrganizacionais.length > 0) || (data.embasamentosOrganizacionais && data.embasamentosOrganizacionais.length > 0)) {
                setEmbasamentosOrganizacionais(contentData.embasamentosOrganizacionais || data.embasamentosOrganizacionais);
            }

            if ((contentData.embasamentosAmbientais && contentData.embasamentosAmbientais.length > 0) || (data.embasamentosAmbientais && data.embasamentosAmbientais.length > 0)) {
                setEmbasamentosAmbientais(contentData.embasamentosAmbientais || data.embasamentosAmbientais);
            }

            // Carregar classificações e observações ambientais, se existirem
            if (Array.isArray((data as any).classificacoesAmbientais) || Array.isArray((contentData as any).classificacoesAmbientais)) {
                const src = (data as any).classificacoesAmbientais || (contentData as any).classificacoesAmbientais;
                setClassificacoesAmbientais(src);
            } else if ((data as any).detalhesLinhasAmbientais || (contentData as any).detalhesLinhasAmbientais) {
                const det = (data as any).detalhesLinhasAmbientais || (contentData as any).detalhesLinhasAmbientais;
                const cls = [det.ambientais_0?.classificacao || '', det.ambientais_1?.classificacao || '', det.ambientais_2?.classificacao || ''];
                setClassificacoesAmbientais(cls);
            }

            if (Array.isArray((data as any).observacoesAmbientais) || Array.isArray((contentData as any).observacoesAmbientais)) {
                const src = (data as any).observacoesAmbientais || (contentData as any).observacoesAmbientais;
                setObservacoesAmbientais(src);
            } else if ((data as any).detalhesLinhasAmbientais || (contentData as any).detalhesLinhasAmbientais) {
                const det = (data as any).detalhesLinhasAmbientais || (contentData as any).detalhesLinhasAmbientais;
                const obs = [det.ambientais_0?.observacoes || '', det.ambientais_1?.observacoes || '', det.ambientais_2?.observacoes || ''];
                setObservacoesAmbientais(obs);
            }

            // Carregar classificações/observações para Biomecânicos
            if (Array.isArray((data as any).classificacoesBiomecanicos) || Array.isArray((contentData as any).classificacoesBiomecanicos)) {
                const src = ((data as any).classificacoesBiomecanicos || (contentData as any).classificacoesBiomecanicos || []).map((v: any) => (v ?? '')).slice();
                setClassificacoesBiomecanicos(src);
            } else if ((data as any).detalhesLinhasBiomecanicos || (contentData as any).detalhesLinhasBiomecanicos) {
                const det = (data as any).detalhesLinhasBiomecanicos || (contentData as any).detalhesLinhasBiomecanicos;
                const arr: string[] = [];
                const obs: string[] = [];
                Object.keys(det).forEach((k) => {
                    const m = k.match(/_(\d+)$/);
                    const i = m ? parseInt(m[1], 10) : -1;
                    if (i >= 0) {
                        arr[i] = (det[k]?.classificacao ?? '') || '';
                        obs[i] = (det[k]?.observacoes ?? '') || '';
                    }
                });
                setClassificacoesBiomecanicos(arr);
                setObservacoesBiomecanicos(obs);
            }

            // Carregar classificações/observações para Organizacionais
            if (Array.isArray((data as any).classificacoesOrganizacionais) || Array.isArray((contentData as any).classificacoesOrganizacionais)) {
                const src = ((data as any).classificacoesOrganizacionais || (contentData as any).classificacoesOrganizacionais || []).map((v: any) => (v ?? '')).slice();
                setClassificacoesOrganizacionais(src);
            } else if ((data as any).detalhesLinhasOrganizacionais || (contentData as any).detalhesLinhasOrganizacionais) {
                const det = (data as any).detalhesLinhasOrganizacionais || (contentData as any).detalhesLinhasOrganizacionais;
                const arr: string[] = [];
                const obs: string[] = [];
                Object.keys(det).forEach((k) => {
                    const m = k.match(/_(\d+)$/);
                    const i = m ? parseInt(m[1], 10) : -1;
                    if (i >= 0) {
                        arr[i] = (det[k]?.classificacao ?? '') || '';
                        obs[i] = (det[k]?.observacoes ?? '') || '';
                    }
                });
                setClassificacoesOrganizacionais(arr);
                setObservacoesOrganizacionais(obs);
            }

            // Carregar classificações/observações para Psicossociais
            if (Array.isArray((data as any).classificacoesPsicossociais) || Array.isArray((contentData as any).classificacoesPsicossociais)) {
                const src = ((data as any).classificacoesPsicossociais || (contentData as any).classificacoesPsicossociais || []).map((v: any) => (v ?? '')).slice();
                setClassificacoesPsicossociais(src);
            } else if ((data as any).detalhesLinhasPsicossociais || (contentData as any).detalhesLinhasPsicossociais) {
                const det = (data as any).detalhesLinhasPsicossociais || (contentData as any).detalhesLinhasPsicossociais;
                const arr: string[] = [];
                const obs: string[] = [];
                Object.keys(det).forEach((k) => {
                    const m = k.match(/_(\d+)$/);
                    const i = m ? parseInt(m[1], 10) : -1;
                    if (i >= 0) {
                        arr[i] = (det[k]?.classificacao ?? '') || '';
                        obs[i] = (det[k]?.observacoes ?? '') || '';
                    }
                });
                setClassificacoesPsicossociais(arr);
                setObservacoesPsicossociais(obs);
            }

            // Carregar classificações/observações para Mobiliário
            if (Array.isArray((data as any).classificacoesMobiliario) || Array.isArray((contentData as any).classificacoesMobiliario)) {
                const src = ((data as any).classificacoesMobiliario || (contentData as any).classificacoesMobiliario || []).map((v: any) => (v ?? '')).slice();
                setClassificacoesMobiliario(src);
            } else if ((data as any).detalhesLinhasMobiliario || (contentData as any).detalhesLinhasMobiliario) {
                const det = (data as any).detalhesLinhasMobiliario || (contentData as any).detalhesLinhasMobiliario;
                const arr: string[] = [];
                const obs: string[] = [];
                Object.keys(det).forEach((k) => {
                    const m = k.match(/_(\d+)$/);
                    const i = m ? parseInt(m[1], 10) : -1;
                    if (i >= 0) {
                        arr[i] = (det[k]?.classificacao ?? '') || '';
                        obs[i] = (det[k]?.observacoes ?? '') || '';
                    }
                });
                setClassificacoesMobiliario(arr);
                setObservacoesMobiliario(obs);
            }

            if ((contentData.embasamentosPsicossociais && contentData.embasamentosPsicossociais.length > 0) || (data.embasamentosPsicossociais && data.embasamentosPsicossociais.length > 0)) {
                setEmbasamentosPsicossociais(contentData.embasamentosPsicossociais || data.embasamentosPsicossociais);
            }

            if (data.openAccordions) {
                setOpenAccordions(data.openAccordions);
            }

            // Carregar dados da imagem da logo da empresa
            if (data.logoEmpresa && data.logoEmpresa.imageData) {
                setLogoEmpresa(data.logoEmpresa.imageData);
                // Recriar o objeto File se possível (para mostrar informações)
                if (data.logoEmpresa.fileName && data.logoEmpresa.fileSize && data.logoEmpresa.fileType) {
                    // Criar um objeto File simulado para mostrar as informações
                    const fileInfo = {
                        name: data.logoEmpresa.fileName,
                        size: data.logoEmpresa.fileSize,
                        type: data.logoEmpresa.fileType
                    } as File;
                    setLogoEmpresaFile(fileInfo);
                }
            }

            // Carregar imagens do posto de trabalho
            if (data.imagensPostoTrabalho) {
                setImagensPostoTrabalho(data.imagensPostoTrabalho);
            }

        } else if (location.state) {
            const data = location.state;
            setFormData((prev: any) => ({
                ...prev,
                // Identificação da Empresa
                nomeEmpresa: data.nomeEmpresa || prev.nomeEmpresa,
                cnpj: data.cnpj || prev.cnpj,
                endereco: data.endereco || prev.endereco,
                cnae: data.cnae || prev.cnae,
                // Informações Gerais
                cidade: data.cidade || prev.cidade,
                dataLaudo: data.dataLaudo || prev.dataLaudo,
            }));
        }
    }, [location.state, location.pathname]);

    const [setores, setSetores] = useState<Setor[]>([
        {
            id: '1',
            unidade: '',
            setor: '',
            funcoes: '',
            colaboradores: '',
            tarefaReal: ''
        }
    ]);

    const [riscoseSolucoes, setRiscoseSolucoes] = useState<RiscoSolucao[]>([
        {
            id: '1',
            risco: '',
            classificacao: '',
            solucao: '',
            prazo: '',
            gravidade: '',
            probabilidade: '',
            nivelRisco: ''
        }
    ]);

    const [acoesCronograma, setAcoesCronograma] = useState<AcaoCronograma[]>([
        {
            id: '1',
            acao: '',
            trimestre1: false,
            trimestre2: false,
            trimestre3: false,
            trimestre4: false,
            trimestre5: false,
            trimestre6: false
        }
    ]);

    const [openAccordions, setOpenAccordions] = useState({
        fatoresBiomecanicos: false,
        mobiliarioEquipamento: false,
        fatoresOrganizacionais: false,
        fatoresAmbientais: false,
        fatoresPsicossociais: false,
        treinamentos: false,
        mobiliarioEquipamentos: false,
        pausasGinastica: false,
        aspectosOrganizacionais: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [laudoId, setLaudoId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [reportUpId, setReportUpId] = useState<string | null>(null);

    // Estados para upload de imagens
    const [logoEmpresa, setLogoEmpresa] = useState<string | null>(null);
    const [logoEmpresaFile, setLogoEmpresaFile] = useState<File | null>(null);

    // Estados para imagens do posto de trabalho (4 imagens)
    const [imagensPostoTrabalho, setImagensPostoTrabalho] = useState<{
        imagem1: { data: string | null; file: File | null };
        imagem2: { data: string | null; file: File | null };
        imagem3: { data: string | null; file: File | null };
        imagem4: { data: string | null; file: File | null };
    }>({
        imagem1: { data: null, file: null },
        imagem2: { data: null, file: null },
        imagem3: { data: null, file: null },
        imagem4: { data: null, file: null }
    });

    // Estados para Fatores Ambientais (classificação e observações por linha)
    const [classificacoesAmbientais, setClassificacoesAmbientais] = useState<string[]>(['', '', '']);
    const [observacoesAmbientais, setObservacoesAmbientais] = useState<string[]>(['', '', '']);

    // Estados para outras seções: Biomecânicos, Organizacionais, Mobiliário e Psicossociais
    const [classificacoesBiomecanicos, setClassificacoesBiomecanicos] = useState<string[]>(Array(14).fill(''));
    const [observacoesBiomecanicos, setObservacoesBiomecanicos] = useState<string[]>(Array(14).fill(''));

    const [classificacoesOrganizacionais, setClassificacoesOrganizacionais] = useState<string[]>(Array(6).fill(''));
    const [observacoesOrganizacionais, setObservacoesOrganizacionais] = useState<string[]>(Array(6).fill(''));

    const [classificacoesMobiliario, setClassificacoesMobiliario] = useState<string[]>(Array(6).fill(''));
    const [observacoesMobiliario, setObservacoesMobiliario] = useState<string[]>(Array(6).fill(''));

	const [classificacoesPsicossociais, setClassificacoesPsicossociais] = useState<string[]>(Array(38).fill(''));
	const [observacoesPsicossociais, setObservacoesPsicossociais] = useState<string[]>(Array(38).fill(''));

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para converter arquivo para base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Função para manipular upload da logo da empresa
    const handleLogoEmpresaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toastError('Formato de arquivo não suportado. Use JPG, PNG ou GIF.');
                return;
            }

            // Validar tamanho do arquivo (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toastError('Arquivo muito grande. Tamanho máximo: 5MB.');
                return;
            }

            try {
                const base64 = await convertToBase64(file);
                setLogoEmpresa(base64);
                setLogoEmpresaFile(file);
                toastSuccess('Logo da empresa carregada com sucesso!');
            } catch (error) {
                toastError('Erro ao processar a imagem.');
            }
        }
    };

    // Função para remover logo da empresa
    const handleRemoveLogoEmpresa = () => {
        setLogoEmpresa(null);
        setLogoEmpresaFile(null);
        // Limpar o input file
        const fileInput = document.getElementById('logoEmpresa') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
        toastSuccess('Logo da empresa removida.');
    };

    // Funções para manipular imagens do posto de trabalho
    const handleImagemPostoTrabalhoUpload = async (imagemKey: 'imagem1' | 'imagem2' | 'imagem3' | 'imagem4', event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toastError('Formato de arquivo não suportado. Use JPG, PNG ou GIF.');
                return;
            }

            // Validar tamanho do arquivo (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toastError('Arquivo muito grande. Tamanho máximo: 5MB.');
                return;
            }

            try {
                const base64 = await convertToBase64(file);
                setImagensPostoTrabalho(prev => ({
                    ...prev,
                    [imagemKey]: {
                        data: base64,
                        file: file
                    }
                }));
                toastSuccess(`Imagem ${imagemKey.replace('imagem', '')} carregada com sucesso!`);
            } catch (error) {
                toastError('Erro ao processar a imagem.');
            }
        }
    };

    // Função para remover imagem do posto de trabalho
    const handleRemoveImagemPostoTrabalho = (imagemKey: 'imagem1' | 'imagem2' | 'imagem3' | 'imagem4') => {
        setImagensPostoTrabalho(prev => ({
            ...prev,
            [imagemKey]: {
                data: null,
                file: null
            }
        }));

        // Limpar o input file
        const fileInput = document.getElementById(`imagemPosto${imagemKey.replace('imagem', '')}`) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        toastSuccess(`Imagem ${imagemKey.replace('imagem', '')} removida.`);
    };

    const handleSetorChange = (id: string, field: string, value: string) => {
        setSetores(prev => prev.map(setor =>
            setor.id === id ? { ...setor, [field]: value } : setor
        ));
    };

    const adicionarSetor = () => {
        const novoSetor: Setor = {
            id: Date.now().toString(),
            unidade: '',
            setor: '',
            funcoes: '',
            colaboradores: '',
            tarefaReal: ''
        };
        setSetores(prev => [...prev, novoSetor]);
    };

    const removerSetor = (id: string) => {
        if (setores.length > 1) {
            setSetores(prev => prev.filter(setor => setor.id !== id));
        }
    };

    // Funções para Riscos e Soluções (Seção 11)
    const handleRiscoSolucaoChange = (id: string, field: string, value: string) => {
        setRiscoseSolucoes(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));

        // Se o campo alterado for 'solucao' e há uma solução selecionada, adicionar ao cronograma
        if (field === 'solucao' && value.trim() !== '') {
            adicionarSolucaoAoCronograma(value);
        }
    };

    const adicionarRiscoSolucao = () => {
        const novoRisco: RiscoSolucao = {
            id: Date.now().toString(),
            risco: '',
            classificacao: '',
            solucao: '',
            prazo: '',
            gravidade: '',
            probabilidade: '',
            nivelRisco: ''
        };
        setRiscoseSolucoes(prev => [...prev, novoRisco]);
    };

    const removerRiscoSolucao = (id: string) => {
        if (riscoseSolucoes.length > 1) {
            setRiscoseSolucoes(prev => prev.filter(item => item.id !== id));
        }
    };

    // Funções para Cronograma de Ações (Seção 14)
    const handleAcaoCronogramaChange = (id: string, field: string, value: string | boolean) => {
        setAcoesCronograma(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const adicionarAcaoCronograma = () => {
        const novaAcao: AcaoCronograma = {
            id: Date.now().toString(),
            acao: '',
            trimestre1: false,
            trimestre2: false,
            trimestre3: false,
            trimestre4: false,
            trimestre5: false,
            trimestre6: false
        };
        setAcoesCronograma(prev => [...prev, novaAcao]);
    };

    const removerAcaoCronograma = (id: string) => {
        if (acoesCronograma.length > 1) {
            setAcoesCronograma(prev => prev.filter(item => item.id !== id));
        }
    };

    // Função para adicionar solução ao cronograma automaticamente
    const adicionarSolucaoAoCronograma = (solucao: string) => {
        // Verificar se a solução já existe no cronograma
        const solucaoExiste = acoesCronograma.some(acao => acao.acao === solucao);

        if (!solucaoExiste && solucao.trim() !== '') {
            const novaAcao: AcaoCronograma = {
                id: Date.now().toString(),
                acao: solucao,
                trimestre1: false,
                trimestre2: false,
                trimestre3: false,
                trimestre4: false,
                trimestre5: false,
                trimestre6: false
            };
            setAcoesCronograma(prev => [...prev, novaAcao]);
        }
    };

    // Helpers para motivos por linha (Seção 7)
    const motivosValue = (key: string) => motivosPorLinha[key] || [];
    const handleMotivos = (key: string) => (newValue: any) => {
        setMotivosPorLinha(prev => {
            const next = newValue ? [...newValue] : [];

            return {
                ...prev,
                [key]: next
            };
        });
    };

    // Helpers para atualizar/ler classificação e observação por chave (ex: "biomecanicos_3")
    const setClassificacaoPorKey = (key: string, value: string) => {
        const match = key.match(/_(\d+)$/);
        const idx = match ? parseInt(match[1], 10) : -1;
        if (idx < 0) return;

        if (key.startsWith('biomecanicos_')) {
            setClassificacoesBiomecanicos(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        } else if (key.startsWith('organizacionais_')) {
            setClassificacoesOrganizacionais(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        } else if (key.startsWith('mobiliario_')) {
            setClassificacoesMobiliario(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        } else if (key.startsWith('psicossociais_')) {
            setClassificacoesPsicossociais(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        }
    };

    const getClassificacaoPorKey = (key: string): string => {
        const match = key.match(/_(\d+)$/);
        const idx = match ? parseInt(match[1], 10) : -1;
        if (idx < 0) return '';
        if (key.startsWith('biomecanicos_')) {
            return classificacoesBiomecanicos[idx] || '';
        } else if (key.startsWith('organizacionais_')) {
            return classificacoesOrganizacionais[idx] || '';
        } else if (key.startsWith('mobiliario_')) {
            return classificacoesMobiliario[idx] || '';
        } else if (key.startsWith('psicossociais_')) {
            return classificacoesPsicossociais[idx] || '';
        }
        return '';
    };

    const setObservacaoPorKey = (key: string, value: string) => {
        const match = key.match(/_(\d+)$/);
        const idx = match ? parseInt(match[1], 10) : -1;
        if (idx < 0) return;
        if (key.startsWith('biomecanicos_')) {
            setObservacoesBiomecanicos(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        } else if (key.startsWith('organizacionais_')) {
            setObservacoesOrganizacionais(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        } else if (key.startsWith('mobiliario_')) {
            setObservacoesMobiliario(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        } else if (key.startsWith('psicossociais_')) {
            setObservacoesPsicossociais(prev => {
                const next = [...prev];
                if (idx >= next.length) next.length = idx + 1;
                next[idx] = value || '';
                return next;
            });
        }
    };

    const getObservacaoPorKey = (key: string): string => {
        const match = key.match(/_(\d+)$/);
        const idx = match ? parseInt(match[1], 10) : -1;
        if (idx < 0) return '';
        if (key.startsWith('biomecanicos_')) {
            return observacoesBiomecanicos[idx] || '';
        } else if (key.startsWith('organizacionais_')) {
            return observacoesOrganizacionais[idx] || '';
        } else if (key.startsWith('mobiliario_')) {
            return observacoesMobiliario[idx] || '';
        } else if (key.startsWith('psicossociais_')) {
            return observacoesPsicossociais[idx] || '';
        }
        return '';
    };

    // Ao classificar uma linha, além de salvar no resumo, também persistimos no array correspondente
    const handleClassificacaoChange = (key: string, value: string) => {
        // Atualiza o estado específico da seção (biomecânicos/organizacionais/psicossociais)
        setClassificacaoPorKey(key, value);

        // Só adiciona à tabela se tiver uma classificação válida (Baixo, Médio ou Alto)
        const classificacoesValidas = ['baixo', 'medio', 'alto'];
        if (!value || value === '' || !classificacoesValidas.includes(value.toLowerCase())) {
            return;
        }

        const motivos = motivosPorLinha[key] || [];
        if (!motivos.length) {
            return;
        }

        setRiscoseSolucoes(current => {
            const existingRisks = new Set(current.map(r => r.risco));
            const novos = motivos
                .filter((o: any) => !existingRisks.has(o.label || o.value))
                .map((o: any) => ({
                    id: Date.now().toString() + Math.random().toString(36).slice(2),
                    risco: o.label || o.value,
                    classificacao: value.toLowerCase(), // Normaliza para minúsculo
                    solucao: '',
                    prazo: '',
                    gravidade: '',
                    probabilidade: '',
                    nivelRisco: ''
                }));
            return novos.length ? [...current, ...novos] : current;
        });
    };

    // Buscar CNAE a partir do CNPJ via BrasilAPI
    const sanitizeDigits = (s: string) => (s || '').replace(/\D/g, '');
    const handleCnpjBlur = async () => {
        try {
            const cnpjDigits = sanitizeDigits(formData.cnpj);
            if (cnpjDigits.length !== 14) return;
            const resp = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpjDigits}`);
            const cnae = resp?.data?.cnae_fiscal;
            if (cnae) {
                setFormData(prev => ({ ...prev, cnae: String(cnae) }));
            }
        } catch (e) {
            // Falha silenciosa ao buscar CNAE pelo CNPJ
        }
    };

    const handleSave = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            // Montar detalhes por linha para fatores ambientais
            const detalhesLinhasAmbientais = {
                ambientais_0: {
                    embasamento: embasamentosAmbientais?.[0] || '',
                    classificacao: classificacoesAmbientais?.[0] || '',
                    observacoes: observacoesAmbientais?.[0] || ''
                },
                ambientais_1: {
                    embasamento: embasamentosAmbientais?.[1] || '',
                    classificacao: classificacoesAmbientais?.[1] || '',
                    observacoes: observacoesAmbientais?.[1] || ''
                },
                ambientais_2: {
                    embasamento: embasamentosAmbientais?.[2] || '',
                    classificacao: classificacoesAmbientais?.[2] || '',
                    observacoes: observacoesAmbientais?.[2] || ''
                }
            };

            // Montar detalhes por linha para fatores biomecânicos
            const detalhesLinhasBiomecanicos: Record<string, { classificacao: string; observacoes: string }> = {};
            classificacoesBiomecanicos.forEach((cls, idx) => {
                detalhesLinhasBiomecanicos[`biomecanicos_${idx}`] = {
                    classificacao: cls || '',
                    observacoes: observacoesBiomecanicos?.[idx] || ''
                };
            });

            // Montar detalhes por linha para fatores organizacionais
            const detalhesLinhasOrganizacionais: Record<string, { classificacao: string; observacoes: string }> = {};
            classificacoesOrganizacionais.forEach((cls, idx) => {
                detalhesLinhasOrganizacionais[`organizacionais_${idx}`] = {
                    classificacao: cls || '',
                    observacoes: observacoesOrganizacionais?.[idx] || ''
                };
            });

            // Montar detalhes por linha para fatores psicossociais
            const detalhesLinhasPsicossociais: Record<string, { classificacao: string; observacoes: string }> = {};
            classificacoesPsicossociais.forEach((cls, idx) => {
                detalhesLinhasPsicossociais[`psicossociais_${idx}`] = {
                    classificacao: cls || '',
                    observacoes: observacoesPsicossociais?.[idx] || ''
                };
            });

            // Montar detalhes por linha para Mobiliário
            const detalhesLinhasMobiliario: Record<string, { classificacao: string; observacoes: string }> = {};
            classificacoesMobiliario.forEach((cls, idx) => {
                detalhesLinhasMobiliario[`mobiliario_${idx}`] = {
                    classificacao: cls || '',
                    observacoes: observacoesMobiliario?.[idx] || ''
                };
            });

            // Coletar todos os dados do formulário
            const conteudoCompleto = {
                formData,
                setores,
                riscoseSolucoes,
                acoesCronograma,
                motivosLinha,
                motivosPorLinha,
                embasamentosBiomecanicos,
                embasamentosMobiliarioEquipamento,
                embasamentosOrganizacionais,
                embasamentosAmbientais,
                embasamentosPsicossociais,
                classificacoesAmbientais,
                observacoesAmbientais,
                detalhesLinhasAmbientais,
                // Novos agrupamentos de detalhes/classificações
                classificacoesBiomecanicos,
                observacoesBiomecanicos,
                detalhesLinhasBiomecanicos,
                classificacoesOrganizacionais,
                observacoesOrganizacionais,
                detalhesLinhasOrganizacionais,
                classificacoesPsicossociais,
                observacoesPsicossociais,
                detalhesLinhasPsicossociais,
                classificacoesMobiliario,
                observacoesMobiliario,
                detalhesLinhasMobiliario,
                openAccordions,
                // Dados da imagem da logo da empresa
                logoEmpresa: {
                    imageData: logoEmpresa, // base64 da imagem
                    fileName: logoEmpresaFile?.name || null,
                    fileSize: logoEmpresaFile?.size || null,
                    fileType: logoEmpresaFile?.type || null
                },
                // Dados das imagens do posto de trabalho
                imagensPostoTrabalho,
                timestamp: new Date().toISOString()
            };

            setores.forEach((setor, index) => {
                debugLog(`  Setor ${index + 1}:`, {
                    unidade: setor.unidade,
                    setor: setor.setor,
                    funcoes: setor.funcoes,
                    colaboradores: setor.colaboradores,
                    tarefaReal: setor.tarefaReal
                });
            });
            riscoseSolucoes.forEach((risco, index) => {
                debugLog(`  Risco ${index + 1}:`, {
                    risco: risco.risco,
                    classificacao: risco.classificacao,
                    solucao: risco.solucao,
                    prazo: risco.prazo
                });
            });
            acoesCronograma.forEach((acao, index) => {
                debugLog(`  Ação ${index + 1}:`, {
                    acao: acao.acao,
                    trimestres: {
                        t1: acao.trimestre1,
                        t2: acao.trimestre2,
                        t3: acao.trimestre3,
                        t4: acao.trimestre4,
                        t5: acao.trimestre5,
                        t6: acao.trimestre6
                    }
                });
            });

            Object.keys(motivosPorLinha).forEach(linha => {
                debugLog(`- Linha ${linha}:`, motivosPorLinha[linha]?.length || 0, 'motivos');
                debugLog(`  Motivos:`, motivosPorLinha[linha]?.map(m => m.label || m.value));
            });


            Object.keys(imagensPostoTrabalho).forEach(key => {
                const imagem = imagensPostoTrabalho[key as keyof typeof imagensPostoTrabalho];
                if (imagem.data) {

                }
            });
            // payload de envio (mantido inline na requisição)

            // Verificar se laudoId foi capturado
            if (!laudoId) {
                // Registra o erro de forma silenciosa e mostra toast para o usuário
                // (logs de console removidos para produção)
                toastError('ID do laudo não encontrado. Acesse através do botão "Criar Laudo" na lista de laudos.');
                return;
            }

            let response;

            if (isEditing && reportUpId) {
                response = await axios.patch(`${import.meta.env.VITE_API_URL}/report-up/${reportUpId}`, {
                    conteudo: conteudoCompleto
                });
                toastSuccess('AEP atualizado com sucesso! Redirecionando...');

            } else {

                response = await axios.post(`${import.meta.env.VITE_API_URL}/report-up`, {
                    laudo_id: laudoId,
                    conteudo: conteudoCompleto
                });
                toastSuccess('Dados do AEP salvos com sucesso! Redirecionando...');
            }

            if (response.status === 200 || response.status === 201) {
                // Aguardar um pouco para o usuário ver a mensagem de sucesso
                setTimeout(() => {
                    navigate('/app/laudos');
                }, 1500);
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || `Erro ao ${isEditing ? 'atualizar' : 'salvar'} dados do AEP. Tente novamente.`;
            toastError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    const toggleAccordion = (accordionKey: string) => {
        setOpenAccordions(prev => ({
            ...prev,
            [accordionKey]: !prev[accordionKey as keyof typeof prev]
        }));
    };

    const summaryItems = [
        { id: 'secao-1', label: '1. Identificação da Empresa', icon: Building2 },
        { id: 'secao-2', label: '2. Informações Gerais', icon: Info },
        { id: 'secao-3', label: '3. Demanda', icon: MessageSquare },
        { id: 'secao-4', label: '4. Objetivos da AEP', icon: Target },
        { id: 'secao-5', label: '5. Setores e Funções Avaliados', icon: Users },
        { id: 'secao-6', label: '6. Função(ões), Tarefa Prescrita e Tarefa Real', icon: BookText },
        { id: 'secao-7', label: '7. Referências Técnicas e Legais', icon: FileText },
        { id: 'secao-8', label: '8. Posto de Trabalho', icon: AlertTriangle },
        { id: 'secao-9', label: '9. Avaliação por Categoria de Perigos', icon: BarChart3 },
        { id: 'secao-10', label: '10. Tabela Resumo – Riscos x Soluções', icon: ClipboardList },
        { id: 'secao-11', label: '11. Matriz de Riscos Ergonômicos', icon: MapPin },
        { id: 'secao-12', label: '12. Recomendações Gerais', icon: Calendar },
        { id: 'secao-13', label: '13. Cronograma de Ações', icon: RotateCcw },
        { id: 'secao-14', label: '14. Encerramento', icon: UserCheck },
        { id: 'secao-15', label: '15. Responsável Técnico', icon: BookOpen },
        { id: 'secao-16', label: '16. Bibliografia Técnica', icon: BookOpen }
    ];

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar com Sumário */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Sumário
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    <nav className="space-y-1">
                        {summaryItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="w-full flex items-center px-2 py-1.5 text-xs text-black font-bold hover:bg-gray-100 rounded transition-colors duration-200 text-left"
                                >
                                    <IconComponent className="w-3 h-3 mr-2 flex-shrink-0 text-blue-600" />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-6">
                    {/* Header */}
                    <div className="bg-white p-6 border border-gray-200 rounded-lg mb-6">
                        {/* Título Principal */}
                        <div className="text-center border-b border-gray-200 pb-4 mb-6">
                            <h1 className="text-2xl font-bold text-blue-600 mb-2">
                                Avaliação Ergonômica Preliminar (AEP)
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Metodologia ErgonTech – Documento em Português (Brasil)
                            </p>
                            <div className="mt-3 space-y-2">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {laudoId ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✅ Laudo ID: {laudoId}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            ❌ Nenhum Laudo ID encontrado
                                        </span>
                                    )}

                                    {isEditing && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            🔄 Modo de Edição
                                        </span>
                                    )}

                                    {reportUpId && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            📝 AEP ID: {reportUpId.substring(0, 8)}...
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Informações da Empresa Prestadora - Fundo Azul */}
                        <div className="bg-[#EFF6FF] text-black p-6 rounded-lg mb-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-blue-600 mb-3">Empresa Prestadora do Serviço:</h3>
                                    <div className="space-y-1 text-sm text-black">
                                        <p><strong>Nome:</strong> Ergontech</p>
                                        <p><strong>CNPJ:</strong> 51.317.376/0001-65</p>
                                        <p><strong>E-mail:</strong> atendimento@ergontech.net</p>
                                        <p><strong>Site:</strong> www.ergontech.net</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-blue-600 mb-3">Contato:</h3>
                                    <div className="space-y-1 text-sm text-black">
                                        <p><strong>Telefone:</strong> (86) 99426-9136</p>
                                        <p><strong>Endereço:</strong> Rua Professora Elenir Costa Largo, Nº 4515</p>
                                        <p><strong>Bairro:</strong> Angelim</p>
                                        <p><strong>CEP:</strong> 64034-170</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 1. Identificação da Empresa */}
                    <div id="secao-1" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <Building2 className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                            Identificação da Empresa
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Empresa
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nome da empresa"
                                    value={formData.nomeEmpresa}
                                    onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CNPJ
                                </label>
                                <input
                                    type="text"
                                    placeholder="00.000.000/0000-00"
                                    value={formData.cnpj}
                                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                                    onBlur={handleCnpjBlur}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Endereço
                            </label>
                            <input
                                type="text"
                                placeholder="Endereço completo"
                                value={formData.endereco}
                                onChange={(e) => handleInputChange('endereco', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CNAE (Atividade principal)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Código CNAE"
                                    value={formData.cnae}
                                    onChange={(e) => handleInputChange('cnae', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grau de Risco
                                </label>
                                <select
                                    value={formData.grauRisco}
                                    onChange={(e) => handleInputChange('grauRisco', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">Selecione o grau</option>
                                    <option value="1">Grau 1</option>
                                    <option value="2">Grau 2</option>
                                    <option value="3">Grau 3</option>
                                    <option value="4">Grau 4</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Informações Gerais */}
                    <div id="secao-2" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <Info className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                            Informações Gerais
                        </h2>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cidade
                                </label>
                                <input
                                    type="text"
                                    placeholder="Cidade"
                                    value={formData.cidade}
                                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data do Laudo
                                </label>
                                <input
                                    type="date"
                                    value={formData.dataLaudo}
                                    onChange={(e) => handleInputChange('dataLaudo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Upload da Logo da Empresa */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo da Empresa
                                </label>
                                <p className="text-xs text-gray-500 mb-3">
                                    Formatos aceitos: JPG, PNG, GIF (máximo 5MB)
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                {/* Preview da imagem */}
                                <div className="flex-shrink-0">
                                    {logoEmpresa ? (
                                        <div className="relative">
                                            <img
                                                src={logoEmpresa}
                                                alt="Logo da empresa"
                                                className="w-24 h-24 object-contain border-2 border-gray-300 rounded-lg bg-gray-50"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveLogoEmpresa}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                title="Remover logo"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                            <span className="text-gray-400 text-xs text-center">
                                                Sem<br />logo
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Input de upload */}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="logoEmpresa"
                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                        onChange={handleLogoEmpresaUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="logoEmpresa"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        {logoEmpresa ? 'Alterar Logo' : 'Selecionar Logo'}
                                    </label>

                                    {logoEmpresaFile && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p><strong>Arquivo:</strong> {logoEmpresaFile.name}</p>
                                            <p><strong>Tamanho:</strong> {(logoEmpresaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Demanda */}
                    <div id="secao-3" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <MessageSquare className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                            Demanda
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título da Demanda (editável)
                            </label>
                            <input
                                type="text"
                                value={formData.tituloDemanda}
                                placeholder="Ex.: QUAL FOI O MOTIVO / OS MOTIVOS / DO PEDIDO DA AEP"
                                onChange={(e) => handleInputChange('tituloDemanda', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texto Base (editável)
                            </label>
                            <textarea
                                rows={6}
                                value={formData.textoDemanda}
                                onChange={(e) => handleInputChange('textoDemanda', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                placeholder="Descreva a demanda..."
                            />
                        </div>
                    </div>

                    {/* 4. Objetivos da AEP */}
                    <div id="secao-4" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <Target className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
                            Objetivos da AEP
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título dos Objetivos (editável)
                            </label>
                            <input
                                type="text"
                                value={formData.tituloObjetivos}
                                onChange={(e) => handleInputChange('tituloObjetivos', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Ex.: DEPENDE DO MOTIVO [DEMANDA] DA REALIZAÇÃO DA AEP"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texto Base (editável)
                            </label>
                            <textarea
                                rows={6}
                                value={formData.textoObjetivos}
                                onChange={(e) => handleInputChange('textoObjetivos', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                placeholder="Descreva os objetivos..."
                            />
                        </div>
                    </div>

                    {/* 5. Setores e Funções Avaliados */}
                    <div id="secao-5" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <Users className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">5</span>
                            Setores e Funções Avaliados
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Unidade Operacional / GHE
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Setor
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Funções
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Nº Colaboradores
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {setores.map((setor) => (
                                        <tr key={setor.id}>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    type="text"
                                                    placeholder="Unidade"
                                                    value={setor.unidade}
                                                    onChange={(e) => handleSetorChange(setor.id, 'unidade', e.target.value)}
                                                    className="w-full px-2 py-1 border-0 focus:ring-0 focus:outline-none"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    type="text"
                                                    placeholder="Setor"
                                                    value={setor.setor}
                                                    onChange={(e) => handleSetorChange(setor.id, 'setor', e.target.value)}
                                                    className="w-full px-2 py-1 border-0 focus:ring-0 focus:outline-none"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    type="text"
                                                    placeholder="Funções"
                                                    value={setor.funcoes}
                                                    onChange={(e) => handleSetorChange(setor.id, 'funcoes', e.target.value)}
                                                    className="w-full px-2 py-1 border-0 focus:ring-0 focus:outline-none"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    type="text"
                                                    placeholder="Nº"
                                                    value={setor.colaboradores}
                                                    onChange={(e) => handleSetorChange(setor.id, 'colaboradores', e.target.value)}
                                                    className="w-full px-2 py-1 border-0 focus:ring-0 focus:outline-none"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <button
                                                    onClick={() => removerSetor(setor.id)}
                                                    disabled={setores.length === 1}
                                                    className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            onClick={adicionarSetor}
                            className="mt-4 flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Setor
                        </button>
                    </div>

                    {/* 6. Função(ões), Tarefa Prescrita e Tarefa Real */}
                    <div id="secao-6" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <ClipboardList className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full px-2 h-6 flex items-center justify-center text-xs font-bold mr-3">6</span>
                            Função(ões), Tarefa Prescrita e Tarefa Real
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">

                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Função(ões)</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Tarefa Prescrita</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Tarefa Real</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {setores.map((setor) => (
                                        <tr key={setor.id}>
                                            <td className="border border-gray-300 p-2 text-sm text-gray-800">{setor.funcoes || '-'}</td>
                                            <td className="border border-gray-300 p-2">
                                                <textarea
                                                    rows={2}
                                                    readOnly
                                                    value={setor.setor}
                                                    className="w-full px-2 py-1 border-0"
                                                    placeholder="Tarefa prescrita (auto a partir das funções)"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                <textarea
                                                    rows={2}
                                                    value={setor.tarefaReal || ''}
                                                    onChange={(e) => handleSetorChange(setor.id, 'tarefaReal', e.target.value)}
                                                    className="w-full px-2 py-1 border-0"
                                                    placeholder="Descreva a tarefa real observada"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 7. Referências Técnicas e Legais */}
                    <div id="secao-7" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <BookText className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">7</span>
                            Referências Técnicas e Legais
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texto Base (editável)
                            </label>
                            <textarea
                                rows={8}
                                value={formData.referenciasTecnicas}
                                onChange={(e) => handleInputChange('referenciasTecnicas', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                placeholder="Inclua as leis, normas, técnicas ou ferramentas que você utilizou para embasar os resultados da sua AEP."
                            />
                        </div>

                        <p className="text-sm text-gray-600 mt-2">
                            <strong>Observação:</strong> Inclua as leis, normas, técnicas ou ferramentas que você utilizou para embasar os resultados da sua AEP.
                        </p>
                    </div>

                    {/* 8. Posto de Trabalho */}
                    <div id="secao-8" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <FileText className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">8</span>
                            Posto de Trabalho
                        </h2>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Adicione até 4 imagens do posto de trabalho para documentação visual da avaliação ergonômica.
                            </p>
                            <p className="text-xs text-gray-500 mb-6">
                                Formatos aceitos: JPG, PNG, GIF (máximo 5MB por imagem)
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Imagem 1 */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Imagem 1</h3>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {imagensPostoTrabalho.imagem1.data ? (
                                            <div className="relative">
                                                <img
                                                    src={imagensPostoTrabalho.imagem1.data}
                                                    alt="Posto de trabalho - Imagem 1"
                                                    className="w-24 h-24 object-cover border-2 border-gray-300 rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImagemPostoTrabalho('imagem1')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    title="Remover imagem"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                                <span className="text-gray-400 text-xs text-center">
                                                    Sem<br />imagem
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="imagemPosto1"
                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                            onChange={(e) => handleImagemPostoTrabalhoUpload('imagem1', e)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="imagemPosto1"
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 cursor-pointer transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            {imagensPostoTrabalho.imagem1.data ? 'Alterar' : 'Selecionar'}
                                        </label>
                                        {imagensPostoTrabalho.imagem1.file && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                <p><strong>Arquivo:</strong> {imagensPostoTrabalho.imagem1.file.name}</p>
                                                <p><strong>Tamanho:</strong> {(imagensPostoTrabalho.imagem1.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Imagem 2 */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Imagem 2</h3>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {imagensPostoTrabalho.imagem2.data ? (
                                            <div className="relative">
                                                <img
                                                    src={imagensPostoTrabalho.imagem2.data}
                                                    alt="Posto de trabalho - Imagem 2"
                                                    className="w-24 h-24 object-cover border-2 border-gray-300 rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImagemPostoTrabalho('imagem2')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    title="Remover imagem"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                                <span className="text-gray-400 text-xs text-center">
                                                    Sem<br />imagem
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="imagemPosto2"
                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                            onChange={(e) => handleImagemPostoTrabalhoUpload('imagem2', e)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="imagemPosto2"
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 cursor-pointer transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            {imagensPostoTrabalho.imagem2.data ? 'Alterar' : 'Selecionar'}
                                        </label>
                                        {imagensPostoTrabalho.imagem2.file && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                <p><strong>Arquivo:</strong> {imagensPostoTrabalho.imagem2.file.name}</p>
                                                <p><strong>Tamanho:</strong> {(imagensPostoTrabalho.imagem2.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Imagem 3 */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Imagem 3</h3>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {imagensPostoTrabalho.imagem3.data ? (
                                            <div className="relative">
                                                <img
                                                    src={imagensPostoTrabalho.imagem3.data}
                                                    alt="Posto de trabalho - Imagem 3"
                                                    className="w-24 h-24 object-cover border-2 border-gray-300 rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImagemPostoTrabalho('imagem3')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    title="Remover imagem"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                                <span className="text-gray-400 text-xs text-center">
                                                    Sem<br />imagem
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="imagemPosto3"
                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                            onChange={(e) => handleImagemPostoTrabalhoUpload('imagem3', e)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="imagemPosto3"
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 cursor-pointer transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            {imagensPostoTrabalho.imagem3.data ? 'Alterar' : 'Selecionar'}
                                        </label>
                                        {imagensPostoTrabalho.imagem3.file && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                <p><strong>Arquivo:</strong> {imagensPostoTrabalho.imagem3.file.name}</p>
                                                <p><strong>Tamanho:</strong> {(imagensPostoTrabalho.imagem3.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Imagem 4 */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Imagem 4</h3>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {imagensPostoTrabalho.imagem4.data ? (
                                            <div className="relative">
                                                <img
                                                    src={imagensPostoTrabalho.imagem4.data}
                                                    alt="Posto de trabalho - Imagem 4"
                                                    className="w-24 h-24 object-cover border-2 border-gray-300 rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImagemPostoTrabalho('imagem4')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    title="Remover imagem"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                                <span className="text-gray-400 text-xs text-center">
                                                    Sem<br />imagem
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="imagemPosto4"
                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                            onChange={(e) => handleImagemPostoTrabalhoUpload('imagem4', e)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="imagemPosto4"
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 cursor-pointer transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            {imagensPostoTrabalho.imagem4.data ? 'Alterar' : 'Selecionar'}
                                        </label>
                                        {imagensPostoTrabalho.imagem4.file && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                <p><strong>Arquivo:</strong> {imagensPostoTrabalho.imagem4.file.name}</p>
                                                <p><strong>Tamanho:</strong> {(imagensPostoTrabalho.imagem4.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 9. Avaliação por Categoria de Perigos */}
                    <div id="secao-9" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <AlertTriangle className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">9</span>
                            Avaliação por Categoria de Perigos
                        </h2>

                        <div className="space-y-2">
                            {/* Fatores Biomecânicos */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => toggleAccordion('fatoresBiomecanicos')}
                                    className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="font-medium text-gray-900">Fatores Biomecânicos</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.fatoresBiomecanicos ? 'rotate-180' : ''
                                        }`} />
                                </button>
                                {openAccordions.fatoresBiomecanicos && (
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Fator de Risco</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Entrevista/Motivo</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Embasamento</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Classificação</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Observações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Exigência de posturas incômodas ou pouco confortáveis por longos períodos (posturas estáticas)
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As atividades permitem a alternância de posturas e a movimentação corporal, não sendo identificada a permanência em posturas estáticas ou incômodas por períodos prolongados.', label: 'As atividades permitem a alternância de posturas e a movimentação corporal, não sendo identificada a permanência em posturas estáticas ou incômodas por períodos prolongados.' },

                                                                    { value: 'Identificada a permanência em postura estática (sentada ou em pé) por períodos que podem exceder o recomendado, porém com possibilidade de pausas informais e breves alternâncias, resultando em um risco de nível baixo.', label: 'Identificada a permanência em postura estática (sentada ou em pé) por períodos que podem exceder o recomendado, porém com possibilidade de pausas informais e breves alternâncias, resultando em um risco de nível baixo.' },

                                                                    { value: 'Constatada a exigência de manutenção de posturas estáticas e/ou incômodas (sentado, em pé, com torções) por longos períodos da jornada, sem pausas adequadas ou possibilidade de alternância, configurando risco ergonômico significativo.', label: 'Constatada a exigência de manutenção de posturas estáticas e/ou incômodas (sentado, em pé, com torções) por longos períodos da jornada, sem pausas adequadas ou possibilidade de alternância, configurando risco ergonômico significativo.' },

                                                                ]}
                                                                value={motivosValue('biomecanicos_0')}
                                                                onChange={handleMotivos('biomecanicos_0')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[0]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[0] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_0')} onChange={(e) => handleClassificacaoChange('biomecanicos_0', e.target.value)}>
                                                                <option value="">Classificação</option>
                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('biomecanicos_0')} onChange={(e) => setObservacaoPorKey('biomecanicos_0', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Levantamento e transporte manual de cargas ou volumes e/ou pega pobre	
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A dinâmica do trabalho promove a alternância natural entre as posturas sentada, em pé e a deambulação, prevenindo a permanência prolongada em qualquer uma delas.', label: 'A dinâmica do trabalho promove a alternância natural entre as posturas sentada, em pé e a deambulação, prevenindo a permanência prolongada em qualquer uma delas.' },
                                                                    { value: 'A atividade exige a permanência em pé ou sentado por períodos que podem exceder o ideal, mas a organização do trabalho permite pausas e a realização de outras tarefas que favorecem a alternância postural.', label: 'A atividade exige a permanência em pé ou sentado por períodos que podem exceder o ideal, mas a organização do trabalho permite pausas e a realização de outras tarefas que favorecem a alternância postural.' },
                                                                    { value: 'O trabalho confina o trabalhador à postura em pé ou sentada por longos períodos contínuos, ou exige deambulação constante sem pausas para descanso, elevando o risco de fadiga e distúrbios musculoesqueléticos.', label: 'O trabalho confina o trabalhador à postura em pé ou sentada por longos períodos contínuos, ou exige deambulação constante sem pausas para descanso, elevando o risco de fadiga e distúrbios musculoesqueléticos.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_1')}
                                                                onChange={handleMotivos('biomecanicos_1')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[1]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[1] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_1')} onChange={(e) => handleClassificacaoChange('biomecanicos_1', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('biomecanicos_1')} onChange={(e) => setObservacaoPorKey('biomecanicos_1', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Trabalho com esforço físico intenso
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As tarefas executadas demandam baixo esforço físico, com atividades classificadas como leves (conforme Escala de Borg ou similar) e sem sobrecarga para o sistema cardiovascular ou musculoesquelético.', label: 'As tarefas executadas demandam baixo esforço físico, com atividades classificadas como leves (conforme Escala de Borg ou similar) e sem sobrecarga para o sistema cardiovascular ou musculoesquelético.' },
                                                                    { value: 'O trabalho envolve esforço físico moderado de forma eventual, com períodos adequados de recuperação, não representando uma sobrecarga contínua para o trabalhador.', label: 'O trabalho envolve esforço físico moderado de forma eventual, com períodos adequados de recuperação, não representando uma sobrecarga contínua para o trabalhador.' },
                                                                    { value: 'A atividade exige esforço físico intenso de forma contínua ou frequente, com sobrecarga muscular significativa e risco elevado de fadiga e lesões musculoesqueléticas.', label: 'A atividade exige esforço físico intenso de forma contínua ou frequente, com sobrecarga muscular significativa e risco elevado de fadiga e lesões musculoesqueléticas.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_2')}
                                                                onChange={handleMotivos('biomecanicos_2')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[2]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[2] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_2')} onChange={(e) => handleClassificacaoChange('biomecanicos_2', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('organizacionais_0')} onChange={(e) => setObservacaoPorKey('organizacionais_0', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Levantamento e transporte manual de cargas ou volumes e/ou pega pobre
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As tarefas executadas não envolvem o levantamento ou transporte manual de cargas, ou, quando ocorrem, são com objetos de peso e volume insignificantes e com condições de pega seguras.', label: 'As tarefas executadas não envolvem o levantamento ou transporte manual de cargas, ou, quando ocorrem, são com objetos de peso e volume insignificantes e com condições de pega seguras.' },
                                                                    { value: 'Ocorre levantamento e transporte manual de cargas de forma eventual, com peso dentro dos limites aceitáveis para a população trabalhadora e condições de pega favoráveis. O risco é considerado baixo.', label: 'Ocorre levantamento e transporte manual de cargas de forma eventual, com peso dentro dos limites aceitáveis para a população trabalhadora e condições de pega favoráveis. O risco é considerado baixo.' },
                                                                    { value: 'Identificado levantamento e transporte manual de cargas com frequência, peso e/ou condições de pega (pobre/difícil) que excedem os limites recomendados (NIOSH, ISO 11228-1), gerando sobrecarga musculoesquelética e risco elevado.', label: 'Identificado levantamento e transporte manual de cargas com frequência, peso e/ou condições de pega (pobre/difícil) que excedem os limites recomendados (NIOSH, ISO 11228-1), gerando sobrecarga musculoesquelética e risco elevado.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_3')}
                                                                onChange={handleMotivos('biomecanicos_3')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[3]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[3] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_3')} onChange={(e) => handleClassificacaoChange('biomecanicos_3', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('organizacionais_1')} onChange={(e) => setObservacaoPorKey('organizacionais_1', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Frequente ação de puxar/empurrar cargas ou volumes
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As tarefas executadas não envolvem o levantamento ou transporte manual de cargas, ou, quando ocorrem, são com objetos de peso e volume insignificantes e com condições de pega seguras.', label: 'As tarefas executadas não envolvem o levantamento ou transporte manual de cargas, ou, quando ocorrem, são com objetos de peso e volume insignificantes e com condições de pega seguras.' },

                                                                    { value: 'As ações de puxar e/ou empurrar cargas ocorrem de forma esporádica, com esforço moderado e em distâncias curtas, utilizando equipamentos com manutenção adequada. O risco associado é baixo.', label: 'As ações de puxar e/ou empurrar cargas ocorrem de forma esporádica, com esforço moderado e em distâncias curtas, utilizando equipamentos com manutenção adequada. O risco associado é baixo.' },

                                                                    { value: 'Constatada a necessidade frequente de puxar e/ou empurrar cargas, exigindo esforço físico intenso devido ao peso, características do piso ou manutenção inadequada dos equipamentos, o que representa um risco ergonômico médio/alto.', label: 'Constatada a necessidade frequente de puxar e/ou empurrar cargas, exigindo esforço físico intenso devido ao peso, características do piso ou manutenção inadequada dos equipamentos, o que representa um risco ergonômico médio/alto.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_4')}
                                                                onChange={handleMotivos('biomecanicos_4')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[4]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[4] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_4')} onChange={(e) => handleClassificacaoChange('biomecanicos_4', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('organizacionais_2')} onChange={(e) => setObservacaoPorKey('organizacionais_2', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Frequente execução de movimentos repetitivos (incluindo digitação)
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A dinâmica da atividade promove a diversidade de movimentos e tarefas, não havendo a execução de ciclos de trabalho repetitivos para os membros superiores.', label: 'A dinâmica da atividade promove a diversidade de movimentos e tarefas, não havendo a execução de ciclos de trabalho repetitivos para os membros superiores.' },
                                                                    { value: 'Identificada a presença de movimentos repetitivos (ex: digitação), porém com tempo de ciclo superior a 30 segundos ou com pausas suficientes que permitem a recuperação muscular, classificando o risco como baixo.', label: 'Identificada a presença de movimentos repetitivos (ex: digitação), porém com tempo de ciclo superior a 30 segundos ou com pausas suficientes que permitem a recuperação muscular, classificando o risco como baixo.' },
                                                                    { value: 'A tarefa exige a execução de movimentos repetitivos de membros superiores com alta frequência (ciclos curtos, <30s) e/ou por mais de 50% da jornada, sem pausas adequadas, configurando um risco significativo para LER/DORT.', label: 'A tarefa exige a execução de movimentos repetitivos de membros superiores com alta frequência (ciclos curtos, <30s) e/ou por mais de 50% da jornada, sem pausas adequadas, configurando um risco significativo para LER/DORT.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_5')}
                                                                onChange={handleMotivos('biomecanicos_5')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[5]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[5] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_5')} onChange={(e) => handleClassificacaoChange('biomecanicos_5', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('organizacionais_3')} onChange={(e) => setObservacaoPorKey('organizacionais_3', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Manuseio de ferramentas e/ou objetos pesados por períodos prolongados
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As ferramentas e objetos manuseados são leves e seu uso não é contínuo, não gerando sobrecarga estática nos membros superiores.', label: 'As ferramentas e objetos manuseados são leves e seu uso não é contínuo, não gerando sobrecarga estática nos membros superiores.' },

                                                                    { value: 'Ocorre o manuseio de ferramentas ou objetos com peso moderado, porém por curtos períodos e de forma não contínua, com pausas que previnem a fadiga muscular localizada. Risco baixo.', label: 'Ocorre o manuseio de ferramentas ou objetos com peso moderado, porém por curtos períodos e de forma não contínua, com pausas que previnem a fadiga muscular localizada. Risco baixo.' },

                                                                    { value: 'Verificado o manuseio de ferramentas ou objetos pesados por períodos prolongados, exigindo contração muscular estática e esforço contínuo dos membros superiores, o que representa um risco ergonômico elevado.', label: 'Verificado o manuseio de ferramentas ou objetos pesados por períodos prolongados, exigindo contração muscular estática e esforço contínuo dos membros superiores, o que representa um risco ergonômico elevado.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_6')}
                                                                onChange={handleMotivos('biomecanicos_6')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[6]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[6] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_6')} onChange={(e) => handleClassificacaoChange('biomecanicos_6', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('organizacionais_4')} onChange={(e) => setObservacaoPorKey('organizacionais_4', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Compressão de partes do corpo por superfícies rígidas ou com quinas
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Os postos de trabalho, ferramentas e mobiliário possuem superfícies com cantos arredondados e materiais adequados, não sendo identificados pontos de compressão mecânica sobre segmentos corporais.', label: 'Os postos de trabalho, ferramentas e mobiliário possuem superfícies com cantos arredondados e materiais adequados, não sendo identificados pontos de compressão mecânica sobre segmentos corporais.' },

                                                                    { value: 'Identificados pontos de contato do corpo com superfícies rígidas ou quinas vivas (ex: borda da mesa), porém o contato é breve e não contínuo, resultando em um risco baixo de lesão por compressão.', label: 'Identificados pontos de contato do corpo com superfícies rígidas ou quinas vivas (ex: borda da mesa), porém o contato é breve e não contínuo, resultando em um risco baixo de lesão por compressão.' },

                                                                    { value: 'Constatado apoio constante de segmentos corporais (punhos, antebraços) sobre superfícies com quinas vivas ou material rígido, gerando compressão mecânica contínua e risco de lesões em nervos e tecidos moles. ', label: 'Constatado apoio constante de segmentos corporais (punhos, antebraços) sobre superfícies com quinas vivas ou material rígido, gerando compressão mecânica contínua e risco de lesões em nervos e tecidos moles. ' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_7')}
                                                                onChange={handleMotivos('biomecanicos_7')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[7]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[7] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_7')} onChange={(e) => handleClassificacaoChange('biomecanicos_7', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('organizacionais_5')} onChange={(e) => setObservacaoPorKey('organizacionais_5', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Exigência de flexões de coluna vertebral frequentes
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O layout do posto de trabalho e a organização das tarefas permitem que as atividades sejam realizadas com a coluna em postura neutra, sem a necessidade de flexões ou torções vertebrais.', label: 'O layout do posto de trabalho e a organização das tarefas permitem que as atividades sejam realizadas com a coluna em postura neutra, sem a necessidade de flexões ou torções vertebrais.' },

                                                                    { value: 'Ocorre a necessidade de flexão da coluna vertebral de forma eventual e com angulação moderada para alcançar objetos, não sendo uma exigência constante da tarefa. O risco é considerado baixo.', label: 'Ocorre a necessidade de flexão da coluna vertebral de forma eventual e com angulação moderada para alcançar objetos, não sendo uma exigência constante da tarefa. O risco é considerado baixo.' },

                                                                    { value: 'A atividade exige flexões e/ou torções frequentes e/ou acentuadas da coluna vertebral para manuseio de materiais ou operação de equipamentos, gerando sobrecarga significativa na região lombar e dorsal.', label: 'A atividade exige flexões e/ou torções frequentes e/ou acentuadas da coluna vertebral para manuseio de materiais ou operação de equipamentos, gerando sobrecarga significativa na região lombar e dorsal.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_8')}
                                                                onChange={handleMotivos('biomecanicos_8')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[8]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[8] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_8')} onChange={(e) => handleClassificacaoChange('biomecanicos_8', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('biomecanicos_8')} onChange={(e) => setObservacaoPorKey('biomecanicos_8', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Uso frequente de pedais
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As atividades executadas não requerem o uso de pedais de acionamento.', label: 'As atividades executadas não requerem o uso de pedais de acionamento.' },

                                                                    { value: 'O uso de pedais é eventual e requer baixo esforço de acionamento, com o posto de trabalho permitindo um posicionamento adequado dos membros inferiores. O risco associado é baixo.', label: 'O uso de pedais é eventual e requer baixo esforço de acionamento, com o posto de trabalho permitindo um posicionamento adequado dos membros inferiores. O risco associado é baixo.' },

                                                                    { value: 'O acionamento de pedais é frequente e/ou exige força elevada, podendo levar a posturas inadequadas dos membros inferiores e sobrecarga muscular, configurando um risco médio/alto.', label: 'O acionamento de pedais é frequente e/ou exige força elevada, podendo levar a posturas inadequadas dos membros inferiores e sobrecarga muscular, configurando um risco médio/alto.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_9')}
                                                                onChange={handleMotivos('biomecanicos_9')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[9]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[9] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_9')} onChange={(e) => handleClassificacaoChange('biomecanicos_9', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Exigência de elevação frequentes de membros superiores
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As tarefas são executadas dentro da zona de alcance ideal (entre a altura da cintura e dos ombros), não havendo a necessidade de elevação dos membros superiores acima do nível dos ombros.', label: 'As tarefas são executadas dentro da zona de alcance ideal (entre a altura da cintura e dos ombros), não havendo a necessidade de elevação dos membros superiores acima do nível dos ombros.' },

                                                                    { value: 'Identificada a necessidade eventual de elevação dos braços acima do nível dos ombros para alcançar objetos de uso pouco frequente. A curta duração e baixa frequência da ação resultam em um risco baixo.', label: 'Identificada a necessidade eventual de elevação dos braços acima do nível dos ombros para alcançar objetos de uso pouco frequente. A curta duração e baixa frequência da ação resultam em um risco baixo.' },

                                                                    { value: 'Constatada a exigência de elevação frequente e/ou sustentada dos membros superiores acima da linha dos ombros, gerando sobrecarga na articulação do ombro e musculatura associada, o que representa um risco ergonômico elevado.', label: 'Constatada a exigência de elevação frequente e/ou sustentada dos membros superiores acima da linha dos ombros, gerando sobrecarga na articulação do ombro e musculatura associada, o que representa um risco ergonômico elevado.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_10')}
                                                                onChange={handleMotivos('biomecanicos_10')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[10]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[10] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_10')} onChange={(e) => handleClassificacaoChange('biomecanicos_10', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Exposição a vibração de corpo inteiro (por tempo prolongado)
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Não há exposição a fontes de vibração de corpo inteiro, como operação de veículos de grande porte ou plataformas vibratórias.', label: 'Não há exposição a fontes de vibração de corpo inteiro, como operação de veículos de grande porte ou plataformas vibratórias.' },

                                                                    { value: 'A exposição à VCI ocorre por curtos períodos e está abaixo do nível de ação definido pela NHO 09, não representando um risco significativo, mas um fator de atenção.', label: 'A exposição à VCI ocorre por curtos períodos e está abaixo do nível de ação definido pela NHO 09, não representando um risco significativo, mas um fator de atenção.' },

                                                                    { value: 'Identificada exposição à VCI de forma contínua e/ou com níveis que ultrapassam o limite de exposição definido em norma, configurando risco à saúde do trabalhador (ex: dores lombares).', label: 'Identificada exposição à VCI de forma contínua e/ou com níveis que ultrapassam o limite de exposição definido em norma, configurando risco à saúde do trabalhador (ex: dores lombares).' },

                                                                ]}
                                                                value={motivosValue('biomecanicos_11')}
                                                                onChange={handleMotivos('biomecanicos_11')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[11]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[11] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_11')} onChange={(e) => handleClassificacaoChange('biomecanicos_11', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Exposição a vibração localizada (por tempo prolongado)
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As atividades não envolvem o manuseio de ferramentas ou equipamentos que gerem vibração localizada nos membros superiores.', label: 'As atividades não envolvem o manuseio de ferramentas ou equipamentos que gerem vibração localizada nos membros superiores.' },

                                                                    { value: 'O manuseio de ferramentas vibratórias ocorre por curtos períodos, com níveis de vibração abaixo do nível de ação definido pela NHO 10, representando um fator de atenção, mas com risco baixo.', label: 'O manuseio de ferramentas vibratórias ocorre por curtos períodos, com níveis de vibração abaixo do nível de ação definido pela NHO 10, representando um fator de atenção, mas com risco baixo.' },

                                                                    { value: 'Constatada a exposição à vibração em mãos e braços por períodos prolongados e/ou com níveis que excedem o limite de exposição, representando risco para o desenvolvimento de desordens vasculares e neurológicas.', label: 'Constatada a exposição à vibração em mãos e braços por períodos prolongados e/ou com níveis que excedem o limite de exposição, representando risco para o desenvolvimento de desordens vasculares e neurológicas.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_12')}
                                                                onChange={handleMotivos('biomecanicos_12')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[12]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[12] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_12')} onChange={(e) => handleClassificacaoChange('biomecanicos_12', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Torções dos segmentos corporais
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O posto de trabalho é organizado para evitar a necessidade de torções de tronco, pescoço ou punhos, mantendo os itens de maior uso em posição frontal ao trabalhador.', label: 'O posto de trabalho é organizado para evitar a necessidade de torções de tronco, pescoço ou punhos, mantendo os itens de maior uso em posição frontal ao trabalhador.' },
                                                                    { value: 'Ocorrem torções de segmentos corporais (tronco, pescoço) de forma eventual e com pequena amplitude para visualização ou alcance de objetos, não sendo um requisito constante da tarefa. Risco baixo.', label: 'Ocorrem torções de segmentos corporais (tronco, pescoço) de forma eventual e com pequena amplitude para visualização ou alcance de objetos, não sendo um requisito constante da tarefa. Risco baixo.' },
                                                                    { value: 'A execução da tarefa exige torções frequentes e/ou de grande amplitude do tronco, pescoço ou punhos, gerando sobrecarga assimétrica nas articulações e músculos, o que configura um risco ergonômico significativo.', label: 'A execução da tarefa exige torções frequentes e/ou de grande amplitude do tronco, pescoço ou punhos, gerando sobrecarga assimétrica nas articulações e músculos, o que configura um risco ergonômico significativo.' }
                                                                ]}
                                                                value={motivosValue('biomecanicos_13')}
                                                                onChange={handleMotivos('biomecanicos_13')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosBiomecanicos[13]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosBiomecanicos];
                                                                    newArr[13] = e.target.value;
                                                                    setEmbasamentosBiomecanicos(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('biomecanicos_13')} onChange={(e) => handleClassificacaoChange('biomecanicos_13', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobiliário e Equipamento */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => toggleAccordion('mobiliarioEquipamento')}
                                    className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="font-medium text-gray-900">Mobiliário e Equipamento</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.mobiliarioEquipamento ? 'rotate-180' : ''
                                        }`} />
                                </button>
                                {openAccordions.mobiliarioEquipamento && (
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Fator de Risco</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Entrevista/Motivo</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Embasamento</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Classificação</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Observações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Posto de trabalho improvisado
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O posto de trabalho é projetado e adequado para a função, com mobiliário e equipamentos específicos para a tarefa, atendendo às normas de ergonomia.', label: 'O posto de trabalho é projetado e adequado para a função, com mobiliário e equipamentos específicos para a tarefa, atendendo às normas de ergonomia.' },

                                                                    { value: 'O posto de trabalho apresenta pequenas inadequações ou adaptações que não comprometem a segurança e o conforto do trabalhador de forma significativa.', label: 'O posto de trabalho apresenta pequenas inadequações ou adaptações que não comprometem a segurança e o conforto do trabalhador de forma significativa.' },

                                                                    { value: 'O posto de trabalho é improvisado, utilizando mobiliário não apropriado para a função, o que gera posturas inadequadas e potencial risco de lesões.', label: 'O posto de trabalho é improvisado, utilizando mobiliário não apropriado para a função, o que gera posturas inadequadas e potencial risco de lesões.' }
                                                                ]}
                                                                value={motivosValue('mobiliario_0')}
                                                                onChange={handleMotivos('mobiliario_0')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosMobiliarioEquipamento[0]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosMobiliarioEquipamento];
                                                                    newArr[0] = e.target.value;
                                                                    setEmbasamentosMobiliarioEquipamento(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('mobiliario_0')} onChange={(e) => handleClassificacaoChange('mobiliario_0', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('mobiliario_0')} onChange={(e) => setObservacaoPorKey('mobiliario_0', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Mobiliários e equipamentos inadequados ergonomicamente, sem meios de regulagem de ajuste ou sem condições de uso (assento, encosto, etc)
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O mobiliário (cadeiras, mesas) e os equipamentos atendem aos requisitos da NR-17, possuindo regulagens que permitem o ajuste às características antropométricas do usuário e estão em bom estado de conservação.', label: 'O mobiliário (cadeiras, mesas) e os equipamentos atendem aos requisitos da NR-17, possuindo regulagens que permitem o ajuste às características antropométricas do usuário e estão em bom estado de conservação.' },

                                                                    { value: 'O mobiliário possui algumas limitações de ajuste ou características que não atendem plenamente às normas, mas permite uma adaptação razoável, resultando em um risco baixo.', label: 'O mobiliário possui algumas limitações de ajuste ou características que não atendem plenamente às normas, mas permite uma adaptação razoável, resultando em um risco baixo.' },

                                                                    { value: 'O mobiliário é inadequado, não possui regulagens essenciais (altura do assento, apoio lombar), está em mau estado de conservação ou suas dimensões são incompatíveis com a tarefa, gerando risco elevado.', label: 'O mobiliário é inadequado, não possui regulagens essenciais (altura do assento, apoio lombar), está em mau estado de conservação ou suas dimensões são incompatíveis com a tarefa, gerando risco elevado.' }
                                                                ]}
                                                                value={motivosValue('mobiliario_1')}
                                                                onChange={handleMotivos('mobiliario_1')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosMobiliarioEquipamento[1]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosMobiliarioEquipamento];
                                                                    newArr[1] = e.target.value;
                                                                    setEmbasamentosMobiliarioEquipamento(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('mobiliario_1')} onChange={(e) => handleClassificacaoChange('mobiliario_1', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('mobiliario_1')} onChange={(e) => setObservacaoPorKey('mobiliario_1', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Posto de trabalho não planejado/adaptado para alternância de posturas
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O posto de trabalho é planejado para permitir a alternância entre as posturas sentada e em pé, ou a dinâmica da tarefa naturalmente promove essa variação.', label: 'O posto de trabalho é planejado para permitir a alternância entre as posturas sentada e em pé, ou a dinâmica da tarefa naturalmente promove essa variação.' },

                                                                    { value: 'Embora o posto seja predominantemente para uma única postura, a organização do trabalho permite pausas e a realização de outras tarefas que favorecem a alternância postural.', label: 'Embora o posto seja predominantemente para uma única postura, a organização do trabalho permite pausas e a realização de outras tarefas que favorecem a alternância postural.' },

                                                                    { value: 'O posto de trabalho e a organização da tarefa confinam o trabalhador a uma única postura (sentado ou em pé) por toda a jornada, sem possibilidade de alternância, elevando o risco de distúrbios musculoesqueléticos.', label: 'O posto de trabalho e a organização da tarefa confinam o trabalhador a uma única postura (sentado ou em pé) por toda a jornada, sem possibilidade de alternância, elevando o risco de distúrbios musculoesqueléticos.' }
                                                                ]}
                                                                value={motivosValue('mobiliario_2')}
                                                                onChange={handleMotivos('mobiliario_2')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosMobiliarioEquipamento[2]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosMobiliarioEquipamento];
                                                                    newArr[2] = e.target.value;
                                                                    setEmbasamentosMobiliarioEquipamento(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('mobiliario_2')} onChange={(e) => handleClassificacaoChange('mobiliario_2', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('mobiliario_2')} onChange={(e) => setObservacaoPorKey('mobiliario_2', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Mobiliário ou equipamento sem espaço para movimentação dos segmentos corporais
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O posto de trabalho oferece espaço suficiente para a livre movimentação dos segmentos corporais, permitindo o posicionamento adequado de pernas, braços e o acesso fácil aos itens de trabalho.', label: 'O posto de trabalho oferece espaço suficiente para a livre movimentação dos segmentos corporais, permitindo o posicionamento adequado de pernas, braços e o acesso fácil aos itens de trabalho.' },

                                                                    { value: 'O espaço para movimentação é um pouco restrito, podendo causar contatos eventuais com o mobiliário, mas não impede a execução da tarefa de forma segura.', label: 'O espaço para movimentação é um pouco restrito, podendo causar contatos eventuais com o mobiliário, mas não impede a execução da tarefa de forma segura.' },

                                                                    { value: 'O espaço do posto de trabalho é insuficiente, restringindo a movimentação das pernas, impedindo o ajuste postural e forçando o trabalhador a adotar posturas inadequadas.', label: 'O espaço do posto de trabalho é insuficiente, restringindo a movimentação das pernas, impedindo o ajuste postural e forçando o trabalhador a adotar posturas inadequadas.' },
                                                                ]}
                                                                value={motivosValue('mobiliario_3')}
                                                                onChange={handleMotivos('mobiliario_3')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosMobiliarioEquipamento[3]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosMobiliarioEquipamento];
                                                                    newArr[3] = e.target.value;
                                                                    setEmbasamentosMobiliarioEquipamento(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('mobiliario_3')} onChange={(e) => handleClassificacaoChange('mobiliario_3', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('mobiliario_3')} onChange={(e) => setObservacaoPorKey('mobiliario_3', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Trabalho com necessidade de alcançar objetos, documentos, controles ou qualquer ponto além das zonas de alcance ideais para as características antropométricas do trabalhador
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Todos os objetos, controles e documentos de uso frequente estão localizados dentro da zona de alcance ótimo (horizontal e vertical), evitando a necessidade de esticar ou torcer o corpo.', label: 'Todos os objetos, controles e documentos de uso frequente estão localizados dentro da zona de alcance ótimo (horizontal e vertical), evitando a necessidade de esticar ou torcer o corpo.' },

                                                                    { value: 'Alguns objetos de uso menos frequente estão localizados fora da zona de alcance ideal, exigindo um esforço postural eventual para serem alcançados.', label: 'Alguns objetos de uso menos frequente estão localizados fora da zona de alcance ideal, exigindo um esforço postural eventual para serem alcançados.' },

                                                                    { value: 'Objetos de uso constante estão posicionados fora da zona de alcance ideal, forçando o trabalhador a realizar movimentos de flexão, torção ou elevação dos braços repetidamente, o que configura risco elevado.', label: 'Objetos de uso constante estão posicionados fora da zona de alcance ideal, forçando o trabalhador a realizar movimentos de flexão, torção ou elevação dos braços repetidamente, o que configura risco elevado.' },
                                                                ]}
                                                                value={motivosValue('mobiliario_4')}
                                                                onChange={handleMotivos('mobiliario_4')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />

                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosMobiliarioEquipamento[4]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosMobiliarioEquipamento];
                                                                    newArr[4] = e.target.value;
                                                                    setEmbasamentosMobiliarioEquipamento(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('mobiliario_4')} onChange={(e) => handleClassificacaoChange('mobiliario_4', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('mobiliario_4')} onChange={(e) => setObservacaoPorKey('mobiliario_4', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Equipamentos ou mobiliários não adaptados à antropometria do trabalhador
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">                                                        <CreatableSelect
                                                            isMulti
                                                            options={[
                                                                { value: 'O mobiliário e os equipamentos são ajustáveis e compatíveis com as diversas características antropométricas (altura, peso, dimensões) dos trabalhadores que os utilizam.', label: 'O mobiliário e os equipamentos são ajustáveis e compatíveis com as diversas características antropométricas (altura, peso, dimensões) dos trabalhadores que os utilizam.' },

                                                                { value: 'O posto de trabalho permite uma adaptação razoável para a maioria dos trabalhadores, mas pode apresentar pequenas incompatibilidades para indivíduos com características antropométricas extremas.', label: 'O posto de trabalho permite uma adaptação razoável para a maioria dos trabalhadores, mas pode apresentar pequenas incompatibilidades para indivíduos com características antropométricas extremas.' },

                                                                { value: 'O posto de trabalho possui dimensões fixas e inadequadas, não se adaptando às características antropométricas dos trabalhadores e impondo posturas de risco para a maioria dos usuários.', label: 'O posto de trabalho possui dimensões fixas e inadequadas, não se adaptando às características antropométricas dos trabalhadores e impondo posturas de risco para a maioria dos usuários.' },
                                                            ]}
                                                            value={motivosValue('mobiliario_5')}
                                                            onChange={handleMotivos('mobiliario_5')}
                                                            placeholder="Digite ou selecione motivos..."
                                                            classNamePrefix="react-select"
                                                            menuPortalTarget={document.body}
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    minHeight: '28px',
                                                                    fontSize: '12px',
                                                                    border: 'none',
                                                                    boxShadow: 'none',
                                                                    minWidth: '250px'
                                                                }),
                                                                multiValue: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: '#e0f2fe',
                                                                    color: '#0369a1',
                                                                    fontSize: '11px',
                                                                    maxWidth: '200px'
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                    maxWidth: '400px'
                                                                }),
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999
                                                                })
                                                            }}
                                                        />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosMobiliarioEquipamento[5]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosMobiliarioEquipamento];
                                                                    newArr[5] = e.target.value;
                                                                    setEmbasamentosMobiliarioEquipamento(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('mobiliario_5')} onChange={(e) => handleClassificacaoChange('mobiliario_5', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('mobiliario_5')} onChange={(e) => setObservacaoPorKey('mobiliario_5', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fatores Organizacionais */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => toggleAccordion('fatoresOrganizacionais')}
                                    className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="font-medium text-gray-900">Fatores Organizacionais</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.fatoresOrganizacionais ? 'rotate-180' : ''
                                        }`} />
                                </button>
                                {openAccordions.fatoresOrganizacionais && (
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Fator de Risco</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Entrevista/Motivo</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Embasamento</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Classificação</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Observações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Trabalho realizado sem pausas pré definidas para descanso e/ ou desequilíbrio entre tempo de trabalho e tempo de repouso
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A jornada de trabalho inclui pausas formais e informais, com equilíbrio adequado entre os períodos de trabalho e repouso, conforme a legislação e as necessidades da tarefa.', label: 'A jornada de trabalho inclui pausas formais e informais, com equilíbrio adequado entre os períodos de trabalho e repouso, conforme a legislação e as necessidades da tarefa.' },

                                                                    { value: 'As pausas formais são cumpridas, mas a intensidade do trabalho dificulta a realização de micropausas ou pausas informais, gerando um baixo risco de fadiga.', label: 'As pausas formais são cumpridas, mas a intensidade do trabalho dificulta a realização de micropausas ou pausas informais, gerando um baixo risco de fadiga.' },

                                                                    { value: 'Não há pausas definidas para descanso além dos intervalos legais, ou o ritmo de trabalho impede sua utilização, resultando em desequilíbrio entre esforço e recuperação e risco elevado de fadiga.', label: 'Não há pausas definidas para descanso além dos intervalos legais, ou o ritmo de trabalho impede sua utilização, resultando em desequilíbrio entre esforço e recuperação e risco elevado de fadiga.' }
                                                                ]}
                                                                value={motivosValue('organizacionais_0')}
                                                                onChange={handleMotivos('organizacionais_0')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosOrganizacionais[0]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosOrganizacionais];
                                                                    newArr[0] = e.target.value;
                                                                    setEmbasamentosOrganizacionais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('organizacionais_0')} onChange={(e) => handleClassificacaoChange('organizacionais_0', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Necessidade de manter ritmos intensos de trabalho
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O ritmo de trabalho é determinado pelo próprio trabalhador, permitindo a adequação da cadência às suas capacidades e às demandas da tarefa, sem imposição de velocidade.', label: 'O ritmo de trabalho é determinado pelo próprio trabalhador, permitindo a adequação da cadência às suas capacidades e às demandas da tarefa, sem imposição de velocidade.' },

                                                                    { value: 'O ritmo de trabalho é moderado, com picos de intensidade ocasionais que são gerenciáveis e não se estendem por longos períodos.', label: 'O ritmo de trabalho é moderado, com picos de intensidade ocasionais que são gerenciáveis e não se estendem por longos períodos.' },

                                                                    { value: 'O trabalho exige a manutenção de um ritmo intenso e constante, com alta pressão por produtividade e sem possibilidade de autorregulação, o que eleva o risco de estresse e exaustão.', label: 'O trabalho exige a manutenção de um ritmo intenso e constante, com alta pressão por produtividade e sem possibilidade de autorregulação, o que eleva o risco de estresse e exaustão.' }
                                                                ]}
                                                                value={motivosValue('organizacionais_1')}
                                                                onChange={handleMotivos('organizacionais_1')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosOrganizacionais[1]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosOrganizacionais];
                                                                    newArr[1] = e.target.value;
                                                                    setEmbasamentosOrganizacionais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('organizacionais_1')} onChange={(e) => handleClassificacaoChange('organizacionais_1', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Monotonia
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">                                                        <CreatableSelect
                                                            isMulti
                                                            options={[
                                                                { value: 'As tarefas são diversificadas, com conteúdo significativo e ciclos de trabalho longos, o que previne a monotonia e o desinteresse.', label: 'As tarefas são diversificadas, com conteúdo significativo e ciclos de trabalho longos, o que previne a monotonia e o desinteresse.' },

                                                                { value: 'A tarefa possui certo grau de repetitividade, mas inclui atividades secundárias que quebram a monotonia e permitem variação cognitiva e motora.', label: 'A tarefa possui certo grau de repetitividade, mas inclui atividades secundárias que quebram a monotonia e permitem variação cognitiva e motora.' },

                                                                { value: 'A tarefa é extremamente monótona e repetitiva, com ciclos de trabalho muito curtos e conteúdo pobre, gerando desmotivação, queda de atenção e risco de erros e acidentes.', label: 'A tarefa é extremamente monótona e repetitiva, com ciclos de trabalho muito curtos e conteúdo pobre, gerando desmotivação, queda de atenção e risco de erros e acidentes.' }
                                                            ]}
                                                            value={motivosValue('organizacionais_2')}
                                                            onChange={handleMotivos('organizacionais_2')}
                                                            placeholder="Digite ou selecione motivos..."
                                                            classNamePrefix="react-select"
                                                            menuPortalTarget={document.body}
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    minHeight: '28px',
                                                                    fontSize: '12px',
                                                                    border: 'none',
                                                                    boxShadow: 'none',
                                                                    minWidth: '250px'
                                                                }),
                                                                multiValue: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: '#e0f2fe',
                                                                    color: '#0369a1',
                                                                    fontSize: '11px',
                                                                    maxWidth: '200px'
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                    maxWidth: '400px'
                                                                }),
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999
                                                                })
                                                            }}
                                                        />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosOrganizacionais[2]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosOrganizacionais];
                                                                    newArr[2] = e.target.value;
                                                                    setEmbasamentosOrganizacionais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('organizacionais_2')} onChange={(e) => handleClassificacaoChange('organizacionais_2', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Trabalho noturno
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As atividades são realizadas integralmente em período diurno.', label: 'As atividades são realizadas integralmente em período diurno.' },

                                                                    { value: 'Treinamento ergonômico: Capacite os trabalhadores sobre as posturas corretas e a importância da movimentação e dos alongamentos.', label: 'Treinamento ergonômico: Capacite os trabalhadores sobre as posturas corretas e a importância da movimentação e dos alongamentos.' },

                                                                    { value: 'O trabalho é realizado em turno noturno de forma fixa ou com trocas de turno inadequadas, impactando o ciclo circadiano e aumentando o risco de fadiga, sonolência e problemas de saúde.', label: 'O trabalho é realizado em turno noturno de forma fixa ou com trocas de turno inadequadas, impactando o ciclo circadiano e aumentando o risco de fadiga, sonolência e problemas de saúde.' }
                                                                ]}
                                                                value={motivosValue('organizacionais_3')}
                                                                onChange={handleMotivos('organizacionais_3')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosOrganizacionais[3]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosOrganizacionais];
                                                                    newArr[3] = e.target.value;
                                                                    setEmbasamentosOrganizacionais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('organizacionais_3')} onChange={(e) => handleClassificacaoChange('organizacionais_3', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Trabalho com utilização rigorosa de metas de produção ou trabalho remunerado por produção
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As metas de produção são claras, realistas e negociadas, servindo como um fator de orientação e não de pressão. O sistema de remuneração não está atrelado diretamente à produção individual.', label: 'As metas de produção são claras, realistas e negociadas, servindo como um fator de orientação e não de pressão. O sistema de remuneração não está atrelado diretamente à produção individual.' },

                                                                    { value: 'Existem metas de produção, mas são consideradas atingíveis e há flexibilidade para lidar com imprevistos, gerando uma pressão moderada e controlada.', label: 'Existem metas de produção, mas são consideradas atingíveis e há flexibilidade para lidar com imprevistos, gerando uma pressão moderada e controlada.' },

                                                                    { value: 'As metas de produção são rigorosas, de difícil alcance e utilizadas como forma de pressão contínua, ou a remuneração é por produção, incentivando um ritmo excessivo e a negligência de pausas e segurança.', label: 'As metas de produção são rigorosas, de difícil alcance e utilizadas como forma de pressão contínua, ou a remuneração é por produção, incentivando um ritmo excessivo e a negligência de pausas e segurança.' }
                                                                ]}
                                                                value={motivosValue('organizacionais_4')}
                                                                onChange={handleMotivos('organizacionais_4')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosOrganizacionais[4]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosOrganizacionais];
                                                                    newArr[4] = e.target.value;
                                                                    setEmbasamentosOrganizacionais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('organizacionais_4')} onChange={(e) => handleClassificacaoChange('organizacionais_4', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Cadência do trabalho imposta por um equipamento
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">
                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O trabalhador tem controle sobre a velocidade do equipamento ou processo, podendo iniciar, parar e regular a cadência da produção.', label: 'O trabalhador tem controle sobre a velocidade do equipamento ou processo, podendo iniciar, parar e regular a cadência da produção.' },

                                                                    { value: 'A cadência é parcialmente imposta por um equipamento, mas existem áreas de "pulmão" ou mecanismos que permitem ao trabalhador uma margem de controle sobre o fluxo de trabalho.', label: 'A cadência é parcialmente imposta por um equipamento, mas existem áreas de "pulmão" ou mecanismos que permitem ao trabalhador uma margem de controle sobre o fluxo de trabalho.' },

                                                                    { value: 'A cadência do trabalho é totalmente imposta por uma máquina ou esteira, sem que o trabalhador tenha qualquer controle sobre o ritmo, configurando um fator de risco psicossocial e biomecânico elevado.', label: 'A cadência do trabalho é totalmente imposta por uma máquina ou esteira, sem que o trabalhador tenha qualquer controle sobre o ritmo, configurando um fator de risco psicossocial e biomecânico elevado.' }
                                                                ]}
                                                                value={motivosValue('organizacionais_5')}
                                                                onChange={handleMotivos('organizacionais_5')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosOrganizacionais[5]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosOrganizacionais];
                                                                    newArr[5] = e.target.value;
                                                                    setEmbasamentosOrganizacionais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('organizacionais_5')} onChange={(e) => handleClassificacaoChange('organizacionais_5', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fatores Ambientais */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => toggleAccordion('fatoresAmbientais')}
                                    className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="font-medium text-gray-900">Fatores Ambientais</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.fatoresAmbientais ? 'rotate-180' : ''
                                        }`} />
                                </button>
                                {openAccordions.fatoresAmbientais && (
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Fator de Risco</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Entrevista/Motivo</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Embasamento</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Classificação</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Observações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Condições de trabalho com níveis de pressão sonora fora dos parâmetros de conforto
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O ambiente de trabalho é silencioso ou os níveis de pressão sonora estão dentro da faixa de conforto acústico recomendada pela NBR 10152 para a atividade exercida.', label: 'O ambiente de trabalho é silencioso ou os níveis de pressão sonora estão dentro da faixa de conforto acústico recomendada pela NBR 10152 para a atividade exercida.' },

                                                                    { value: 'O ruído no ambiente está ligeiramente acima do nível de conforto, mas não interfere na comunicação e não causa incômodo significativo, representando um risco baixo.', label: 'O ruído no ambiente está ligeiramente acima do nível de conforto, mas não interfere na comunicação e não causa incômodo significativo, representando um risco baixo.' },

                                                                    { value: 'O nível de pressão sonora no ambiente é elevado e constante, causando desconforto, dificultando a comunicação e a concentração, e representando um risco para a saúde auditiva e mental.', label: 'O nível de pressão sonora no ambiente é elevado e constante, causando desconforto, dificultando a comunicação e a concentração, e representando um risco para a saúde auditiva e mental.' }
                                                                ]}
                                                                value={motivosValue('ambientais_0')}
                                                                onChange={handleMotivos('ambientais_0')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosAmbientais[0]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosAmbientais];
                                                                    newArr[0] = e.target.value;
                                                                    setEmbasamentosAmbientais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" onChange={(e) => { setClassificacoesAmbientais(prev => { const arr = [...prev]; arr[0] = e.target.value; return arr; }); handleClassificacaoChange('ambientais_0', e.target.value); }} value={classificacoesAmbientais[0]}>
                                                                <option value="">Classificação</option>
                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={observacoesAmbientais[0]} onChange={(e) => setObservacoesAmbientais(prev => { const arr = [...prev]; arr[0] = e.target.value; return arr; })} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Condições de trabalho com índice de temperatura, velocidade do ar e umidade do ar fora dos parâmetros de conforto
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As condições de temperatura, umidade e velocidade do ar estão dentro dos parâmetros de conforto estabelecidos pela NR-17, proporcionando um ambiente termicamente agradável.', label: 'As condições de temperatura, umidade e velocidade do ar estão dentro dos parâmetros de conforto estabelecidos pela NR-17, proporcionando um ambiente termicamente agradável.' },

                                                                    { value: 'As condições de temperatura apresentam pequenas variações, causando um leve desconforto ocasional, mas sem representar um risco à saúde ou ao desempenho.', label: 'As condições de temperatura apresentam pequenas variações, causando um leve desconforto ocasional, mas sem representar um risco à saúde ou ao desempenho.' },

                                                                    { value: 'As condições de temperatura, umidade ou velocidade do ar estão fora dos limites de conforto, causando estresse térmico (calor ou frio excessivo) e impactando negativamente o bem-estar e a produtividade.', label: 'As condições de temperatura, umidade ou velocidade do ar estão fora dos limites de conforto, causando estresse térmico (calor ou frio excessivo) e impactando negativamente o bem-estar e a produtividade.' }
                                                                ]}
                                                                value={motivosValue('ambientais_1')}
                                                                onChange={handleMotivos('ambientais_1')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosAmbientais[1]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosAmbientais];
                                                                    newArr[1] = e.target.value;
                                                                    setEmbasamentosAmbientais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>

                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" onChange={(e) => { setClassificacoesAmbientais(prev => { const arr = [...prev]; arr[1] = e.target.value; return arr; }); handleClassificacaoChange('ambientais_1', e.target.value); }} value={classificacoesAmbientais[1]}>
                                                                <option value="">Classificação</option>
                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={observacoesAmbientais[1]} onChange={(e) => setObservacoesAmbientais(prev => { const arr = [...prev]; arr[1] = e.target.value; return arr; })} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Condições de trabalho com iluminação diurna e noturna inadequada ou presença de reflexos em telas, painéis, vidros, monitores ou qualquer superfície, que causem desconforto ou prejudiquem a visualização
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A iluminação do ambiente (natural e/ou artificial) é suficiente, uniformemente distribuída e adequada à tarefa visual, sem causar ofuscamento, reflexos ou sombras que prejudiquem a visão.', label: 'A iluminação do ambiente (natural e/ou artificial) é suficiente, uniformemente distribuída e adequada à tarefa visual, sem causar ofuscamento, reflexos ou sombras que prejudiquem a visão.' },

                                                                    { value: 'A iluminação apresenta pequenas deficiências, como pontos de sombra ou leve ofuscamento, que causam um desconforto visual mínimo, mas não impedem a execução da tarefa.', label: 'A iluminação apresenta pequenas deficiências, como pontos de sombra ou leve ofuscamento, que causam um desconforto visual mínimo, mas não impedem a execução da tarefa.' },

                                                                    { value: 'A iluminação é inadequada (insuficiente ou excessiva), mal distribuída ou causa ofuscamento e reflexos incômodos em telas e superfícies, gerando fadiga visual, dores de cabeça e aumentando o risco de erros.', label: 'A iluminação é inadequada (insuficiente ou excessiva), mal distribuída ou causa ofuscamento e reflexos incômodos em telas e superfícies, gerando fadiga visual, dores de cabeça e aumentando o risco de erros.' }
                                                                ]}
                                                                value={motivosValue('ambientais_2')}
                                                                onChange={handleMotivos('ambientais_2')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosAmbientais[2]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosAmbientais];
                                                                    newArr[2] = e.target.value;
                                                                    setEmbasamentosAmbientais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" onChange={(e) => { setClassificacoesAmbientais(prev => { const arr = [...prev]; arr[2] = e.target.value; return arr; }); handleClassificacaoChange('ambientais_2', e.target.value); }} value={classificacoesAmbientais[2]}>
                                                                <option value="">Classificação</option>
                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={observacoesAmbientais[2]} onChange={(e) => setObservacoesAmbientais(prev => { const arr = [...prev]; arr[2] = e.target.value; return arr; })} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fatores Psicossociais/Cognitivos */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => toggleAccordion('fatoresPsicossociais')}
                                    className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="font-medium text-gray-900">Fatores Psicossociais/Cognitivos</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.fatoresPsicossociais ? 'rotate-180' : ''
                                        }`} />
                                </button>
                                {openAccordions.fatoresPsicossociais && (
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Fator de Risco</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Entrevista/Motivo</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Embasamento</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Classificação</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">Observações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Seu trabalho exige muita concentração?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A carga de trabalho mental é adequada, com tempo suficiente para a realização das tarefas com qualidade. As demandas de concentração e memória são compatíveis com a capacidade humana e intercaladas com tarefas mais leves.', label: 'A carga de trabalho mental é adequada, com tempo suficiente para a realização das tarefas com qualidade. As demandas de concentração e memória são compatíveis com a capacidade humana e intercaladas com tarefas mais leves.' },

                                                                    { value: 'A carga de trabalho mental é adequada, com tempo suficiente para a realização das tarefas com qualidade. As demandas de concentração e memória são compatíveis com a capacidade humana e intercaladas com tarefas mais leves.', label: 'A carga de trabalho mental é adequada, com tempo suficiente para a realização das tarefas com qualidade. As demandas de concentração e memória são compatíveis com a capacidade humana e intercaladas com tarefas mais leves.' },

                                                                    { value: 'A tarefa exige um estado de concentração intenso e contínuo durante a maior parte da jornada, elevando o risco de fadiga mental, estresse e erros.', label: 'A tarefa exige um estado de concentração intenso e contínuo durante a maior parte da jornada, elevando o risco de fadiga mental, estresse e erros.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_0')}
                                                                onChange={handleMotivos('psicossociais_0')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[0]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[0] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_0')} onChange={(e) => handleClassificacaoChange('psicossociais_0', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_0')} onChange={(e) => setObservacaoPorKey('psicossociais_0', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você precisa trabalhar muito rápido?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O ritmo de trabalho é autogerenciado e permite a execução das tarefas com qualidade e segurança, sem pressão por velocidade.', label: 'O ritmo de trabalho é autogerenciado e permite a execução das tarefas com qualidade e segurança, sem pressão por velocidade.' },

                                                                    { value: 'Ocasionalmente, picos de demanda exigem um ritmo mais acelerado, mas são eventos pontuais e não uma condição crônica de trabalho.', label: 'Ocasionalmente, picos de demanda exigem um ritmo mais acelerado, mas são eventos pontuais e não uma condição crônica de trabalho.' },

                                                                    { value: 'A pressão por um ritmo de trabalho rápido é constante, comprometendo a qualidade e a segurança, e elevando o risco de estresse e erros.', label: 'A pressão por um ritmo de trabalho rápido é constante, comprometendo a qualidade e a segurança, e elevando o risco de estresse e erros.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_1')}
                                                                onChange={handleMotivos('psicossociais_1')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[1]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[1] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_1')} onChange={(e) => handleClassificacaoChange('psicossociais_1', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_1')} onChange={(e) => setObservacaoPorKey('psicossociais_1', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Seu trabalho exige que você tome decisões difíceis?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As decisões a serem tomadas são de baixa complexidade ou, se complexas, há suporte, tempo e informação adequados para a tomada de decisão.', label: 'As decisões a serem tomadas são de baixa complexidade ou, se complexas, há suporte, tempo e informação adequados para a tomada de decisão.' },

                                                                    { value: 'Eventualmente, é necessário tomar decisões de maior complexidade, mas existe autonomia e suporte da gestão para lidar com essas situações.', label: 'Eventualmente, é necessário tomar decisões de maior complexidade, mas existe autonomia e suporte da gestão para lidar com essas situações.' },

                                                                    { value: 'O trabalho exige a tomada de decisões difíceis de forma frequente, muitas vezes com informações insuficientes ou sob pressão de tempo, gerando alta carga cognitiva.', label: 'O trabalho exige a tomada de decisões difíceis de forma frequente, muitas vezes com informações insuficientes ou sob pressão de tempo, gerando alta carga cognitiva.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_2')}
                                                                onChange={handleMotivos('psicossociais_2')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[2]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[2] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_2')} onChange={(e) => handleClassificacaoChange('psicossociais_2', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_2')} onChange={(e) => setObservacaoPorKey('psicossociais_2', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você tem tempo suficiente para realizar suas tarefas?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O volume de trabalho é compatível com a jornada, permitindo que todas as tarefas sejam realizadas com qualidade, sem a necessidade de horas extras.', label: 'O volume de trabalho é compatível com a jornada, permitindo que todas as tarefas sejam realizadas com qualidade, sem a necessidade de horas extras.' },

                                                                    { value: 'Geralmente o tempo é suficiente, mas em períodos específicos (ex: fechamentos de mês), o volume de tarefas aumenta, exigindo uma gestão de tempo mais rigorosa.', label: 'Geralmente o tempo é suficiente, mas em períodos específicos (ex: fechamentos de mês), o volume de tarefas aumenta, exigindo uma gestão de tempo mais rigorosa.' },

                                                                    { value: 'O volume de tarefas é consistentemente maior do que o tempo disponível, gerando pressão constante, necessidade de horas extras e risco de esgotamento.', label: 'O volume de tarefas é consistentemente maior do que o tempo disponível, gerando pressão constante, necessidade de horas extras e risco de esgotamento.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_3')}
                                                                onChange={handleMotivos('psicossociais_3')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[3]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[3] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_3')} onChange={(e) => handleClassificacaoChange('psicossociais_3', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_3')} onChange={(e) => setObservacaoPorKey('psicossociais_3', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você precisa esconder suas emoções no trabalho?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O ambiente de trabalho permite a expressão emocional autêntica e saudável, sem a necessidade de suprimir sentimentos para se adequar a normas implícitas.', label: 'O ambiente de trabalho permite a expressão emocional autêntica e saudável, sem a necessidade de suprimir sentimentos para se adequar a normas implícitas.' },

                                                                    { value: 'Em situações específicas de interação com o público ou em negociações, é esperado um controle emocional, mas não é uma exigência contínua na rotina.', label: 'Em situações específicas de interação com o público ou em negociações, é esperado um controle emocional, mas não é uma exigência contínua na rotina.' },

                                                                    { value: 'Há uma forte exigência de suprimir emoções (dissonância emocional) para manter uma postura profissional, gerando desgaste e estresse emocional crônico.', label: 'Há uma forte exigência de suprimir emoções (dissonância emocional) para manter uma postura profissional, gerando desgaste e estresse emocional crônico.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_4')}
                                                                onChange={handleMotivos('psicossociais_4')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[4]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[4] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_4')} onChange={(e) => handleClassificacaoChange('psicossociais_4', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_4')} onChange={(e) => setObservacaoPorKey('psicossociais_4', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Seu trabalho envolve lidar com situações emocionalmente difíceis?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As tarefas não envolvem exposição a situações de sofrimento, conflito intenso ou outras demandas emocionalmente desgastantes.', label: 'As tarefas não envolvem exposição a situações de sofrimento, conflito intenso ou outras demandas emocionalmente desgastantes.' },

                                                                    { value: 'Ocasionalmente, o trabalho envolve lidar com situações emocionalmente difíceis, mas há suporte da equipe e da gestão para processar esses eventos.', label: 'Ocasionalmente, o trabalho envolve lidar com situações emocionalmente difíceis, mas há suporte da equipe e da gestão para processar esses eventos.' },

                                                                    { value: 'O contato com situações emocionalmente desgastantes é frequente e intrínseco à função, sem o devido suporte organizacional, elevando o risco de estresse e fadiga.', label: 'O contato com situações emocionalmente desgastantes é frequente e intrínseco à função, sem o devido suporte organizacional, elevando o risco de estresse e fadiga.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_5')}
                                                                onChange={handleMotivos('psicossociais_5')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[5]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[5] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_5')} onChange={(e) => handleClassificacaoChange('psicossociais_5', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_5')} onChange={(e) => setObservacaoPorKey('psicossociais_5', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você pode decidir como organizar seu trabalho?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O trabalhador possui alta autonomia para definir a ordem, o método e o ritmo de suas próprias tarefas, promovendo o engajamento e a responsabilidade.', label: 'O trabalhador possui alta autonomia para definir a ordem, o método e o ritmo de suas próprias tarefas, promovendo o engajamento e a responsabilidade.' },

                                                                    { value: 'O trabalhador pode organizar a ordem de suas tarefas dentro de um método de trabalho pré-definido, possuindo um nível de autonomia moderado.', label: 'O trabalhador pode organizar a ordem de suas tarefas dentro de um método de trabalho pré-definido, possuindo um nível de autonomia moderado.' },

                                                                    { value: 'O trabalho é totalmente prescrito, com pouca ou nenhuma margem para o trabalhador decidir como organizar suas atividades, o que limita o uso de suas competências.', label: 'O trabalho é totalmente prescrito, com pouca ou nenhuma margem para o trabalhador decidir como organizar suas atividades, o que limita o uso de suas competências.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_6')}
                                                                onChange={handleMotivos('psicossociais_6')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[6]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[6] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_6')} onChange={(e) => handleClassificacaoChange('psicossociais_6', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_6')} onChange={(e) => setObservacaoPorKey('psicossociais_6', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você tem influência sobre decisões do setor?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A participação nas decisões do setor é incentivada, e as opiniões dos trabalhadores são consideradas na definição de metas e processos.', label: 'A participação nas decisões do setor é incentivada, e as opiniões dos trabalhadores são consideradas na definição de metas e processos.' },

                                                                    { value: 'É possível dar sugestões e opiniões, mas a influência nas decisões finais do setor é limitada ou restrita a assuntos operacionais.', label: 'É possível dar sugestões e opiniões, mas a influência nas decisões finais do setor é limitada ou restrita a assuntos operacionais.' },

                                                                    { value: 'As decisões são centralizadas na gestão, sem consulta ou espaço para a participação dos trabalhadores, gerando um sentimento de baixa influência.', label: 'As decisões são centralizadas na gestão, sem consulta ou espaço para a participação dos trabalhadores, gerando um sentimento de baixa influência.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_7')}
                                                                onChange={handleMotivos('psicossociais_7')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[7]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[7] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_7')} onChange={(e) => handleClassificacaoChange('psicossociais_7', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_7')} onChange={(e) => setObservacaoPorKey('psicossociais_7', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Seu trabalho permite que você desenvolva novas habilidades?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]" >

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O trabalho oferece constantes oportunidades de aprendizado e desenvolvimento de novas competências, sendo um fator de motivação e crescimento profissional.', label: 'O trabalho oferece constantes oportunidades de aprendizado e desenvolvimento de novas competências, sendo um fator de motivação e crescimento profissional.' },

                                                                    { value: 'O desenvolvimento de novas habilidades é possível, mas depende principalmente da iniciativa do próprio trabalhador, com pouco incentivo formal da empresa.', label: 'O desenvolvimento de novas habilidades é possível, mas depende principalmente da iniciativa do próprio trabalhador, com pouco incentivo formal da empresa.' },

                                                                    { value: 'A tarefa é rotineira e não oferece oportunidades para aprender ou desenvolver novas habilidades, podendo levar à estagnação e desmotivação.', label: 'A tarefa é rotineira e não oferece oportunidades para aprender ou desenvolver novas habilidades, podendo levar à estagnação e desmotivação.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_8')}
                                                                onChange={handleMotivos('psicossociais_8')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[8]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[8] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_8')} onChange={(e) => handleClassificacaoChange('psicossociais_8', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_8')} onChange={(e) => setObservacaoPorKey('psicossociais_8', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você recebe informações claras sobre mudanças na empresa?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A comunicação sobre mudanças, metas e diretrizes da empresa é transparente, clara e chega a todos os trabalhadores em tempo hábil.', label: 'A comunicação sobre mudanças, metas e diretrizes da empresa é transparente, clara e chega a todos os trabalhadores em tempo hábil.' },

                                                                    { value: 'A comunicação sobre mudanças existe, mas pode apresentar falhas, ruídos ou atrasos, gerando alguma incerteza ocasional.', label: 'A comunicação sobre mudanças existe, mas pode apresentar falhas, ruídos ou atrasos, gerando alguma incerteza ocasional.' },

                                                                    { value: 'A comunicação sobre mudanças importantes é falha, insuficiente ou inexistente, gerando um clima de insegurança, boatos e desconfiança.', label: 'A comunicação sobre mudanças importantes é falha, insuficiente ou inexistente, gerando um clima de insegurança, boatos e desconfiança.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_9')}
                                                                onChange={handleMotivos('psicossociais_9')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[9]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[9] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                        <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_9')} onChange={(e) => handleClassificacaoChange('psicossociais_9', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_9')} onChange={(e) => setObservacaoPorKey('psicossociais_9', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você sabe o que se espera de você no trabalho?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As responsabilidades, metas e critérios de avaliação do cargo são claros e bem definidos, permitindo que o trabalhador saiba exatamente o que se espera dele.', label: 'As responsabilidades, metas e critérios de avaliação do cargo são claros e bem definidos, permitindo que o trabalhador saiba exatamente o que se espera dele.' },

                                                                    { value: 'As principais responsabilidades são claras, mas pode haver ambiguidade em relação a tarefas secundárias ou novos projetos.', label: 'As principais responsabilidades são claras, mas pode haver ambiguidade em relação a tarefas secundárias ou novos projetos.' },

                                                                    { value: 'Há uma falta de clareza ou ambiguidade constante sobre as responsabilidades e o que se espera do trabalhador, gerando estresse e conflito de papéis.', label: 'Há uma falta de clareza ou ambiguidade constante sobre as responsabilidades e o que se espera do trabalhador, gerando estresse e conflito de papéis.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_10')}
                                                                onChange={handleMotivos('psicossociais_10')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[10]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[10] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_10')} onChange={(e) => handleClassificacaoChange('psicossociais_10', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_10')} onChange={(e) => setObservacaoPorKey('psicossociais_10', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você pode contar com seus colegas quando precisa de ajuda?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O espírito de equipe é forte, e os colegas de trabalho são proativos em oferecer ajuda e suporte uns aos outros.', label: 'O espírito de equipe é forte, e os colegas de trabalho são proativos em oferecer ajuda e suporte uns aos outros.' },

                                                                    { value: 'É possível contar com a ajuda dos colegas quando solicitado, mas a colaboração não é uma prática proativa e constante.', label: 'É possível contar com a ajuda dos colegas quando solicitado, mas a colaboração não é uma prática proativa e constante.' },

                                                                    { value: 'Há um clima de isolamento ou competitividade que dificulta a colaboração, e os trabalhadores sentem que não podem contar com a ajuda dos colegas.', label: 'Há um clima de isolamento ou competitividade que dificulta a colaboração, e os trabalhadores sentem que não podem contar com a ajuda dos colegas.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_11')}
                                                                onChange={handleMotivos('psicossociais_11')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[11]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[11] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_11')} onChange={(e) => handleClassificacaoChange('psicossociais_11', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_11')} onChange={(e) => setObservacaoPorKey('psicossociais_11', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            O ambiente entre os funcionários é amigável?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O ambiente de trabalho é caracterizado por relações de respeito, cordialidade e amizade entre os funcionários.', label: 'O ambiente de trabalho é caracterizado por relações de respeito, cordialidade e amizade entre os funcionários.' },

                                                                    { value: 'O ambiente é geralmente cordial e profissional, com pouca ocorrência de conflitos interpessoais.', label: 'O ambiente é geralmente cordial e profissional, com pouca ocorrência de conflitos interpessoais.' },

                                                                    { value: 'O ambiente de trabalho é tenso, com a presença de conflitos, desrespeito ou "panelinhas", o que prejudica o clima organizacional.', label: 'O ambiente de trabalho é tenso, com a presença de conflitos, desrespeito ou "panelinhas", o que prejudica o clima organizacional.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_12')}
                                                                onChange={handleMotivos('psicossociais_12')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[12]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[12] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_12')} onChange={(e) => handleClassificacaoChange('psicossociais_12', e.target.value)}>
                                                                <option value="">Classificação</option>
                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_12')} onChange={(e) => setObservacaoPorKey('psicossociais_12', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Seu gestor escuta suas preocupações e sugestões?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A gestão mantém canais de comunicação abertos, escutando ativamente as preocupações e sugestões da equipe e dando o devido encaminhamento.', label: 'A gestão mantém canais de comunicação abertos, escutando ativamente as preocupações e sugestões da equipe e dando o devido encaminhamento.' },

                                                                    { value: 'A gestão escuta as preocupações e sugestões, mas nem sempre há um retorno claro sobre as ações tomadas, ou a abertura é limitada a certos assuntos.', label: 'A gestão escuta as preocupações e sugestões, mas nem sempre há um retorno claro sobre as ações tomadas, ou a abertura é limitada a certos assuntos.' },

                                                                    { value: 'Há uma percepção clara de que a gestão não escuta ou não valoriza as preocupações e sugestões dos trabalhadores, gerando um sentimento de descaso.', label: 'Há uma percepção clara de que a gestão não escuta ou não valoriza as preocupações e sugestões dos trabalhadores, gerando um sentimento de descaso.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_13')}
                                                                onChange={handleMotivos('psicossociais_13')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[13]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[13] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_13')} onChange={(e) => handleClassificacaoChange('psicossociais_13', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_13')} onChange={(e) => setObservacaoPorKey('psicossociais_13', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você recebe reconhecimento pelo seu trabalho?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O reconhecimento pelo bom desempenho é uma prática cultural na empresa, ocorrendo de forma frequente e genuína por parte de gestores e colegas.', label: 'O reconhecimento pelo bom desempenho é uma prática cultural na empresa, ocorrendo de forma frequente e genuína por parte de gestores e colegas.' },

                                                                    { value: 'O reconhecimento ocorre de forma esporádica, geralmente associado a grandes projetos ou resultados excepcionais, mas não é uma prática regular na rotina.', label: 'O reconhecimento ocorre de forma esporádica, geralmente associado a grandes projetos ou resultados excepcionais, mas não é uma prática regular na rotina.' },

                                                                    { value: 'Há uma percepção clara de falta de reconhecimento pelo esforço e pelos resultados alcançados, gerando sentimentos de desvalorização e injustiça.', label: 'Há uma percepção clara de falta de reconhecimento pelo esforço e pelos resultados alcançados, gerando sentimentos de desvalorização e injustiça.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_14')}
                                                                onChange={handleMotivos('psicossociais_14')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[14]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[14] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_14')} onChange={(e) => handleClassificacaoChange('psicossociais_14', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_14')} onChange={(e) => setObservacaoPorKey('psicossociais_14', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            As decisões da empresa são tomadas de forma justa?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Os processos de tomada de decisão (promoções, alocação de tarefas) são percebidos como transparentes, imparciais e justos por todos.', label: 'Os processos de tomada de decisão (promoções, alocação de tarefas) são percebidos como transparentes, imparciais e justos por todos.' },

                                                                    { value: 'A maioria das decisões é percebida como justa, mas pode haver questionamentos ou falta de clareza em situações pontuais.', label: 'A maioria das decisões é percebida como justa, mas pode haver questionamentos ou falta de clareza em situações pontuais.' },

                                                                    { value: 'Há uma percepção generalizada de que as decisões são tomadas de forma parcial, injusta ou baseada em favoritismo, minando a confiança na gestão.', label: 'Há uma percepção generalizada de que as decisões são tomadas de forma parcial, injusta ou baseada em favoritismo, minando a confiança na gestão.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_15')}
                                                                onChange={handleMotivos('psicossociais_15')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[15]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[15] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_15')} onChange={(e) => handleClassificacaoChange('psicossociais_15', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_15')} onChange={(e) => setObservacaoPorKey('psicossociais_15', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você sente que é tratado com respeito por seus superiores?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O tratamento recebido dos superiores é consistentemente respeitoso, ético e profissional.', label: 'O tratamento recebido dos superiores é consistentemente respeitoso, ético e profissional.' },

                                                                    { value: 'O tratamento é geralmente respeitoso, mas podem ocorrer situações pontuais de comunicação inadequada ou falta de consideração.', label: 'O tratamento é geralmente respeitoso, mas podem ocorrer situações pontuais de comunicação inadequada ou falta de consideração.' },

                                                                    { value: 'O tratamento por parte da liderança é frequentemente percebido como desrespeitoso, autoritário ou hostil, configurando um risco psicossocial.', label: 'O tratamento por parte da liderança é frequentemente percebido como desrespeitoso, autoritário ou hostil, configurando um risco psicossocial.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_16')}
                                                                onChange={handleMotivos('psicossociais_16')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[16]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[16] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_16')} onChange={(e) => handleClassificacaoChange('psicossociais_16', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_16')} onChange={(e) => setObservacaoPorKey('psicossociais_16', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você já sofreu ou presenciou assédio moral?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O ambiente de trabalho é seguro e não há relatos ou percepção de assédio moral ou qualquer forma de violência psicológica.', label: 'O ambiente de trabalho é seguro e não há relatos ou percepção de assédio moral ou qualquer forma de violência psicológica.' },

                                                                    { value: 'Não há relatos diretos de assédio, mas podem existir comentários ou "brincadeiras" inadequadas que criam um ambiente desconfortável.', label: 'Não há relatos diretos de assédio, mas podem existir comentários ou "brincadeiras" inadequadas que criam um ambiente desconfortável.' },

                                                                    { value: 'Foram identificados relatos ou uma percepção clara da ocorrência de assédio moral (humilhações, isolamento, perseguição), indicando um ambiente de trabalho tóxico.', label: 'Foram identificados relatos ou uma percepção clara da ocorrência de assédio moral (humilhações, isolamento, perseguição), indicando um ambiente de trabalho tóxico.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_17')}
                                                                onChange={handleMotivos('psicossociais_17')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[17]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[17] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_17')} onChange={(e) => handleClassificacaoChange('psicossociais_17', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_17')} onChange={(e) => setObservacaoPorKey('psicossociais_17', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você teme perder seu emprego nos próximos meses?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Há um forte sentimento de segurança e estabilidade no emprego, com uma percepção positiva sobre o futuro da empresa.', label: 'Há um forte sentimento de segurança e estabilidade no emprego, com uma percepção positiva sobre o futuro da empresa.' },

                                                                    { value: 'Existe uma leve incerteza sobre o futuro, geralmente ligada a fatores de mercado, mas não um temor iminente de demissão.', label: 'Existe uma leve incerteza sobre o futuro, geralmente ligada a fatores de mercado, mas não um temor iminente de demissão.' },

                                                                    { value: 'Há um temor constante e significativo de perder o emprego, gerando alta insegurança, ansiedade e desmotivação entre os trabalhadores.', label: 'Há um temor constante e significativo de perder o emprego, gerando alta insegurança, ansiedade e desmotivação entre os trabalhadores.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_18')}
                                                                onChange={handleMotivos('psicossociais_18')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[18]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[18] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_18')} onChange={(e) => handleClassificacaoChange('psicossociais_18', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_18')} onChange={(e) => setObservacaoPorKey('psicossociais_18', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você se sente esgotado após o trabalho?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Ao final do expediente, o sentimento é de cansaço natural, mas não de esgotamento. A energia para atividades pessoais é preservada.', label: 'Ao final do expediente, o sentimento é de cansaço natural, mas não de esgotamento. A energia para atividades pessoais é preservada.' },

                                                                    { value: 'Sentir-se esgotado é algo que ocorre ocasionalmente, após dias de demanda atípica, mas não é um sentimento crônico.', label: 'Sentir-se esgotado é algo que ocorre ocasionalmente, após dias de demanda atípica, mas não é um sentimento crônico.' },

                                                                    { value: 'O sentimento de esgotamento físico e mental ao final do expediente é frequente ou diário, indicando uma sobrecarga crônica e risco de burnout.', label: 'O sentimento de esgotamento físico e mental ao final do expediente é frequente ou diário, indicando uma sobrecarga crônica e risco de burnout.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_19')}
                                                                onChange={handleMotivos('psicossociais_19')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[19]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[19] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_19')} onChange={(e) => handleClassificacaoChange('psicossociais_19', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_19')} onChange={(e) => setObservacaoPorKey('psicossociais_19', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            O trabalho afeta negativamente sua saúde mental?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-20 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O trabalho é percebido como uma fonte de satisfação e realização, contribuindo positivamente para a saúde mental.', label: 'O trabalho é percebido como uma fonte de satisfação e realização, contribuindo positivamente para a saúde mental.' },

                                                                    { value: 'O trabalho, em si, não afeta a saúde mental, mas a pressão ocasional pode gerar estresse temporário.', label: 'O trabalho, em si, não afeta a saúde mental, mas a pressão ocasional pode gerar estresse temporário.' },

                                                                    { value: 'O ambiente ou a carga de trabalho são fontes constantes de estresse, ansiedade ou outros impactos negativos na saúde mental do trabalhador.', label: 'O ambiente ou a carga de trabalho são fontes constantes de estresse, ansiedade ou outros impactos negativos na saúde mental do trabalhador.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_20')}
                                                                onChange={handleMotivos('psicossociais_20')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[20]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[20] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_20')} onChange={(e) => handleClassificacaoChange('psicossociais_20', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_20')} onChange={(e) => setObservacaoPorKey('psicossociais_20', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Você consegue equilibrar sua vida pessoal e profissional?
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A empresa respeita os limites da vida pessoal, e o trabalhador consegue equilibrar satisfatoriamente as demandas do trabalho com suas atividades pessoais e familiares.', label: 'A empresa respeita os limites da vida pessoal, e o trabalhador consegue equilibrar satisfatoriamente as demandas do trabalho com suas atividades pessoais e familiares.' },

                                                                    { value: 'Geralmente o equilíbrio é possível, mas em certos períodos o trabalho exige uma dedicação maior que interfere temporariamente na vida pessoal.', label: 'Geralmente o equilíbrio é possível, mas em certos períodos o trabalho exige uma dedicação maior que interfere temporariamente na vida pessoal.' },

                                                                    { value: 'A carga de trabalho e as demandas da empresa invadem constantemente a vida pessoal, tornando o equilíbrio entre as duas esferas muito difícil ou impossível.', label: 'A carga de trabalho e as demandas da empresa invadem constantemente a vida pessoal, tornando o equilíbrio entre as duas esferas muito difícil ou impossível.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_21')}
                                                                onChange={handleMotivos('psicossociais_21')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[21]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[21] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_21')} onChange={(e) => handleClassificacaoChange('psicossociais_21', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_21')} onChange={(e) => setObservacaoPorKey('psicossociais_21', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Tenho mais tarefas do que consigo realizar no tempo disponível.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O volume de trabalho é adequado à jornada, permitindo a realização das tarefas com qualidade e sem sobrecarga.', label: 'O volume de trabalho é adequado à jornada, permitindo a realização das tarefas com qualidade e sem sobrecarga.' },

                                                                    { value: 'Ocasionalmente, o volume de tarefas excede o tempo disponível, mas são situações pontuais e gerenciáveis.', label: 'Ocasionalmente, o volume de tarefas excede o tempo disponível, mas são situações pontuais e gerenciáveis.' },

                                                                    { value: 'A sobrecarga quantitativa é uma condição crônica, com um volume de trabalho consistentemente superior à capacidade de realização no tempo previsto.', label: 'A sobrecarga quantitativa é uma condição crônica, com um volume de trabalho consistentemente superior à capacidade de realização no tempo previsto.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_22')}
                                                                onChange={handleMotivos('psicossociais_22')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[22]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[22] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_22')} onChange={(e) => handleClassificacaoChange('psicossociais_22', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_22')} onChange={(e) => setObservacaoPorKey('psicossociais_22', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Trabalho frequentemente sob pressão e prazos curtos.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'AO planejamento das tarefas permite a execução com prazos realistas e sem pressão indevida.', label: 'AO planejamento das tarefas permite a execução com prazos realistas e sem pressão indevida.' },

                                                                    { value: 'A pressão por prazos ocorre em situações específicas e previsíveis, não sendo uma característica constante do ambiente de trabalho.', label: 'A pressão por prazos ocorre em situações específicas e previsíveis, não sendo uma característica constante do ambiente de trabalho.' },

                                                                    { value: 'A pressão por prazos curtos é uma exigência constante, gerando um ambiente de alta tensão e risco de estresse.', label: 'A pressão por prazos curtos é uma exigência constante, gerando um ambiente de alta tensão e risco de estresse.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_23')}
                                                                onChange={handleMotivos('psicossociais_23')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[23]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[23] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_23')} onChange={(e) => handleClassificacaoChange('psicossociais_23', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_23')} onChange={(e) => setObservacaoPorKey('psicossociais_23', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Sinto-me exausto ao final do expediente.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O cansaço ao final do dia é normal e compatível com o esforço despendido, sem comprometer a recuperação para o dia seguinte.', label: 'O cansaço ao final do dia é normal e compatível com o esforço despendido, sem comprometer a recuperação para o dia seguinte.' },

                                                                    { value: 'O sentimento de exaustão é raro, ocorrendo apenas em dias de esforço atípico.', label: 'O sentimento de exaustão é raro, ocorrendo apenas em dias de esforço atípico.' },

                                                                    { value: 'A exaustão ao final do expediente é um sentimento frequente ou diário, indicando que a carga de trabalho excede a capacidade de recuperação.', label: 'A exaustão ao final do expediente é um sentimento frequente ou diário, indicando que a carga de trabalho excede a capacidade de recuperação.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_24')}
                                                                onChange={handleMotivos('psicossociais_24')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[24]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[24] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_24')} onChange={(e) => handleClassificacaoChange('psicossociais_24', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_24')} onChange={(e) => setObservacaoPorKey('psicossociais_24', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Tenho controle sobre como organizo minhas tarefas diárias.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Há total autonomia para planejar e organizar a sequência e o método de execução das próprias tarefas.', label: 'Há total autonomia para planejar e organizar a sequência e o método de execução das próprias tarefas.' },

                                                                    { value: 'É possível organizar as tarefas diárias dentro de um escopo e método de trabalho pré-definidos pela gestão.', label: 'É possível organizar as tarefas diárias dentro de um escopo e método de trabalho pré-definidos pela gestão.' },

                                                                    { value: 'As tarefas são rigidamente definidas e sequenciadas pela gestão, com pouca ou nenhuma margem para o trabalhador organizar seu próprio trabalho.', label: 'As tarefas são rigidamente definidas e sequenciadas pela gestão, com pouca ou nenhuma margem para o trabalhador organizar seu próprio trabalho.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_25')}
                                                                onChange={handleMotivos('psicossociais_25')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[25]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[25] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_25')} onChange={(e) => handleClassificacaoChange('psicossociais_25', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_25')} onChange={(e) => setObservacaoPorKey('psicossociais_25', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Posso tomar decisões sobre meu trabalho sem precisar de autorização constante.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A autonomia para tomar decisões relativas ao próprio trabalho é alta, sendo a consulta à gestão necessária apenas para questões estratégicas.', label: 'A autonomia para tomar decisões relativas ao próprio trabalho é alta, sendo a consulta à gestão necessária apenas para questões estratégicas.' },

                                                                    { value: 'A autonomia decisória está presente nas tarefas rotineiras, mas decisões que fogem do padrão exigem autorização superior.', label: 'A autonomia decisória está presente nas tarefas rotineiras, mas decisões que fogem do padrão exigem autorização superior.' },

                                                                    { value: 'Praticamente todas as decisões, mesmo as mais simples, requerem autorização da gestão, limitando a autonomia e a agilidade.', label: 'Praticamente todas as decisões, mesmo as mais simples, requerem autorização da gestão, limitando a autonomia e a agilidade.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_26')}
                                                                onChange={handleMotivos('psicossociais_26')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[26]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[26] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_26')} onChange={(e) => handleClassificacaoChange('psicossociais_26', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_26')} onChange={(e) => setObservacaoPorKey('psicossociais_26', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Tenho liberdade para sugerir melhorias no meu setor.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A empresa possui canais formais e informais que incentivam ativamente as sugestões de melhoria, e elas são valorizadas e consideradas.', label: 'A empresa possui canais formais e informais que incentivam ativamente as sugestões de melhoria, e elas são valorizadas e consideradas.' },

                                                                    { value: 'É possível dar sugestões, mas não há um processo formal para isso, e a implementação depende da iniciativa da gestão.', label: 'É possível dar sugestões, mas não há um processo formal para isso, e a implementação depende da iniciativa da gestão.' },

                                                                    { value: 'Não há espaço ou canais para sugerir melhorias, ou as sugestões feitas são consistentemente ignoradas pela gestão.', label: 'Não há espaço ou canais para sugerir melhorias, ou as sugestões feitas são consistentemente ignoradas pela gestão.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_27')}
                                                                onChange={handleMotivos('psicossociais_27')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[27]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[27] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_27')} onChange={(e) => handleClassificacaoChange('psicossociais_27', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_27')} onChange={(e) => setObservacaoPorKey('psicossociais_27', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Tenho uma boa relação com meus colegas de trabalho.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'As relações interpessoais com os colegas são baseadas em respeito, confiança e colaboração mútua.', label: 'As relações interpessoais com os colegas são baseadas em respeito, confiança e colaboração mútua.' },

                                                                    { value: 'A relação com os colegas é profissional e cordial, sem a presença de conflitos significativos.', label: 'A relação com os colegas é profissional e cordial, sem a presença de conflitos significativos.' },

                                                                    { value: 'As relações de trabalho são marcadas por conflitos, isolamento ou falta de confiança, prejudicando a colaboração.', label: 'As relações de trabalho são marcadas por conflitos, isolamento ou falta de confiança, prejudicando a colaboração.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_28')}
                                                                onChange={handleMotivos('psicossociais_28')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[28]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[28] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_28')} onChange={(e) => handleClassificacaoChange('psicossociais_28', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_28')} onChange={(e) => setObservacaoPorKey('psicossociais_28', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Sinto-me apoiado pela minha liderança quando enfrento dificuldades.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'A liderança demonstra apoio ativo e oferece os recursos necessários para que a equipe supere as dificuldades e desafios.', label: 'A liderança demonstra apoio ativo e oferece os recursos necessários para que a equipe supere as dificuldades e desafios.' },

                                                                    { value: 'O apoio da liderança existe, mas precisa ser solicitado pelo trabalhador, não sendo uma atitude proativa da gestão.', label: 'O apoio da liderança existe, mas precisa ser solicitado pelo trabalhador, não sendo uma atitude proativa da gestão.' },

                                                                    { value: 'Há uma percepção clara de falta de apoio por parte da liderança diante de dificuldades, gerando sentimentos de desamparo.', label: 'Há uma percepção clara de falta de apoio por parte da liderança diante de dificuldades, gerando sentimentos de desamparo.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_29')}
                                                                onChange={handleMotivos('psicossociais_29')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[29]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[29] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_29')} onChange={(e) => handleClassificacaoChange('psicossociais_29', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_29')} onChange={(e) => setObservacaoPorKey('psicossociais_29', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            O clima organizacional da empresa é positivo e motivador.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O clima organizacional é percebido como positivo, justo e motivador, promovendo o bem-estar e o engajamento dos funcionários.', label: 'O clima organizacional é percebido como positivo, justo e motivador, promovendo o bem-estar e o engajamento dos funcionários.' },

                                                                    { value: 'O clima organizacional é neutro, sem grandes fatores de desmotivação, mas também com poucas iniciativas que promovam ativamente a motivação.', label: 'O clima organizacional é neutro, sem grandes fatores de desmotivação, mas também com poucas iniciativas que promovam ativamente a motivação.' },

                                                                    { value: 'O clima organizacional é percebido como negativo, tenso ou desmotivador, impactando negativamente a satisfação e o desempenho.', label: 'O clima organizacional é percebido como negativo, tenso ou desmotivador, impactando negativamente a satisfação e o desempenho.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_30')}
                                                                onChange={handleMotivos('psicossociais_30')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[30]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[30] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_30')} onChange={(e) => handleClassificacaoChange('psicossociais_30', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_30')} onChange={(e) => setObservacaoPorKey('psicossociais_30', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Meu trabalho é valorizado e reconhecido pela empresa.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O reconhecimento pelo esforço e pelos resultados é uma prática consistente na cultura da empresa.', label: 'O reconhecimento pelo esforço e pelos resultados é uma prática consistente na cultura da empresa.' },

                                                                    { value: 'O reconhecimento ocorre de forma pontual, geralmente ligado a metas específicas, mas não é uma prática difundida na rotina.', label: 'O reconhecimento ocorre de forma pontual, geralmente ligado a metas específicas, mas não é uma prática difundida na rotina.' },

                                                                    { value: 'Há um sentimento generalizado de que o trabalho não é valorizado nem reconhecido pela empresa, gerando desmotivação.', label: 'Há um sentimento generalizado de que o trabalho não é valorizado nem reconhecido pela empresa, gerando desmotivação.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_31')}
                                                                onChange={handleMotivos('psicossociais_31')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[31]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[31] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_31')} onChange={(e) => handleClassificacaoChange('psicossociais_31', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_31')} onChange={(e) => setObservacaoPorKey('psicossociais_31', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Recebo feedbacks construtivos sobre o meu desempenho.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O feedback sobre o desempenho é uma prática regular, sendo realizado de forma construtiva e com foco no desenvolvimento.', label: 'O feedback sobre o desempenho é uma prática regular, sendo realizado de forma construtiva e com foco no desenvolvimento.' },

                                                                    { value: 'O feedback ocorre de forma irregular ou apenas quando há problemas de desempenho, com pouco foco no desenvolvimento contínuo.', label: 'O feedback ocorre de forma irregular ou apenas quando há problemas de desempenho, com pouco foco no desenvolvimento contínuo.' },

                                                                    { value: 'Não há uma cultura de feedback, ou o feedback, quando ocorre, é vago, punitivo ou inexistente.', label: 'Não há uma cultura de feedback, ou o feedback, quando ocorre, é vago, punitivo ou inexistente.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_32')}
                                                                onChange={handleMotivos('psicossociais_32')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[32]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[32] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_32')} onChange={(e) => handleClassificacaoChange('psicossociais_32', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_32')} onChange={(e) => setObservacaoPorKey('psicossociais_32', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Sinto que minha remuneração e benefícios são justos em relação às minhas responsabilidades.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Há uma percepção clara de que a remuneração e os benefícios são justos e competitivos em relação às responsabilidades do cargo e ao mercado.', label: 'Há uma percepção clara de que a remuneração e os benefícios são justos e competitivos em relação às responsabilidades do cargo e ao mercado.' },

                                                                    { value: 'A remuneração é percebida como aceitável, embora não seja considerada um grande diferencial ou fator de motivação.', label: 'A remuneração é percebida como aceitável, embora não seja considerada um grande diferencial ou fator de motivação.' },

                                                                    { value: 'Há um forte sentimento de que a remuneração e os benefícios são injustos ou insuficientes para as responsabilidades exigidas.', label: 'Há um forte sentimento de que a remuneração e os benefícios são injustos ou insuficientes para as responsabilidades exigidas.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_33')}
                                                                onChange={handleMotivos('psicossociais_33')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[33]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[33] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_33')} onChange={(e) => handleClassificacaoChange('psicossociais_33', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_33')} onChange={(e) => setObservacaoPorKey('psicossociais_33', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            O ambiente de trabalho me causa estresse e ansiedade frequentes.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O ambiente de trabalho é percebido como psicologicamente seguro e não é uma fonte de estresse ou ansiedade.', label: 'O ambiente de trabalho é percebido como psicologicamente seguro e não é uma fonte de estresse ou ansiedade.' },

                                                                    { value: 'O estresse e a ansiedade são reações pontuais a situações específicas de trabalho, não sendo um estado emocional crônico.', label: 'O estresse e a ansiedade são reações pontuais a situações específicas de trabalho, não sendo um estado emocional crônico.' },

                                                                    { value: 'O ambiente de trabalho é uma fonte constante de estresse e ansiedade, impactando a saúde mental e o bem-estar do trabalhador.', label: 'O ambiente de trabalho é uma fonte constante de estresse e ansiedade, impactando a saúde mental e o bem-estar do trabalhador.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_34')}
                                                                onChange={handleMotivos('psicossociais_34')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[34]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[34] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_34')} onChange={(e) => handleClassificacaoChange('psicossociais_34', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_34')} onChange={(e) => setObservacaoPorKey('psicossociais_34', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Já fui vítima de assédio moral ou tratamento injusto no trabalho.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'Não há percepção ou relatos de assédio moral ou tratamento injusto. O ambiente é de total respeito.', label: 'Não há percepção ou relatos de assédio moral ou tratamento injusto. O ambiente é de total respeito.' },

                                                                    { value: 'Não há relatos de assédio, mas podem ocorrer situações percebidas como tratamento injusto de forma pontual e isolada.', label: 'Não há relatos de assédio, mas podem ocorrer situações percebidas como tratamento injusto de forma pontual e isolada.' },

                                                                    { value: 'Há relatos ou uma percepção clara da ocorrência de assédio moral ou tratamento injusto sistemático, indicando um ambiente de trabalho hostil.', label: 'Há relatos ou uma percepção clara da ocorrência de assédio moral ou tratamento injusto sistemático, indicando um ambiente de trabalho hostil.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_35')}
                                                                onChange={handleMotivos('psicossociais_35')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[35]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[35] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_35')} onChange={(e) => handleClassificacaoChange('psicossociais_35', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_35')} onChange={(e) => setObservacaoPorKey('psicossociais_35', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 border border-gray-200 text-xs">
                                                            Sinto que há competitividade excessiva e pouco trabalho em equipe na empresa.
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200 min-w-[300px]">

                                                            <CreatableSelect
                                                                isMulti
                                                                options={[
                                                                    { value: 'O trabalho em equipe e a colaboração são fortemente incentivados e praticados.', label: 'O trabalho em equipe e a colaboração são fortemente incentivados e praticados.' },

                                                                    { value: 'O trabalho é mais individualizado, mas não há um clima de competitividade prejudicial entre os colegas.', label: 'O trabalho é mais individualizado, mas não há um clima de competitividade prejudicial entre os colegas.' },

                                                                    { value: 'A competitividade entre colegas é excessiva e estimulada, prejudicando a colaboração e o trabalho em equipe.', label: 'A competitividade entre colegas é excessiva e estimulada, prejudicando a colaboração e o trabalho em equipe.' }
                                                                ]}
                                                                value={motivosValue('psicossociais_36')}
                                                                onChange={handleMotivos('psicossociais_36')}
                                                                placeholder="Digite ou selecione motivos..."
                                                                classNamePrefix="react-select"
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        minHeight: '28px',
                                                                        fontSize: '12px',
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        minWidth: '250px'
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: '#e0f2fe',
                                                                        color: '#0369a1',
                                                                        fontSize: '11px',
                                                                        maxWidth: '200px'
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999,
                                                                        maxWidth: '400px'
                                                                    }),
                                                                    menuPortal: (base) => ({
                                                                        ...base,
                                                                        zIndex: 9999
                                                                    })
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <textarea
                                                                placeholder="Embasamento"
                                                                value={embasamentosPsicossociais[36]}
                                                                onChange={e => {
                                                                    const newArr = [...embasamentosPsicossociais];
                                                                    newArr[36] = e.target.value;
                                                                    setEmbasamentosPsicossociais(newArr);
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <select className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getClassificacaoPorKey('psicossociais_36')} onChange={(e) => handleClassificacaoChange('psicossociais_36', e.target.value)}>
                                                                <option value="">Classificação</option>

                                                                <option value="baixo">Baixo</option>
                                                                <option value="medio">Médio</option>
                                                                <option value="alto">Alto</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2 border border-gray-200">
                                                            <input type="text" placeholder="Observações" className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-teal-500 rounded" value={getObservacaoPorKey('psicossociais_36')} onChange={(e) => setObservacaoPorKey('psicossociais_36', e.target.value)} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 10. Tabela Resumo – Riscos x Soluções */}
                    <div id="secao-10" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <BarChart3 className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">10</span>
                            Tabela Resumo – Riscos x Soluções
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Risco Identificado</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Classificação</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Solução Proposta</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Prazo Sugerido</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riscoseSolucoes.map((risco) => (
                                        <tr key={risco.id}>
                                            <td className="border border-gray-300 px-4 py-3">
                                                <input
                                                    type="text"
                                                    placeholder="Descreva o risco"
                                                    value={risco.risco}
                                                    onChange={(e) => handleRiscoSolucaoChange(risco.id, 'risco', e.target.value)}
                                                    className="w-full px-3 py-2 border-0 focus:ring-2 focus:ring-teal-500 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                <select
                                                    value={risco.classificacao}
                                                    onChange={(e) => handleRiscoSolucaoChange(risco.id, 'classificacao', e.target.value)}
                                                    className="w-full px-3 py-2 border-0 focus:ring-2 focus:ring-teal-500 rounded"
                                                >
                                                    <option value="">Classificação</option>
                                                    <option value="baixo">Baixo</option>
                                                    <option value="medio">Médio</option>
                                                    <option value="alto">Alto</option>
                                                </select>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                <select
                                                    value={risco.solucao}
                                                    onChange={(e) => handleRiscoSolucaoChange(risco.id, 'solucao', e.target.value)}
                                                    className="w-full px-3 py-2 border-0 focus:ring-2 focus:ring-teal-500 rounded"
                                                >
                                                    <option value="">Selecione uma solução</option>
                                                    {getSolucoesParaRisco(risco.risco).map((solucao, index) => (
                                                        <option key={index} value={solucao}>
                                                            {solucao}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                <select
                                                    value={risco.prazo}
                                                    onChange={(e) => handleRiscoSolucaoChange(risco.id, 'prazo', e.target.value)}
                                                    className="w-full px-3 py-2 border-0 focus:ring-2 focus:ring-teal-500 rounded"
                                                >
                                                    <option value="">Prazo Sugerido</option>
                                                    <option value="curto">Curto prazo</option>
                                                    <option value="medio">Médio prazo</option>
                                                    <option value="longo">Longo prazo</option>
                                                </select>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <button
                                                    onClick={() => removerRiscoSolucao(risco.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                    disabled={riscoseSolucoes.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={adicionarRiscoSolucao}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Risco
                            </button>
                        </div>
                    </div>

                    {/* 11. Matriz de Riscos Ergonômicos */}
                    <div id="secao-11" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <BarChart3 className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">11</span>
                            Matriz de Riscos Ergonômicos
                        </h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Esta matriz apresenta os riscos identificados organizados por gravidade, probabilidade e nível de risco/classificação.
                            </p>

                            {/* Legenda de Cores */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Legenda de Classificação:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                                        <span className="text-sm text-gray-700">Crítico (Ação Imediata)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                        <span className="text-sm text-gray-700">Alto (Ação Prioritária)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                        <span className="text-sm text-gray-700">Moderado (Ação Programada)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                                        <span className="text-sm text-gray-700">Baixo (Monitoramento)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900 w-12">Nº</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Risco Erg. Identificado</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Gravidade</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Probabilidade</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Nível de Risco / Classificação</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Medidas Propostas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riscoseSolucoes.filter(risco =>
                                        risco.risco.trim() !== '' &&
                                        risco.classificacao.trim() !== '' &&
                                        ['baixo', 'medio', 'alto'].includes(risco.classificacao.toLowerCase())
                                    ).map((risco, index) => {
                                        // Função para determinar a cor baseada no nível de risco
                                        const getNivelRiscoColor = (nivelRisco: string) => {
                                            if (!nivelRisco || typeof nivelRisco !== 'string') {
                                                return 'bg-gray-200 text-gray-700';
                                            }
                                            switch (nivelRisco.toLowerCase()) {
                                                case 'critico':
                                                    return 'bg-red-500 text-white';
                                                case 'alto':
                                                    return 'bg-orange-500 text-white';
                                                case 'moderado':
                                                case 'medio':
                                                    return 'bg-yellow-500 text-white';
                                                case 'baixo':
                                                    return 'bg-green-500 text-white';
                                                default:
                                                    return 'bg-gray-200 text-gray-700';
                                            }
                                        };

                                        return (
                                            <tr key={risco.id}>
                                                <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <span className="text-sm text-gray-800">
                                                        {risco.risco || '[Perigo encontrado]'}
                                                    </span>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    <select
                                                        value={risco.gravidade}
                                                        onChange={(e) => handleRiscoSolucaoChange(risco.id, 'gravidade', e.target.value)}
                                                        className="w-full px-2 py-1 text-xs border-0 focus:ring-2 focus:ring-teal-500 rounded bg-gray-100"
                                                    >
                                                        <option value="">Gravidade</option>
                                                        <option value="Baixa">Baixa</option>
                                                        <option value="Média">Média</option>
                                                        <option value="Alta">Alta</option>
                                                    </select>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    <select
                                                        value={risco.probabilidade}
                                                        onChange={(e) => handleRiscoSolucaoChange(risco.id, 'probabilidade', e.target.value)}
                                                        className="w-full px-2 py-1 text-xs border-0 focus:ring-2 focus:ring-teal-500 rounded bg-gray-100"
                                                    >
                                                        <option value="">Probabilidade</option>
                                                        <option value="Ocasional">Ocasional</option>
                                                        <option value="Frequente">Frequente</option>
                                                        <option value="Provável">Provável</option>
                                                        <option value="Raro">Raro</option>
                                                    </select>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    <select
                                                        value={risco.nivelRisco}
                                                        onChange={(e) => handleRiscoSolucaoChange(risco.id, 'nivelRisco', e.target.value)}
                                                        className={`w-full px-2 py-1 text-xs font-medium rounded border-0 focus:ring-2 focus:ring-teal-500 ${getNivelRiscoColor(risco.nivelRisco)}`}
                                                    >
                                                        <option value="">Nível de Risco</option>
                                                        <option value="Baixo">Baixo</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Alto">Alto</option>
                                                        <option value="Critico">Crítico</option>
                                                    </select>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <span className="text-sm text-gray-800">
                                                        {risco.solucao || '[Medida Proposta]'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {riscoseSolucoes.filter(risco =>
                                        risco.risco.trim() !== '' &&
                                        risco.classificacao.trim() !== '' &&
                                        ['baixo', 'medio', 'alto'].includes(risco.classificacao.toLowerCase())
                                    ).length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                    <div className="space-y-2">
                                                        <p className="font-medium">Nenhum risco classificado ainda</p>
                                                        <p className="text-sm">Adicione motivos na Seção 8 (Avaliação por Categoria de Perigos) e classifique-os para visualizá-los aqui.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Nota:</strong> Esta matriz é automaticamente preenchida com base nos riscos identificados na seção anterior.
                                As classificações de gravidade e probabilidade são determinadas automaticamente com base no nível de risco selecionado.
                            </p>
                        </div>
                    </div>

                    {/* 12. Recomendações Gerais */}
                    <div id="secao-12" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <ClipboardList className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">12</span>
                            Recomendações Gerais
                        </h2>

                        {/* Treinamentos */}
                        <div className="border border-gray-200 rounded-lg mb-4">
                            <button
                                onClick={() => toggleAccordion('treinamentos')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Treinamentos</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.treinamentos ? 'rotate-180' : ''
                                    }`} />
                            </button>
                            {openAccordions.treinamentos && (
                                <div className="px-4 py-3 border-t border-gray-200">
                                    <textarea
                                        rows={4}
                                        placeholder="Descreva as recomendações para treinamentos..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                        value={formData.treinamentosRecomendacoes}
                                        onChange={(e) => handleInputChange('treinamentosRecomendacoes', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Mobiliário e Equipamentos */}
                        <div className="border border-gray-200 rounded-lg mb-4">
                            <button
                                onClick={() => toggleAccordion('mobiliarioEquipamentos')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Mobiliário e Equipamentos</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.mobiliarioEquipamentos ? 'rotate-180' : ''
                                    }`} />
                            </button>
                            {openAccordions.mobiliarioEquipamentos && (
                                <div className="px-4 py-3 border-t border-gray-200">
                                    <textarea
                                        rows={4}
                                        placeholder="Descreva as recomendações para mobiliário e equipamentos..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                        value={formData.mobiliarioEquipamentosRecomendacoes}
                                        onChange={(e) => handleInputChange('mobiliarioEquipamentosRecomendacoes', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Pausas e Ginástica Laboral */}
                        <div className="border border-gray-200 rounded-lg mb-4">
                            <button
                                onClick={() => toggleAccordion('pausasGinastica')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Pausas e Ginástica Laboral</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.pausasGinastica ? 'rotate-180' : ''
                                    }`} />
                            </button>
                            {openAccordions.pausasGinastica && (
                                <div className="px-4 py-3 border-t border-gray-200">
                                    <textarea
                                        rows={4}
                                        placeholder="Descreva as recomendações para pausas e ginástica laboral..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                        value={formData.pausasGinasticaRecomendacoes}
                                        onChange={(e) => handleInputChange('pausasGinasticaRecomendacoes', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Aspectos Organizacionais */}
                        <div className="border border-gray-200 rounded-lg mb-4">
                            <button
                                onClick={() => toggleAccordion('aspectosOrganizacionais')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Aspectos Organizacionais</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openAccordions.aspectosOrganizacionais ? 'rotate-180' : ''
                                    }`} />
                            </button>
                            {openAccordions.aspectosOrganizacionais && (
                                <div className="px-4 py-3 border-t border-gray-200">
                                    <textarea
                                        rows={4}
                                        placeholder="Descreva as recomendações para aspectos organizacionais..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                        value={formData.aspectosOrganizacionaisRecomendacoes}
                                        onChange={(e) => handleInputChange('aspectosOrganizacionaisRecomendacoes', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 13. Cronograma de Ações – 18 Meses */}
                    <div id="secao-13" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <Calendar className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">13</span>
                            Cronograma de Ações – 18 Meses
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Ação</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Trimestre 1</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Trimestre 2</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Trimestre 3</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Trimestre 4</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Trimestre 5</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Trimestre 6</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {acoesCronograma.map((acao) => (
                                        <tr key={acao.id}>
                                            <td className="border border-gray-300 px-4 py-3">
                                                <input
                                                    type="text"
                                                    placeholder="Descreva a ação"
                                                    value={acao.acao}
                                                    onChange={(e) => handleAcaoCronogramaChange(acao.id, 'acao', e.target.value)}
                                                    className="w-full px-3 py-2 border-0 focus:ring-2 focus:ring-teal-500 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={acao.trimestre1}
                                                    onChange={(e) => handleAcaoCronogramaChange(acao.id, 'trimestre1', e.target.checked)}
                                                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={acao.trimestre2}
                                                    onChange={(e) => handleAcaoCronogramaChange(acao.id, 'trimestre2', e.target.checked)}
                                                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={acao.trimestre3}
                                                    onChange={(e) => handleAcaoCronogramaChange(acao.id, 'trimestre3', e.target.checked)}
                                                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={acao.trimestre4}
                                                    onChange={(e) => handleAcaoCronogramaChange(acao.id, 'trimestre4', e.target.checked)}
                                                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={acao.trimestre5}
                                                    onChange={(e) => handleAcaoCronogramaChange(acao.id, 'trimestre5', e.target.checked)}
                                                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={acao.trimestre6}
                                                    onChange={(e) => handleAcaoCronogramaChange(acao.id, 'trimestre6', e.target.checked)}
                                                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <button
                                                    onClick={() => removerAcaoCronograma(acao.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                    disabled={acoesCronograma.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={adicionarAcaoCronograma}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Ação
                            </button>
                        </div>
                    </div>

                    {/* 14. Encerramento */}
                    <div id="secao-14" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <RotateCcw className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">14</span>
                            Encerramento
                        </h2>

                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data de Encerramento
                                </label>
                                <input
                                    type="date"
                                    placeholder="dd/mm/aaaa"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    value={formData.dataEncerramento}
                                    onChange={(e) => handleInputChange('dataEncerramento', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Validade do Laudo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: 12 meses"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    value={formData.validadeLaudo}
                                    onChange={(e) => handleInputChange('validadeLaudo', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conclusão
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Conclusões finais da avaliação ergonômica..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                value={formData.conclusao}
                                onChange={(e) => handleInputChange('conclusao', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 15. Responsável Técnico */}
                    <div id="secao-15" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <UserCheck className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">15</span>
                            Responsável Técnico
                        </h2>

                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Ergonomista
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    value={formData.responsavelTecnicoNome}
                                    onChange={(e) => handleInputChange('responsavelTecnicoNome', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Registro Profissional (CREFITO)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Número do CREFITO"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    value={formData.responsavelTecnicoRegistro}
                                    onChange={(e) => handleInputChange('responsavelTecnicoRegistro', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Formação
                                </label>
                                <input
                                    type="text"
                                    placeholder="Formação acadêmica"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    value={formData.responsavelTecnicoFormacao}
                                    onChange={(e) => handleInputChange('responsavelTecnicoFormacao', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Especialização
                                </label>
                                <input
                                    type="text"
                                    placeholder="Especializações"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    value={formData.responsavelTecnicoEspecializacao}
                                    onChange={(e) => handleInputChange('responsavelTecnicoEspecializacao', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 16. Bibliografia Técnica */}
                    <div id="secao-16" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                <BookOpen className="w-4 h-4" />
                            </span>
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">16</span>
                            Bibliografia Técnica
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Referências Bibliográficas (editável)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Descreva as recomendações para treinamentos..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                value={formData.referenciasBibliograficas}
                                onChange={(e) => handleInputChange('referenciasBibliograficas', e.target.value)}
                            />
                        </div>

                        <p className="text-sm text-gray-600">
                            Inclua todas as referências bibliográficas utilizadas na elaboração deste laudo.
                        </p>
                    </div>

                    {/* Botões de Ação Final */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium ${isLoading
                                    ? 'bg-teal-400 cursor-not-allowed'
                                    : 'bg-teal-600 hover:bg-teal-700'
                                    }`}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {isLoading
                                    ? (isEditing ? 'Atualizando...' : 'Salvando...')
                                    : (isEditing ? 'Atualizar AEP' : 'Salvar Dados')
                                }
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}