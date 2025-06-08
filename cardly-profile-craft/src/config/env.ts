// Environment Configuration
// This file safely handles environment variables and provides fallbacks

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  openai: {
    apiKey: string;
    enabled: boolean;
  };
  app: {
    environment: 'development' | 'production';
    debugMode: boolean;
  };
}

// Safely get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  const value = import.meta.env[key];
  if (!value && fallback === '' && import.meta.env.PROD) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
  return value || fallback;
};

// Environment configuration
export const env: EnvironmentConfig = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL', 'https://your-project.supabase.co'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', 'your-anon-key-here'),
  },
  openai: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    enabled: !!getEnvVar('VITE_OPENAI_API_KEY'),
  },
  app: {
    environment: (getEnvVar('VITE_APP_ENV', 'development') as 'development' | 'production'),
    debugMode: getEnvVar('VITE_DEBUG_MODE', 'true') === 'true',
  },
};

// Validation function
export const validateEnvironment = (): boolean => {
  const errors: string[] = [];

  // Check required variables
  if (!env.supabase.url || env.supabase.url.includes('your-project')) {
    errors.push('VITE_SUPABASE_URL is not configured');
  }

  if (!env.supabase.anonKey || env.supabase.anonKey.includes('your-anon-key')) {
    errors.push('VITE_SUPABASE_ANON_KEY is not configured');
  }

  // Log errors in development
  if (errors.length > 0 && env.app.debugMode) {
    console.group('🔧 Environment Configuration Issues:');
    errors.forEach(error => console.warn(`⚠️ ${error}`));
    console.groupEnd();
  }

  return errors.length === 0;
};

// Development helper
export const logEnvironmentStatus = (): void => {
  if (!env.app.debugMode) return;

  console.group('🔧 Environment Status:');
  console.log('📍 Environment:', env.app.environment);
  console.log('🔍 Debug Mode:', env.app.debugMode);
  console.log('🗄️ Supabase:', env.supabase.url ? '✅ Configured' : '❌ Missing');
  console.log('🤖 OpenAI:', env.openai.enabled ? '✅ Enabled' : '❌ Disabled');
  console.groupEnd();
};

// Export individual configs for convenience
export const supabaseConfig = env.supabase;
export const openaiConfig = env.openai;
export const appConfig = env.app;

// Default export
export default env;
