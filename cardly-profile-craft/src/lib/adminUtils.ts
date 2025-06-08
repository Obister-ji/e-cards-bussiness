import { User } from "@supabase/supabase-js";

// List of admin email addresses
const ADMIN_EMAILS = [
  'admin@cardly.com',
  'dev@cardly.com',
  'test@cardly.com',
  'sarvaxgupta@gmail.com',
  // Add more admin emails here as needed
];

/**
 * Check if a user is an admin
 * @param user - The user object from Supabase auth
 * @returns boolean - true if user is admin, false otherwise
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check if user email is in admin list
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true;
  }
  
  // Check for development mode mock users
  if (import.meta.env.DEV && user.id?.startsWith('dev-user-')) {
    return true; // In development, mock users are considered admins
  }
  
  // Check for admin role in user metadata
  if (user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') {
    return true;
  }
  
  return false;
};

/**
 * Get admin status with detailed info for debugging
 * @param user - The user object from Supabase auth
 * @returns object with admin status and reason
 */
export const getAdminStatus = (user: User | null) => {
  if (!user) {
    return { isAdmin: false, reason: 'No user logged in' };
  }
  
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return { isAdmin: true, reason: `Email ${user.email} is in admin list` };
  }
  
  if (import.meta.env.DEV && user.id?.startsWith('dev-user-')) {
    return { isAdmin: true, reason: 'Development mode mock user' };
  }
  
  if (user.user_metadata?.role === 'admin') {
    return { isAdmin: true, reason: 'User metadata role is admin' };
  }
  
  if (user.app_metadata?.role === 'admin') {
    return { isAdmin: true, reason: 'App metadata role is admin' };
  }
  
  return { isAdmin: false, reason: 'User is not an admin' };
};

/**
 * Hook to use admin status in React components
 * @param user - The user object from auth context
 * @returns boolean - true if user is admin
 */
export const useIsAdmin = (user: User | null): boolean => {
  return isAdmin(user);
};
