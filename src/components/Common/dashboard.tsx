import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Building2, FileText, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type Company = { id: string; name: string };
type ReportUp = { id: string; created_at: string };
type Report = {
  id: string;
  name: string;
  created_at: string;
  status: string;
  company?: { id: string; name: string };
  report_ups?: ReportUp[];
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchAll = async () => {
      try {
        const [companiesResp, reportsResp] = await Promise.all([
          axios.get<Company[]>('/company'),
          axios.get<Report[]>('/reports'),
        ]);

        if (!isMounted) return;
        setCompanies(companiesResp.data || []);
        setReports(reportsResp.data || []);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || 'Erro ao carregar dados do dashboard');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAll();
    return () => { isMounted = false; };
  }, []);

  const stats = useMemo(() => {
    const companiesCount = companies.length;
    const reportsCount = reports.length;
    const pendingCount = reports.filter((r) => (r.report_ups?.length || 0) === 0).length;

    return [
      {
        title: 'Empresas Clientes',
        value: String(companiesCount),
        subtitle: companiesCount > 0 ? `${companiesCount} cadastrada(s)` : 'Sem empresas',
        icon: Building2,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Laudos Emitidos',
        value: String(reportsCount),
        subtitle: reportsCount > 0 ? `${reportsCount} no total` : 'Nenhum laudo',
        icon: FileText,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        title: 'Avaliações Pendentes',
        value: String(pendingCount),
        subtitle: pendingCount > 0 ? `${pendingCount} sem AEP` : 'Tudo em dia',
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      }
    ];
  }, [companies, reports]);

  const recentActivities = useMemo(() => {
    const items = (reports || []).slice(0, 6).map((r) => ({
      title: `${r.name} — ${r.company?.name || 'Empresa'}`,
      time: new Date(r.created_at).toLocaleString('pt-BR'),
      user: r.status || 'Ativo'
    }));
    return items;
  }, [reports]);

  const userInfo = useMemo(() => {
    return {
      type: user?.profile?.company?.name || 'ErgonTech',
      role: user?.role || 'USER',
      lastAccess: new Date().toLocaleString('pt-BR')
    };
  }, [user]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo à plataforma de laudos da ErgonTech</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{isLoading ? '...' : stat.value}</p>
                <p className="text-sm text-gray-500">{isLoading ? 'Carregando...' : stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
              <p className="text-sm text-gray-600">Últimos laudos criados</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(isLoading ? Array.from({ length: 4 }).map(() => ({
                  title: 'Carregando...', time: '', user: ''
                })) : recentActivities).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time} {activity.user && `• ${activity.user}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Informações do Usuário</h2>
              <p className="text-sm text-gray-600">Detalhes do seu acesso à plataforma</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Empresa:</p>
                  <p className="text-sm text-gray-900">{userInfo.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Função:</p>
                  <p className="text-sm text-gray-900">{userInfo.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Último acesso:</p>
                  <p className="text-sm text-gray-900">{userInfo.lastAccess}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;