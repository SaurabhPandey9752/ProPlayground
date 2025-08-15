import { ProxySettings } from '../types';

const STORAGE_KEY = 'proxy_settings';

export const defaultSettings: ProxySettings = {
  host: '',
  port: 8080,
  username: '',
  password: '',
  enabled: false,
};

export async function saveSettings(settings: ProxySettings): Promise<void> {
  try {
    // Try to use sync storage first, fallback to local
    const storage = chrome.storage.sync || chrome.storage.local;
    await storage.set({ [STORAGE_KEY]: settings });
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw new Error('Failed to save proxy settings');
  }
}

export async function loadSettings(): Promise<ProxySettings> {
  try {
    // Try to use sync storage first, fallback to local
    const storage = chrome.storage.sync || chrome.storage.local;
    const result = await storage.get(STORAGE_KEY);
    
    if (result[STORAGE_KEY]) {
      return { ...defaultSettings, ...result[STORAGE_KEY] };
    }
    
    return defaultSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
}

export async function clearSettings(): Promise<void> {
  try {
    const storage = chrome.storage.sync || chrome.storage.local;
    await storage.remove(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear settings:', error);
    throw new Error('Failed to clear proxy settings');
  }
}