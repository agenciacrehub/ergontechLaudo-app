import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, ChevronDown, Pencil, Trash2, Eye, Link, FileText } from 'lucide-react';
import ModalLayout from '../UI/ModalLayout';
import DeleteModal from '../UI/DeleteModal';
import axios from 'axios';
import { toastError, toastSuccess } from '../../utils/toast';
import { generateFormularioHTML, generateAEPHTMLFromConteudo } from './pdfTemplates';

interface Report {
    id: string;
    name: string;
    company_id: string;
    user_id: string;
    type_laudos: 'PSICOSSOCIAL' | 'PERICULOSIDADE' | 'ERGONOMIC';
    status: string;
    created_at: string;
    updated_at: string;
    // Relacionamentos populados
    company?: Company;
    user?: {
        id: string;
        name: string;
    };
    report_ups?: {
        id: string;
        created_at: string;
    }[];
    formularios?: {
        id: string;
        created_at: string;
        respostas: any;
    }[];
}

interface Company {
    id: string;
    name: string;
    legal_name: string;
    street: string;
    number: string;
    zip_code: string;
    cnpj: string;
    neighborhood: string;
    city: string;
    state: string;
    cnae?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    role: string;
}

const Report: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos os tipos');
    const [filterStatus, setFilterStatus] = useState('Filtrar por status');
    const [showTypeFilter, setShowTypeFilter] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);

    // Estados dos modais
    const [showNewLaudoModal, setShowNewLaudoModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    // Edição de laudo (metadados)
    const [isEditingLaudo, setIsEditingLaudo] = useState(false);
    const [selectedReportForEdit, setSelectedReportForEdit] = useState<Report | null>(null);
    // Estado do modal de exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReportForDelete, setSelectedReportForDelete] = useState<Report | null>(null);

    // Estado do formulário de novo laudo
    const [newLaudo, setNewLaudo] = useState({
        name: '',
        company_id: '',
        user_id: '',
        type_laudos: ''
    });

    // Estados para seleção de empresa
    const [companySearch, setCompanySearch] = useState('');
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    // Estados para dados das APIs
    const [companies, setCompanies] = useState<Company[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // URL da API
    const API_URL = import.meta.env.VITE_API_URL;

    // Função para buscar empresas
    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/company`);
            setCompanies(response.data.filter((company: Company) => company.active));
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
            toastError('Erro ao carregar empresas');
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar usuários
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            setUsers(response.data.filter((user: User) => user.is_active));
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            toastError('Erro ao carregar usuários');
        }
    };

    // Função para resetar o formulário
    const resetForm = () => {
        setNewLaudo({
            name: '',
            company_id: '',
            user_id: '',
            type_laudos: ''
        });
        setSelectedCompany(null);
        setCompanySearch('');
        setShowCompanyDropdown(false);
        setIsEditingLaudo(false);
        setSelectedReportForEdit(null);
    };



    // useEffect para buscar dados iniciais
    useEffect(() => {
        fetchCompanies();
        fetchUsers();
        fetchReports();
    }, []);

    // useEffect para fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.company-dropdown-container')) {
                setShowCompanyDropdown(false);
            }
        };

        if (showCompanyDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCompanyDropdown]);

    // Estados para dados dos reports
    const [reports, setReports] = useState<Report[]>([]);
    const [reportsLoading, setReportsLoading] = useState(false);

    // Função para buscar reports
    const fetchReports = async () => {
        try {
            setReportsLoading(true);
            const response = await axios.get(`${API_URL}/reports`);
            setReports(response.data);
        } catch (error) {
            console.error('Erro ao buscar reports:', error);
            toastError('Erro ao carregar relatórios');
        } finally {
            setReportsLoading(false);
        }
    };

    // Funções auxiliares para mapear dados
    const getTypeLaudoLabel = (type: string) => {
        switch (type) {
            case 'PSICOSSOCIAL':
                return 'Laudo Psicossocial';
            case 'PERICULOSIDADE':
                return 'Laudo de Periculosidade';
            case 'ERGONOMIC':
                return 'Laudo Ergonômico';
            default:
                return type;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getCompanyName = (report: Report) => {
        return report.company?.name || 'Empresa não encontrada';
    };

    const getUserName = (report: Report) => {
        return report.user?.name || 'Usuário não encontrado';
    };

    const typeOptions = [
        'Todos os tipos',
        'Laudo Psicossocial',
        'Laudo de Periculosidade',
        'Laudo Ergonômico'
    ];

    const statusOptions = [
        'Filtrar por status',
        'Ativo',
        'Inativo',
        'Concluído',
        'Em Andamento',
        'Pendente'
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Concluído':
                return 'bg-green-100 text-green-800';
            case 'Em Andamento':
                return 'bg-yellow-100 text-yellow-800';
            case 'Pendente':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredReports = reports.filter(report => {
        const companyName = getCompanyName(report);
        const userName = getUserName(report);
        const typeLabel = getTypeLaudoLabel(report.type_laudos);

        const matchesSearch = companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            typeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'Todos os tipos' || typeLabel === filterType;
        const matchesStatus = filterStatus === 'Filtrar por status' || report.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Filtrar empresas baseado na busca
    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(companySearch.toLowerCase())
    );

    // Função para selecionar empresa
    const handleSelectCompany = (company: Company) => {
        setSelectedCompany(company);
        setNewLaudo({ ...newLaudo, company_id: company.id });
        setCompanySearch(company.name);
        setShowCompanyDropdown(false);
    };

    // Função para limpar seleção de empresa
    const handleClearCompany = () => {
        setSelectedCompany(null);
        setNewLaudo({ ...newLaudo, company_id: '' });
        setCompanySearch('');
    };

    // Funções dos modais

    const handleCreateLaudo = async () => {
        try {
            const laudoData = {
                ...newLaudo,
                status: 'Ativo' // Status padrão
            };

            const response = await axios.post(`${API_URL}/reports`, laudoData);

            // Atualizar lista de reports
            setReports(prev => [...prev, response.data]);

            // Resetar formulário e fechar modal
            resetForm();
            setShowNewLaudoModal(false);

        } catch (error) {
            console.error('Erro ao criar laudo:', error);
            toastError('Erro ao criar laudo');
        }
    };

    const handleRowClick = (report: Report) => {
        setSelectedReport(report);
        setShowDetailsModal(true);
    };

    const openEditLaudoModal = (report: Report) => {
        setIsEditingLaudo(true);
        setSelectedReportForEdit(report);
        setShowNewLaudoModal(true);
        // Prefill formulário com dados existentes
        setNewLaudo({
            name: report.name || '',
            company_id: report.company_id || '',
            user_id: report.user?.id || report.user_id || '',
            type_laudos: report.type_laudos || ''
        });
        // Selecionar empresa no dropdown
        const companyObj = companies.find((c) => c.id === report.company_id) || report.company || null;
        if (companyObj) {
            setSelectedCompany(companyObj as Company);
            setCompanySearch(companyObj.name);
        }
    };

    const handleUpdateLaudo = async () => {
        if (!selectedReportForEdit) return;
        try {
            const payload = {
                name: newLaudo.name,
                company_id: newLaudo.company_id,
                user_id: newLaudo.user_id,
                type_laudos: newLaudo.type_laudos,
                status: selectedReportForEdit.status,
            };
            const response = await axios.put(`${API_URL}/reports/${selectedReportForEdit.id}`, payload);
            const updated = response.data;
            setReports((prev) => prev.map((r) => (r.id === selectedReportForEdit.id ? { ...r, ...updated } : r)));
            toastSuccess('Laudo atualizado com sucesso');
            setShowNewLaudoModal(false);
            setIsEditingLaudo(false);
            setSelectedReportForEdit(null);
        } catch (error: any) {
            console.error('Erro ao atualizar laudo:', error);
            toastError(error?.response?.data?.message || 'Erro ao atualizar laudo');
        }
    };

    const openDeleteModal = (report: Report) => {
        setSelectedReportForDelete(report);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteReport = async ({ id }: { id: string | number }) => {
        try {
            await axios.delete(`${API_URL}/reports/${id}`);
            setReports((prev) => prev.filter((r) => r.id !== id));
            toastSuccess('Laudo excluído com sucesso');
            setIsDeleteModalOpen(false);
            setSelectedReportForDelete(null);
        } catch (error: any) {
            console.error('Erro ao excluir laudo:', error);
            toastError(error?.response?.data?.message || 'Erro ao excluir laudo');
        }
    };

    const handleGenerateLink = async () => {
        if (!selectedReport) {
            toastError('Nenhum laudo selecionado');
            return;
        }

        try {
            setLoading(true);

            // Gerar token seguro para o formulário
            const response = await axios.post(`${API_URL}/formularios/generate-token`, {
                laudo_id: selectedReport.id
            });

            if (response.data.success) {
                const { token, expires_at } = response.data.data;
                const baseUrl = window.location.origin;
                const formLink = `${baseUrl}/formulario-ergonomico?token=${token}`;

                // Copiar link para a área de transferência
                await navigator.clipboard.writeText(formLink);

                // Calcular tempo de expiração
                const expirationDate = new Date(expires_at);
                const now = new Date();
                const hoursLeft = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60));

                toastSuccess(`Link copiado! Expira em ${hoursLeft} horas`);

            } else {
                toastError(response.data.message || 'Erro ao gerar link');
            }

        } catch (error: any) {
            console.error('Erro ao gerar token:', error);
            toastError(error.response?.data?.message || 'Erro ao gerar link do formulário');
        } finally {
            setLoading(false);
        }
    };

    // Função para verificar se o laudo já tem um report_up
    const hasReportUp = (report: Report): boolean => {
        return !!(report.report_ups && report.report_ups.length > 0);
    };

    // Função para editar laudo existente (carregar dados do report_up)
    const handleEditLaudo = async () => {
        if (!selectedReport || !selectedReport.id) {
            toastError('Erro: Nenhum laudo selecionado');
            return;
        }

        try {
            // Buscar dados do report_up
            const response = await axios.get(`${API_URL}/report-up/laudo/${selectedReport.id}`);

            // A API retorna {success, message, data}, então precisamos acessar response.data.data
            const apiData = response.data.data;

            if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
                toastError('Nenhum AEP encontrado para este laudo');
                return;
            }

            const reportUpData = apiData[0]; // Pegar o mais recente

            if (!reportUpData) {
                toastError('Dados do AEP não encontrados');
                return;
            }
            if (!reportUpData.conteudo) {
                toastError('Conteúdo do AEP não encontrado ou está vazio');
                return;
            }

            const conteudo = reportUpData.conteudo;
            // Montar endereço completo da empresa
            const company = selectedReport.company;
            const enderecoArray = [
                company?.street,
                company?.number,
                company?.neighborhood,
                company?.city,
                company?.state,
                company?.zip_code
            ].filter(Boolean);
            const enderecoCompleto = enderecoArray.join(', ');

            // Montar objeto de state com todos os dados do AEP
            const editData = {
                laudoId: selectedReport.id,
                isEditing: true, // Flag para indicar que é edição
                reportUpId: reportUpData.id, // ID do report_up para atualização
                // Enviar todo o conteúdo para que a tela de edição consiga pré-preencher todas as seções
                conteudo,

                // Dados básicos da empresa (sempre atualizados)
                nomeEmpresa: company?.name || '',
                cnpj: company?.cnpj || '',
                endereco: enderecoCompleto || '',
                cidade: company?.city || '',
                dataLaudo: new Date().toISOString().split('T')[0],
                cnae: company?.cnae || '',

                // Dados do formulário salvos anteriormente (com fallbacks seguros)
                formData: (conteudo && conteudo.formData) ? conteudo.formData : {},
                setores: (conteudo && conteudo.setores && Array.isArray(conteudo.setores)) ? conteudo.setores : [{
                    id: '1',
                    unidade: '',
                    setor: '',
                    funcoes: '',
                    colaboradores: ''
                }],
                riscoseSolucoes: (conteudo && conteudo.riscoseSolucoes && Array.isArray(conteudo.riscoseSolucoes)) ? conteudo.riscoseSolucoes : [{
                    id: '1',
                    risco: '',
                    classificacao: '',
                    solucao: '',
                    prazo: ''
                }],
                atividadesAET: (conteudo && conteudo.atividadesAET && Array.isArray(conteudo.atividadesAET)) ? conteudo.atividadesAET : [{
                    id: '1',
                    atividade: '',
                    justificativa: '',
                    prioridade: ''
                }],
                acoesCronograma: (conteudo && conteudo.acoesCronograma && Array.isArray(conteudo.acoesCronograma)) ? conteudo.acoesCronograma : [{
                    id: '1',
                    acao: '',
                    trimestre1: false,
                    trimestre2: false,
                    trimestre3: false,
                    trimestre4: false,
                    trimestre5: false,
                    trimestre6: false
                }],
                motivosLinha: (conteudo && conteudo.motivosLinha && Array.isArray(conteudo.motivosLinha)) ? conteudo.motivosLinha : [],
                motivosPorLinha: (conteudo && conteudo.motivosPorLinha) ? conteudo.motivosPorLinha : {},
                embasamentosBiomecanicos: (conteudo && conteudo.embasamentosBiomecanicos && Array.isArray(conteudo.embasamentosBiomecanicos)) ? conteudo.embasamentosBiomecanicos : [],
                embasamentosOrganizacionais: (conteudo && conteudo.embasamentosOrganizacionais && Array.isArray(conteudo.embasamentosOrganizacionais)) ? conteudo.embasamentosOrganizacionais : [],
                embasamentosAmbientais: (conteudo && conteudo.embasamentosAmbientais && Array.isArray(conteudo.embasamentosAmbientais)) ? conteudo.embasamentosAmbientais : [],
                embasamentosPsicossociais: (conteudo && conteudo.embasamentosPsicossociais && Array.isArray(conteudo.embasamentosPsicossociais)) ? conteudo.embasamentosPsicossociais : [],
                classificacoesAmbientais: (conteudo && Array.isArray(conteudo.classificacoesAmbientais)) ? conteudo.classificacoesAmbientais : undefined,
                observacoesAmbientais: (conteudo && Array.isArray(conteudo.observacoesAmbientais)) ? conteudo.observacoesAmbientais : undefined,
                detalhesLinhasAmbientais: (conteudo && conteudo.detalhesLinhasAmbientais) ? conteudo.detalhesLinhasAmbientais : undefined,
                logoEmpresa: (conteudo && conteudo.logoEmpresa) ? conteudo.logoEmpresa : null,
                imagensPostoTrabalho: (conteudo && conteudo.imagensPostoTrabalho) ? conteudo.imagensPostoTrabalho : {
                    imagem1: { data: '', file: null },
                    imagem2: { data: '', file: null },
                    imagem3: { data: '', file: null },
                    imagem4: { data: '', file: null }
                },
                openAccordions: (conteudo && conteudo.openAccordions && typeof conteudo.openAccordions === 'object') ? conteudo.openAccordions : {
                    fatoresBiomecanicos: false,
                    mobiliarioEquipamento: false,
                    fatoresOrganizacionais: false,
                    fatoresAmbientais: false,
                    fatoresPsicossociais: false,
                    treinamentos: false,
                    mobiliarioEquipamentos: false,
                    pausasGinastica: false,
                    aspectosOrganizacionais: false
                }
            };
            setShowDetailsModal(false);
            navigate('/app/laudos/create', { state: editData });
            toastSuccess('Carregando dados do AEP para edição...');

        } catch (error: any) {
            console.error('Erro ao carregar dados do AEP:', error);
            console.error('Stack trace:', error.stack);

            let errorMessage = 'Erro ao carregar dados do AEP';

            if (error.response?.status === 404) {
                errorMessage = 'AEP não encontrado para este laudo';
            } else if (error.response?.status === 500) {
                errorMessage = 'Erro interno do servidor ao buscar AEP';
            } else if (error.message?.includes('Cannot read properties of undefined')) {
                errorMessage = 'Dados do AEP estão em formato inválido ou corrompidos';
            } else if (error.message?.includes('conteudo')) {
                errorMessage = 'Conteúdo do AEP não encontrado';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Erro de conexão com o servidor';
            }

            toastError(`${errorMessage}. Detalhes: ${error.message}`);
        }
    };

    // Função para gerar PDF com respostas do formulário usando template modularizado


    const handleViewFormularioPDF = async (respostas: any) => {
        try {
            const htmlContent = generateFormularioHTML(respostas);
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();
                setTimeout(() => {
                    newWindow.print();
                }, 1000);
            }
        } catch (error) {
            console.error('Erro ao gerar PDF do formulário:', error);
            toastError('Erro ao gerar PDF do formulário');
        }
    };







    // Função para exportar PDF do AEP usando template
    const handleExportAEPPDF = async () => {
        if (!selectedReport) {
            toastError('Nenhum laudo selecionado');
            return;
        }

        try {
            // Buscar dados do report_up para este laudo
            const response = await axios.get(`${API_URL}/report-up/laudo/${selectedReport.id}`);
            const apiResponse = response.data;

            // Verificar se a resposta tem a estrutura esperada
            if (!apiResponse || !apiResponse.success || !apiResponse.data) {
                toastError('Erro na resposta da API');
                return;
            }

            const reportUpArray = apiResponse.data;

            if (!Array.isArray(reportUpArray) || reportUpArray.length === 0) {
                toastError('Nenhum AEP encontrado para este laudo');
                return;
            }

            // Pegar o primeiro (mais recente) report_up
            const reportUpData = reportUpArray[0];

            if (!reportUpData || !reportUpData.conteudo) {
                toastError('Dados do AEP incompletos');
                return;
            }

            // Gerar HTML do AEP dinamicamente a partir do JSON salvo
            const htmlContent = generateAEPHTMLFromConteudo(reportUpData.conteudo);

            // Abrir nova janela com o conteúdo
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();

                // Aguardar carregamento e imprimir
                setTimeout(() => {
                    newWindow.print();
                }, 1500);
            } else {
                toastError('Não foi possível abrir nova janela. Verifique se pop-ups estão bloqueados.');
            }
        } catch (error: any) {
            console.error('Erro ao exportar PDF do AEP:', error);

            // Mensagem de erro mais específica
            let errorMessage = 'Erro ao exportar PDF do AEP';

            if (error.response?.status === 404) {
                errorMessage = 'AEP não encontrado para este laudo';
            } else if (error.message?.includes('template')) {
                errorMessage = 'Erro ao carregar template do PDF';
            } else if (error.message?.includes('dados')) {
                errorMessage = 'Dados do AEP incompletos ou corrompidos';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toastError(errorMessage);
        }
    };

    // Usando o gerador dinâmico de AEP de pdfTemplates.ts

    const handleCreateLaudoFromDetails = () => {
        if (!selectedReport || !selectedReport.company) {
            setShowDetailsModal(false);
            navigate('/app/laudos/create');
            return;
        }

        // Montar endereço completo se possível
        const company = selectedReport.company;
        const enderecoArray = [
            company.street,
            company.number,
            company.neighborhood,
            company.city,
            company.state,
            company.zip_code
        ].filter(Boolean);
        const enderecoCompleto = enderecoArray.join(', ');

        // Montar objeto de state incluindo o laudoId e o CNAE
        const prefillData = {
            laudoId: selectedReport.id, // ID do laudo selecionado
            nomeEmpresa: company.name || '',
            cnpj: company.cnpj || '',
            endereco: enderecoCompleto || '',
            cidade: company.city || '',
            dataLaudo: new Date().toISOString().split('T')[0],
            cnae: company.cnae || '' // ✅ Inclui CNAE para prefill
        };

        setShowDetailsModal(false);
        navigate('/app/laudos/create', { state: prefillData });

    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laudos</h1>
                        <p className="text-gray-600">Gerencie os laudos psicossociais emitidos pela ErgonTech</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowNewLaudoModal(true);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Laudo
                    </button>
                </div>
            </div>

            {/* Lista de Laudos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Lista de Laudos</h2>
                    <p className="text-sm text-gray-600 mb-6">Visualize e gerencie os laudos emitidos para as empresas clientes</p>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        {/* Busca */}
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar laudos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Filtro por Tipo */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTypeFilter(!showTypeFilter)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {filterType}
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {showTypeFilter && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {typeOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterType(option);
                                                setShowTypeFilter(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filtro por Status */}
                        <div className="relative">
                            <button
                                onClick={() => setShowStatusFilter(!showStatusFilter)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {filterStatus}
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {showStatusFilter && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterStatus(option);
                                                setShowStatusFilter(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Botão de Filtro Avançado */}
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Empresa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data de Emissão
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Técnico Responsável
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportsLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-500">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                                            Carregando relatórios...
                                        </div>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Nenhum relatório encontrado
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleRowClick(report)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{report.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{getCompanyName(report)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{getTypeLaudoLabel(report.type_laudos)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(report.created_at)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{getUserName(report)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    className="text-teal-600 hover:text-teal-800 p-1 rounded-full hover:bg-teal-100 transition"
                                                    title="Visualizar"
                                                    onClick={() => handleRowClick(report)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition"
                                                    title="Editar"
                                                    onClick={() => openEditLaudoModal(report)}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition"
                                                    title="Excluir"
                                                    onClick={() => openDeleteModal(report)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Novo/Editar Laudo */}
            <ModalLayout
                isOpen={showNewLaudoModal}
                onClose={() => setShowNewLaudoModal(false)}
                title={isEditingLaudo ? 'Editar Laudo' : 'Novo Laudo'}
                width="max-w-lg"
            >
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Laudo
                            </label>
                            <input
                                type="text"
                                value={newLaudo.name}
                                onChange={(e) => setNewLaudo({ ...newLaudo, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                placeholder="Nome do laudo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Empresa
                            </label>
                            <div className="relative company-dropdown-container">
                                <input
                                    type="text"
                                    value={companySearch}
                                    onChange={(e) => {
                                        setCompanySearch(e.target.value);
                                        setShowCompanyDropdown(true);
                                        if (!e.target.value) {
                                            handleClearCompany();
                                        }
                                    }}
                                    onFocus={() => setShowCompanyDropdown(true)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    placeholder="Pesquisar empresa..."
                                    required
                                />

                                {showCompanyDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {loading ? (
                                            <div className="px-3 py-2 text-center text-gray-500 text-sm">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                                                    Carregando empresas...
                                                </div>
                                            </div>
                                        ) : filteredCompanies.length > 0 ? (
                                            filteredCompanies.map((company) => (
                                                <div
                                                    key={company.id}
                                                    onClick={() => handleSelectCompany(company)}
                                                    className="px-3 py-2 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="font-medium text-gray-900">{company.name}</div>
                                                    {company.legal_name && company.legal_name !== company.name && (
                                                        <div className="text-xs text-gray-500">{company.legal_name}</div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500 text-sm">
                                                {companies.length === 0 ? 'Nenhuma empresa cadastrada' : 'Nenhuma empresa encontrada'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {selectedCompany && (
                                <div className="mt-2 text-sm text-teal-600">
                                    ✓ Empresa selecionada: {selectedCompany.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Laudo
                            </label>
                            <select
                                value={newLaudo.type_laudos}
                                onChange={(e) => setNewLaudo({ ...newLaudo, type_laudos: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                required
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="PSICOSSOCIAL">Laudo Psicossocial</option>
                                <option value="PERICULOSIDADE">Laudo de Periculosidade</option>
                                <option value="ERGONOMICO">Laudo Ergonômico</option>
                                <option value="AET">Análise Ergonômica do Trabalho</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Responsável pelo Laudo
                            </label>
                            <select
                                value={newLaudo.user_id}
                                onChange={(e) => setNewLaudo({ ...newLaudo, user_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                required
                            >
                                <option value="">Selecione o responsável</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => {
                                resetForm();
                                setShowNewLaudoModal(false);
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        {isEditingLaudo ? (
                            <button
                                onClick={handleUpdateLaudo}
                                disabled={!newLaudo.name || !newLaudo.company_id || !newLaudo.type_laudos || !newLaudo.user_id}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                Atualizar Laudo
                            </button>
                        ) : (
                            <button
                                onClick={handleCreateLaudo}
                                disabled={!newLaudo.name || !newLaudo.company_id || !newLaudo.type_laudos || !newLaudo.user_id}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                Criar Laudo
                            </button>
                        )}
                    </div>
                </div>
            </ModalLayout>

            {/* Modal Detalhes do Laudo */}
            <ModalLayout
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Detalhes do Laudo"
                width="max-w-2xl"
            >
                {selectedReport && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome do Laudo
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                        {selectedReport.name}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Empresa
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                        {getCompanyName(selectedReport)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Laudo
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                        {getTypeLaudoLabel(selectedReport.type_laudos)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data de Criação
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                        {formatDate(selectedReport.created_at)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                                            {selectedReport.status}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Técnico Responsável
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                        {getUserName(selectedReport)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Informações Adicionais</h4>
                            <p className="text-sm text-blue-700">
                                Este laudo "{selectedReport.name}" foi criado para avaliar as condições ergonômicas e psicossociais da empresa {getCompanyName(selectedReport)}.
                                O documento está sob responsabilidade de {getUserName(selectedReport)} e encontra-se no status {selectedReport.status}.
                            </p>
                        </div>

                        {/* Seção de Formulários Respondidos */}
                        {selectedReport.formularios && selectedReport.formularios.length > 0 && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="text-sm font-medium text-green-900 mb-3 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Formulários Respondidos ({selectedReport.formularios.length})
                                </h4>
                                <div className="space-y-2">
                                    {selectedReport.formularios.map((formulario, index) => (
                                        <div key={formulario.id} className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Formulário Ergonômico
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Respondido em {formatDate(formulario.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleViewFormularioPDF(formulario.respostas)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Eye className="w-3 h-3" />
                                                Ver PDF
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={handleExportAEPPDF}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <FileText className="h-4 w-4" />
                                Exportar PDF
                            </button>
                            <button
                                onClick={handleGenerateLink}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Link className="h-4 w-4" />
                            </button>
                            {hasReportUp(selectedReport) ? (
                                <button
                                    onClick={handleEditLaudo}
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    title="Editar laudo AEP existente"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar Laudo
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreateLaudoFromDetails}
                                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    title="Criar novo laudo AEP"
                                >
                                    <FileText className="h-4 w-4" />
                                    Criar Laudo
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </ModalLayout>

            {/* Modal de Confirmação de Exclusão */}
            <DeleteModal
                open={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedReportForDelete(null); }}
                onConfirm={handleDeleteReport}
                requestData={{ id: selectedReportForDelete?.id || '' }}
                title="Excluir Laudo"
                message={`Tem certeza que deseja excluir o laudo "${selectedReportForDelete?.name}"? Esta ação não pode ser desfeita.`}
            />
        </div>
    );
};

export default Report;