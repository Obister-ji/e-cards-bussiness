export interface AIGenerationRequest {
  prompt: string;
  industry: string;
}

export interface AIGenerationResult {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  whatsapp: string;
  tagline: string;
  description: string;
  theme: string;
}

export class AIService {
  static async generateBusinessCard(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      // Extract information from the prompt using regex patterns
      const prompt = request.prompt.toLowerCase();
      const industry = request.industry.toLowerCase();

      // Extract name
      const nameMatch = prompt.match(/(?:name|named|i'm|i am|my name is)\s+([a-zA-Z\s]+?)(?:\s|,|\.|\||$)/i);
      const name = nameMatch ? nameMatch[1].trim() : 'John Doe';

      // Extract email
      const emailMatch = prompt.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      const email = emailMatch ? emailMatch[1] : `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;

      // Extract phone
      const phoneMatch = prompt.match(/(?:phone|call|mobile|tel|telephone)[\s:]*([+]?[\d\s\-\(\)]{10,})/i);
      const phone = phoneMatch ? phoneMatch[1].trim() : '+1 (555) 123-4567';

      // Extract website
      const websiteMatch = prompt.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(com|org|net|io|co))/i);
      const website = websiteMatch ? websiteMatch[1] : `www.${name.toLowerCase().replace(/\s+/g, '')}.com`;

      // Extract Instagram
      const instagramMatch = prompt.match(/(?:instagram|ig|@)[\s:]*@?([a-zA-Z0-9._]+)/i);
      const instagram = instagramMatch ? instagramMatch[1] : name.toLowerCase().replace(/\s+/g, '');

      // Extract WhatsApp (often same as phone)
      const whatsappMatch = prompt.match(/(?:whatsapp|wa)[\s:]*([+]?[\d\s\-\(\)]{10,})/i);
      const whatsapp = whatsappMatch ? whatsappMatch[1].trim() : phone;

      // Generate title based on industry and prompt
      let title = 'Professional';
      if (prompt.includes('developer') || prompt.includes('programmer') || prompt.includes('engineer')) {
        title = 'Software Developer';
      } else if (prompt.includes('designer') || prompt.includes('creative')) {
        title = 'Creative Designer';
      } else if (prompt.includes('manager') || prompt.includes('director')) {
        title = 'Project Manager';
      } else if (prompt.includes('consultant') || prompt.includes('advisor')) {
        title = 'Business Consultant';
      } else if (prompt.includes('marketing') || prompt.includes('sales')) {
        title = 'Marketing Specialist';
      } else if (prompt.includes('doctor') || prompt.includes('physician')) {
        title = 'Medical Professional';
      } else if (prompt.includes('teacher') || prompt.includes('educator')) {
        title = 'Educator';
      } else if (prompt.includes('lawyer') || prompt.includes('attorney')) {
        title = 'Legal Professional';
      } else if (prompt.includes('photographer')) {
        title = 'Professional Photographer';
      } else if (prompt.includes('chef') || prompt.includes('cook')) {
        title = 'Culinary Expert';
      } else {
        // Generate based on industry
        switch (industry) {
          case 'technology':
            title = 'Technology Professional';
            break;
          case 'healthcare':
            title = 'Healthcare Professional';
            break;
          case 'finance':
            title = 'Financial Advisor';
            break;
          case 'education':
            title = 'Education Specialist';
            break;
          case 'marketing':
            title = 'Marketing Expert';
            break;
          case 'design':
            title = 'Creative Designer';
            break;
          case 'consulting':
            title = 'Business Consultant';
            break;
          case 'real-estate':
            title = 'Real Estate Professional';
            break;
          case 'legal':
            title = 'Legal Professional';
            break;
          case 'hospitality':
            title = 'Hospitality Expert';
            break;
          default:
            title = 'Professional';
        }
      }

      // Extract or generate company
      const companyMatch = prompt.match(/(?:company|work at|employed by|business)\s+([a-zA-Z\s&]+?)(?:\s|,|\.|\||$)/i);
      let company = companyMatch ? companyMatch[1].trim() : '';
      
      if (!company) {
        // Generate company based on industry
        switch (industry) {
          case 'technology':
            company = 'Tech Solutions Inc.';
            break;
          case 'healthcare':
            company = 'Healthcare Partners';
            break;
          case 'finance':
            company = 'Financial Services Group';
            break;
          case 'education':
            company = 'Educational Institute';
            break;
          case 'marketing':
            company = 'Marketing Agency';
            break;
          case 'design':
            company = 'Creative Studio';
            break;
          case 'consulting':
            company = 'Consulting Group';
            break;
          case 'real-estate':
            company = 'Real Estate Partners';
            break;
          case 'legal':
            company = 'Law Firm';
            break;
          case 'hospitality':
            company = 'Hospitality Group';
            break;
          default:
            company = 'Professional Services';
        }
      }

      // Generate tagline based on industry
      let tagline = 'Excellence in Every Detail';
      switch (industry) {
        case 'technology':
          tagline = 'Innovating Tomorrow\'s Solutions';
          break;
        case 'healthcare':
          tagline = 'Caring for Your Health';
          break;
        case 'finance':
          tagline = 'Your Financial Success Partner';
          break;
        case 'education':
          tagline = 'Empowering Minds, Shaping Futures';
          break;
        case 'marketing':
          tagline = 'Growing Your Brand Story';
          break;
        case 'design':
          tagline = 'Creating Beautiful Experiences';
          break;
        case 'consulting':
          tagline = 'Strategic Solutions for Growth';
          break;
        case 'real-estate':
          tagline = 'Your Dream Home Awaits';
          break;
        case 'legal':
          tagline = 'Protecting Your Rights';
          break;
        case 'hospitality':
          tagline = 'Exceptional Service, Every Time';
          break;
      }

      // Generate description based on industry and title
      let description = `Experienced ${title.toLowerCase()} dedicated to delivering exceptional results and building lasting relationships with clients.`;
      
      switch (industry) {
        case 'technology':
          description = `Passionate ${title.toLowerCase()} with expertise in cutting-edge technologies and innovative solutions that drive business growth.`;
          break;
        case 'healthcare':
          description = `Compassionate ${title.toLowerCase()} committed to providing the highest quality care and improving patient outcomes.`;
          break;
        case 'finance':
          description = `Trusted ${title.toLowerCase()} helping clients achieve their financial goals through strategic planning and expert guidance.`;
          break;
        case 'education':
          description = `Dedicated ${title.toLowerCase()} passionate about inspiring learning and fostering academic excellence in students.`;
          break;
        case 'marketing':
          description = `Creative ${title.toLowerCase()} specializing in building powerful brand narratives and driving customer engagement.`;
          break;
        case 'design':
          description = `Innovative ${title.toLowerCase()} creating visually stunning and user-centered designs that make lasting impressions.`;
          break;
        case 'consulting':
          description = `Strategic ${title.toLowerCase()} helping businesses optimize operations and achieve sustainable growth.`;
          break;
        case 'real-estate':
          description = `Professional ${title.toLowerCase()} dedicated to helping clients find their perfect property and investment opportunities.`;
          break;
        case 'legal':
          description = `Experienced ${title.toLowerCase()} providing comprehensive legal services with integrity and attention to detail.`;
          break;
        case 'hospitality':
          description = `Service-oriented ${title.toLowerCase()} committed to creating memorable experiences and exceeding guest expectations.`;
          break;
      }

      // Select theme based on industry
      let theme = 'minimalist-black-gold';
      switch (industry) {
        case 'technology':
          theme = 'futuristic-glass';
          break;
        case 'healthcare':
          theme = 'minimalist-black-gold';
          break;
        case 'finance':
          theme = 'executive-monochrome';
          break;
        case 'education':
          theme = 'dark-academia';
          break;
        case 'marketing':
          theme = 'cyberpunk-neon';
          break;
        case 'design':
          theme = 'luxury-marble';
          break;
        case 'consulting':
          theme = 'executive-monochrome';
          break;
        case 'real-estate':
          theme = 'luxury-marble';
          break;
        case 'legal':
          theme = 'dark-academia';
          break;
        case 'hospitality':
          theme = 'nature-inspired';
          break;
      }

      return {
        name,
        title,
        company,
        email,
        phone,
        website,
        instagram,
        whatsapp,
        tagline,
        description,
        theme
      };

    } catch (error) {
      console.error('AI Generation Error:', error);
      
      // Return fallback data
      return {
        name: 'John Doe',
        title: 'Professional',
        company: 'Professional Services',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        website: 'www.johndoe.com',
        instagram: 'johndoe',
        whatsapp: '+1 (555) 123-4567',
        tagline: 'Excellence in Every Detail',
        description: 'Experienced professional dedicated to delivering exceptional results and building lasting relationships with clients.',
        theme: 'minimalist-black-gold'
      };
    }
  }
}
