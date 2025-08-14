import React, { useState } from 'react';

const Security: React.FC = () => {
  const [securitySettings, setSecuritySettings] = useState({
    // Autenticação
    autenticacaoDoisFatores: false,
    loginSemDispositivos: false,
    
    // Políticas de Segurança
    tempoExpiracaoSessao: '480', // em minutos
    maximoTentativasLogin: '5',
    bloqueioTemporario: true
  });

  const [logs] = useState([
    {
      id: 1,
      tipo: 'Login realizado',
      ip: '192.168.1.102',
      data: 'Hoje às 14:32',
      status: 'Sucesso'
    },
    {
      id: 2,
      tipo: 'Tentativa de login falhada',
      ip: '203.456.789.1',
      data: 'Ontem às 09:15',
      status: 'Falha'
    },
    {
      id: 3,
      tipo: 'Senha alterada',
      ip: '192.168.1.102',
      data: '2 dias atrás às 16:45',
      status: 'Atenção'
    }
  ]);

  const handleToggle = (field: string) => {
    setSecuritySettings(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${
          enabled
            ? 'bg-teal-600'
            : 'bg-gray-200'
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }
        `}
      />
    </button>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sucesso':
        return 'bg-green-100 text-green-800';
      case 'Falha':
        return 'bg-red-100 text-red-800';
      case 'Atenção':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Autenticação */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Autenticação</h3>
          <p className="text-sm text-gray-600">Configure as opções de segurança para autenticação</p>
        </div>

        <div className="space-y-6">
          {/* Autenticação de dois fatores */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Autenticação de dois fatores</h4>
              <p className="text-sm text-gray-600">Adicione uma camada extra de segurança à sua conta</p>
            </div>
            <ToggleSwitch 
              enabled={securitySettings.autenticacaoDoisFatores} 
              onChange={() => handleToggle('autenticacaoDoisFatores')} 
            />
          </div>

          {/* Login sem dispositivos */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Login sem dispositivos</h4>
              <p className="text-sm text-gray-600">Permita apenas um login ativo por vez</p>
            </div>
            <ToggleSwitch 
              enabled={securitySettings.loginSemDispositivos} 
              onChange={() => handleToggle('loginSemDispositivos')} 
            />
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-200"></div>

      {/* Políticas de Segurança */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Políticas de Segurança</h3>
          <p className="text-sm text-gray-600">Configure as políticas de segurança da plataforma</p>
        </div>

        <div className="space-y-6">
          {/* Tempo de expiração da sessão */}
          <div>
            <label htmlFor="tempoExpiracaoSessao" className="block text-sm font-medium text-gray-700 mb-2">
              Tempo de expiração da sessão (minutos)
            </label>
            <select
              id="tempoExpiracaoSessao"
              value={securitySettings.tempoExpiracaoSessao}
              onChange={(e) => handleInputChange('tempoExpiracaoSessao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="480">480</option>
              <option value="240">240</option>
              <option value="120">120</option>
              <option value="60">60</option>
              <option value="30">30</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Entre 30 minutos e 24 horas</p>
          </div>

          {/* Máximo de tentativas de login */}
          <div>
            <label htmlFor="maximoTentativasLogin" className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de tentativas de login
            </label>
            <select
              id="maximoTentativasLogin"
              value={securitySettings.maximoTentativasLogin}
              onChange={(e) => handleInputChange('maximoTentativasLogin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Entre 3 e 10 tentativas</p>
          </div>

          {/* Bloqueio temporário */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Bloqueio temporário</h4>
              <p className="text-sm text-gray-600">Bloquear conta temporariamente após tentativas falhadas</p>
            </div>
            <ToggleSwitch 
              enabled={securitySettings.bloqueioTemporario} 
              onChange={() => handleToggle('bloqueioTemporario')} 
            />
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-200"></div>

      {/* Logs de Segurança */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Logs de Segurança</h3>
          <p className="text-sm text-gray-600">Visualize os últimos acessos e atividades de segurança</p>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{log.tipo}</h4>
                <p className="text-sm text-gray-600">IP: {log.ip} • {log.data}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Security;