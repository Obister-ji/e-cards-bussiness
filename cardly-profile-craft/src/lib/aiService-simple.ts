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

      // Generate content with context awareness
      const { tagline, description } = this.generateContent(industry, prompt);

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

    // Enhanced patterns for better name extraction
    const patterns = [
      // Quoted names (highest priority)
      /"([^"]{2,60})"/,
      /'([^']{2,60})'/,

      // Business context patterns
      /(?:business|company|firm|startup|agency|studio|group|corp|inc|llc|ltd)\s+(?:called|named|is)\s+([A-Z][a-zA-Z\s&'-]{2,50})/i,
      /(?:for|called|named|starting|launching)\s+([A-Z][a-zA-Z\s&'-]{2,50})/i,

      // Direct business names
      /\b([A-Z][a-zA-Z\s&'-]{2,50})\s+(?:inc|llc|ltd|corp|company|business|firm|agency|studio|group)\b/i,

      // Personal names (for individual professionals)
      /(?:i'm|i am|my name is|name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,

      // Capitalized business names
      /\b([A-Z][a-zA-Z\s&'-]{3,50})\b/,

      // Service-based names
      /(?:providing|offering|specializing in)\s+([a-zA-Z\s&'-]{3,50})/i
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match) {
        let name = match[1].split(/[.,!?\n]/)[0].trim();

        // Clean up the name
        name = name.replace(/\s+/g, ' ').trim();

        // Skip if it's too generic or contains common words that aren't names
        const skipWords = ['business', 'services', 'solutions', 'consulting', 'development', 'design', 'marketing'];
        if (name.length > 2 && !skipWords.some(word => name.toLowerCase() === word)) {
          console.log('✅ Found name:', name);
          return name;
        }
      }
    }

    console.log('❌ No specific name found, using default');
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
      // US formats
      /\(\d{3}\)\s*\d{3}[-\s]?\d{4}/,
      /\d{3}[-\.\s]\d{3}[-\.\s]\d{4}/,
      /\b\d{10}\b/,

      // International formats
      /\+\d{1,3}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,9}/,

      // Common variations
      /(?:phone|call|tel|mobile|cell)[:\s]+(\+?[\d\s\-\(\)\.]{10,20})/i,
      /(?:contact|reach)[:\s]+(\+?[\d\s\-\(\)\.]{10,20})/i
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match) {
        const phoneNumber = match[1] || match[0];
        const formatted = this.formatPhone(phoneNumber);
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
      // Full URLs
      /https?:\/\/[^\s,]+/,

      // www domains
      /www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?/,

      // Context-based website extraction
      /(?:website|site|visit|check out|find us at)[:\s]+((?:https?:\/\/)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)/i,

      // Domain names (be more selective)
      /\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?\b/
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match) {
        let website = (match[1] || match[0]).replace(/[.,;!?]+$/, '');

        // Skip if it contains @ (likely email)
        if (website.includes('@')) continue;

        // Skip common non-website domains
        const skipDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
        if (skipDomains.some(domain => website.includes(domain))) continue;

        // Add protocol if missing
        if (!website.startsWith('http')) {
          website = 'https://' + website.replace(/^www\./, 'www.');
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

  private analyzePromptContext(prompt: string): string[] {
    const keywords: string[] = [];
    const lowerPrompt = prompt.toLowerCase();

    // Service-specific keywords
    const serviceKeywords = {
      'startup': ['innovative', 'disruptive', 'next-generation'],
      'consulting': ['strategic', 'expert', 'advisory'],
      'development': ['custom', 'scalable', 'cutting-edge'],
      'design': ['creative', 'visual', 'artistic'],
      'marketing': ['growth', 'brand', 'digital'],
      'healthcare': ['compassionate', 'quality', 'patient-centered'],
      'finance': ['trusted', 'secure', 'wealth'],
      'education': ['learning', 'knowledge', 'academic'],
      'premium': ['luxury', 'high-end', 'exclusive'],
      'local': ['community', 'neighborhood', 'local'],
      'online': ['digital', 'virtual', 'remote'],
      'small': ['boutique', 'personalized', 'intimate'],
      'large': ['enterprise', 'comprehensive', 'full-service']
    };

    // Check for context keywords
    for (const [key, values] of Object.entries(serviceKeywords)) {
      if (lowerPrompt.includes(key)) {
        keywords.push(...values);
      }
    }

    // Check for quality indicators
    if (lowerPrompt.includes('best') || lowerPrompt.includes('top') || lowerPrompt.includes('leading')) {
      keywords.push('excellence', 'premier', 'industry-leading');
    }

    if (lowerPrompt.includes('new') || lowerPrompt.includes('starting') || lowerPrompt.includes('launching')) {
      keywords.push('innovative', 'fresh', 'emerging');
    }

    if (lowerPrompt.includes('experienced') || lowerPrompt.includes('years') || lowerPrompt.includes('established')) {
      keywords.push('experienced', 'trusted', 'proven');
    }

    return [...new Set(keywords)]; // Remove duplicates
  }

  private generateContent(industry: string, prompt?: string): { tagline: string; description: string } {
    console.log('🎨 Generating content for industry:', industry);
    console.log('🔍 Analyzing prompt for context:', prompt);

    // Analyze prompt for context clues
    const contextKeywords = this.analyzePromptContext(prompt || '');
    console.log('🧠 Context keywords found:', contextKeywords);

    // Enhanced templates with more variety and context-awareness
    const templates: Record<string, { taglines: string[], descriptions: string[] }> = {
      technology: {
        taglines: [
          "Innovative Tech Solutions", "Digital Innovation Experts", "Future-Ready Technology",
          "Transforming Ideas into Code", "Next-Gen Software Solutions", "Tech Excellence Delivered",
          "Digital Transformation Partners", "Cutting-Edge Development", "Smart Technology Solutions"
        ],
        descriptions: [
          "Cutting-edge technology solutions that drive business growth and innovation.",
          "Transforming businesses through innovative software development and digital solutions.",
          "Expert technology consulting and development services for modern enterprises.",
          "Building scalable, secure, and efficient technology solutions for your business needs.",
          "Delivering high-quality software solutions that exceed expectations and drive results."
        ]
      },
      finance: {
        taglines: [
          "Trusted Financial Services", "Your Financial Partner", "Wealth Management Experts",
          "Financial Growth Specialists", "Investment Excellence", "Secure Financial Planning",
          "Strategic Financial Solutions", "Building Financial Futures", "Expert Financial Guidance"
        ],
        descriptions: [
          "Comprehensive financial services designed to secure and grow your wealth.",
          "Expert financial planning and investment strategies tailored to your goals.",
          "Building long-term financial security through personalized advisory services.",
          "Professional financial management with a focus on sustainable growth and security.",
          "Trusted financial expertise helping clients achieve their financial objectives."
        ]
      },
      healthcare: {
        taglines: [
          "Compassionate Healthcare", "Health & Wellness Experts", "Quality Care Providers",
          "Dedicated Medical Excellence", "Patient-Centered Care", "Health Innovation Leaders",
          "Comprehensive Healthcare Solutions", "Wellness & Recovery Specialists", "Medical Excellence"
        ],
        descriptions: [
          "Providing exceptional healthcare services with compassion and expertise.",
          "Comprehensive medical care focused on patient wellness and recovery.",
          "Dedicated healthcare professionals committed to improving lives and health outcomes.",
          "Advanced medical services delivered with personalized care and attention.",
          "Quality healthcare solutions designed to promote wellness and healing."
        ]
      },
      consulting: {
        taglines: [
          "Strategic Business Solutions", "Expert Consultants", "Growth Partners",
          "Business Transformation Experts", "Strategic Advisory Services", "Performance Optimization",
          "Management Consulting Excellence", "Business Growth Catalysts", "Strategic Innovation Partners"
        ],
        descriptions: [
          "Strategic consulting services that drive business growth and operational excellence.",
          "Expert business advisory services helping organizations achieve their strategic goals.",
          "Transforming businesses through strategic planning and performance optimization.",
          "Professional consulting services focused on sustainable growth and competitive advantage.",
          "Delivering strategic insights and solutions that create lasting business value."
        ]
      },
      design: {
        taglines: [
          "Creative Design Solutions", "Visual Innovation", "Design Excellence",
          "Creative Visual Storytelling", "Brand Design Experts", "Artistic Innovation",
          "Design & Creative Services", "Visual Communication Specialists", "Creative Excellence"
        ],
        descriptions: [
          "Exceptional design services that bring your vision to life with creativity and precision.",
          "Creative design solutions that captivate audiences and strengthen brand identity.",
          "Professional design services combining artistic vision with strategic thinking.",
          "Innovative visual design that communicates your message and engages your audience.",
          "Expert design services creating memorable visual experiences that drive results."
        ]
      },
      marketing: {
        taglines: [
          "Digital Marketing Experts", "Brand Growth Specialists", "Marketing Innovation",
          "Strategic Marketing Solutions", "Growth Marketing Partners", "Brand Amplification Experts",
          "Marketing Performance Specialists", "Digital Growth Catalysts", "Marketing Excellence"
        ],
        descriptions: [
          "Strategic marketing services that amplify your brand and drive measurable growth.",
          "Comprehensive digital marketing solutions designed to maximize your reach and impact.",
          "Expert marketing strategies that connect your brand with the right audience.",
          "Data-driven marketing services that deliver results and accelerate business growth.",
          "Professional marketing solutions that build brand awareness and drive conversions."
        ]
      },
      education: {
        taglines: [
          "Educational Excellence", "Learning & Development Experts", "Knowledge Empowerment",
          "Educational Innovation", "Learning Solutions Specialists", "Academic Excellence Partners",
          "Education & Training Experts", "Knowledge Transfer Specialists", "Learning Excellence"
        ],
        descriptions: [
          "Comprehensive educational services designed to empower learning and development.",
          "Expert educational solutions that inspire growth and knowledge advancement.",
          "Professional training and development services that unlock potential and drive success.",
          "Innovative educational programs that deliver measurable learning outcomes.",
          "Dedicated educational services focused on student success and achievement."
        ]
      }
    };

    // Get template for industry or use default
    const template = templates[industry.toLowerCase()] || {
      taglines: [
        "Professional Services", "Quality Solutions", "Expert Providers",
        "Excellence in Service", "Trusted Professionals", "Quality & Reliability",
        "Professional Excellence", "Service Innovation", "Trusted Expertise"
      ],
      descriptions: [
        "Professional services tailored to meet your specific needs and exceed expectations.",
        "Quality solutions delivered with expertise, reliability, and exceptional service.",
        "Trusted professionals committed to delivering outstanding results and value.",
        "Expert services designed to help you achieve your goals with confidence.",
        "Professional excellence in every project, ensuring quality and satisfaction."
      ]
    };

    // Intelligent content selection based on context
    let selectedTagline = template.taglines[Math.floor(Math.random() * template.taglines.length)];
    let selectedDescription = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];

    // Enhance content with context keywords if available
    if (contextKeywords.length > 0 && prompt) {
      selectedTagline = this.enhanceWithContext(selectedTagline, contextKeywords);
      selectedDescription = this.enhanceWithContext(selectedDescription, contextKeywords);
    }

    console.log('✅ Generated context-aware content:', {
      tagline: selectedTagline,
      description: selectedDescription,
      contextUsed: contextKeywords
    });

    return {
      tagline: selectedTagline,
      description: selectedDescription
    };
  }

  private enhanceWithContext(content: string, keywords: string[]): string {
    // Simple context enhancement - replace generic words with context-specific ones
    let enhanced = content;

    const replacements: Record<string, string[]> = {
      'Professional': keywords.filter(k => ['expert', 'premier', 'industry-leading'].includes(k)),
      'Quality': keywords.filter(k => ['excellence', 'premium', 'superior'].includes(k)),
      'Expert': keywords.filter(k => ['experienced', 'trusted', 'proven'].includes(k)),
      'Innovative': keywords.filter(k => ['cutting-edge', 'next-generation', 'disruptive'].includes(k)),
      'Solutions': keywords.filter(k => ['strategic', 'comprehensive', 'custom'].includes(k))
    };

    // Apply context-based replacements
    for (const [original, contextWords] of Object.entries(replacements)) {
      if (contextWords.length > 0 && enhanced.includes(original)) {
        const replacement = contextWords[Math.floor(Math.random() * contextWords.length)];
        enhanced = enhanced.replace(original, replacement.charAt(0).toUpperCase() + replacement.slice(1));
      }
    }

    return enhanced;
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
