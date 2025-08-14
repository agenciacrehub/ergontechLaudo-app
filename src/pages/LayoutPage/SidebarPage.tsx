import { LayoutDashboard, FileText, Building2, Users, Settings, Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';

const menuItems = [
  {
    section: 'Menu Principal',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
      { label: 'Laudos', icon: FileText, path: '/app/laudos' },
      { label: 'Empresas', icon: Building2, path: '/app/empresas' },
      { label: 'Usuários', icon: Users, path: '/app/usuarios' },
      { label: 'Cadastros', icon: Users, path: '/app/cadastros' },
    ]
  },
  {
    section: 'Configurações',
    items: [
      { label: 'Configurações (Em breve)', icon: Settings, path: '/app/configuracoes' },
    ]
  }
];

export default function SidebarPage() {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  return (
    <>
      {/* Botão para abrir sidebar quando fechada */}
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 transition-colors duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-0' : 'w-64'} bg-teal-600 border-r border-teal-700 flex flex-col h-screen fixed left-0 top-0 z-40 shadow-sm overflow-hidden transition-all duration-300 ease-in-out`}>
        {/* Header com Logo e Botão Toggle */}
        <div className="p-6 border-b border-teal-700 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white whitespace-nowrap">ErgonTech</h1>
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-white hover:bg-teal-700 rounded transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h2 className="text-xs font-semibold text-teal-200 uppercase tracking-wider mb-3">
              {section.section}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-teal-700 text-white'
                          : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                      }`}
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        </nav>
      </aside>
    </>
  );
}
