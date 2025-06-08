import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export type ThemeStyle = {
  id: string;
  name: string;
  colors: string;
  vibe: string;
  bestFor: string;
  keyElement: string;
  previewClass: string;
  fontPair?: {
    heading: string;
    body: string;
  };
  animations?: string[];
  effects?: string[];
};

export const PREMIUM_THEMES: ThemeStyle[] = [
  {
    id: "minimalist-black-gold",
    name: "Minimalist Black & Gold",
    colors: "Matte black background + gold accents",
    vibe: "Timeless, executive, luxury",
    bestFor: "CEOs, lawyers, high-end consultants",
    keyElement: "Thin gold borders, elegant typography",
    previewClass: "bg-black text-amber-400 border border-amber-400",
    fontPair: {
      heading: "font-playfair",
      body: "font-lora"
    },
    animations: ["gold-shimmer", "subtle-float"],
    effects: ["layered-shadow", "gold-accent"]
  },
  {
    id: "futuristic-glass",
    name: "Futuristic Glass Morphism",
    colors: "Semi-transparent frosted glass effect with neon highlights",
    vibe: "Cutting-edge, tech, modern",
    bestFor: "Tech founders, designers, innovators",
    keyElement: "Blurred layers, floating elements",
    previewClass: "bg-slate-800/70 backdrop-blur-lg text-white border border-cyan-400 shadow-lg shadow-cyan-400/20",
    fontPair: {
      heading: "font-montserrat",
      body: "font-poppins"
    },
    animations: ["neon-pulse", "hover-lift"],
    effects: ["glass-card", "floating-elements"]
  },
  {
    id: "dark-academia",
    name: "Dark Academia",
    colors: "Deep navy, burgundy, antique white",
    vibe: "Sophisticated, intellectual, vintage",
    bestFor: "Writers, professors, creatives",
    keyElement: "Old paper texture, serif fonts",
    previewClass: "bg-indigo-950 text-amber-50 border border-amber-900/50",
    fontPair: {
      heading: "font-playfair",
      body: "font-lora"
    },
    animations: ["ink-spread", "page-turn"],
    effects: ["paper-texture", "ink-splatter"]
  },
  {
    id: "luxury-marble",
    name: "Luxury Marble & Rose Gold",
    colors: "White marble + rose gold/metallic accents",
    vibe: "Elegant, feminine, premium",
    bestFor: "Lifestyle brands, luxury coaches",
    keyElement: "Subtle marble patterns",
    previewClass: "bg-slate-50 text-rose-400 border border-rose-300",
    fontPair: {
      heading: "font-montserrat",
      body: "font-poppins"
    },
    animations: ["rose-shimmer", "gentle-float"],
    effects: ["marble-texture", "metallic-accent"]
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    colors: "Dark purple/blue + electric pink/green",
    vibe: "Bold, edgy, futuristic",
    bestFor: "Developers, gamers, digital artists",
    keyElement: "Glowing text, grid lines",
    previewClass: "bg-purple-950 text-green-400 border border-pink-500",
    fontPair: {
      heading: "font-montserrat",
      body: "font-poppins"
    },
    animations: ["neon-flicker", "glitch-effect"],
    effects: ["grid-overlay", "glow-effect"]
  },
  {
    id: "executive-monochrome",
    name: "Executive Monochrome",
    colors: "Pure black & white (high contrast)",
    vibe: "Ultra-clean, corporate, powerful",
    bestFor: "Finance, legal, executives",
    keyElement: "Sharp lines, no distractions",
    previewClass: "bg-black text-white border border-white",
    fontPair: {
      heading: "font-montserrat",
      body: "font-poppins"
    },
    animations: ["subtle-reveal", "crisp-transition"],
    effects: ["sharp-shadow", "high-contrast"]
  },
  {
    id: "nature-inspired",
    name: "Nature-Inspired Luxe",
    colors: "Forest green, deep teal, gold",
    vibe: "Organic, premium, calm authority",
    bestFor: "Wellness coaches, sustainability brands",
    keyElement: "Leaf/wood grain textures",
    previewClass: "bg-emerald-900 text-amber-300 border border-teal-600",
    fontPair: {
      heading: "font-playfair",
      body: "font-lora"
    },
    animations: ["leaf-sway", "organic-grow"],
    effects: ["wood-texture", "leaf-pattern"]
  }
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PREMIUM_THEMES.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden ${
              selectedTheme === theme.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-[1.02]'
            }`}
            onClick={() => onSelectTheme(theme.id)}
          >
            <div className={`h-24 flex items-center justify-center ${theme.previewClass}`}>
              <span className="font-bold text-lg">ABC</span>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">{theme.name}</CardTitle>
                {selectedTheme === theme.id && (
                  <div className="bg-primary text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <CardDescription className="text-sm">{theme.vibe}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><span className="font-medium">Best for:</span> {theme.bestFor}</p>
                <p><span className="font-medium">Key elements:</span> {theme.keyElement}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onSelectTheme(theme.id)}
              >
                {selectedTheme === theme.id ? 'Selected' : 'Select Theme'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
