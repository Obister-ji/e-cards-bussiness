
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

interface AuthFormProps {
  mode: "signIn" | "signUp";
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, signInWithMicrosoft } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signIn") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      await signInWithMicrosoft();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-xl overflow-hidden">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-montserrat text-slate-900 dark:text-white">
          {mode === "signIn" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
          {mode === "signIn"
            ? "Sign in to access your business cards"
            : "Create an account to start creating business cards"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200"
              onClick={handleGoogleSignIn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="mr-2 text-blue-500" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200"
              onClick={handleMicrosoftSignIn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="mr-2 text-blue-500" viewBox="0 0 16 16">
                <path d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"/>
              </svg>
              Microsoft
            </Button>
          </div>

          <div className="flex items-center my-5">
            <Separator className="flex-grow bg-slate-200 dark:bg-slate-700" />
            <span className="px-3 text-sm text-slate-500 dark:text-slate-400 font-medium">OR</span>
            <Separator className="flex-grow bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-gradient hover:opacity-90 text-white font-medium py-2.5 mt-2 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : mode === "signIn" ? "Sign In" : "Create Account"
              }
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6 pt-2">
        <Button variant="link" onClick={onToggleMode} className="text-blue-500 hover:text-blue-600 font-medium">
          {mode === "signIn"
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
