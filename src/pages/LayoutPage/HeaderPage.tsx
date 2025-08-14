import { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toastSuccess } from '../../utils/toast';

export default function HeaderPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    toastSuccess('Logout realizado com sucesso!');
    logout();
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Configurações',
      action: () => toastSuccess('Configurações em breve!')
    },
    {
      icon: LogOut,
      label: 'Sair',
      action: handleLogout,
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <header className="bg-white h-16 flex items-center justify-between px-8 shadow-sm sticky top-0 z-20 border-b border-gray-200">
      {/* Logo/Título - lado esquerdo */}
      <div className="flex-1 flex items-center">
        {/* Conteúdo do lado esquerdo pode ir aqui */}
      </div>

      {/* User Menu - lado direito */}
      <div className="flex items-center gap-4">
        {/* Notificações ou outros elementos podem ir aqui */}
        
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            
            {/* Nome do usuário */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'email@exemplo.com'}</p>
            </div>
            
            {/* Ícone de dropdown */}
            <ChevronDown 
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${
                      item.className || 'text-gray-700'
                    }`}
                  >
                    <IconComponent className="mr-3 h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
