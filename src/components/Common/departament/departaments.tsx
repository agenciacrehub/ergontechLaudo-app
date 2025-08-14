import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import ModalLayout from '../../UI/ModalLayout';
import DeleteModal from '../../UI/DeleteModal';
import axios from 'axios';
import { toastSuccess, toastError } from '../../../utils/toast';

interface Departament {
  id: string;
  name: string;
  setor_id: string;
  setor?: {
    id: string;
    name: string;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Setor {
  id: string;
  name: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Funções para status
const getStatusColor = (active: boolean) => {
  return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

const getStatusText = (active: boolean) => {
  return active ? 'Ativo' : 'Inativo';
};

const Departament: React.FC = () => {
  const [departaments, setDepartaments] = useState<Departament[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartament, setSelectedDepartament] = useState<Departament | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    setor_id: '',
    active: true
  });

  // Buscar departamentos
  const fetchDepartaments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/departament`);
      setDepartaments(response.data);
    } catch (error) {
      toastError('Erro ao carregar departamentos');
      console.error('Erro ao carregar departamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar setores para o dropdown
  const fetchSetores = async () => {
    try {
      const response = await axios.get(`${API_URL}/setor`);
      setSetores(response.data);
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    }
  };

  useEffect(() => {
    fetchDepartaments();
    fetchSetores();
  }, []);

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      setor_id: '',
      active: true
    });
  };

  // Função para criar departamento
  const createDepartament = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_URL}/departament`, formData);
      toastSuccess('Departamento criado com sucesso!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchDepartaments();
    } catch (error) {
      toastError('Erro ao criar departamento');
      console.error('Erro ao criar departamento:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de visualização
  const openViewModal = (departament: Departament) => {
    setSelectedDepartament(departament);
    setIsViewModalOpen(true);
  };

  // Função para abrir modal de edição
  const openEditModal = (departament: Departament) => {
    setSelectedDepartament(departament);
    setFormData({
      name: departament.name,
      setor_id: departament.setor_id,
      active: departament.active
    });
    setIsEditModalOpen(true);
  };

  // Função para editar departamento
  const editDepartament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartament) return;
    
    try {
      setLoading(true);
      await axios.put(`${API_URL}/departament/${selectedDepartament.id}`, formData);
      toastSuccess('Departamento atualizado com sucesso!');
      setIsEditModalOpen(false);
      setSelectedDepartament(null);
      resetForm();
      fetchDepartaments();
    } catch (error) {
      toastError('Erro ao atualizar departamento');
      console.error('Erro ao atualizar departamento:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de delete
  const openDeleteModal = (departament: Departament) => {
    setSelectedDepartament(departament);
    setIsDeleteModalOpen(true);
  };

  // Função para deletar departamento
  const deleteDepartament = async (requestData: { id: string | number }) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/departament/${requestData.id}`);
      toastSuccess('Departamento excluído com sucesso!');
      setIsDeleteModalOpen(false);
      setSelectedDepartament(null);
      fetchDepartaments();
    } catch (error) {
      toastError('Erro ao excluir departamento');
      console.error('Erro ao excluir departamento:', error);
      throw error; // Re-throw para o DeleteModal tratar
    } finally {
      setLoading(false);
    }
  };

  // Filtrar departamentos
  const filteredDepartaments = departaments.filter(departament =>
    departament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (departament.setor?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Departamentos</h1>
            <p className="text-gray-600">Gerencie os departamentos da plataforma</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Departamento
          </button>
        </div>
      </div>

      {/* Lista de Departamentos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Lista de Departamentos</h2>
          <p className="text-sm text-gray-600 mb-6">Visualize e gerencie os departamentos cadastrados na plataforma</p>

          {/* Busca */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar departamentos..."
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
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Setor
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
                {filteredDepartaments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Nenhum departamento encontrado
                    </td>
                  </tr>
                ) : (
                  filteredDepartaments.map((departament) => (
                    <tr key={departament.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{departament.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{departament.setor?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(departament.active)}`}>
                          {getStatusText(departament.active)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openViewModal(departament)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition"
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(departament)}
                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(departament)}
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

      {/* Modal para Criar Departamento */}
      <ModalLayout
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Adicionar Novo Departamento"
        width="max-w-md"
      >
        <form onSubmit={createDepartament} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="Digite o nome do departamento"
            />
          </div>

          <div>
            <label htmlFor="setor_id" className="block text-sm font-medium text-gray-700 mb-1">
              Setor *
            </label>
            <select
              id="setor_id"
              required
              value={formData.setor_id}
              onChange={(e) => setFormData(prev => ({ ...prev, setor_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Selecione um setor</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.name}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 mr-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Departamento'}
            </button>
          </div>
        </form>
      </ModalLayout>

      {/* Modal para Editar Departamento */}
      <ModalLayout
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartament(null);
          resetForm();
        }}
        title="Editar Departamento"
        width="max-w-md"
      >
        <form onSubmit={editDepartament} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="edit-name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="Digite o nome do departamento"
            />
          </div>

          <div>
            <label htmlFor="edit-setor_id" className="block text-sm font-medium text-gray-700 mb-1">
              Setor *
            </label>
            <select
              id="edit-setor_id"
              required
              value={formData.setor_id}
              onChange={(e) => setFormData(prev => ({ ...prev, setor_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Selecione um setor</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.name}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedDepartament(null);
                resetForm();
              }}
              className="px-4 py-2 mr-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </ModalLayout>

      {/* Modal para Visualizar Departamento */}
      <ModalLayout
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDepartament(null);
        }}
        title="Detalhes do Departamento"
        width="max-w-md"
      >
        {selectedDepartament && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedDepartament.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">
                {selectedDepartament.setor?.name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDepartament.active)}`}>
                {getStatusText(selectedDepartament.active)}
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

      {/* Modal de Confirmação de Exclusão */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDepartament(null);
        }}
        onConfirm={deleteDepartament}
        requestData={{ id: selectedDepartament?.id || '' }}
        title="Excluir Departamento"
        message={`Tem certeza que deseja excluir o departamento "${selectedDepartament?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default Departament;
