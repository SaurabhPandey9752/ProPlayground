import React, { useState, useEffect } from 'react';
import { ProxySettings, ProxyStatus, ToastMessage } from '../types';
import { sendMessage } from '../lib/messaging';
import { validateProxySettings } from '../lib/validation';
import Toast from './Toast';

const Popup: React.FC = () => {
  const [settings, setSettings] = useState<ProxySettings>({
    host: '',
    port: 8080,
    username: '',
    password: '',
    enabled: false,
  });
  
  const [status, setStatus] = useState<ProxyStatus>({
    enabled: false,
    connected: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Load settings and status on mount
  useEffect(() => {
    loadSettingsAndStatus();
  }, []);

  const loadSettingsAndStatus = async () => {
    try {
      const [settingsResponse, statusResponse] = await Promise.all([
        sendMessage({ type: 'LOAD_SETTINGS' }),
        sendMessage({ type: 'GET_STATUS' })
      ]);

      if (settingsResponse.success && settingsResponse.data) {
        setSettings(settingsResponse.data);
      }

      if (statusResponse.success && statusResponse.data) {
        setStatus(statusResponse.data);
      }
    } catch (error) {
      showToast('error', 'Failed to load settings');
    }
  };

  const showToast = (type: ToastMessage['type'], message: string) => {
    setToast({ type, message });
  };

  const handleInputChange = (field: keyof ProxySettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const validation = validateProxySettings(settings.host, settings.port, settings.username, settings.password);
      
      if (!validation.isValid) {
        showToast('error', validation.errors.join(', '));
        return;
      }

      const response = await sendMessage({
        type: 'SAVE_SETTINGS',
        payload: settings
      });

      if (response.success) {
        showToast('success', 'Settings saved successfully');
      } else {
        showToast('error', response.error || 'Failed to save settings');
      }
    } catch (error) {
      showToast('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await sendMessage({ type: 'TOGGLE_PROXY' });

      if (response.success) {
        const newEnabled = response.data?.enabled ?? !settings.enabled;
        setSettings(prev => ({ ...prev, enabled: newEnabled }));
        setStatus(prev => ({ ...prev, enabled: newEnabled }));
        showToast('success', response.data?.message || 'Proxy toggled successfully');
      } else {
        showToast('error', response.error || 'Failed to toggle proxy');
      }
    } catch (error) {
      showToast('error', 'Failed to toggle proxy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 min-h-96 p-6 bg-gradient-to-br from-dark-900 to-dark-800 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Proxy Manager
        </h1>
        
        {/* Status */}
        <div className="mt-3">
          <span className={`status-pill ${status.enabled ? 'status-enabled' : 'status-disabled'}`}>
            {status.enabled ? '🟢 Proxy Enabled' : '🔴 Proxy Disabled'}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-4 space-y-4 animate-scale-in">
        {/* Host */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proxy Host *
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="proxy.example.com or 192.168.1.1"
            value={settings.host}
            onChange={(e) => handleInputChange('host', e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Port */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Port *
          </label>
          <input
            type="number"
            className="input-field"
            placeholder="8080"
            min="1"
            max="65535"
            value={settings.port}
            onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 8080)}
            disabled={loading}
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username (optional)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter username"
            value={settings.username || ''}
            onChange={(e) => handleInputChange('username', e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password (optional)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-12"
              placeholder="Enter password"
              value={settings.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          
          <button
            onClick={handleToggle}
            disabled={loading || !settings.host || !settings.port}
            className="btn-primary flex-1"
          >
            {loading ? 'Loading...' : status.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">
          Powered by <span className="text-primary-400 font-medium">HolySuch</span>
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Popup;