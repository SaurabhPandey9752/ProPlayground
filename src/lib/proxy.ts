import { ProxySettings, ProxyStatus } from '../types';

export async function applyProxySettings(settings: ProxySettings): Promise<void> {
  try {
    const config: chrome.proxy.ProxyConfig = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: 'http',
          host: settings.host,
          port: settings.port
        }
      }
    };

    await chrome.proxy.settings.set({
      value: config,
      scope: 'regular'
    });
  } catch (error) {
    console.error('Failed to apply proxy settings:', error);
    throw new Error('Failed to apply proxy settings');
  }
}

export async function clearProxySettings(): Promise<void> {
  try {
    const config: chrome.proxy.ProxyConfig = {
      mode: 'direct'
    };

    await chrome.proxy.settings.set({
      value: config,
      scope: 'regular'
    });
  } catch (error) {
    console.error('Failed to clear proxy settings:', error);
    throw new Error('Failed to clear proxy settings');
  }
}

export async function getProxyStatus(): Promise<ProxyStatus> {
  try {
    const result = await chrome.proxy.settings.get({});
    const config = result.value;
    
    if (config.mode === 'direct') {
      return {
        enabled: false,
        connected: true
      };
    } else if (config.mode === 'fixed_servers' && config.rules?.singleProxy) {
      return {
        enabled: true,
        host: config.rules.singleProxy.host,
        port: config.rules.singleProxy.port,
        connected: true
      };
    } else {
      return {
        enabled: false,
        connected: false,
        error: 'Unknown proxy configuration'
      };
    }
  } catch (error) {
    console.error('Failed to get proxy status:', error);
    return {
      enabled: false,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}