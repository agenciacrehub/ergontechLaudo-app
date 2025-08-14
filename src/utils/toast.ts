import toast from 'react-hot-toast';

// Tipos de notificações
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Interface para as opções de configuração
interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

// Configuração padrão
const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-center'
};

/**
 * Função para exibir notificações toast com configurações consistentes
 * @param message Mensagem a ser exibida
 * @param type Tipo da notificação (success, error, info, warning)
 * @param options Opções adicionais de configuração
 */
export const showToast = (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  switch (type) {
    case 'success':
      return toast.success(message, mergedOptions);
    case 'error':
      return toast.error(message, mergedOptions);
    case 'warning':
      return toast(message, {
        ...mergedOptions,
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          padding: '16px',
          background: 'linear-gradient(to right, #fffbe6, #ffffff)',
          borderLeft: '4px solid #FAAD14',
          color: '#AD6800',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
        }
      });
    case 'info':
    default:
      return toast(message, {
        ...mergedOptions,
        icon: 'ℹ️',
        style: {
          borderRadius: '10px',
          padding: '16px',
          background: 'linear-gradient(to right, #e6f7ff, #ffffff)',
          borderLeft: '4px solid #1890FF',
          color: '#0050B3',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
        }
      });
  }
};

// Atalhos para cada tipo de toast
export const toastSuccess = (message: string, options?: ToastOptions) => 
  showToast(message, 'success', options);

export const toastError = (message: string, options?: ToastOptions) => 
  showToast(message, 'error', options);

export const toastInfo = (message: string, options?: ToastOptions) => 
  showToast(message, 'info', options);

export const toastWarning = (message: string, options?: ToastOptions) => 
  showToast(message, 'warning', options);

// Exportar também o toast original para casos especiais
export { toast };

export default showToast;
