
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  const getDisplayName = (user: User | null) => {
    if (!user) return "";

    // Try to get display name from user metadata
    if (user.user_metadata) {
      const { name, full_name, email } = user.user_metadata;
      return name || full_name || user.email || "";
    }

    return user.email || "";
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-montserrat font-bold text-primary">
          Digital Business Card
        </h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user && (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                {getDisplayName(user)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
