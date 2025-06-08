import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2, Settings, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { BusinessCard } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { AIService } from '@/lib/aiService-simple';

interface AICardGeneratorProps {
  onGenerate: (card: BusinessCard) => void;
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
  "Legal",
  "Real Estate",
  "Hospitality",
  "Retail",
  "Manufacturing",
  "Consulting"
];

const AICardGenerator: React.FC<AICardGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const [aiService] = useState(() => new AIService());
  const [providerInfo, setProviderInfo] = useState<{provider: string; configured: boolean; model?: string} | null>(null);
  const [lastGeneratedCard, setLastGeneratedCard] = useState<BusinessCard | null>(null);
  const [showRegenerateOption, setShowRegenerateOption] = useState(false);

  // Initialize provider info on component mount
  useEffect(() => {
    setProviderInfo(aiService.getProviderInfo());
  }, [aiService]);

  // Only reset regenerate option when starting a completely new generation
  // (not when user makes minor edits to prompt)

  // Enhanced AI generation function using the new AI service
  const generateCard = async (isRegeneration = false) => {
    setIsGenerating(true);
    // Only hide regenerate option for completely new generations
    if (!isRegeneration) {
      setShowRegenerateOption(false);
      setLastGeneratedCard(null);
    }

    try {
      const selectedIndustry = industry === "custom" ? customIndustry : industry;

      // Generate card using AI service
      const generatedCard = await aiService.generateBusinessCard({
        prompt,
        industry: selectedIndustry
      });

      // Log the generated card for debugging
      console.log("Generated card:", generatedCard);

      // Store the generated card for potential regeneration
      setLastGeneratedCard(generatedCard);
      setShowRegenerateOption(true);

      console.log('🔄 Regenerate option enabled:', true);

      onGenerate(generatedCard);

      toast({
        title: isRegeneration ? "Card Regenerated!" : "Card Generated!",
        description: `Your AI-generated business card is ready to customize. ${providerInfo?.provider === 'openai' ? '(Powered by OpenAI)' : '(Enhanced Mock AI)'} ${isRegeneration ? 'Try regenerating again if needed.' : 'Not satisfied? Use the regenerate button.'}`,
      });
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate card. Please try again.",
        variant: "destructive",
      });
      // Only hide regenerate option if this was the first generation attempt
      if (!isRegeneration) {
        setShowRegenerateOption(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate function with slight variations for different results
  const regenerateCard = async () => {
    if (!prompt || !industry) {
      toast({
        title: "Cannot Regenerate",
        description: "Please ensure you have entered a prompt and selected an industry first.",
        variant: "destructive",
      });
      return;
    }

    await generateCard(true);
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-xl overflow-hidden">
      <CardHeader className="bg-primary-gradient text-white pb-6">
        <CardTitle className="flex items-center justify-between text-2xl font-montserrat">
          <div className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" /> AI Card Generator
          </div>
          {providerInfo && (
            <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
              {providerInfo.configured ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {providerInfo.provider === 'openai' ? 'OpenAI' : 'Enhanced Mock AI'}
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-white/80">
          Let AI create a professional business card for you
          {providerInfo?.provider === 'openai' && providerInfo.model && (
            <span className="block text-xs mt-1 opacity-75">
              Powered by {providerInfo.model}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Describe your business</Label>
          <Textarea
            id="prompt"
            placeholder="e.g., I need a business card for a tech startup called 'CodeCraft' that specializes in web development. Our email is contact@codecraft.com and phone is (555) 123-4567."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tip: Include your business name, contact details, and what makes your business unique for better results.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Select your industry</Label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Select an industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
            <option value="custom">Other (specify)</option>
          </select>
        </div>

        {industry === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="customIndustry">Specify your industry</Label>
            <Input
              id="customIndustry"
              placeholder="e.g., Blockchain Development"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-2 pb-6 space-y-3">
        {prompt.length < 10 && prompt.length > 0 && (
          <p className="text-amber-500 dark:text-amber-400 text-sm w-full text-left">
            Tip: Add more details to get better results
          </p>
        )}

        {!industry && (
          <p className="text-amber-500 dark:text-amber-400 text-sm w-full text-left">
            Please select an industry for better results
          </p>
        )}

        <div className="flex flex-col w-full space-y-3">
          {/* Debug info for regenerate state */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 p-2 bg-gray-100 dark:bg-gray-800 rounded">
              Debug: showRegenerateOption={showRegenerateOption.toString()}, isGenerating={isGenerating.toString()}, hasLastCard={!!lastGeneratedCard}
            </div>
          )}

          <Button
            onClick={() => generateCard(false)}
            disabled={isGenerating || !prompt || (!industry || (industry === "custom" && !customIndustry))}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Card...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Business Card
              </>
            )}
          </Button>

          {/* Regenerate Button */}
          {showRegenerateOption && !isGenerating && (
            <div className="w-full space-y-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center space-x-2 text-sm text-purple-700 dark:text-purple-300 font-medium">
                <span>✨ Not satisfied with the result?</span>
              </div>
              <Button
                onClick={regenerateCard}
                variant="outline"
                className="w-full border-2 border-purple-300 hover:border-purple-400 text-purple-700 hover:text-purple-800 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:text-purple-200 dark:hover:bg-purple-800/30 font-medium py-3 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                🔄 Regenerate with Different Results
              </Button>
              <p className="text-xs text-center text-purple-600 dark:text-purple-400">
                Generate a new variation using the same prompt and industry
              </p>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AICardGenerator;
