import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center px-4 py-3 rounded-lg border backdrop-blur-sm ${getToastStyles()}`}>
        <span className="mr-2">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-3 text-current hover:opacity-75 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;