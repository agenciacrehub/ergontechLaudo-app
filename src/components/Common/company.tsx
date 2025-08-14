import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import ModalLayout from '../UI/ModalLayout';
import DeleteModal from '../UI/DeleteModal';
import axios from 'axios';
import { toastSuccess, toastError } from '../../utils/toast';

interface Company {
  id: string;
  name: string;
  legal_name: string;
  street: string;
  number: string;
  zip_code: string;
  cnpj: string;
  cnae: string;
  neighborhood: string;
  city: string;
  state: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Funções para status
const getStatusColor = (active: boolean) => {
  return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

const getStatusText = (active: boolean) => {
  return active ? 'Ativo' : 'Inativo';
};

const Company: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    legal_name: '',
    street: '',
    number: '',
    zip_code: '',
    cnpj: '',
    cnae: '',
    neighborhood: '',
    city: '',
    state: '',
    active: true
  });

  // Buscar empresas
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/company`);
      setCompanies(response.data);
    } catch (error) {
      toastError('Erro ao carregar empresas');
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Função para limpar CNPJ (apenas números)
  const cleanCNPJ = (cnpj: string) => {
    return cnpj.replace(/\D/g, '');
  };

  // Função para formatar CNPJ
  const formatCNPJ = (cnpj: string) => {
    const cleaned = cleanCNPJ(cnpj);
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  };

  // Função para buscar dados do CNPJ usando API com suporte a CORS
  const fetchCNPJData = async (cnpj: string) => {
    const cleanedCNPJ = cleanCNPJ(cnpj);

    if (cleanedCNPJ.length !== 14) {
      toastError('CNPJ deve ter 14 dígitos');
      return;
    }

    try {
      setCnpjLoading(true);

      // Usando API alternativa com suporte a CORS
      const response = await fetch(`https://publica.cnpj.ws/cnpj/${cleanedCNPJ}`);

      if (!response.ok) {
        throw new Error('Erro ao consultar CNPJ');
      }

      const data = await response.json();

      if (data.status === 400 || data.message) {
        toastError(data.message || 'CNPJ não encontrado');
        return;
      }

      // Preencher CNAE automaticamente se existir
      const cnae = data.estabelecimento?.atividade_principal?.subclasse || '';
      if (cnae) {
        setFormData(prev => ({ ...prev, cnae }));
      }

      // Mapear nome fantasia (está dentro do objeto estabelecimento)
      const estabelecimento = data.estabelecimento || data;
      const nomeFantasia = estabelecimento.nome_fantasia ||
        data.nome_fantasia ||
        data.fantasia ||
        data.nome ||
        data.razao_social;

      const razaoSocial = data.razao_social ||
        estabelecimento.razao_social ||
        data.corporate_name ||
        data.nome;

      // Mapear endereço (também pode estar no estabelecimento)
      const endereco = {
        logradouro: estabelecimento.logradouro || data.logradouro,
        numero: estabelecimento.numero || data.numero,
        bairro: estabelecimento.bairro || data.bairro,
        cep: estabelecimento.cep || data.cep,
        cidade: estabelecimento.cidade?.nome || data.municipio || data.cidade,
        estado: estabelecimento.estado?.sigla || data.uf || data.estado
      };

      // Preencher formulário com dados da API
      setFormData(prev => ({
        ...prev,
        name: nomeFantasia || prev.name, // Nome fantasia
        legal_name: razaoSocial || prev.legal_name, // Razão social
        street: endereco.logradouro || prev.street,
        number: endereco.numero || prev.number,
        zip_code: endereco.cep?.replace(/\D/g, '') || prev.zip_code,
        neighborhood: endereco.bairro || prev.neighborhood,
        city: endereco.cidade || prev.city,
        state: endereco.estado || prev.state
      }));

      toastSuccess('Dados do CNPJ carregados com sucesso!');

    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);

      // Fallback: tentar API alternativa
      try {
        const fallbackResponse = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`);

        if (!fallbackResponse.ok) {
          throw new Error('Erro na API alternativa');
        }

        const fallbackData = await fallbackResponse.json();

        // Mapear nome fantasia da API alternativa
        const nomeFantasiaFallback = fallbackData.nome_fantasia ||
          fallbackData.fantasia ||
          fallbackData.alias ||
          fallbackData.trade_name ||
          fallbackData.razao_social;

        const razaoSocialFallback = fallbackData.razao_social ||
          fallbackData.corporate_name;

        // Preencher formulário com dados da API alternativa
        setFormData(prev => ({
          ...prev,
          name: nomeFantasiaFallback || prev.name, // Nome fantasia
          legal_name: razaoSocialFallback || prev.legal_name, // Razão social
          street: fallbackData.logradouro || fallbackData.endereco || prev.street,
          number: fallbackData.numero || fallbackData.number || prev.number,
          zip_code: fallbackData.cep?.replace(/\D/g, '') || prev.zip_code,
          neighborhood: fallbackData.bairro || fallbackData.distrito || prev.neighborhood,
          city: fallbackData.municipio || fallbackData.cidade || prev.city,
          state: fallbackData.uf || fallbackData.estado || prev.state
        }));

        toastSuccess('Dados do CNPJ carregados com sucesso!');

      } catch (fallbackError) {
        console.error('Erro na API alternativa:', fallbackError);
        toastError('Erro ao consultar CNPJ. Verifique o número e tente novamente.');
      }
    } finally {
      setCnpjLoading(false);
    }
  };

  // Função para lidar com mudança no campo CNPJ
  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));

    // Buscar dados automaticamente quando CNPJ estiver completo
    const cleaned = cleanCNPJ(value);
    if (cleaned.length === 14) {
      fetchCNPJData(cleaned);
    }
  };

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      legal_name: '',
      street: '',
      number: '',
      zip_code: '',
      cnpj: '',
      cnae: '',
      neighborhood: '',
      city: '',
      state: '',
      active: true
    });
  };

  // Função para criar empresa
  const createCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_URL}/company`, formData);
      toastSuccess('Empresa criada com sucesso!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchCompanies();
    } catch (error) {
      toastError('Erro ao criar empresa');
      console.error('Erro ao criar empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de visualização
  const openViewModal = (company: Company) => {
    setSelectedCompany(company);
    setIsViewModalOpen(true);
  };

  // Função para abrir modal de edição
  const openEditModal = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      legal_name: company.legal_name,
      street: company.street,
      number: company.number,
      zip_code: company.zip_code,
      cnpj: company.cnpj ? formatCNPJ(company.cnpj) : '',
      cnae: company.cnae,
      neighborhood: company.neighborhood,
      city: company.city,
      state: company.state,
      active: company.active
    });
    setIsEditModalOpen(true);
  };

  // Função para editar empresa
  const editCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    try {
      setLoading(true);
      await axios.put(`${API_URL}/company/${selectedCompany.id}`, formData);
      toastSuccess('Empresa editada com sucesso!');
      setIsEditModalOpen(false);
      setSelectedCompany(null);
      resetForm();
      fetchCompanies();
    } catch (error) {
      toastError('Erro ao editar empresa');
      console.error('Erro ao editar empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de exclusão
  const openDeleteModal = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  // Função para deletar empresa
  const deleteCompany = async (requestData: { id: string | number }) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/company/${requestData.id}`);
      toastSuccess('Empresa excluída com sucesso!');
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      toastError('Erro ao excluir empresa');
      console.error('Erro ao excluir empresa:', error);
      throw error; // Re-throw para o DeleteModal tratar
    } finally {
      setLoading(false);
    }
  };

  // Filtrar empresas
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Empresas</h1>
            <p className="text-gray-600">Gerencie as empresas clientes da plataforma</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Empresa
          </button>
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Lista de Empresas</h2>
          <p className="text-sm text-gray-600 mb-6">Visualize e gerencie as empresas cadastradas na plataforma</p>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Busca */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>
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
                  Razão Social
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma empresa encontrada
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.legal_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(company.active)}`}>
                        {getStatusText(company.active)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openViewModal(company)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(company)}
                          className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(company)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition"
                          title="Excluir"
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

      {/* Modal para Criar Empresa */}
      <ModalLayout
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Adicionar Nova Empresa"
        width="max-w-2xl"
      >
        <form onSubmit={createCompany} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Preencha os dados da nova empresa</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome Fantasia */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Fantasia *
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Nome fantasia da empresa"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
                        {/* CNAE */}
                        <div>
              <label htmlFor="cnae" className="block text-sm font-medium text-gray-700 mb-1">
                CNAE *
              </label>
              <input
                id="cnae"
                type="text"
                required
                placeholder="CNAE da empresa"
                value={formData.cnae}
                onChange={(e) => setFormData(prev => ({ ...prev, cnae: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* CNPJ */}
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ * {cnpjLoading && <span className="text-teal-600 text-xs">(Buscando dados...)</span>}
              </label>
              <div className="relative">
                <input
                  id="cnpj"
                  type="text"
                  required
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  disabled={cnpjLoading}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none ${cnpjLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  maxLength={18}
                />
                {cnpjLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Digite o CNPJ para buscar automaticamente os dados da empresa
              </p>
            </div>

            {/* Razão Social */}
            <div>
              <label htmlFor="legal_name" className="block text-sm font-medium text-gray-700 mb-1">
                Razão Social *
              </label>
              <input
                id="legal_name"
                type="text"
                required
                placeholder="Razão Social da empresa"
                value={formData.legal_name}
                onChange={(e) => setFormData(prev => ({ ...prev, legal_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Rua */}
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Rua *
              </label>
              <input
                id="street"
                type="text"
                required
                placeholder="Rua da empresa"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Número */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <input
                id="number"
                type="text"
                required
                placeholder="Número da empresa"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                CEP *
              </label>
              <input
                id="zip_code"
                type="text"
                required
                placeholder="CEP da empresa"
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Bairro */}
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                id="neighborhood"
                type="text"
                required
                placeholder="Bairro da empresa"
                value={formData.neighborhood}
                onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade *
              </label>
              <input
                id="city"
                type="text"
                required
                placeholder="Cidade da empresa"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <input
                id="state"
                type="text"
                required
                placeholder="Estado da empresa"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Empresa'}
            </button>
          </div>
        </form>
      </ModalLayout>

      {/* Modal para Visualizar Empresa */}
      <ModalLayout
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes da Empresa"
        width="max-w-2xl"
      >
        {selectedCompany && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.legal_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNAE</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.cnae}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.street}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.zip_code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.neighborhood}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedCompany.state}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCompany.active)}`}>
                  {getStatusText(selectedCompany.active)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Criado em</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">
                  {new Date(selectedCompany.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </ModalLayout>

      {/* Modal para Editar Empresa */}
      <ModalLayout
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCompany(null);
          resetForm();
        }}
        title="Editar Empresa"
        width="max-w-2xl"
      >
        <form onSubmit={editCompany} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Edite os dados da empresa</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome Fantasia */}
            <div>
              <label htmlFor="edit_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Fantasia *
              </label>
              <input
                id="edit_name"
                type="text"
                required
                placeholder="Nome fantasia da empresa"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* CNAE */}
            <div>
              <label htmlFor="edit_cnae" className="block text-sm font-medium text-gray-700 mb-1">
                CNAE *
              </label>
              <input
                id="edit_cnae"
                type="text"
                required
                placeholder="CNAE da empresa"
                value={formData.cnae}
                onChange={(e) => setFormData(prev => ({ ...prev, cnae: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* CNPJ */}
            <div>
              <label htmlFor="edit_cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ * {cnpjLoading && <span className="text-teal-600 text-xs">(Buscando dados...)</span>}
              </label>
              <div className="relative">
                <input
                  id="edit_cnpj"
                  type="text"
                  required
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  disabled={cnpjLoading}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none ${cnpjLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  maxLength={18}
                />
                {cnpjLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Digite o CNPJ para buscar automaticamente os dados da empresa
              </p>
            </div>

            {/* Razão Social */}
            <div>
              <label htmlFor="edit_legal_name" className="block text-sm font-medium text-gray-700 mb-1">
                Razão Social *
              </label>
              <input
                id="edit_legal_name"
                type="text"
                required
                value={formData.legal_name}
                onChange={(e) => setFormData(prev => ({ ...prev, legal_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Rua */}
            <div>
              <label htmlFor="edit_street" className="block text-sm font-medium text-gray-700 mb-1">
                Rua *
              </label>
              <input
                id="edit_street"
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Número */}
            <div>
              <label htmlFor="edit_number" className="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <input
                id="edit_number"
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="edit_zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                CEP *
              </label>
              <input
                id="edit_zip_code"
                type="text"
                required
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Bairro */}
            <div>
              <label htmlFor="edit_neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                id="edit_neighborhood"
                type="text"
                required
                value={formData.neighborhood}
                onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="edit_city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade *
              </label>
              <input
                id="edit_city"
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="edit_state" className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <input
                id="edit_state"
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="edit_active" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="edit_active"
              required
              value={formData.active.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value === 'true' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCompany(null);
                resetForm();
              }}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </ModalLayout>

      {/* Modal para Deletar Empresa */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCompany(null);
        }}
        onConfirm={deleteCompany}
        title="Excluir Empresa"
        message={`Tem certeza que deseja excluir a empresa "${selectedCompany?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="EXCLUIR"
        requestData={{ id: selectedCompany?.id || '' }}
      />
    </div>
  );
};

export default Company;
