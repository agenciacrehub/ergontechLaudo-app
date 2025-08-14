import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toastError } from '../../utils/toast';

interface FormData {
  // Informações da Empresa
  razao_social: string;
  cnpj: string;

  // Informações do Colaborador
  nome_completo: string;
  setor: string;
  cargo: string;
  data_coleta: string;

  // Perigos Biomecânicos
  bio_postura: string;
  p1_comentario: string;
  bio_cargas: string;
  p2_comentario: string;
  bio_puxar: string;
  p3_comentario: string;
  bio_repetitivos: string;
  p4_comentario: string;
  bio_ferramentas: string;
  p5_comentario: string;
  bio_compressao: string;
  p6_comentario: string;
  bio_flexoes: string;
  p7_comentario: string;
  bio_pedais: string;
  p8_comentario: string;
  bio_elevacao: string;
  p9_comentario: string;
  bio_vibracao_corpo: string;
  p10_comentario: string;
  bio_vibracao_localizada: string;
  p11_comentario: string;
  bio_torcao: string;
  p12_comentario: string;
  bio_trabalho_duro: string;
  p13_comentario: string;
  bio_postura_sentada: string;
  p14_comentario: string;

  // Perigos Mobiliários
  mob_improvisado: string;
  mob_p1_comentario: string;
  mob_inadequado: string;
  mob_p2_comentario: string;
  mob_espacos: string;
  mob_p3_comentario: string;
  mob_alcance: string;
  mob_p4_comentario: string;
  mob_equipamentos_trabalhador: string;
  mob_p5_comentario: string;
  mob_posto_trabalho: string;
  mob_p6_comentario: string;

  // Perigos Organizacionais
  org_pausas: string;
  org_p1_comentario: string;
  org_ritmos: string;
  org_p2_comentario: string;
  org_monotonia: string;
  org_p3_comentario: string;
  org_noturno: string;
  org_p4_comentario: string;
  org_renumerado: string;
  org_p5_comentario: string;
  org_cadencia: string;
  org_p6_comentario: string;

  // Perigos Ambientais
  amb_sonora: string;
  amb_p1_comentario: string;
  amb_temperatura: string;
  amb_p2_comentario: string;
  amb_vibracao: string;
  amb_p3_comentario: string;

