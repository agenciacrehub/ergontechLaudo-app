import React, { useState, useEffect } from 'react';

interface DeleteRequestData {
  id: string | number;
  [key: string]: any; // Campos adicionais que possam ser necessários
}

interface DeleteModalProps {
  open: boolean;
  title: string;
  message: string;
  requestData: DeleteRequestData; // Dados da requisição de exclusão
  onClose: () => void;
  onConfirm: (requestData: DeleteRequestData) => Promise<void> | void; // Pode ser async ou sync
  confirmText?: string; // Texto que o usuário deve digitar para confirmar (padrão: EXCLUIR)
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, title, message, requestData, onClose, onConfirm, confirmText = 'EXCLUIR' }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário digitou o texto de confirmação corretamente
    setIsValid(inputValue === confirmText);
  }, [inputValue, confirmText]);

  // Reset states when modal is closed externally
  useEffect(() => {
    if (!open) {
      setInputValue('');
      setError(null);
      setIsDeleting(false);
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = async () => {
    if (!isValid || isDeleting) return;
    
    try {
      setIsDeleting(true);
      setError(null);
      
      await onConfirm(requestData);
      
      // Se chegou até aqui, a exclusão foi bem-sucedida
      // Resetar estados e fechar modal
      setInputValue('');
      setIsDeleting(false);
      onClose();
    } catch (err) {
      setIsDeleting(false);
      setError(err instanceof Error ? err.message : 'Erro ao excluir item');
    }
  };

  const handleClose = () => {
    if (isDeleting) return; // Não permitir fechar durante exclusão
    setInputValue('');
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-4 mx-auto">
        <div className="relative bg-white rounded-lg shadow-lg">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-4 bg-red-600 rounded-t-lg">
            <h3 className="text-xl font-semibold text-white">
              {title}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className={`text-white bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ${
                isDeleting ? 'cursor-not-allowed opacity-50' : 'hover:bg-red-700 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            <p className="mb-4 text-gray-700">
              {message}
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  <strong>Erro:</strong> {error}
                </p>
              </div>
            )}
            
            <p className="mb-2 font-bold text-sm text-gray-800">
              Para confirmar a exclusão, digite {confirmText} (em maiúsculas):
            </p>
            
            <div className="mb-4">
              <input
                type="text"
                autoFocus
                disabled={isDeleting}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isDeleting ? 'bg-gray-100 cursor-not-allowed' :
                  inputValue !== '' && !isValid 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={`Digite ${confirmText}`}
              />
              {inputValue !== '' && !isValid && (
                <p className="mt-1 text-sm text-red-600">
                  Digite {confirmText} em maiúsculas
                </p>
              )}
            </div>
          </div>
          
          {/* Botões */}
          <div className="flex items-center justify-end p-4 space-x-2 border-t border-gray-200 rounded-b">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className={`px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isDeleting
                  ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100'
              }`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isValid || isDeleting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2 ${
                isValid && !isDeleting
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-400 cursor-not-allowed'
              }`}
            >
              {isDeleting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;