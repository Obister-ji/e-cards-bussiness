import { BusinessCard } from '@/types/types';
import { generateCardId } from '@/lib/cardUtils';
import { PREMIUM_THEMES } from '@/components/ThemeSelector';

export interface AIGenerationRequest {
  prompt: string;
  industry: string;
}

export interface AIGenerationResponse {
  name: string;
  tagline: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
}

// Simple, Working AI Service
class SimpleAIService {
  async generateCard(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    console.log('🚀 SimpleAI: Starting generation for:', request.prompt);
    
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { prompt, industry } = request;

    try {
      // Extract information
      const name = this.extractName(prompt);
      const email = this.extractEmail(prompt);
      const phone = this.extractPhone(prompt);
      const website = this.extractWebsite(prompt);
      const instagram = this.extractInstagram(prompt);
      const whatsapp = this.extractWhatsapp(prompt);

      console.log('📊 SimpleAI: Extracted:', { name, email, phone, website, instagram, whatsapp });

      // Generate content
      const { tagline, description } = this.generateContent(industry);

      const result = {
        name,
        tagline,
        description,
        email,
        phone,
        website,
        instagram,
        whatsapp,
      };

      console.log('✅ SimpleAI: Generation complete:', result);
      return result;
    } catch (error) {
      console.error('❌ SimpleAI: Error:', error);
      throw new Error('Failed to generate business card. Please try again.');
    }
  }

  private extractName(prompt: string): string {
    console.log('🔍 Extracting name from:', prompt);

    // Simple patterns for name extraction
    let match = prompt.match(/"([^"]{2,60})"/);
    if (match) {
      console.log('✅ Found quoted name:', match[1]);
      return match[1];
    }

    match = prompt.match(/(?:for|called|named)\s+([A-Z][a-zA-Z\s&'-]{2,50})/i);
    if (match) {
      const name = match[1].split(/[.,!?\n]/)[0].trim();
      console.log('✅ Found pattern name:', name);
      return name;
    }

    match = prompt.match(/\b([A-Z][a-z]+\s+[A-Z][a-zA-Z\s&'-]{1,40})\b/);
    if (match) {
      const name = match[1].split(/[.,!?\n]/)[0].trim();
      console.log('✅ Found capitalized name:', name);
      return name;
    }

    console.log('❌ No name found, using default');
    return "Professional Business";
  }

  private extractEmail(prompt: string): string | undefined {
    const match = prompt.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/);
    if (match) {
      console.log('✅ Found email:', match[1]);
      return match[1].toLowerCase();
    }
    return undefined;
  }

  private extractPhone(prompt: string): string | undefined {
    const patterns = [
      /\(\d{3}\)\s*\d{3}[-\s]?\d{4}/,
      /\d{3}[-\.\s]\d{3}[-\.\s]\d{4}/,
      /\b\d{10}\b/
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match) {
        const formatted = this.formatPhone(match[0]);
        console.log('✅ Found phone:', formatted);
        return formatted;
      }
    }
    return undefined;
  }

  private formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  }

  private extractWebsite(prompt: string): string | undefined {
    const patterns = [
      /https?:\/\/[^\s,]+/,
      /www\.[^\s,]+/,
      /\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b/
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match) {
        let website = match[0].replace(/[.,;!?]+$/, '');
        if (website.includes('@')) continue;
        if (!website.startsWith('http')) {
          website = 'https://' + website;
        }
        console.log('✅ Found website:', website);
        return website;
      }
    }
    return undefined;
  }

  private extractInstagram(prompt: string): string | undefined {
    const match = prompt.match(/@([a-zA-Z0-9._]{1,30})/);
    if (match) {
      const handle = '@' + match[1];
      console.log('✅ Found Instagram:', handle);
      return handle;
    }
    return undefined;
  }

  private extractWhatsapp(prompt: string): string | undefined {
    const match = prompt.match(/(?:whatsapp|wa)[:\s]+(\+?[\d\s\-\(\)\.]{10,20})/i);
    if (match) {
      const number = match[1].replace(/[^\d\+]/g, '');
      if (number.length >= 10) {
        const formatted = number.startsWith('+') ? number : `+${number}`;
        console.log('✅ Found WhatsApp:', formatted);
        return formatted;
      }
    }
    return undefined;
  }

  private generateContent(industry: string): { tagline: string; description: string } {
    const templates: Record<string, { taglines: string[], descriptions: string[] }> = {
      technology: {
        taglines: ["Innovative Tech Solutions", "Digital Innovation Experts", "Future-Ready Technology"],
        descriptions: ["Cutting-edge technology solutions for modern businesses.", "Transforming businesses through innovation."]
      },
      finance: {
        taglines: ["Trusted Financial Services", "Your Financial Partner", "Wealth Management Experts"],
        descriptions: ["Secure financial solutions for your future.", "Building financial security through expert guidance."]
      },
      healthcare: {
        taglines: ["Compassionate Healthcare", "Health & Wellness Experts", "Quality Care Providers"],
        descriptions: ["Quality healthcare with a personal touch.", "Dedicated to your health and wellbeing."]
      },
      consulting: {
        taglines: ["Strategic Business Solutions", "Expert Consultants", "Growth Partners"],
        descriptions: ["Strategic consulting for business growth.", "Helping businesses achieve their goals."]
      },
      design: {
        taglines: ["Creative Design Solutions", "Visual Innovation", "Design Excellence"],
        descriptions: ["Exceptional design that stands out.", "Creating visual experiences that inspire."]
      }
    };

    const template = templates[industry.toLowerCase()] || {
      taglines: ["Professional Services", "Quality Solutions", "Expert Providers"],
      descriptions: ["Professional services tailored to your needs.", "Quality solutions for your business."]
    };

    const tagline = template.taglines[Math.floor(Math.random() * template.taglines.length)];
    const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];

    console.log('✅ Generated content:', { tagline, description });
    return { tagline, description };
  }
}