  // Avaliação Psicossocial (já existente no form-ergon.tsx)
  psic_1: string;
  psic_2: string;
  psic_3: string;
  psic_4: string;
  psic_5: string;
  psic_6: string;
  psic_7: string;
  psic_8: string;
  psic_9: string;
  psic_10: string;
  psic_11: string;
  psic_12: string;
  psic_13: string;
  psic_14: string;
  psic_15: string;
  psic_16: string;
  psic_17: string;
  psic_18: string;
  psic_19: string;
  psic_20: string;
  psic_21: string;
  psic_22: string;
  psic_23: string;
  psic_24: string;
  psic_25: string;
  psic_26: string;
  psic_27: string;
  psic_28: string;
  psic_29: string;
  psic_30: string;
  psic_31: string;
  psic_32: string;
  psic_33: string;
  psic_34: string;
  psic_35: string;
  psic_36: string;
  psic_37: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Função utilitária para obter data local no formato YYYY-MM-DD
const getLocalDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const FormErgon2: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState('06:00:00');
  const [tokenExpiresAt, setTokenExpiresAt] = useState<Date | null>(null);
  const [laudoId, setLaudoId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Informações da Empresa
    razao_social: '',
    cnpj: '',

    // Informações do Colaborador
    nome_completo: '',
    setor: '',
    cargo: '',
    data_coleta: getLocalDateString(),

    // Perigos Biomecânicos
    bio_postura: '',
    p1_comentario: '',
    bio_cargas: '',
    p2_comentario: '',
    bio_puxar: '',
    p3_comentario: '',
    bio_repetitivos: '',
    p4_comentario: '',
    bio_ferramentas: '',
    p5_comentario: '',
    bio_compressao: '',
    p6_comentario: '',
    bio_flexoes: '',
    p7_comentario: '',
    bio_pedais: '',
    p8_comentario: '',
    bio_elevacao: '',
    p9_comentario: '',
    bio_vibracao_corpo: '',
    p10_comentario: '',
    bio_vibracao_localizada: '',
    p11_comentario: '',
    bio_torcao: '',
    p12_comentario: '',
    bio_trabalho_duro: '',
    p13_comentario: '',
    bio_postura_sentada: '',
    p14_comentario: '',

    // Perigos Mobiliários
    mob_improvisado: '',
    mob_p1_comentario: '',
    mob_inadequado: '',
    mob_p2_comentario: '',
    mob_espacos: '',
    mob_p3_comentario: '',
    mob_alcance: '',
    mob_p4_comentario: '',
    mob_equipamentos_trabalhador: '',
    mob_p5_comentario: '',
    mob_posto_trabalho: '',
    mob_p6_comentario: '',

    // Perigos Organizacionais
    org_pausas: '',
    org_p1_comentario: '',
    org_ritmos: '',
    org_p2_comentario: '',
    org_monotonia: '',
    org_p3_comentario: '',
    org_noturno: '',
    org_p4_comentario: '',
    org_renumerado: '',
    org_p5_comentario: '',
    org_cadencia: '',
    org_p6_comentario: '',

    // Perigos Ambientais
    amb_sonora: '',
    amb_p1_comentario: '',
    amb_temperatura: '',
    amb_p2_comentario: '',
    amb_vibracao: '',
    amb_p3_comentario: '',

    // Avaliação Psicossocial
    psic_1: '',
    psic_2: '',
    psic_3: '',
    psic_4: '',
    psic_5: '',
    psic_6: '',
    psic_7: '',
    psic_8: '',
    psic_9: '',
    psic_10: '',
    psic_11: '',
    psic_12: '',
    psic_13: '',
    psic_14: '',
    psic_15: '',
    psic_16: '',
    psic_17: '',
    psic_18: '',
    psic_19: '',
    psic_20: '',
    psic_21: '',
    psic_22: '',
    psic_23: '',
    psic_24: '',
    psic_25: '',
    psic_26: '',
    psic_27: '',
    psic_28: '',
    psic_29: '',
    psic_30: '',
    psic_31: '',
    psic_32: '',
    psic_33: '',
    psic_34: '',
    psic_35: '',
    psic_36: '',
    psic_37: '',
  });

  const radioOptions = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'];

  // useEffect para capturar token da URL e validar (executa apenas uma vez)
  useEffect(() => {
    if (initialized) return; // Evita execução dupla

    const tokenFromUrl = searchParams.get('token');
    const laudoIdFromUrl = searchParams.get('laudoId'); // Manter compatibilidade com links antigos

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setInitialized(true);
      validateTokenAndFetchData(tokenFromUrl);
    } else if (laudoIdFromUrl) {
      // Compatibilidade com links antigos (sem token)
      setLaudoId(laudoIdFromUrl);
      setInitialized(true);
      fetchLaudoDataDirect(laudoIdFromUrl);
    } else {
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  // useEffect para cronômetro - atualiza timeLeft a cada segundo
  useEffect(() => {
    if (!tokenExpiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const timeRemaining = tokenExpiresAt.getTime() - now.getTime();

      if (timeRemaining <= 0) {
        setTimeLeft('00:00:00');
        setTokenExpired(true);
        return;
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeLeft(formattedTime);
    };

    // Atualizar imediatamente
    updateTimer();

    // Configurar intervalo para atualizar a cada segundo
    const interval = setInterval(updateTimer, 1000);

    // Cleanup do intervalo
    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  // Função para validar token e buscar dados do laudo
  const validateTokenAndFetchData = async (tokenValue: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/formularios/validate-token/${tokenValue}`);

      if (response.data.success) {
        const { laudo_id, laudo, expires_at } = response.data.data;
        setLaudoId(laudo_id);

        // Definir data de expiração para o cronômetro
        if (expires_at) {
          setTokenExpiresAt(new Date(expires_at));
        } else {
          // Fallback: assumir 6 horas a partir de agora se não tiver expires_at
          const fallbackExpiration = new Date();
          fallbackExpiration.setHours(fallbackExpiration.getHours() + 6);
          setTokenExpiresAt(fallbackExpiration);
        }

        // Preencher automaticamente os campos da empresa
        if (laudo && laudo.company) {
          setFormData(prev => ({
            ...prev,
            razao_social: laudo.company.legal_name || '',
            cnpj: laudo.company.cnpj || ''
          }));
        }
      } else {
        setTokenExpired(true);
        toastError(response.data.message || 'Token inválido');
      }
    } catch (error: any) {
      console.error('Erro ao validar token:', error);
      setTokenExpired(true);
      if (error.response?.status === 404) {
        toastError('Token não encontrado ou inválido');
      } else if (error.response?.data?.message?.includes('expirado')) {
        toastError('Link expirado. Solicite um novo link.');
      } else {
        toastError('Erro ao carregar formulário');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar dados diretamente pelo laudoId (compatibilidade)
  const fetchLaudoDataDirect = async (laudoIdValue: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/reports/${laudoIdValue}`);
      const laudo = response.data;

      if (laudo && laudo.company) {
        setFormData(prev => ({
          ...prev,
          razao_social: laudo.company.legal_name || '',
          cnpj: laudo.company.cnpj || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do laudo:', error);
      toastError('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (stepIndex: number): boolean => {
    // Implementar validação específica para cada etapa
    switch (stepIndex) {
      case 0: // Informações
        return !!(formData.razao_social && formData.cnpj && formData.nome_completo && formData.setor && formData.cargo);
      case 1: // Biomecânicos
        return !!(formData.bio_postura && formData.bio_cargas && formData.bio_puxar && formData.bio_repetitivos &&
          formData.bio_ferramentas && formData.bio_compressao && formData.bio_flexoes && formData.bio_pedais && formData.bio_elevacao && formData.bio_vibracao_corpo && formData.bio_vibracao_localizada && formData.bio_torcao && formData.bio_trabalho_duro && formData.bio_postura_sentada);
      case 2: // Mobiliários
        return !!(formData.mob_improvisado && formData.mob_inadequado && formData.mob_espacos && formData.mob_alcance && formData.mob_equipamentos_trabalhador && formData.mob_posto_trabalho);
      case 3: // Organizacionais
        return !!(formData.org_pausas && formData.org_ritmos && formData.org_monotonia && formData.org_noturno && formData.org_renumerado && formData.org_cadencia);
      case 4: // Ambientais
        return !!(formData.amb_sonora && formData.amb_temperatura && formData.amb_vibracao);
      case 5: // Psicossociais
        return !!(formData.psic_1 && formData.psic_2 && formData.psic_3 && formData.psic_4 && formData.psic_5 && formData.psic_6 && formData.psic_7 && formData.psic_8 && formData.psic_9 && formData.psic_10 && formData.psic_11 && formData.psic_12 && formData.psic_13 && formData.psic_14 && formData.psic_15 && formData.psic_16 && formData.psic_17 && formData.psic_18 && formData.psic_19 && formData.psic_20 && formData.psic_21 && formData.psic_22 && formData.psic_23 && formData.psic_24 && formData.psic_25 && formData.psic_26 && formData.psic_27 && formData.psic_28 && formData.psic_29 && formData.psic_30 && formData.psic_31 && formData.psic_32 && formData.psic_33 && formData.psic_34 && formData.psic_35 && formData.psic_36 && formData.psic_37);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios antes de avançar.');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Capturar o ID do laudo da URL e buscar dados da empresa
  useEffect(() => {
    const laudoIdFromUrl = searchParams.get('laudoId');
    if (laudoIdFromUrl) {
      setLaudoId(laudoIdFromUrl);
      fetchLaudoData(laudoIdFromUrl);
    }
  }, [searchParams]);

  // Função para buscar dados do laudo e empresa
  const fetchLaudoData = async (laudoId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/reports/${laudoId}`);
      const laudo = response.data;

      if (laudo && laudo.company) {
        // Preencher automaticamente os campos da empresa
        setFormData(prev => ({
          ...prev,
          razao_social: laudo.company.legal_name || '',
          cnpj: laudo.company.cnpj || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do laudo:', error);
      toastError('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!laudoId) {
      toastError('ID do laudo não encontrado');
      return;
    }

    if (validateStep(currentStep)) {
      try {
        setLoading(true);

        const formDataToSend = {
          laudo_id: laudoId,
          respostas: formData
        };
        const response = await axios.post(`${API_URL}/formularios`, formDataToSend);

        if (response.data.success) {
          setFormSubmitted(true);
        } else {
          toastError(response.data.message || 'Erro ao enviar formulário');
        }
      } catch (error: any) {
        console.error('Erro ao enviar formulário:', error);
        toastError(error.response?.data?.message || 'Erro ao enviar formulário');
      } finally {
        setLoading(false);
      }
    } else {
      toastError('Por favor, preencha todos os campos obrigatórios antes de enviar.');
    }
  };

  const renderRadioGroup = (name: keyof FormData, question: string, commentField?: keyof FormData) => (
    <div className="question-block mb-4 sm:mb-6">
      <p className="mb-2 sm:mb-3 font-medium text-gray-700 text-sm sm:text-base leading-relaxed">{question}</p>
      <div className="options-group grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-3">
        {radioOptions.map((option, index) => (
          <div key={index} className="option-item flex items-center p-2 sm:p-1 border border-gray-200 sm:border-0 rounded sm:rounded-none hover:bg-gray-50 sm:hover:bg-transparent">
            <input
              type="radio"
              id={`${name}_${index + 1}`}
              name={name}
              value={option}
              checked={formData[name] === option}
              onChange={handleInputChange}
              required
              className="mr-2 sm:mr-1 flex-shrink-0"
            />
            <label htmlFor={`${name}_${index + 1}`} className="text-xs sm:text-sm cursor-pointer leading-tight">
              {option}
            </label>
          </div>
        ))}
      </div>
      {commentField && (
        <textarea
          name={commentField}
          value={formData[commentField] || ''}
          onChange={handleInputChange}
          placeholder="Comentário..."
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-md resize-none text-sm sm:text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          rows={3}
        />
      )}
    </div>
  );

  // Tela de sucesso após envio das respostas
  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-4 flex justify-center items-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Respostas enviadas com sucesso!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Muito obrigado por participar!
              <br />Suas respostas foram registradas com sucesso.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-green-800">
                <strong>Informação:</strong> Suas respostas contribuem para melhorar as condições ergonômicas do ambiente de trabalho.
              </p>
            </div>
            <button
              onClick={() => window.close()}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Fechar Janela
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de erro para token expirado
  if (tokenExpired) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-4 flex justify-center items-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Link Expirado</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Este link de acesso ao formulário ergonômico expirou ou é inválido.
              <br />Por favor, solicite um novo link ao responsável.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>Informação:</strong> Os links de acesso expiram em 6 horas por motivos de segurança.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-4 flex justify-center items-start sm:items-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center sm:justify-between pb-4 sm:pb-6 border-b-2 border-gray-200 mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="logo">
            <img
              src="https://ergontech.net/images/Logo_ErgonTech.png"
              alt="Logo ErgonTech"
              className="w-16 sm:w-20"
            />
          </div>
          <div className="company-info text-center sm:text-right">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-0">Formulário Ergonômico</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-0">ErgonTech - Soluções Ergonômicas</p>
            {token && (
              <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full inline-block">
                🔒 Link Seguro Ativo
              </div>
            )}
            {laudoId && !token && (
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full inline-block">
                📄 Laudo ID: {laudoId}
              </div>
            )}
          </div>
        </header>

        {/* Timer Info - apenas para tokens */}
        {token && (
          <div className="text-center mb-4 sm:mb-6">
            <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${timeLeft === '00:00:00' ? 'bg-red-100 text-red-800' :
                timeLeft.startsWith('00:') && parseInt(timeLeft.split(':')[1]) < 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
              }`}>
              <span className="mr-1 sm:mr-2">⏰</span>
              <span className="font-mono font-bold text-base sm:text-lg">{timeLeft}</span>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm">restante</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Link seguro com expiração automática</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Etapa 1: Informações */}
          {currentStep === 0 && (
            <div className="form-step">
              <fieldset className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <legend className="px-2 font-semibold text-gray-700 text-sm sm:text-base">Informações da Empresa</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="input-group">
                    <label htmlFor="razao_social" className="block text-sm font-medium text-gray-700 mb-1">
                      Razão Social {laudoId && <span className="text-xs text-blue-600">(Preenchido automaticamente)</span>}
                    </label>
                    <input
                      type="text"
                      id="razao_social"
                      name="razao_social"
                      value={loading ? 'Carregando...' : formData.razao_social}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className={`w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${loading ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ {laudoId && <span className="text-xs text-blue-600">(Preenchido automaticamente)</span>}
                    </label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={loading ? 'Carregando...' : formData.cnpj}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      pattern="\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}"
                      className={`w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${loading ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <legend className="px-2 font-semibold text-gray-700 text-sm sm:text-base">Informações do Colaborador</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="input-group">
                    <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="nome_completo"
                      name="nome_completo"
                      value={formData.nome_completo}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="setor" className="block text-sm font-medium text-gray-700 mb-1">
                      Setor / Departamento
                    </label>
                    <input
                      type="text"
                      id="setor"
                      name="setor"
                      value={formData.setor}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo / Função
                    </label>
                    <input
                      type="text"
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="data_coleta" className="block text-sm font-medium text-gray-700 mb-1">
                      Data da Coleta
                    </label>
                    <input
                      type="date"
                      id="data_coleta"
                      name="data_coleta"
                      value={formData.data_coleta}
                      readOnly
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md bg-gray-100 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </fieldset>

              <div className="btn-container flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-teal-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm sm:text-base"
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}

          {/* Etapa 2: Biomecânicos */}
          {currentStep === 1 && (
            <div className="form-step">
              <fieldset className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <legend className="px-2 font-semibold text-gray-700 text-sm sm:text-base">PERIGOS ERGONÔMICOS - BIOMECÂNICOS</legend>

                {renderRadioGroup('bio_postura', 'Exigência de posturas incômodas ou pouco confortável por longos períodos (posturas estáticas)', 'p1_comentario')}
                {renderRadioGroup('bio_cargas', 'Levantamento e transporte manual de cargas ou volumes e/ou pega pobre', 'p2_comentario')}
                {renderRadioGroup('bio_puxar', 'Frequente ação de puxar/empurrar cargas ou volumes', 'p3_comentario')}
                {renderRadioGroup('bio_repetitivos', 'Frequente execução de movimentos repetitivos (incluindo digitação)', 'p4_comentario')}
                {renderRadioGroup('bio_ferramentas', 'Manuseio de ferramentas e/ou objetos pesados por períodos prolongados', 'p5_comentario')}
                {renderRadioGroup('bio_compressao', 'Compressão de partes do corpo por superfícies rígidas ou com quinas', 'p6_comentario')}
                {renderRadioGroup('bio_flexoes', 'Exigência de flexões de coluna vertebral frequentes', 'p7_comentario')}
                {renderRadioGroup('bio_pedais', 'Uso frequente de pedais', 'p8_comentario')}
                {renderRadioGroup('bio_elevacao', 'Exigência de elevação frequentes de membros superiores', 'p9_comentario')}
                {renderRadioGroup('bio_vibracao_corpo', 'Exposição a vibração de corpo inteiro (por tempo prolongado)', 'p10_comentario')}
                {renderRadioGroup('bio_vibracao_localizada', 'Exposição a vibração localizada (por tempo prolongado)', 'p11_comentario')}
                {renderRadioGroup('bio_torcao', 'Torções dos segmentos corporais', 'p12_comentario')}
                {renderRadioGroup('bio_trabalho_duro', 'Trabalho com esforço físico intenso', 'p13_comentario')}
                {renderRadioGroup('bio_postura_sentada', 'Postura sentada ou postura em pé por longos períodos ou constante deslocamento a pé durante a jornada', 'p14_comentario')}
              </fieldset>

              <div className="btn-container flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-teal-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm sm:text-base"
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}

          {/* Etapa 3: Mobiliários */}
          {currentStep === 2 && (
            <div className="form-step">
              <fieldset className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <legend className="px-2 font-semibold text-gray-700 text-sm sm:text-base">PERIGOS ERGONÔMICOS - MOBILIÁRIOS E EQUIPAMENTOS</legend>

                {renderRadioGroup('mob_improvisado', 'Posto de trabalho improvisado', 'mob_p1_comentario')}
                {renderRadioGroup('mob_inadequado', 'Mobiliários e equipamentos inadequados ergonomicamente, sem meios de regulagem de ajuste ou sem condições de uso (assento, encosto, etc)', 'mob_p2_comentario')}
                { renderRadioGroup('mob_espacos', 'Mobiliário ou equipamento sem espaço para movimentação dos segmentos corporais', 'mob_p3_comentario')}
                {renderRadioGroup('mob_alcance', 'Trabalho com necessidade de alcançar objetos, documentos, controles ou qualquer ponto além das zonas de alcance ideais para as características antropométricas do trabalhador', 'mob_p4_comentario')}
                {renderRadioGroup('mob_equipamentos_trabalhador', 'Equipamentos ou mobiliários não adaptados à antropometria do trabalhador', 'mob_p5_comentario')}
                {renderRadioGroup('mob_posto_trabalho', 'Posto de trabalho não planejado/adaptado para alternância de postura','mob_p6_comentario')}
              </fieldset>

              <div className="btn-container flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-teal-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm sm:text-base"
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}

          {/* Etapa 4: Organizacionais */}
          {currentStep === 3 && (
            <div className="form-step">
              <fieldset className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <legend className="px-2 font-semibold text-gray-700 text-sm sm:text-base">PERIGOS ERGONÔMICOS - ORGANIZACIONAIS</legend>

                {renderRadioGroup('org_pausas', 'Trabalho realizado sem pausas pré definidas para descanso e/ ou desequilíbrio entre tempo de trabalho e tempo de repouso', 'org_p1_comentario')}
                {renderRadioGroup('org_ritmos', 'Necessidade de manter ritmos intensos de trabalho', 'org_p2_comentario')}
                {renderRadioGroup('org_monotonia', 'Monotonia', 'org_p3_comentario')}
                {renderRadioGroup('org_noturno', 'Trabalho noturno', 'org_p4_comentario')}
                {renderRadioGroup('org_renumerado', 'Trabalho com utilização rigorosa de metas de produção ou trabalho remunerado por produção', 'org_p5_comentario')}
                {renderRadioGroup('org_cadencia', 'Cadência do trabalho imposta por um equipamento', 'org_p6_comentario')}
              </fieldset>

              <div className="btn-container flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-teal-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm sm:text-base"
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}

          {/* Etapa 5: Ambientais */}
          {currentStep === 4 && (
            <div className="form-step">
              <fieldset className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <legend className="px-2 font-semibold text-gray-700 text-sm sm:text-base">PERIGOS ERGONÔMICOS - AMBIENTAIS</legend>

                {renderRadioGroup('amb_sonora', 'Condições de trabalho com níveis de pressão sonora fora dos parâmetros de conforto', 'amb_p1_comentario')}
                {renderRadioGroup('amb_temperatura', 'Condições de trabalho com índice de temperatura, velocidade do ar e umidade do ar fora dos parâmetros de conforto', 'amb_p2_comentario')}
                {renderRadioGroup('amb_vibracao', 'Condições de trabalho com iluminação diurna e noturna inadequada ou presença de reflexos que causem desconforto', 'amb_p3_comentario')}
              </fieldset>

              <div className="btn-container flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-teal-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm sm:text-base"
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}

          {/* Etapa 6: Psicossociais / Cognitivos */}
          {currentStep === 5 && (
            <div className="form-step">
              <fieldset className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <legend className="px-2 font-semibold text-gray-700 text-sm sm:text-base">PERIGOS ERGONÔMICOS - PSICOSSOCIAIS / COGNITIVOS</legend>

                <fieldset className="border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <legend className="px-2 font-medium text-gray-600 text-sm sm:text-base">Demandas do Trabalho</legend>
                  {renderRadioGroup('psic_1', 'Seu trabalho exige muita concentração?')}
                  {renderRadioGroup('psic_2', 'Você precisa trabalhar muito rápido?')}
                  {renderRadioGroup('psic_3', 'Seu trabalho exige que você tome decisões difíceis?')}
                  {renderRadioGroup('psic_4', 'Você tem tempo suficiente para realizar suas tarefas?')}
                  {renderRadioGroup('psic_5', 'Você precisa esconder suas emoções no trabalho?')}
                  {renderRadioGroup('psic_6', 'Seu trabalho envolve lidar com situações emocionalmente difíceis?')}
                  {renderRadioGroup('psic_7', 'Você pode decidir como organizar seu trabalho?')}
                  {renderRadioGroup('psic_8', 'Você tem influência sobre decisões do setor?')}
                  {renderRadioGroup('psic_9', 'Seu trabalho permite que você desenvolva novas habilidades?')}
                  {renderRadioGroup('psic_10', 'Você recebe informações claras sobre mudanças na empresa?')}
                  {renderRadioGroup('psic_11', 'Você sabe o que se espera de você no trabalho?')}
                  {renderRadioGroup('psic_12', 'Você pode contar com seus colegas quando precisa de ajuda?')}
                  {renderRadioGroup('psic_13', 'O ambiente entre os funcionários é amigável?')}
                  {renderRadioGroup('psic_14', 'Seu gestor escuta suas preocupações e sugestões?')}
                  {renderRadioGroup('psic_15', 'Você recebe reconhecimento pelo seu trabalho?')}
                  {renderRadioGroup('psic_16', 'As decisões da empresa são tomadas de forma justa?')}
                  {renderRadioGroup('psic_17', 'Você sente que é tratado com respeito por seus superiores?')}
                  {renderRadioGroup('psic_18', 'Você já sofreu ou presenciou assédio moral?')}
                  {renderRadioGroup('psic_19', 'Você teme perder seu emprego nos próximos meses?')}
                  {renderRadioGroup('psic_20', 'Você se sente esgotado após o trabalho?')}
                  {renderRadioGroup('psic_21', 'O trabalho afeta negativamente sua saúde mental?')}
                  {renderRadioGroup('psic_22', 'Você consegue equilibrar sua vida pessoal e profissional?')}
                  {renderRadioGroup('psic_23', 'Tenho mais tarefas do que consigo realizar no tempo disponível.')}
                  {renderRadioGroup('psic_24', 'Trabalho frequentemente sob pressão e prazos curtos.')}
                  {renderRadioGroup('psic_25', 'Sinto-me exausto ao final do expediente.')}
                  {renderRadioGroup('psic_26', 'Tenho controle sobre como organizo minhas tarefas diárias.')}
                  {renderRadioGroup('psic_27', 'Posso tomar decisões sobre meu trabalho sem precisar de autorização constante.')}
                  {renderRadioGroup('psic_28', 'Tenho liberdade para sugerir melhorias no meu setor.')}
                  {renderRadioGroup('psic_29', 'Tenho uma boa relação com meus colegas de trabalho.')}
                  {renderRadioGroup('psic_30', 'Sinto-me apoiado pela minha liderança quando enfrento dificuldades.')}
                  {renderRadioGroup('psic_31', 'O clima organizacional da empresa é positivo e motivador.')}
                  {renderRadioGroup('psic_32', 'Meu trabalho é valorizado e reconhecido pela empresa.')}
                  {renderRadioGroup('psic_33', 'Recebo feedbacks construtivos sobre o meu desempenho.')}
                  {renderRadioGroup('psic_34', 'Sinto que minha remuneração e benefícios são justos em relação às minhas responsabilidades.')}
                  {renderRadioGroup('psic_35', 'O ambiente de trabalho me causa estresse e ansiedade frequentes.')}
                  {renderRadioGroup('psic_36', 'Já fui vítima de assédio moral ou tratamento injusto no trabalho.')}
                  {renderRadioGroup('psic_37', 'Sinto que há competitividade excessiva e pouco trabalho em equipe na empresa.')}
                </fieldset>
              </fieldset>

              <div className="btn-container flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Anterior
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  Enviar Respostas
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Progress indicator */}
        <div className="mt-6 sm:mt-8">
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2">
            <span>Etapa {currentStep + 1} de 6</span>
            <span>{Math.round(((currentStep + 1) / 6) * 100)}% completo</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className="bg-teal-600 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormErgon2;
