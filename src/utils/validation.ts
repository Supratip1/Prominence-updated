export const validateUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty is valid (no error state)
  
  // Remove protocol if present for validation
  const cleanUrl = url.replace(/^https?:\/\//, '');
  
  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/;
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const localhostRegex = /^localhost(:\d+)?$/;
  
  return domainRegex.test(cleanUrl) || ipRegex.test(cleanUrl) || localhostRegex.test(cleanUrl);
};

export const sanitizeUrl = (url: string): string => {
  const cleanUrl = url.trim().toLowerCase();
  
  // Add protocol if missing
  if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return `https://${cleanUrl}`;
  }
  
  return cleanUrl;
};

export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(sanitizeUrl(url));
    return urlObj.hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
};