// Main AI Service
export class AIService {
  private simpleService: SimpleAIService;

  constructor() {
    this.simpleService = new SimpleAIService();
  }

  async generateBusinessCard(request: AIGenerationRequest): Promise<BusinessCard> {
    console.log('🚀 AI Service: Starting generation');
    
    try {
      const response = await this.simpleService.generateCard(request);
      return this.convertToBusinessCard(response, request.industry);
    } catch (error) {
      console.error('🚨 AI Service Error:', error);
      throw error;
    }
  }

  private convertToBusinessCard(response: AIGenerationResponse, industry: string): BusinessCard {
    const theme = this.selectThemeForIndustry(industry);
    const selectedTheme = PREMIUM_THEMES.find(t => t.id === theme);

    return {
      id: generateCardId(),
      name: response.name,
      tagline: response.tagline,
      description: response.description,
      email: response.email,
      phone: response.phone,
      website: response.website,
      instagram: response.instagram,
      whatsapp: response.whatsapp,
      theme: theme,
      badge: this.selectBadgeForIndustry(industry),
      animations: selectedTheme?.animations || [],
      effects: selectedTheme?.effects || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private selectThemeForIndustry(industry: string): string {
    const themes: Record<string, string> = {
      'technology': 'cyber-neon',
      'finance': 'minimalist-black-gold',
      'healthcare': 'nature-green',
      'consulting': 'executive-black',
      'design': 'artistic-purple'
    };
    return themes[industry.toLowerCase()] || 'minimalist-black-gold';
  }

  private selectBadgeForIndustry(industry: string): string {
    const badges: Record<string, string> = {
      'technology': 'tech-innovator',
      'finance': 'trusted-advisor',
      'healthcare': 'health-expert',
      'consulting': 'strategic-partner',
      'design': 'creative-genius'
    };
    return badges[industry.toLowerCase()] || 'none';
  }

  isConfigured(): boolean {
    return true;
  }

  getProviderInfo() {
    return {
      provider: 'simple-mock',
      configured: true,
      model: 'Simple AI',
      debugLogging: true
    };
  }
}
