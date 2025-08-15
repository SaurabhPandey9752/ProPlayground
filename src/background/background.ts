import { ProxySettings, Message, MessageResponse } from '../types';
import { saveSettings, loadSettings } from '../lib/storage';
import { onMessage } from '../lib/messaging';
import { applyProxySettings, clearProxySettings, getProxyStatus } from '../lib/proxy';
import { validateProxySettings } from '../lib/validation';

// Store current proxy credentials for authentication
let currentCredentials: { username?: string; password?: string } = {};

// Handle proxy authentication
chrome.webRequest.onAuthRequired.addListener(
  (_details) => {
    if (currentCredentials.username && currentCredentials.password) {
      return {
        authCredentials: {
          username: currentCredentials.username,
          password: currentCredentials.password
        }
      };
    }
    return { cancel: true };
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// Message handler
onMessage(async (message: Message, _sender): Promise<MessageResponse> => {
  try {
    switch (message.type) {
      case 'APPLY_PROXY': {
        const settings = message.payload as ProxySettings;
        
        // Validate settings
        const validation = validateProxySettings(settings.host, settings.port, settings.username, settings.password);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
        
        // Store credentials for authentication
        currentCredentials = {
          username: settings.username,
          password: settings.password
        };
        
        // Apply proxy settings
        await applyProxySettings(settings);
        
        // Save settings with enabled flag
        const updatedSettings = { ...settings, enabled: true };
        await saveSettings(updatedSettings);
        
        return {
          success: true,
          data: { message: 'Proxy applied successfully' }
        };
      }
      
      case 'CLEAR_PROXY': {
        // Clear proxy settings
        await clearProxySettings();
        
        // Clear credentials
        currentCredentials = {};
        
        // Load current settings and update enabled flag
        const settings = await loadSettings();
        const updatedSettings = { ...settings, enabled: false };
        await saveSettings(updatedSettings);
        
        return {
          success: true,
          data: { message: 'Proxy disabled successfully' }
        };
      }
      
      case 'GET_STATUS': {
        const status = await getProxyStatus();
        return {
          success: true,
          data: status
        };
      }
      
      case 'SAVE_SETTINGS': {
        const settings = message.payload as ProxySettings;
        
        // Validate settings
        const validation = validateProxySettings(settings.host, settings.port, settings.username, settings.password);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
        
        await saveSettings(settings);
        
        return {
          success: true,
          data: { message: 'Settings saved successfully' }
        };
      }
      
      case 'LOAD_SETTINGS': {
        const settings = await loadSettings();
        return {
          success: true,
          data: settings
        };
      }
      
      case 'TOGGLE_PROXY': {
        const settings = await loadSettings();
        
        if (settings.enabled) {
          // Disable proxy
          await clearProxySettings();
          currentCredentials = {};
          const updatedSettings = { ...settings, enabled: false };
          await saveSettings(updatedSettings);
          
          return {
            success: true,
            data: { message: 'Proxy disabled successfully', enabled: false }
          };
        } else {
          // Enable proxy
          const validation = validateProxySettings(settings.host, settings.port, settings.username, settings.password);
          if (!validation.isValid) {
            return {
              success: false,
              error: 'Invalid proxy settings: ' + validation.errors.join(', ')
            };
          }
          
          currentCredentials = {
            username: settings.username,
            password: settings.password
          };
          
          await applyProxySettings(settings);
          const updatedSettings = { ...settings, enabled: true };
          await saveSettings(updatedSettings);
          
          return {
            success: true,
            data: { message: 'Proxy enabled successfully', enabled: true }
          };
        }
      }
      
      default:
        return {
          success: false,
          error: 'Unknown message type'
        };
    }
  } catch (error) {
    console.error('Background script error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
});

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Proxy Manager Extension installed');
});