// Optional Server-Side OpenAI API Endpoint
// This is for Vercel deployment with server-side API calls

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, industry } = req.body;

  // Validate input
  if (!prompt || !industry) {
    return res.status(400).json({ error: 'Prompt and industry are required' });
  }

  // Get OpenAI API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    // Enhanced structured prompt for better results
    const systemPrompt = `You are an expert business card content generator. You create professional, accurate, and engaging business card content based on user descriptions.

Your task is to:
1. Extract business information from the user's description
2. Generate professional taglines and descriptions
3. Return structured JSON data

IMPORTANT: Always return valid JSON in the exact format specified, even if some information is missing from the input.`;

    const userPrompt = `Generate a professional business card based on this description:

"${prompt}"

Industry: ${industry}

Extract and generate the following information:
- Business/Person Name (from the description)
- Professional tagline (max 50 characters, industry-appropriate)
- Business description (max 150 characters, professional and engaging)
- Email address (if mentioned)
- Phone number (if mentioned, format as (XXX) XXX-XXXX)
- Website URL (if mentioned, include https://)
- Instagram handle (if mentioned, include @)
- WhatsApp number (if mentioned)

Return ONLY a JSON object in this exact format:
{
  "name": "Business or Person Name",
  "tagline": "Professional tagline here",
  "description": "Engaging business description here",
  "email": "email@example.com or null",
  "phone": "(555) 123-4567 or null",
  "website": "https://website.com or null", 
  "instagram": "@handle or null",
  "whatsapp": "+1234567890 or null"
}

Make sure the tagline and description are professional, industry-appropriate, and engaging. Use null for any information not provided in the description.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500'),
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      
      if (response.status === 401) {
        return res.status(500).json({ error: 'Invalid OpenAI API key' });
      } else if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      } else if (response.status === 402) {
        return res.status(402).json({ error: 'OpenAI quota exceeded. Please check billing.' });
      } else {
        return res.status(500).json({ error: 'OpenAI API error' });
      }
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    const content = data.choices[0].message.content;

    try {
      const parsedResponse = JSON.parse(content);
      
      // Validate and clean the response
      const cleanedResponse = {
        name: parsedResponse.name || 'Professional Business',
        tagline: parsedResponse.tagline || 'Excellence in Service',
        description: parsedResponse.description || 'Professional services tailored to your needs.',
        email: parsedResponse.email === 'null' ? null : parsedResponse.email,
        phone: parsedResponse.phone === 'null' ? null : parsedResponse.phone,
        website: parsedResponse.website === 'null' ? null : parsedResponse.website,
        instagram: parsedResponse.instagram === 'null' ? null : parsedResponse.instagram,
        whatsapp: parsedResponse.whatsapp === 'null' ? null : parsedResponse.whatsapp,
      };

      // Clean up website URL
      if (cleanedResponse.website && !cleanedResponse.website.startsWith('http')) {
        cleanedResponse.website = 'https://' + cleanedResponse.website;
      }

      // Ensure content length limits
      if (cleanedResponse.tagline.length > 50) {
        cleanedResponse.tagline = cleanedResponse.tagline.substring(0, 47) + '...';
      }
      
      if (cleanedResponse.description.length > 150) {
        cleanedResponse.description = cleanedResponse.description.substring(0, 147) + '...';
      }

      return res.status(200).json({
        success: true,
        data: cleanedResponse
      });

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Example usage from frontend:
/*
const response = await fetch('/api/generate-card', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "I need a business card for a tech startup called 'CodeCraft'...",
    industry: "technology"
  }),
});

const result = await response.json();
if (result.success) {
  console.log('Generated card data:', result.data);
} else {
  console.error('Error:', result.error);
}
*/
