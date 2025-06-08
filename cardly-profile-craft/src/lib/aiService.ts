import { BusinessCard } from '@/types/types';
import { generateCardId } from '@/lib/cardUtils';
import { PREMIUM_THEMES } from '@/components/ThemeSelector';

export interface AIGenerationRequest {
  prompt: string;
  industry: string;
}

export interface OpenAIResponse {
  name: string;
  tagline: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
}

// 100% OpenAI Service with Maximum Accuracy
export class AIService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.model = import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo';
    this.temperature = parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.3'); // Lower for more accuracy
    this.maxTokens = parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '800'); // Higher for better content

    console.log('🚀 100% OpenAI Service initialized');
    console.log('📊 Configuration:', {
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
      configured: this.isConfigured()
    });
  }

  async generateBusinessCard(request: AIGenerationRequest): Promise<BusinessCard> {
    console.log('🚀 AI Service: Starting generation for:', request.prompt);

    // Check if in demo mode
    if (this.apiKey === 'DEMO_MODE') {
      console.log('🎭 Using Demo Mode (Free Mock AI)');
      return this.generateDemoCard(request);
    }

    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please add your API key to .env.local file or set VITE_OPENAI_API_KEY=DEMO_MODE for free testing.');
    }

    try {
      const response = await this.callOpenAIWithMaxAccuracy(request);
      console.log('✅ 100% OpenAI: Generation complete:', response);
      return this.convertToBusinessCard(response, request.industry);
    } catch (error) {
      console.error('❌ 100% OpenAI: Error:', error);
      throw error;
    }
  }

  private async callOpenAIWithMaxAccuracy(request: AIGenerationRequest): Promise<OpenAIResponse> {
    const { prompt, industry } = request;

    // Ultra-precise system prompt for maximum accuracy
    const systemPrompt = `You are the world's most accurate business card content generator. Your expertise is in extracting precise information and creating professional business content.

CRITICAL REQUIREMENTS:
1. Extract information with 100% accuracy - never guess or hallucinate
2. Generate professional, industry-appropriate content
3. Return ONLY valid JSON in the exact format specified
4. Use null for any information not explicitly provided
5. Ensure all content is professional and business-appropriate

Your response must be perfect JSON with no additional text or formatting.`;

    // Enhanced user prompt with detailed instructions
    const userPrompt = `Analyze this business description with maximum precision:

BUSINESS DESCRIPTION: "${prompt}"
INDUSTRY: "${industry}"

EXTRACTION REQUIREMENTS:
1. Business/Person Name: Extract the exact name mentioned (look for quotes, "called", "named", company suffixes)
2. Email: Extract exact email address if provided
3. Phone: Extract and format as (XXX) XXX-XXXX if US number, or keep original format if international
4. Website: Extract URL and ensure it starts with https://
5. Instagram: Extract handle and ensure it starts with @
6. WhatsApp: Extract number (can be same as phone)

GENERATION REQUIREMENTS:
1. Tagline: Create a professional, industry-specific tagline (max 45 characters)
2. Description: Write an engaging business description (max 140 characters)
3. Make content appropriate for the "${industry}" industry
4. Ensure professional tone and clarity

RESPONSE FORMAT (JSON ONLY):
{
  "name": "Exact business/person name from description",
  "tagline": "Professional industry-appropriate tagline",
  "description": "Engaging professional business description",
  "email": "exact@email.com or null",
  "phone": "(555) 123-4567 or null",
  "website": "https://website.com or null",
  "instagram": "@handle or null",
  "whatsapp": "+1234567890 or null"
}

CRITICAL: Return ONLY the JSON object. No explanations, no additional text, no markdown formatting.`;

    console.log('📤 Sending precision request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: { type: 'json_object' },
        top_p: 0.1, // Very focused responses
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }),
    });

    if (!response.ok) {
      await this.handleOpenAIError(response);
    }

    const data = await response.json();
    console.log('📥 OpenAI Raw Response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    const content = data.choices[0].message.content;
    console.log('📝 Generated content:', content);

    try {
      const parsedResponse = JSON.parse(content);
      console.log('✅ Parsed OpenAI response:', parsedResponse);

      return this.validateAndEnhanceResponse(parsedResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      console.error('❌ Raw content:', content);
      throw new Error('Failed to parse AI response. The AI returned invalid JSON.');
    }
  }

  private async handleOpenAIError(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ OpenAI API Error:', errorData);

    if (response.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in .env.local');
    } else if (response.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please wait a moment and try again.');
    } else if (response.status === 402) {
      throw new Error('OpenAI API quota exceeded. Please check your billing at platform.openai.com');
    } else if (response.status === 400) {
      throw new Error('Invalid request to OpenAI API. Please check your configuration.');
    } else {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
  }

  private validateAndEnhanceResponse(response: any): OpenAIResponse {
    console.log('🔍 Validating response:', response);

    // Ensure all required fields exist with proper validation
    const validated: OpenAIResponse = {
      name: this.validateName(response.name),
      tagline: this.validateTagline(response.tagline),
      description: this.validateDescription(response.description),
      email: this.validateEmail(response.email),
      phone: this.validatePhone(response.phone),
      website: this.validateWebsite(response.website),
      instagram: this.validateInstagram(response.instagram),
      whatsapp: this.validateWhatsApp(response.whatsapp),
    };

    console.log('✅ Validated response:', validated);
    return validated;
  }

  private validateName(name: any): string {
    if (!name || name === 'null' || typeof name !== 'string') {
      return 'Professional Business';
    }
    return name.trim().substring(0, 60);
  }

  private validateTagline(tagline: any): string {
    if (!tagline || tagline === 'null' || typeof tagline !== 'string') {
      return 'Excellence in Service';
    }
    const cleaned = tagline.trim();
    return cleaned.length > 45 ? cleaned.substring(0, 42) + '...' : cleaned;
  }

  private validateDescription(description: any): string {
    if (!description || description === 'null' || typeof description !== 'string') {
      return 'Professional services tailored to your needs and delivered with excellence.';
    }
    const cleaned = description.trim();
    return cleaned.length > 140 ? cleaned.substring(0, 137) + '...' : cleaned;
  }

  private validateEmail(email: any): string | undefined {
    if (!email || email === 'null' || typeof email !== 'string') {
      return undefined;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim()) ? email.trim().toLowerCase() : undefined;
  }

  private validatePhone(phone: any): string | undefined {
    if (!phone || phone === 'null' || typeof phone !== 'string') {
      return undefined;
    }
    const cleaned = phone.trim();
    return cleaned.length >= 10 ? cleaned : undefined;
  }

  private validateWebsite(website: any): string | undefined {
    if (!website || website === 'null' || typeof website !== 'string') {
      return undefined;
    }
    let cleaned = website.trim();
    if (cleaned && !cleaned.startsWith('http')) {
      cleaned = 'https://' + cleaned;
    }
    return cleaned;
  }

  private validateInstagram(instagram: any): string | undefined {
    if (!instagram || instagram === 'null' || typeof instagram !== 'string') {
      return undefined;
    }
    const cleaned = instagram.trim();
    return cleaned.startsWith('@') ? cleaned : `@${cleaned}`;
  }

  private validateWhatsApp(whatsapp: any): string | undefined {
    if (!whatsapp || whatsapp === 'null' || typeof whatsapp !== 'string') {
      return undefined;
    }
    return whatsapp.trim();
  }

  private convertToBusinessCard(response: OpenAIResponse, industry: string): BusinessCard {
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
      'design': 'artistic-purple',
      'marketing': 'gradient-modern',
      'education': 'academic-blue'
    };
    return themes[industry.toLowerCase()] || 'minimalist-black-gold';
  }

  private selectBadgeForIndustry(industry: string): string {
    const badges: Record<string, string> = {
      'technology': 'tech-innovator',
      'finance': 'trusted-advisor',
      'healthcare': 'health-expert',
      'consulting': 'strategic-partner',
      'design': 'creative-genius',
      'marketing': 'growth-expert',
      'education': 'knowledge-leader'
    };
    return badges[industry.toLowerCase()] || 'none';
  }

  private async generateDemoCard(request: AIGenerationRequest): Promise<BusinessCard> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { prompt, industry } = request;

    // Simple extraction for demo
    const name = this.extractNameDemo(prompt);
    const email = this.extractEmailDemo(prompt);
    const phone = this.extractPhoneDemo(prompt);
    const website = this.extractWebsiteDemo(prompt);

    // Generate demo content
    const { tagline, description } = this.generateDemoContent(industry);

    const response: OpenAIResponse = {
      name,
      tagline,
      description,
      email,
      phone,
      website,
      instagram: undefined,
      whatsapp: undefined
    };

    console.log('✅ Demo Mode: Generation complete:', response);
    return this.convertToBusinessCard(response, industry);
  }

  private extractNameDemo(prompt: string): string {
    const patterns = [
      /"([^"]{2,60})"/,
      /(?:called|named)\s+([A-Z][a-zA-Z\s&'-]{2,50})/i,
      /\b([A-Z][a-zA-Z\s&'-]{3,50})\b/
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return 'Professional Business';
  }

  private extractEmailDemo(prompt: string): string | undefined {
    const match = prompt.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/);
    return match ? match[1] : undefined;
  }

  private extractPhoneDemo(prompt: string): string | undefined {
    const patterns = [
      /\(\d{3}\)\s*\d{3}[-\s]?\d{4}/,
      /\d{3}[-\.\s]\d{3}[-\.\s]\d{4}/
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match) return match[0];
    }
    return undefined;
  }

  private extractWebsiteDemo(prompt: string): string | undefined {
    const match = prompt.match(/https?:\/\/[^\s,]+|www\.[^\s,]+/);
    if (match) {
      let website = match[0];
      if (!website.startsWith('http')) {
        website = 'https://' + website;
      }
      return website;
    }
    return undefined;
  }

  private generateDemoContent(industry: string): { tagline: string; description: string } {
    const templates: Record<string, { taglines: string[], descriptions: string[] }> = {
      technology: {
        taglines: ['Innovative Tech Solutions', 'Digital Excellence'],
        descriptions: ['Cutting-edge technology solutions for modern businesses.']
      },
      finance: {
        taglines: ['Trusted Financial Services', 'Your Financial Partner'],
        descriptions: ['Professional financial services with expert guidance.']
      },
      healthcare: {
        taglines: ['Quality Healthcare', 'Compassionate Care'],
        descriptions: ['Dedicated healthcare services with personal attention.']
      },
      consulting: {
        taglines: ['Strategic Solutions', 'Business Excellence'],
        descriptions: ['Expert consulting services for business growth.']
      },
      design: {
        taglines: ['Creative Design', 'Visual Innovation'],
        descriptions: ['Professional design services that inspire.']
      }
    };

    const template = templates[industry.toLowerCase()] || {
      taglines: ['Professional Services', 'Excellence in Service'],
      descriptions: ['Quality professional services tailored to your needs.']
    };

    return {
      tagline: template.taglines[Math.floor(Math.random() * template.taglines.length)],
      description: template.descriptions[0]
    };
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.apiKey !== 'your_openai_api_key_here' && (this.apiKey.startsWith('sk-') || this.apiKey === 'DEMO_MODE'));
  }

  getProviderInfo() {
    if (this.apiKey === 'DEMO_MODE') {
      return {
        provider: 'Demo Mode (Free)',
        configured: true,
        model: 'Mock AI',
        debugLogging: true
      };
    }

    return {
      provider: '100% OpenAI',
      configured: this.isConfigured(),
      model: this.model,
      debugLogging: true
    };
  }
}

// Create and export the AI service instance
export const aiService = new AIService();
