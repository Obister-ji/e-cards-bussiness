
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      console.log('🔄 AuthContext: Starting session fetch...');

      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
        );

        const sessionPromise = supabase.auth.getSession();

        // Race between session fetch and timeout
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]);

        if (error) {
          console.error("❌ Error fetching session:", error);
          setIsLoading(false);
          return;
        }

        console.log('✅ Session fetch successful');
        setSession(data?.session || null);
        setUser(data?.session?.user || null);
        setIsLoading(false);
        console.log('🔄 AuthContext: Loading state set to false');

      } catch (error) {
        console.error("❌ Session fetch failed:", error);
        console.log('⚠️  Supabase appears to be unavailable. Enabling offline mode for development.');

        // In development, create a mock user to allow app usage
        if (import.meta.env.DEV) {
          console.log('🔧 Development mode: Creating mock user session');
          const mockUser = {
            id: 'dev-user-' + Date.now(),
            email: 'dev@example.com',
            user_metadata: { name: 'Development User' },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as any;

          setUser(mockUser);
          setSession({ user: mockUser } as any);
          console.log('✅ Mock user session created for development');
        }

        setIsLoading(false);
        console.log('🔄 AuthContext: Loading state set to false (error handled)');
      }
    };

    fetchSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Sign up successful",
        description: "Check your email for the confirmation link.",
      });
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Force production URL for Vercel deployment
      const getRedirectUrl = () => {
        const currentUrl = window.location.origin;
        console.log('🔍 Current URL:', currentUrl);

        // Force production URL if we're on Vercel
        if (currentUrl.includes('vercel.app') || currentUrl.includes('cardlyy')) {
          const productionUrl = 'https://cardlyy-obister-jis-projects.vercel.app';
          console.log('🚀 Using production redirect URL:', productionUrl);
          return productionUrl;
        }

        // For localhost development
        console.log('🔧 Using localhost redirect URL:', currentUrl);
        return currentUrl;
      };

      const redirectUrl = getRedirectUrl();
      console.log('🔗 Final redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      // Force production URL for Vercel deployment
      const getRedirectUrl = () => {
        const currentUrl = window.location.origin;
        console.log('🔍 Current URL:', currentUrl);

        // Force production URL if we're on Vercel
        if (currentUrl.includes('vercel.app') || currentUrl.includes('cardlyy')) {
          const productionUrl = 'https://cardlyy-obister-jis-projects.vercel.app';
          console.log('🚀 Using production redirect URL:', productionUrl);
          return productionUrl;
        }

        // For localhost development
        console.log('🔧 Using localhost redirect URL:', currentUrl);
        return currentUrl;
      };

      const redirectUrl = getRedirectUrl();
      console.log('🔗 Final redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Microsoft OAuth error:', error);
        toast({
          title: "Microsoft sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error("Microsoft sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
