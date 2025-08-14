import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Provedor de notificações toast para a aplicação
 * Design moderno e profissional com animações suaves
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-center"
        gutter={12} // Espaçamento entre as notificações
        toastOptions={{
          // Estilo base para todos os toasts
          className: '',
          style: {
            borderRadius: '10px',
            padding: '16px',
            background: '#FFFFFF',
            color: '#3A3A3A',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            maxWidth: '380px',
            border: 'none',
            backdropFilter: 'blur(5px)',
          },
          
          // Animações suaves de entrada e saída
          duration: 4000,
          
          // Configurações para toast de sucesso
          success: {
            style: {
              background: 'linear-gradient(to right, #f6ffed, #ffffff)',
              borderLeft: '4px solid #52C41A',
              color: '#1D6E0D',
            },
            iconTheme: {
              primary: '#52C41A',
              secondary: '#FFFFFF',
            },
          },
          
          // Configurações para toast de erro
          error: {
            style: {
              background: 'linear-gradient(to right, #fff2f0, #ffffff)',
              borderLeft: '4px solid #F5222D',
              color: '#CF1322',
            },
            iconTheme: {
              primary: '#F5222D',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
