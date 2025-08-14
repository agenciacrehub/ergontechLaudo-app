import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import ModalLayout from '../../UI/ModalLayout';
import DeleteModal from '../../UI/DeleteModal';
import axios from 'axios';
import { toastSuccess, toastError } from '../../../utils/toast';

interface Function {
  id: string;
  name: string;
  active: boolean;
  departament_id: string;
  departament?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface Departament {
  id: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Funções para status
const getStatusColor = (active: boolean) => {
  return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

const getStatusText = (active: boolean) => {
  return active ? 'Ativo' : 'Inativo';
};

const Function: React.FC = () => {
  const [functions, setFunctions] = useState<Function[]>([]);
  const [departaments, setDepartaments] = useState<Departament[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<Function | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    departament_id: '',
    active: true
  });

  // Buscar funções
  const fetchFunctions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/function`);
      setFunctions(response.data);
    } catch (error) {
      toastError('Erro ao carregar funções');
      console.error('Erro ao carregar funções:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar departamentos para o dropdown
  const fetchDepartaments = async () => {
    try {
      const response = await axios.get(`${API_URL}/departament`);
      setDepartaments(response.data);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
    }
  };

  useEffect(() => {
    fetchFunctions();
    fetchDepartaments();
  }, []);

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      departament_id: '',
      active: true
    });
  };

  // Função para criar função
  const createFunction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_URL}/function`, formData);
      toastSuccess('Função criada com sucesso!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchFunctions();
    } catch (error) {
      toastError('Erro ao criar função');
      console.error('Erro ao criar função:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de visualização
  const openViewModal = (functionItem: Function) => {
    setSelectedFunction(functionItem);
    setIsViewModalOpen(true);
  };

  // Função para abrir modal de edição
  const openEditModal = (functionItem: Function) => {
    setSelectedFunction(functionItem);
    setFormData({
      name: functionItem.name,
      departament_id: functionItem.departament_id,
      active: functionItem.active
    });
    setIsEditModalOpen(true);
  };

  // Função para editar função
  const editFunction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFunction) return;

    try {
      setLoading(true);
      await axios.put(`${API_URL}/function/${selectedFunction.id}`, formData);
      toastSuccess('Função editada com sucesso!');
      setIsEditModalOpen(false);
      setSelectedFunction(null);
      resetForm();
      fetchFunctions();
    } catch (error) {
      toastError('Erro ao editar função');
      console.error('Erro ao editar função:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de exclusão
  const openDeleteModal = (functionItem: Function) => {
    setSelectedFunction(functionItem);
    setIsDeleteModalOpen(true);
  };

  // Função para deletar função
  const deleteFunction = async (requestData: { id: string | number }) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/function/${requestData.id}`);
      toastSuccess('Função excluída com sucesso!');
      setIsDeleteModalOpen(false);
      setSelectedFunction(null);
      fetchFunctions();
    } catch (error) {
      toastError('Erro ao excluir função');
      console.error('Erro ao excluir função:', error);
      throw error; // Re-throw para o DeleteModal tratar
    } finally {
      setLoading(false);
    }
  };

  // Filtrar funções
  const filteredFunctions = functions.filter(functionItem =>
    functionItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (functionItem.departament?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Funções</h1>
            <p className="text-gray-600">Gerencie as funções da plataforma</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Função
          </button>
        </div>
      </div>

      {/* Lista de Setores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Lista de Funções</h2>
          <p className="text-sm text-gray-600 mb-6">Visualize e gerencie as funções cadastradas na plataforma</p>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Busca */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar funções..."
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
                  Departamento
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
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredFunctions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma função encontrada
                  </td>
                </tr>
              ) : (
                filteredFunctions.map((functionItem) => (
                  <tr key={functionItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{functionItem.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{functionItem.departament?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(functionItem.active)}`}>
                        {getStatusText(functionItem.active)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openViewModal(functionItem)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(functionItem)}
                          className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(functionItem)}
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

      {/* Modal para Criar Função */}
      <ModalLayout
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Adicionar Nova Função"
        width="max-w-md"
      >
        <form onSubmit={createFunction} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Preencha os dados da nova função</p>

          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Campo Departamento */}
          <div>
            <label htmlFor="departament" className="block text-sm font-medium text-gray-700 mb-1">
              Departamento *
            </label>
            <select
              id="departament"
              required
              value={formData.departament_id}
              onChange={(e) => setFormData(prev => ({ ...prev, departament_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Selecione um departamento</option>
              {departaments.map((departament) => (
                <option key={departament.id} value={departament.id}>
                  {departament.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Status */}
          <div>
            <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="active"
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
              {loading ? 'Criando...' : 'Criar Função'}
            </button>
          </div>
        </form>
      </ModalLayout>

      {/* Modal para Visualizar Função */}
      <ModalLayout
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes da Função"
        width="max-w-md"
      >
        {selectedFunction && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedFunction.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">
                {selectedFunction.departament?.name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFunction.active)}`}>
                {getStatusText(selectedFunction.active)}
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </ModalLayout>

      {/* Modal para Editar Função */}
      <ModalLayout
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFunction(null);
          resetForm();
        }}
        title="Editar Função"
        width="max-w-md"
      >
        <form onSubmit={editFunction} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Edite os dados da função</p>

          {/* Campo Nome */}
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              id="edit-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Campo Departamento */}
          <div>
            <label htmlFor="edit-departament" className="block text-sm font-medium text-gray-700 mb-1">
              Departamento *
            </label>
            <select
              id="edit-departament"
              required
              value={formData.departament_id}
              onChange={(e) => setFormData(prev => ({ ...prev, departament_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Selecione um departamento</option>
              {departaments.map((departament) => (
                <option key={departament.id} value={departament.id}>
                  {departament.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Status */}
          <div>
            <label htmlFor="edit-active" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="edit-active"
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
                setSelectedFunction(null);
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

      {/* Modal para Deletar Função */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFunction(null);
        }}
        onConfirm={deleteFunction}
        title="Excluir Função"
        message={`Tem certeza que deseja excluir a função "${selectedFunction?.name}"?`}
        requestData={{ id: selectedFunction?.id || '' }}
      />
    </div>
  );
};

export default Function;