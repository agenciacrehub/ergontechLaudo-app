import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import ModalLayout from '../../UI/ModalLayout';
import DeleteModal from '../../UI/DeleteModal';
import axios from 'axios';
import { toastSuccess, toastError } from '../../../utils/toast';

interface Setor {
  id: string;
  name: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

const Setor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSetor, setSelectedSetor] = useState<Setor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    active: true,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Carregar setores ao montar o componente
  useEffect(() => {
    fetchSetores();
  }, []);

  // Função para buscar setores
  const fetchSetores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/setor`);
      setSetores(response.data);
    } catch (error) {
      toastError('Erro ao carregar setores');
      console.error('Erro ao buscar setores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para criar setor
  const createSetor = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/setor`, formData);
      toastSuccess('Setor criado com sucesso!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchSetores();
    } catch (error) {
      toastError('Erro ao criar setor');
      console.error('Erro ao criar setor:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar setor
  const updateSetor = async () => {
    if (!selectedSetor) return;
    
    try {
      setLoading(true);
      await axios.put(`${API_URL}/setor/${selectedSetor.id}`, formData);
      toastSuccess('Setor atualizado com sucesso!');
      setIsEditModalOpen(false);
      resetForm();
      fetchSetores();
    } catch (error) {
      toastError('Erro ao atualizar setor');
      console.error('Erro ao atualizar setor:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de delete
  const openDeleteModal = (setor: Setor) => {
    setSelectedSetor(setor);
    setIsDeleteModalOpen(true);
  };

  // Função para deletar setor
  const deleteSetor = async (requestData: { id: string | number }) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/setor/${requestData.id}`);
      toastSuccess('Setor excluído com sucesso!');
      setIsDeleteModalOpen(false);
      setSelectedSetor(null);
      fetchSetores();
    } catch (error) {
      toastError('Erro ao excluir setor');
      console.error('Erro ao excluir setor:', error);
      throw error; // Re-throw para o DeleteModal tratar
    } finally {
      setLoading(false);
    }
  };

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({ name: '', active: true });
    setSelectedSetor(null);
  };

  // Função para abrir modal de edição
  const openEditModal = (setor: Setor) => {
    setSelectedSetor(setor);
    setFormData({ name: setor.name, active: setor.active });
    setIsEditModalOpen(true);
  };

  // Função para abrir modal de visualização
  const openViewModal = (setor: Setor) => {
    setSelectedSetor(setor);
    setIsViewModalOpen(true);
  };

  // Função para submeter formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditModalOpen) {
      updateSetor();
    } else {
      createSetor();
    }
  };

  // Função para obter cor do status
  const getStatusColor = (active: boolean) => {
    return active 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Filtrar setores baseado na busca
  const filteredSetores = setores.filter(setor =>
    setor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Setores</h1>
            <p className="text-gray-600">Gerencie os setores da plataforma</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            Novo Setor
          </button>
        </div>
      </div>

      {/* Lista de Setores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Lista de Setores</h2>
          <p className="text-sm text-gray-600 mb-6">Visualize e gerencie os setores cadastrados na plataforma</p>

          {/* Busca */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar setores..."
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
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span className="ml-2 text-gray-600">Carregando...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
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
                {filteredSetores.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      Nenhum setor encontrado
                    </td>
                  </tr>
                ) : (
                  filteredSetores.map((setor) => (
                    <tr key={setor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{setor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(setor.active)}`}>
                          {setor.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openViewModal(setor)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition"
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(setor)}
                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(setor)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition"
                            title="Excluir"
                            disabled={loading}
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
          )}
        </div>
      </div>

      {/* Modal para Criar Setor */}
      <ModalLayout
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Adicionar Novo Setor"
        width="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Preencha os dados do novo setor</p>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2 text-sm text-gray-700">Ativo</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </ModalLayout>

      {/* Modal para Editar Setor */}
      <ModalLayout
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Editar Setor"
        width="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Edite os dados do setor</p>

          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              id="edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2 text-sm text-gray-700">Ativo</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </ModalLayout>

      {/* Modal para Visualizar Setor */}
      <ModalLayout
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes do Setor"
        width="max-w-md"
      >
        {selectedSetor && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedSetor.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSetor.active)}`}>
                {selectedSetor.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {selectedSetor.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Criado em</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {new Date(selectedSetor.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

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

      {/* Modal de Confirmação de Exclusão */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSetor(null);
        }}
        onConfirm={deleteSetor}
        requestData={{ id: selectedSetor?.id || '' }}
        title="Excluir Setor"
        message={`Tem certeza que deseja excluir o setor "${selectedSetor?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default Setor;
