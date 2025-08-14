import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 5, // Definindo 5 como valor padrão
  className = ''
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    
    // Adiciona primeira página
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    
    // Adiciona páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Adiciona última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  const goToFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const goToLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div className={`flex items-center justify-between bg-white px-4 py-4 sm:px-6 border-t border-gray-200 ${className}`}>
      {/* Versão mobile */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </button>
        
        <span className="flex items-center text-sm text-gray-700 font-medium">
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      {/* Versão desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          {totalItems && itemsPerPage && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-4 py-2 border border-gray-200">
              <p className="text-sm text-gray-700">
                Mostrando{' '}
                <span className="font-bold text-blue-600">
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                </span>{' '}
                até{' '}
                <span className="font-bold text-blue-600">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{' '}
                de <span className="font-bold text-purple-600">{totalItems}</span> resultados
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-lg bg-white" aria-label="Paginação">
            {/* Primeira página */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-xl px-3 py-2 transition-all duration-200 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 active:scale-95'
              } border border-gray-300 hover:border-blue-300`}
              title="Primeira página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            
            {/* Página anterior */}
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 transition-all duration-200 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 active:scale-95'
              } border-y border-gray-300 hover:border-blue-300`}
              title="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Números das páginas */}
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(page)}
                disabled={page === '...'}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  page === currentPage
                    ? 'z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105 border-blue-500'
                    : page === '...'
                    ? 'bg-gray-50 text-gray-400 cursor-default border-gray-300'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 active:scale-95 hover:border-blue-300'
                } border-y border-gray-300`}
              >
                {page}
              </button>
            ))}
            
            {/* Próxima página */}
            <button
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-2 transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 active:scale-95'
              } border-y border-gray-300 hover:border-blue-300`}
              title="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Última página */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-xl px-3 py-2 transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 active:scale-95'
              } border border-gray-300 hover:border-blue-300`}
              title="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 