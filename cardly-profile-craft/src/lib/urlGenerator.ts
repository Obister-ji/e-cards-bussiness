// Beautiful URL Generator for Instagram-style permanent links
import { BusinessCard } from '@/types/types';

/**
 * Generate a clean, beautiful URL slug from company name
 * @param companyName - The company name to convert
 * @returns Clean URL slug
 */
export const generateCleanSlug = (companyName: string): string => {
  if (!companyName || companyName.trim() === '') {
    return '';
  }

  return companyName
    .toLowerCase()
    .trim()
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 30 characters
    .substring(0, 30)
    // Remove trailing hyphen if created by substring
    .replace(/-+$/, '');
};

/**
 * Validate URL slug format
 * @param slug - The URL slug to validate
 * @returns Object with validation result and message
 */
export const validateUrlSlug = (slug: string): { isValid: boolean; message: string } => {
  if (!slug || slug.trim() === '') {
    return { isValid: false, message: 'URL cannot be empty' };
  }

  const cleanSlug = slug.trim();

  // Check length
  if (cleanSlug.length < 3) {
    return { isValid: false, message: 'URL must be at least 3 characters long' };
  }

  if (cleanSlug.length > 30) {
    return { isValid: false, message: 'URL must be 30 characters or less' };
  }

  // Check format
  const validFormat = /^[a-z0-9-]+$/;
  if (!validFormat.test(cleanSlug)) {
    return { isValid: false, message: 'URL can only contain lowercase letters, numbers, and hyphens' };
  }

  // Check for consecutive hyphens
  if (cleanSlug.includes('--')) {
    return { isValid: false, message: 'URL cannot contain consecutive hyphens' };
  }

  // Check start/end with hyphen
  if (cleanSlug.startsWith('-') || cleanSlug.endsWith('-')) {
    return { isValid: false, message: 'URL cannot start or end with a hyphen' };
  }

  // Check reserved words
  const reservedWords = [
    'admin', 'api', 'www', 'app', 'mail', 'ftp', 'localhost', 'test', 'dev',
    'staging', 'production', 'beta', 'alpha', 'demo', 'support', 'help',
    'about', 'contact', 'privacy', 'terms', 'login', 'signup', 'register',
    'dashboard', 'profile', 'settings', 'account', 'billing', 'payment'
  ];

  if (reservedWords.includes(cleanSlug)) {
    return { isValid: false, message: 'This URL is reserved. Please choose a different one.' };
  }

  return { isValid: true, message: 'Perfect! This URL looks great.' };
};

/**
 * Check if URL is available (mock function - in real app would check database)
 * @param slug - The URL slug to check
 * @param existingCards - Array of existing cards to check against
 * @returns Promise with availability result
 */
export const checkUrlAvailability = async (
  slug: string, 
  existingCards: BusinessCard[] = []
): Promise<{ isAvailable: boolean; message: string }> => {
  // Simulate API delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300));

  const validation = validateUrlSlug(slug);
  if (!validation.isValid) {
    return { isAvailable: false, message: validation.message };
  }

  // Check against existing cards
  const isUsed = existingCards.some(card => card.cardUrl === slug);
  
  if (isUsed) {
    return { 
      isAvailable: false, 
      message: 'This URL is already taken. Try adding numbers or your name.' 
    };
  }

  return { 
    isAvailable: true, 
    message: '✨ Perfect! This URL is available.' 
  };
};

/**
 * Generate URL suggestions based on company name
 * @param companyName - The company name
 * @param existingCards - Array of existing cards
 * @returns Array of suggested URLs
 */
export const generateUrlSuggestions = (
  companyName: string, 
  existingCards: BusinessCard[] = []
): string[] => {
  if (!companyName || companyName.trim() === '') {
    return [];
  }

  const baseSlug = generateCleanSlug(companyName);
  if (!baseSlug) {
    return [];
  }

  const suggestions: string[] = [];
  const usedUrls = new Set(existingCards.map(card => card.cardUrl).filter(Boolean));

  // Add base suggestion if available
  if (!usedUrls.has(baseSlug)) {
    suggestions.push(baseSlug);
  }

  // Generate variations
  const variations = [
    `${baseSlug}-co`,
    `${baseSlug}-inc`,
    `${baseSlug}-official`,
    `${baseSlug}-team`,
    `${baseSlug}-studio`,
    `${baseSlug}-group`,
    `${baseSlug}-2024`,
    `${baseSlug}-pro`,
    `${baseSlug}-biz`
  ];

  // Add available variations
  variations.forEach(variation => {
    if (!usedUrls.has(variation) && suggestions.length < 5) {
      suggestions.push(variation);
    }
  });

  // Add numbered variations if needed
  if (suggestions.length < 3) {
    for (let i = 1; i <= 10; i++) {
      const numberedSlug = `${baseSlug}-${i}`;
      if (!usedUrls.has(numberedSlug) && suggestions.length < 5) {
        suggestions.push(numberedSlug);
      }
    }
  }

  return suggestions.slice(0, 5);
};

/**
 * Generate the full shareable URL
 * @param cardUrl - The card URL slug
 * @param baseUrl - The base URL (optional, defaults to current origin)
 * @returns Full shareable URL
 */
export const generateShareableUrl = (cardUrl: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  return `${base}/@${cardUrl}`;
};

/**
 * Format URL for display (with @ symbol)
 * @param cardUrl - The card URL slug
 * @returns Formatted display URL
 */
export const formatDisplayUrl = (cardUrl: string): string => {
  return `@${cardUrl}`;
};

/**
 * Extract slug from various URL formats
 * @param url - The URL to extract slug from
 * @returns Extracted slug or null
 */
export const extractSlugFromUrl = (url: string): string | null => {
  // Handle different formats:
  // @username
  // /@username
  // https://domain.com/@username
  // username
  
  const cleaned = url.trim();
  
  // Remove protocol and domain if present
  const withoutProtocol = cleaned.replace(/^https?:\/\/[^\/]+/, '');
  
  // Remove leading slash
  const withoutSlash = withoutProtocol.replace(/^\//, '');
  
  // Remove @ symbol if present
  const withoutAt = withoutSlash.replace(/^@/, '');
  
  // Validate the result
  const validation = validateUrlSlug(withoutAt);
  return validation.isValid ? withoutAt : null;
};
