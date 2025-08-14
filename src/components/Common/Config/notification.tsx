import React, { useState } from 'react';

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState({
    // Notificações por Email
    novoLaudoCriado: true,
    laudoFinalizado: true,
    novaEmpresaCliente: true,
    
    // Outras Notificações
    notificacoesPush: false,
    notificacoesSMS: false,
    
    // Relatórios
    relatorioSemanal: true,
    relatorioMensal: true
  });

  const handleToggle = (field: string) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
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

  return (
    <div className="space-y-8">
      {/* Notificações por Email */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Notificações por Email</h3>
          <p className="text-sm text-gray-600">Configure quando você deseja receber notificações por email</p>
        </div>

        <div className="space-y-6">
          {/* Novo laudo criado */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Novo laudo criado</h4>
              <p className="text-sm text-gray-600">Receba um email quando um novo laudo for criado</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.novoLaudoCriado} 
              onChange={() => handleToggle('novoLaudoCriado')} 
            />
          </div>

          {/* Laudo finalizado */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Laudo finalizado</h4>
              <p className="text-sm text-gray-600">Receba um email quando um laudo for finalizado</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.laudoFinalizado} 
              onChange={() => handleToggle('laudoFinalizado')} 
            />
          </div>

          {/* Nova empresa cliente */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Nova empresa cliente</h4>
              <p className="text-sm text-gray-600">Receba um email quando uma nova empresa for cadastrada</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.novaEmpresaCliente} 
              onChange={() => handleToggle('novaEmpresaCliente')} 
            />
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-200"></div>

      {/* Outras Notificações */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Outras Notificações</h3>
          <p className="text-sm text-gray-600">Configure outros tipos de notificações</p>
        </div>

        <div className="space-y-6">
          {/* Notificações push */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notificações push</h4>
              <p className="text-sm text-gray-600">Receba notificações push no navegador</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.notificacoesPush} 
              onChange={() => handleToggle('notificacoesPush')} 
            />
          </div>

          {/* Notificações por SMS */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notificações por SMS</h4>
              <p className="text-sm text-gray-600">Receba notificações importantes por SMS</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.notificacoesSMS} 
              onChange={() => handleToggle('notificacoesSMS')} 
            />
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-200"></div>

      {/* Relatórios */}
      <div className="bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Relatórios</h3>
          <p className="text-sm text-gray-600">Configure o envio automático de relatórios</p>
        </div>

        <div className="space-y-6">
          {/* Relatório semanal */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Relatório semanal</h4>
              <p className="text-sm text-gray-600">Receba um resumo semanal das atividades</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.relatorioSemanal} 
              onChange={() => handleToggle('relatorioSemanal')} 
            />
          </div>

          {/* Relatório mensal */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Relatório mensal</h4>
              <p className="text-sm text-gray-600">Receba um relatório mensal completo</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.relatorioMensal} 
              onChange={() => handleToggle('relatorioMensal')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;