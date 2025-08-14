import React, { useState } from 'react';
import { User, Settings, Bell, Shield } from 'lucide-react';
import Profile from './Config/profile';
import Platform from './Config/platform';
import Notification from './Config/notification';
import Security from './Config/segurity';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Config: React.FC = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  const tabs: TabItem[] = [
    {
      id: 'perfil',
      label: 'Perfil',
      icon: User
    },
    {
      id: 'plataforma',
      label: 'Plataforma',
      icon: Settings
    },
    {
      id: 'notificacoes',
      label: 'Notificações',
      icon: Bell
    },
    {
      id: 'seguranca',
      label: 'Segurança',
      icon: Shield
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="p-6">
            <Profile />
          </div>
        );
      case 'plataforma':
        return (
          <div className="p-6">
            <Platform />
          </div>
        );
      case 'notificacoes':
        return (
          <div className="p-6">
            <Notification />
          </div>
        );
      case 'seguranca':
        return (
          <div className="p-6">
            <Security />
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
        <h1 className="text-3xl font-bold text-teal-600 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie seu perfil e as configurações da plataforma</p>
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Config;