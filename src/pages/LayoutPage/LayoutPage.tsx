import { Outlet } from "react-router-dom";
import HeaderPage from "./HeaderPage";
import SidebarPage from "./SidebarPage";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";

function LayoutContent() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarPage />
      
      {/* Conteúdo principal alinhado */}
      <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
        {/* Header */}
        <div className="relative">
          <HeaderPage />
        </div>
        {/* Conteúdo das páginas */}
        <main className="flex-1 overflow-y-auto px-6 pb-6 max-w-full">
          <div className="max-w-full overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LayoutPage() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
