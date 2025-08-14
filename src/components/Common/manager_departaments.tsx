import { useState } from 'react';
import { UserCheck, GraduationCap } from 'lucide-react';
import Departament from './departament/departaments';
import Setor from './departament/setor';
import Function from './departament/function';
type TabType = 'setores' | 'departamentos' | 'funções';

export default function ManagerDepartaments() {
    const [activeTab, setActiveTab] = useState<TabType>('setores');

    const tabs = [
        {
            id: 'setores' as TabType,
            label: 'Setores',
            icon: UserCheck,
            gradient: 'from-green-500 to-emerald-500',
            hoverGradient: 'from-green-600 to-emerald-600',
            shadowColor: 'shadow-green-500/25',
        },
        {
            id: 'departamentos' as TabType,
            label: 'Departamentos',
            icon: GraduationCap,
            gradient: 'from-blue-500 to-cyan-500',
            hoverGradient: 'from-blue-600 to-cyan-600',
            shadowColor: 'shadow-blue-500/25',
        },
        {
            id: 'funções' as TabType,
            label: 'Funções',
            icon: GraduationCap,
            gradient: 'from-blue-500 to-cyan-500',
            hoverGradient: 'from-blue-600 to-cyan-600',
            shadowColor: 'shadow-blue-500/25',
        }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div className="flex items-center space-x-3 mb-3">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                    Gerenciar Cadastros
                                </h1>
                                <p className="mt-1 text-gray-600 font-medium">Administre com estilo e acompanhe o sucesso!</p>
                            </div>
                        </div>
                    </div>

                    {/* Modern Tabs Navigation */}
                    <div className="pb-6">
                        <nav className="flex space-x-2 bg-gray-100/50 p-2 rounded-2xl backdrop-blur-sm" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${isActive
                                                ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl ${tab.shadowColor} hover:shadow-2xl`
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r ${tab.hoverGradient} rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                        )}
                                        <div className="relative flex items-center space-x-3">
                                            <span className="text-lg flex items-center space-x-2">
                                                <Icon className="w-5 h-5" />
                                                <span>{tab.label}</span>
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
                {activeTab === 'setores' && (
                    <Setor />
                )}
                {activeTab === 'departamentos' && (
                    <Departament />
                )}
                {activeTab === 'funções' && (
                    <Function />
                )}
            </div>
        </div>
    );
}