import React, { type ReactNode, useState } from 'react';

interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
  allowExpand?: boolean;
  customHeaderButtons?: ReactNode;
}

/**
 * Componente de layout de modal reutilizável
 * @param isOpen - Estado que controla se o modal está aberto ou fechado
 * @param onClose - Função para fechar o modal
 * @param title - Título opcional do modal
 * @param children - Conteúdo do modal
 * @param width - Largura opcional do modal (padrão: 'max-w-md')
 */
const ModalLayout: React.FC<ModalLayoutProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-md',
  allowExpand = true,
  customHeaderButtons,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50">
      <div 
        className={`relative ${isExpanded ? 'w-[90vw] h-[90vh]' : width} w-full rounded-lg bg-white shadow-lg ${isExpanded ? 'max-h-[90vh]' : 'max-h-[90vh]'} overflow-hidden flex flex-col transition-all duration-300`}
      >
        {/* Cabeçalho com título e botão de fechar */}
        <div className="flex items-center justify-between border-b p-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <div className="ml-auto flex items-center gap-2">
            {customHeaderButtons}
            
            {allowExpand && (
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                onClick={toggleExpand}
                aria-label={isExpanded ? "Recolher" : "Expandir"}
                title={isExpanded ? "Recolher" : "Expandir"}
              >
                {isExpanded ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                )}
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              onClick={onClose}
              aria-label="Fechar"
              title="Fechar"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Conteúdo do modal */}
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default ModalLayout;
