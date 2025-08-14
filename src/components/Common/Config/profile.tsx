import React, { useState } from 'react';
import { Upload, Eye, EyeOff } from 'lucide-react';

const Profile: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        // Alterar Senha
        senhaAtual: '',
        novaSenha: '',
        confirmarNovaSenha: '',

        // Informações Pessoais
        nomeCompleto: '',
        email: '',
        telefone: '',
        cargo: '',
        departamento: '',
        biografia: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você adicionaria a lógica para salvar as informações pessoais
    };

    return (
        <div className="space-y-8">

            {/* Seção Informações Pessoais */}
            <div className="bg-white">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-teal-600 mb-2">Informações Pessoais</h3>
                    <p className="text-sm text-gray-600">Atualize suas informações pessoais e de contato</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Foto de Perfil */}
                    <div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 text-2xl font-medium">U</span>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
                                >
                                    <Upload className="h-4 w-4" />
                                    Alterar foto
                                </button>
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF. Máximo 2MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Grid de Campos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome Completo */}
                        <div>
                            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome completo
                            </label>
                            <input
                                id="nomeCompleto"
                                type="text"
                                value={formData.nomeCompleto}
                                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                placeholder="Digite seu nome completo"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {/* Telefone */}
                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                                Telefone
                            </label>
                            <input
                                id="telefone"
                                type="tel"
                                value={formData.telefone}
                                onChange={(e) => handleInputChange('telefone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        {/* Cargo */}
                        <div>
                            <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                                Cargo
                            </label>
                            <input
                                id="cargo"
                                type="text"
                                value={formData.cargo}
                                onChange={(e) => handleInputChange('cargo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                placeholder="Seu cargo"
                            />
                        </div>
                    </div>

                    {/* Departamento */}
                    <div>
                        <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-2">
                            Departamento
                        </label>
                        <select
                            id="departamento"
                            value={formData.departamento}
                            onChange={(e) => handleInputChange('departamento', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        >
                            <option value="">Selecione o departamento</option>
                            <option value="tecnologia">Tecnologia</option>
                            <option value="recursos-humanos">Recursos Humanos</option>
                            <option value="financeiro">Financeiro</option>
                            <option value="comercial">Comercial</option>
                            <option value="operacional">Operacional</option>
                        </select>
                    </div>

                    {/* Biografia */}
                    <div>
                        <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-2">
                            Biografia
                        </label>
                        <textarea
                            id="biografia"
                            rows={4}
                            value={formData.biografia}
                            onChange={(e) => handleInputChange('biografia', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                            placeholder="Conte um pouco sobre você..."
                        ></textarea>
                    </div>

                    {/* Admin/Cliente Toggle */}
                    <div>
                        <span className="text-sm text-gray-600">Admin Cliente</span>
                    </div>

                    {/* Botão Salvar */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
            </div>

            {/* Divisor */}
            <div className="border-t border-gray-200"></div>

            {/* Seção Alterar Senha */}
            <div className="bg-white">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-teal-600 mb-2">Alterar Senha</h3>
                    <p className="text-sm text-gray-600">Mantenha sua conta segura com uma senha forte</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* Senha Atual */}
                    <div>
                        <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 mb-2">
                            Senha atual
                        </label>
                        <div className="relative">
                            <input
                                id="senhaAtual"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.senhaAtual}
                                onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Nova Senha */}
                    <div>
                        <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-2">
                            Nova senha
                        </label>
                        <input
                            id="novaSenha"
                            type="password"
                            value={formData.novaSenha}
                            onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            required
                        />
                    </div>

                    {/* Confirmar Nova Senha */}
                    <div>
                        <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar nova senha
                        </label>
                        <input
                            id="confirmarNovaSenha"
                            type="password"
                            value={formData.confirmarNovaSenha}
                            onChange={(e) => handleInputChange('confirmarNovaSenha', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            required
                        />
                    </div>

                    {/* Botão Alterar Senha */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            Alterar senha
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;