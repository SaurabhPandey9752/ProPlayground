import { Message, MessageResponse } from '../types';

export async function sendMessage<T = any>(message: Message): Promise<MessageResponse<T>> {
  try {
    const response = await chrome.runtime.sendMessage(message);
    return response as MessageResponse<T>;
  } catch (error) {
    console.error('Message sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export function onMessage<T = any>(
  callback: (message: Message, sender: chrome.runtime.MessageSender) => Promise<MessageResponse<T>> | MessageResponse<T>
): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const result = callback(message, sender);
    
    if (result instanceof Promise) {
      result.then(sendResponse).catch(error => {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      });
      return true; // Indicates we will send a response asynchronously
    } else {
      sendResponse(result);
    }
  });
}