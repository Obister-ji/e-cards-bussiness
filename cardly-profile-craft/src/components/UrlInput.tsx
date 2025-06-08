import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  generateCleanSlug, 
  validateUrlSlug, 
  checkUrlAvailability, 
  generateUrlSuggestions,
  formatDisplayUrl 
} from '@/lib/urlGenerator';
import { BusinessCard } from '@/types/types';
import { Check, X, RefreshCw, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UrlInputProps {
  companyName: string;
  value: string;
  onChange: (value: string) => void;
  existingCards?: BusinessCard[];
  disabled?: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  companyName,
  value,
  onChange,
  existingCards = [],
  disabled = false
}) => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    isAvailable: boolean;
    message: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-generate URL when company name changes
  useEffect(() => {
    if (companyName && !value) {
      const autoSlug = generateCleanSlug(companyName);
      if (autoSlug) {
        onChange(autoSlug);
      }
    }
  }, [companyName, value, onChange]);

  // Check availability when value changes
  const checkAvailability = useCallback(async (slug: string) => {
    if (!slug) {
      setAvailability(null);
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkUrlAvailability(slug, existingCards);
      setAvailability(result);
    } catch (error) {
      setAvailability({
        isAvailable: false,
        message: 'Error checking availability. Please try again.'
      });
    } finally {
      setIsChecking(false);
    }
  }, [existingCards]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) {
        checkAvailability(value);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, checkAvailability]);

  // Generate suggestions
  useEffect(() => {
    if (companyName) {
      const newSuggestions = generateUrlSuggestions(companyName, existingCards);
      setSuggestions(newSuggestions);
    }
  }, [companyName, existingCards]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleCopyUrl = () => {
    if (value) {
      const fullUrl = `${window.location.origin}/@${value}`;
      navigator.clipboard.writeText(fullUrl);
      toast({
        title: "URL Copied!",
        description: "Your card URL has been copied to clipboard.",
      });
    }
  };

  const handlePreviewUrl = () => {
    if (value) {
      const fullUrl = `${window.location.origin}/@${value}`;
      window.open(fullUrl, '_blank');
    }
  };

  const validation = value ? validateUrlSlug(value) : null;
  const isValid = validation?.isValid ?? false;
  const isAvailable = availability?.isAvailable ?? false;
  const canUse = isValid && isAvailable && !isChecking;

  return (
    <div className="space-y-4">
      {/* URL Input Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Your Card URL ✨
        </label>
        
        <div className="relative">
          <div className="flex items-center">
            {/* Domain Prefix */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-xl px-4 py-3">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                cardly.com/@
              </span>
            </div>
            
            {/* Input Field */}
            <div className="relative flex-1">
              <Input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder="your-company-name"
                disabled={disabled}
                className="rounded-l-none rounded-r-xl border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary pr-12"
              />
              
              {/* Status Icon */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isChecking ? (
                  <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
                ) : canUse ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : value && !isValid ? (
                  <X className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {value && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isChecking ? (
                <Badge variant="secondary" className="text-xs">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Checking...
                </Badge>
              ) : canUse ? (
                <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  <Check className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  <X className="w-3 h-3 mr-1" />
                  {availability?.message || validation?.message || 'Invalid'}
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            {canUse && (
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="text-xs h-7 px-2"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviewUrl}
                  className="text-xs h-7 px-2"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Preview
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This will be your permanent shareable link. Choose something memorable!
        </p>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (!value || !canUse) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Suggestions
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs h-6 px-2"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {showSuggestions ? 'Hide' : 'Show'} Ideas
            </Button>
          </div>
          
          {(showSuggestions || !value) && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-8 px-3 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  {formatDisplayUrl(suggestion)}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview URL */}
      {canUse && (
        <div className="p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Card URL
              </p>
              <p className="text-lg font-semibold text-primary">
                cardly.com/@{value}
              </p>
            </div>
            <div className="text-2xl">✨</div>
          </div>
        </div>
      )}
    </div>
  );
};
