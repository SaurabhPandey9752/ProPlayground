export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateHost(host: string): ValidationResult {
  const errors: string[] = [];
  
  if (!host || host.trim().length === 0) {
    errors.push('Host is required');
    return { isValid: false, errors };
  }
  
  const trimmedHost = host.trim();
  
  // Check for valid IPv4
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // Check for valid IPv6 (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  
  // Check for valid domain name
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  
  if (!ipv4Regex.test(trimmedHost) && !ipv6Regex.test(trimmedHost) && !domainRegex.test(trimmedHost)) {
    errors.push('Invalid host format. Use IPv4, IPv6, or domain name');
  }
  
  return { isValid: errors.length === 0, errors };
}

export function validatePort(port: number): ValidationResult {
  const errors: string[] = [];
  
  if (!Number.isInteger(port)) {
    errors.push('Port must be a valid integer');
  } else if (port < 1 || port > 65535) {
    errors.push('Port must be between 1 and 65535');
  }
  
  return { isValid: errors.length === 0, errors };
}

export function validateCredentials(username?: string, password?: string): ValidationResult {
  const errors: string[] = [];
  
  // Username and password are optional, but if username is provided, password should be too
  if (username && username.trim().length > 0 && (!password || password.trim().length === 0)) {
    errors.push('Password is required when username is provided');
  }
  
  return { isValid: errors.length === 0, errors };
}

export function validateProxySettings(host: string, port: number, username?: string, password?: string): ValidationResult {
  const hostValidation = validateHost(host);
  const portValidation = validatePort(port);
  const credentialsValidation = validateCredentials(username, password);
  
  const allErrors = [
    ...hostValidation.errors,
    ...portValidation.errors,
    ...credentialsValidation.errors
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}