export interface ProxySettings {
  host: string;
  port: number;
  username?: string;
  password?: string;
  enabled: boolean;
}

export interface ProxyStatus {
  enabled: boolean;
  host?: string;
  port?: number;
  connected: boolean;
  error?: string;
}

export type MessageType = 
  | 'APPLY_PROXY'
  | 'CLEAR_PROXY'
  | 'GET_STATUS'
  | 'SAVE_SETTINGS'
  | 'LOAD_SETTINGS'
  | 'TOGGLE_PROXY';

export interface Message<T = any> {
  type: MessageType;
  payload?: T;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}