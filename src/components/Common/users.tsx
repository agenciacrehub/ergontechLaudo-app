import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Eye, ChevronLeft, ChevronRight, User, Mail, Shield, Calendar, Building, Briefcase, Phone, MapPin, Clock, Minus, Camera } from 'lucide-react';
import ModalLayout from '../UI/ModalLayout';
import DeleteModal from '../UI/DeleteModal';
import axios from 'axios';
import { toastSuccess, toastError } from '../../utils/toast';

interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  role: 'MASTER' | 'ADMIN' | 'CLIENT' | 'USER';
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    birth_date?: string;
    company: {
      id: string;
      name: string;
    };
    job_function: {
      id: string;
      name: string;
    };
    profile_photo?: {
      id: string;
      photo_user: string;
    };
    profile_email?: {
      id: string;
      email: string;
      is_primary: boolean;
    }[];
    profile_phone?: {
      id: string;
      number: string;
      type: string;
      is_primary: boolean;
    }[];
    profile_address?: {
      id: string;
      street: string;
      number: string;
      district: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
      is_primary: boolean;
    }[];
  }[];
}

interface CreateUserData {
  user: {
    name: string;
    email: string;
    password: string;
    role: string;
  };
  profile: {
    company_id: string;
    function_id: string;
    birth_date?: string;
    emails: {
      email: string;
      is_primary: boolean;
    }[];
    phones: {
      number: string;
      type: string;
      is_primary: boolean;
    }[];
    addresses: {
      type: string;
      street: string;
      number: string;
      district: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
      is_primary: boolean;
    }[];
  };
}

