import React, { useState } from 'react';

const Platform: React.FC = () => {
  const [formData, setFormData] = useState({
    nomeEmpresa: 'ErgonTech',
    emailContato: 'contato@ergontech.com.br',
    telefoneContato: '(11) 99999-9999',
    urlLogo: 'https://exemplo.com/logo.png',
    enderecoCompleto: 'Rua, número, bairro, cidade, estado, CEP',
    corPrimaria: '#0D9488',
    corSecundaria: '#0F2937',
    temaPadrao: 'Claro',
    idioma: 'Português (Brasil)',
    fusoHorario: 'São Paulo (GMT -3)'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8">
      {/* Informações da Empresa */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Informações da Empresa</h3>
          <p className="text-sm text-gray-600">Configure as informações básicas da sua empresa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid de Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome da empresa */}
            <div>
              <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                Nome da empresa
              </label>
              <input
                id="nomeEmpresa"
                type="text"
                value={formData.nomeEmpresa}
                onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Email de contato */}
            <div>
              <label htmlFor="emailContato" className="block text-sm font-medium text-gray-700 mb-2">
                Email de contato
              </label>
              <input
                id="emailContato"
                type="email"
                value={formData.emailContato}
                onChange={(e) => handleInputChange('emailContato', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Telefone de contato */}
            <div>
              <label htmlFor="telefoneContato" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone de contato
              </label>
              <input
                id="telefoneContato"
                type="tel"
                value={formData.telefoneContato}
                onChange={(e) => handleInputChange('telefoneContato', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* URL do logo */}
            <div>
              <label htmlFor="urlLogo" className="block text-sm font-medium text-gray-700 mb-2">
                URL do logo
              </label>
              <input
                id="urlLogo"
                type="url"
                value={formData.urlLogo}
                onChange={(e) => handleInputChange('urlLogo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Endereço completo */}
          <div>
            <label htmlFor="enderecoCompleto" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço completo
            </label>
            <textarea
              id="enderecoCompleto"
              rows={3}
              value={formData.enderecoCompleto}
              onChange={(e) => handleInputChange('enderecoCompleto', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
              placeholder="Rua, número, bairro, cidade, estado, CEP"
            ></textarea>
          </div>
        </form>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-200"></div>

      {/* Personalização Visual */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Personalização Visual</h3>
          <p className="text-sm text-gray-600">Customize a aparência da plataforma</p>
        </div>

        <div className="space-y-6">
          {/* Grid de Cores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cor primária */}
            <div>
              <label htmlFor="corPrimaria" className="block text-sm font-medium text-gray-700 mb-2">
                Cor primária
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="corPrimaria"
                  type="color"
                  value={formData.corPrimaria}
                  onChange={(e) => handleInputChange('corPrimaria', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.corPrimaria}
                  onChange={(e) => handleInputChange('corPrimaria', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            {/* Cor secundária */}
            <div>
              <label htmlFor="corSecundaria" className="block text-sm font-medium text-gray-700 mb-2">
                Cor secundária
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="corSecundaria"
                  type="color"
                  value={formData.corSecundaria}
                  onChange={(e) => handleInputChange('corSecundaria', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <div className="w-6 h-6 bg-black rounded"></div>
              </div>
            </div>
          </div>

          {/* Grid de Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tema padrão */}
            <div>
              <label htmlFor="temaPadrao" className="block text-sm font-medium text-gray-700 mb-2">
                Tema padrão
              </label>
              <select
                id="temaPadrao"
                value={formData.temaPadrao}
                onChange={(e) => handleInputChange('temaPadrao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="Claro">Claro</option>
                <option value="Escuro">Escuro</option>
                <option value="Automático">Automático</option>
              </select>
            </div>

            {/* Idioma da plataforma */}
            <div>
              <label htmlFor="idioma" className="block text-sm font-medium text-gray-700 mb-2">
                Idioma da plataforma
              </label>
              <select
                id="idioma"
                value={formData.idioma}
                onChange={(e) => handleInputChange('idioma', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="Português (Brasil)">Português (Brasil)</option>
                <option value="English (US)">English (US)</option>
                <option value="Español">Español</option>
              </select>
            </div>

            {/* Fuso horário */}
            <div>
              <label htmlFor="fusoHorario" className="block text-sm font-medium text-gray-700 mb-2">
                Fuso horário
              </label>
              <select
                id="fusoHorario"
                value={formData.fusoHorario}
                onChange={(e) => handleInputChange('fusoHorario', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="São Paulo (GMT -3)">São Paulo (GMT -3)</option>
                <option value="Brasília (GMT -3)">Brasília (GMT -3)</option>
                <option value="Rio de Janeiro (GMT -3)">Rio de Janeiro (GMT -3)</option>
              </select>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Salvar configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platform;