
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-playfair font-bold text-gold mb-4">404</h1>
        <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
        <p className="text-2xl text-gray-300 mb-8">Oops! Page not found</p>
        <Button asChild className="bg-gold hover:bg-gold-dark text-cardBg">
          <a href="/" className="inline-block">
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