const API_URL = import.meta.env.VITE_API_URL;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [functions, setFunctions] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Filtrar por função');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Etapa 1 - Dados Básicos
    name: '',
    email: '',
    password: '',
    role: 'USER',
    birth_date: '',
    photo: null as File | null,
    photoBase64: '' as string,
    
    // Etapa 2 - Empresa e Função
    company_id: '',
    function_id: '',
    
    // Etapa 3 - Contatos e Endereço
    phone: '',
    phone_type: 'MOBILE',
    // Emails extras
    extra_emails: [] as {email: string, is_primary: boolean}[],
    // Telefones extras
    extra_phones: [] as {number: string, type: string, is_primary: boolean}[],
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'Brasil'
  });

  // Buscar usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`, {
        params: {
          include: 'profiles.profile_photo,profiles.profile_email,profiles.profile_phone,profiles.profile_address,profiles.company,profiles.job_function'
        }
      });
      setUsers(response.data);
    } catch (error) {
      toastError('Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar empresas
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/company`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  // Buscar funções
  const fetchFunctions = async () => {
    try {
      const response = await axios.get(`${API_URL}/function`);
      setFunctions(response.data);
    } catch (error) {
      console.error('Erro ao carregar funções:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
    fetchFunctions();
  }, []);

  // Função para converter imagem para base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Reduzir qualidade da imagem
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // Definir tamanho máximo (200x200 para reduzir o base64)
          const maxSize = 200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para base64 com qualidade reduzida
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.src = result;
      };
      reader.onerror = reject;
    });
  };

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      // Etapa 1 - Dados Básicos
      name: '',
      email: '',
      password: '',
      role: 'USER',
      birth_date: '',
      photo: null,
      photoBase64: '',
      
      // Etapa 2 - Empresa e Função
      company_id: '',
      function_id: '',
      
      // Etapa 3 - Contatos e Endereço
      phone: '',
      phone_type: 'MOBILE',
      extra_emails: [],
      extra_phones: [],
      street: '',
      number: '',
      district: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'Brasil'
    });
    setCurrentStep(1);
  };

  // Funções para gerenciar steps do modal
  const nextStep = () => {
    // Validação por etapa antes de avançar
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toastError('Nome é obrigatório');
        return;
      }
      if (!formData.email.trim()) {
        toastError('Email é obrigatório');
        return;
      }
      if (!formData.password.trim() && !selectedUser) {
        toastError('Senha é obrigatória');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.company_id) {
        toastError('Empresa é obrigatória');
        return;
      }
      if (!formData.function_id) {
        toastError('Função é obrigatória');
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Funções para gerenciar emails extras
  const addExtraEmail = () => {
    setFormData(prev => ({
      ...prev,
      extra_emails: [...prev.extra_emails, { email: '', is_primary: false }]
    }));
  };

  const removeExtraEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      extra_emails: prev.extra_emails.filter((_, i) => i !== index)
    }));
  };

  const updateExtraEmail = (index: number, email: string) => {
    setFormData(prev => ({
      ...prev,
      extra_emails: prev.extra_emails.map((item, i) => 
        i === index ? { ...item, email } : item
      )
    }));
  };

  // Funções para gerenciar telefones extras
  const addExtraPhone = () => {
    setFormData(prev => ({
      ...prev,
      extra_phones: [...prev.extra_phones, { number: '', type: 'MOBILE', is_primary: false }]
    }));
  };

  const removeExtraPhone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      extra_phones: prev.extra_phones.filter((_, i) => i !== index)
    }));
  };

  const updateExtraPhone = (index: number, field: 'number' | 'type', value: string) => {
    setFormData(prev => ({
      ...prev,
      extra_phones: prev.extra_phones.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Função para abrir modal de criação
  const openCreateModal = () => {
    resetForm();
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  // Função para abrir modal de edição
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    
    // Extrair dados do perfil
    const profile = user.profiles?.[0];
    const primaryPhone = profile?.profile_phone?.find(p => p.is_primary);
    const extraPhones = profile?.profile_phone?.filter(p => !p.is_primary) || [];
    const extraEmails = profile?.profile_email || [];
    const primaryAddress = profile?.profile_address?.find(a => a.is_primary);
    
    setFormData({
      // Etapa 1 - Dados Básicos
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      birth_date: profile?.birth_date || '',
      photo: null,
      photoBase64: profile?.profile_photo?.photo_user || '',
      
      // Etapa 2 - Empresa e Função
      company_id: profile?.company?.id || '',
      function_id: profile?.job_function?.id || '',
      
      // Etapa 3 - Contatos e Endereço
      phone: primaryPhone?.number || '',
      phone_type: primaryPhone?.type || 'MOBILE',
      extra_emails: extraEmails.map(email => ({
        email: email.email,
        is_primary: email.is_primary
      })),
      extra_phones: extraPhones.map(phone => ({
        number: phone.number,
        type: phone.type,
        is_primary: phone.is_primary
      })),
      street: primaryAddress?.street || '',
      number: primaryAddress?.number || '',
      district: primaryAddress?.district || '',
      city: primaryAddress?.city || '',
      state: primaryAddress?.state || '',
      zip_code: primaryAddress?.zip_code || '',
      country: primaryAddress?.country || 'Brasil'
    });
    setCurrentStep(1);
    setIsEditModalOpen(true);
  };

  // Função para fechar modais
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    resetForm();
  };

  // Função para criar usuário
  const createUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validação básica dos campos obrigatórios
    if (!formData.name.trim()) {
      toastError('Nome é obrigatório');
      return;
    }
    if (!formData.email.trim()) {
      toastError('Email é obrigatório');
      return;
    }
    if (!formData.password.trim()) {
      toastError('Senha é obrigatória');
      return;
    }
    if (!formData.company_id) {
      toastError('Empresa é obrigatória');
      return;
    }
    if (!formData.function_id) {
      toastError('Função é obrigatória');
      return;
    }
    
    try {
      setLoading(true);
      
      const userData: CreateUserData = {
        user: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role
        },
        profile: {
          company_id: formData.company_id,
          function_id: formData.function_id,
          // Corrigir formato da data - só enviar se preenchida e em formato ISO
          birth_date: formData.birth_date ? new Date(formData.birth_date).toISOString() : undefined,
          emails: [
            {
              email: formData.email.trim(),
              is_primary: true
            },
            ...formData.extra_emails.filter(email => email.email.trim())
          ],
          phones: [
            ...(formData.phone ? [{
              number: formData.phone,
              type: formData.phone_type,
              is_primary: true
            }] : []),
            ...formData.extra_phones.filter(phone => phone.number.trim()).map(phone => ({
              number: phone.number,
              type: phone.type,
              is_primary: phone.is_primary
            }))
          ],
          addresses: (formData.street && formData.number && formData.district && formData.city && formData.state && formData.zip_code) ? [{
            type: 'RESIDENTIAL',
            street: formData.street.trim(),
            number: formData.number.trim(),
            district: formData.district.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zip_code: formData.zip_code.trim(),
            country: formData.country.trim(),
            is_primary: true
          }] : []
        }
      };

      // Decidir se usar FormData ou JSON baseado na presença de foto
      if (formData.photo) {
        // Usar FormData apenas se houver foto
        const formDataToSend = new FormData();
        formDataToSend.append('data', JSON.stringify(userData));
        formDataToSend.append('photo', formData.photo);

        await axios.post(`${API_URL}/users`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Usar JSON simples se não houver foto
        await axios.post(`${API_URL}/users`, userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      toastSuccess('Usuário criado com sucesso!');
      closeModals();
      fetchUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar usuário';
      toastError(errorMessage);
      console.error('Erro ao criar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para editar usuário
  const updateUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedUser) return;

    try {
      setLoading(true);
      
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        ...(formData.password && { password: formData.password })
      };

      await axios.patch(`${API_URL}/users/${selectedUser.id}`, updateData);
      toastSuccess('Usuário atualizado com sucesso!');
      closeModals();
      fetchUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar usuário';
      toastError(errorMessage);
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de visualização
  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Função para deletar usuário
  const deleteUser = async (requestData: { id: string | number }) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/users/${requestData.id}`);
      toastSuccess('Usuário excluído com sucesso!');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toastError('Erro ao excluir usuário');
      console.error('Erro ao excluir usuário:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de exclusão
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const roleOptions = [
    'Filtrar por função',
    'MASTER',
    'ADMIN',
    'CLIENT',
    'USER'
  ];

  const roleModalOptions = [
    { value: 'MASTER', label: 'Master' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'CLIENT', label: 'Cliente' },
    { value: 'USER', label: 'Usuário' }
  ];

  const getStatusColor = (is_active: boolean) => {
    return is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (is_active: boolean) => {
    return is_active ? 'Ativo' : 'Inativo';
  };

  const getRoleText = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'MASTER': 'Master',
      'ADMIN': 'Admin',
      'CLIENT': 'Cliente',
      'USER': 'Usuário'
    };
    return roleMap[role] || role;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getRoleText(user.role).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'Filtrar por função' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Função para renderizar o conteúdo de cada step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Básicos</h3>

                        {/* Foto de Perfil */}
                        <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Foto de Perfil
              </label>
              <div className="flex flex-col items-center">
                {/* Círculo da foto */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {formData.photoBase64 ? (
                      <img 
                        src={formData.photoBase64} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Botão de upload sobreposto */}
                  <label 
                    htmlFor="photo-upload" 
                    className="absolute inset-0 w-24 h-24 rounded-full bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center cursor-pointer transition-all duration-200"
                  >
                    <Camera className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                  </label>
                  
                  {/* Input file oculto */}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Verificar tamanho do arquivo (máximo 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          toastError('Arquivo muito grande. Máximo 5MB.');
                          return;
                        }
                        
                        try {
                          const base64 = await convertToBase64(file);
                          setFormData(prev => ({ 
                            ...prev, 
                            photo: file,
                            photoBase64: base64
                          }));
                        } catch (error) {
                          toastError('Erro ao processar imagem.');
                          console.error('Erro ao converter imagem:', error);
                        }
                      }
                    }}
                  />
                </div>
                
                {/* Texto informativo */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Clique para adicionar foto<br/>
                  JPG, PNG, GIF - Máx. 5MB
                </p>
                
                {/* Nome do arquivo selecionado */}
                {formData.photo && (
                  <p className="text-sm text-teal-600 mt-1 text-center">
                    {formData.photo.name}
                  </p>
                )}
                
                {/* Botão para remover foto */}
                {formData.photoBase64 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        photo: null,
                        photoBase64: ''
                      }));
                    }}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
            
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {selectedUser ? 'Nova Senha (deixe em branco para manter atual)' : 'Senha *'}
              </label>
              <input
                id="password"
                type="password"
                required={!selectedUser}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Função */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Função *
              </label>
              <select
                id="role"
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                {roleModalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Empresa e Função</h3>
            
            {/* Empresa */}
            <div>
              <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">
                Empresa *
              </label>
              <select
                id="company_id"
                required
                value={formData.company_id}
                onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="">Selecione uma empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Função/Cargo */}
            <div>
              <label htmlFor="function_id" className="block text-sm font-medium text-gray-700 mb-1">
                Cargo/Função *
              </label>
              <select
                id="function_id"
                required
                value={formData.function_id}
                onChange={(e) => setFormData(prev => ({ ...prev, function_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="">Selecione um cargo</option>
                {functions.map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contatos e Endereço</h3>
            
            {/* Telefone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label htmlFor="phone_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  id="phone_type"
                  value={formData.phone_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  <option value="MOBILE">Celular</option>
                  <option value="HOME">Residencial</option>
                  <option value="WORK">Comercial</option>
                </select>
              </div>
            </div>

            {/* Emails Extras */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-800">Emails Adicionais</h4>
                <button
                  type="button"
                  onClick={addExtraEmail}
                  className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Email
                </button>
              </div>
              {formData.extra_emails.map((email, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={email.email}
                    onChange={(e) => updateExtraEmail(index, e.target.value)}
                    placeholder="email@exemplo.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraEmail(index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Telefones Extras */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-800">Telefones Adicionais</h4>
                <button
                  type="button"
                  onClick={addExtraPhone}
                  className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Telefone
                </button>
              </div>
              {formData.extra_phones.map((phone, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="tel"
                    value={phone.number}
                    onChange={(e) => updateExtraPhone(index, 'number', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                  <select
                    value={phone.type}
                    onChange={(e) => updateExtraPhone(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  >
                    <option value="MOBILE">Celular</option>
                    <option value="HOME">Residencial</option>
                    <option value="WORK">Comercial</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeExtraPhone(index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Rua/Avenida
                </label>
                <input
                  id="street"
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  id="number"
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  id="district"
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="SP"
                />
              </div>
              <div>
                <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  id="zip_code"
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Usuários</h1>
            <p className="text-gray-600">Gerencie os usuários da plataforma</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Lista de Usuários</h2>
          <p className="text-sm text-gray-600 mb-6">Visualize e gerencie os usuários cadastrados na plataforma</p>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Busca */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            {/* Filtro por Função */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Filtrar por função' ? option : getRoleText(option)}
                  </option>
                ))}
              </select>
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getRoleText(user.role)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.is_active)}`}>
                        {getStatusText(user.is_active)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openViewModal(user)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-100 transition"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
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

      {/* Modal Multi-Step para Criar/Editar Usuário */}
      <ModalLayout
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={selectedUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
        width="max-w-2xl"
      >
        <div className="space-y-6">
          {/* Indicador de Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Etapa {currentStep} de 3</span>
              <span className="text-sm text-gray-500">
                {currentStep === 1 && 'Dados Básicos'}
                {currentStep === 2 && 'Empresa e Função'}
                {currentStep === 3 && 'Contatos e Endereço'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Conteúdo do Step */}
          {renderStepContent()}

          {/* Botões de Navegação */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={selectedUser ? updateUser : createUser}
                  disabled={loading}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (selectedUser ? 'Atualizando...' : 'Criando...') : (selectedUser ? 'Atualizar Usuário' : 'Criar Usuário')}
                </button>
              )}
            </div>
          </div>
        </div>
      </ModalLayout>

      {/* Modal para Visualizar Usuário */}
      <ModalLayout
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes do Usuário"
        width="max-w-4xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Header com Avatar e Informações Básicas */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 border border-teal-100">
              <div className="flex items-center space-x-4">
                {/* Avatar do usuário */}
                <div className="relative">
                  {selectedUser.profiles?.[0]?.profile_photo?.photo_user ? (
                    <img 
                      src={`data:image/jpeg;base64,${selectedUser.profiles[0].profile_photo.photo_user}`}
                      alt={selectedUser.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="bg-teal-100 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                      <User className="h-12 w-12 text-teal-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-700">{getRoleText(selectedUser.role)}</span>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedUser.is_active)}`}>
                      {getStatusText(selectedUser.is_active)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditModal(selectedUser);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                </div>
              </div>
            </div>

            {/* Grid com Informações Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-teal-600" />
                  Informações Pessoais
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                    <p className="text-gray-900 font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  {selectedUser.profiles?.[0]?.birth_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Data de Nascimento
                      </label>
                      <p className="text-gray-900">
                        {new Date(selectedUser.profiles[0].birth_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações Profissionais */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-teal-600" />
                  Informações Profissionais
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Função no Sistema</label>
                    <p className="text-gray-900 font-medium">{getRoleText(selectedUser.role)}</p>
                  </div>
                  {selectedUser.profiles?.[0]?.company && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Empresa
                      </label>
                      <p className="text-gray-900">{selectedUser.profiles[0].company.name}</p>
                    </div>
                  )}
                  {selectedUser.profiles?.[0]?.job_function && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Cargo/Função</label>
                      <p className="text-gray-900">{selectedUser.profiles[0].job_function.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Informações de Contato e Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contatos */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-teal-600" />
                  Contatos
                </h4>
                <div className="space-y-4">
                  {/* Emails */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Emails</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-gray-900">{selectedUser.email}</span>
                        <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Principal</span>
                      </div>
                      {selectedUser.profiles?.[0]?.profile_email?.map((email) => (
                        <div key={email.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-gray-900">{email.email}</span>
                          {email.is_primary && (
                            <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Principal</span>
                          )}
                        </div>
                      )) || null}
                    </div>
                  </div>
                  
                  {/* Telefones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Telefones</label>
                    {selectedUser.profiles?.[0]?.profile_phone && selectedUser.profiles[0].profile_phone.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.profiles[0].profile_phone.map((phone) => (
                          <div key={phone.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-900">{phone.number}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{phone.type}</span>
                              {phone.is_primary && (
                                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Principal</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm bg-gray-50 p-2 rounded">Nenhum telefone cadastrado</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Endereços */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                  Endereços
                </h4>
                <div className="space-y-3">
                  {selectedUser.profiles?.[0]?.profile_address && selectedUser.profiles[0].profile_address.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUser.profiles[0].profile_address.map((address) => (
                        <div key={address.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900">Endereço</span>
                            </div>
                            {address.is_primary && (
                              <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Principal</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p>{address.street}, {address.number}</p>
                            <p>{address.district} - {address.city}/{address.state}</p>
                            <p>CEP: {address.zip_code}</p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded">Nenhum endereço cadastrado</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-teal-600" />
                Informações do Sistema
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">ID do Usuário</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Criado em</label>
                  <p className="text-gray-900">
                    {new Date(selectedUser.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Última Atualização</label>
                  <p className="text-gray-900">
                    {new Date(selectedUser.updated_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Fechar
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(selectedUser);
                  }}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Editar Usuário
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openDeleteModal(selectedUser);
                  }}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalLayout>

      {/* Modal para Deletar Usuário */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={deleteUser}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${selectedUser?.name}"? Esta ação não pode ser desfeita.`}
        requestData={{ id: selectedUser?.id || '' }}
      />
    </div>
  );
};

export default Users;
