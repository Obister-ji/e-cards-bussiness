# AI Generator Setup Guide

## Overview
The AI Card Generator now supports multiple AI providers and has been significantly enhanced with better pattern matching and content generation.

## Current Status
✅ **Enhanced Mock AI** - Working out of the box with improved intelligence
✅ **OpenAI Integration** - Ready to use with API key
✅ **Supabase AI** - Framework ready for future implementation
✅ **Provider Abstraction** - Easy to switch between providers

## Quick Start (Enhanced Mock AI)

The AI generator is **already working** with an enhanced mock AI that provides:
- Intelligent business name extraction from prompts
- Contact information parsing (email, phone, website, social media)
- Industry-specific content generation
- Smart theme and badge selection
- Realistic generation delays

**No setup required** - just use the AI generator as-is!

## OpenAI Integration Setup

To use real OpenAI AI generation:

### 1. Get OpenAI API Key
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (starts with `sk-`)

### 2. Configure Environment
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your OpenAI key:
   ```env
   # AI Service Configuration
   VITE_AI_PROVIDER=openai
   VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   
   # Optional: Customize AI settings
   VITE_AI_MODEL=gpt-3.5-turbo
   VITE_AI_MAX_TOKENS=500
   VITE_AI_TEMPERATURE=0.7
   ```

3. Restart your development server:
   ```bash
   bun run dev
   ```

### 3. Verify Setup
- The AI generator header will show "OpenAI" with a green checkmark
- Generation will use real OpenAI API calls
- More intelligent and contextual results

## Provider Configuration Options

### Mock AI (Default)
```env
VITE_AI_PROVIDER=mock
```
- No API key required
- Enhanced pattern matching
- Industry-specific templates
- Instant generation

### OpenAI
```env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=your_key_here
VITE_AI_MODEL=gpt-3.5-turbo  # or gpt-4
VITE_AI_MAX_TOKENS=500
VITE_AI_TEMPERATURE=0.7
```
- Real AI generation
- Contextual understanding
- Natural language processing
- Requires API credits

## Features

### Enhanced Pattern Matching
The mock AI now includes:
- **Business Name Extraction**: Multiple patterns to find company names
- **Contact Parsing**: Extracts emails, phones, websites, social media
- **Service Detection**: Identifies specific services mentioned
- **Industry Intelligence**: Tailored content for each industry

### Smart Content Generation
- **Industry-Specific Taglines**: Professional taglines for each industry
- **Contextual Descriptions**: Relevant descriptions based on prompt content
- **Theme Selection**: Automatic theme matching to industry
- **Badge Assignment**: Appropriate badges for different business types

### Real-Time Feedback
- **Provider Status**: Shows which AI provider is active
- **Configuration Check**: Indicates if setup is correct
- **Model Information**: Displays AI model being used
- **Generation Progress**: Real-time status updates

## Example Prompts

### Basic Business
```
I need a business card for a tech startup called "CodeCraft" that specializes in web development.
```

### With Contact Info
```
Create a card for "Green Gardens Landscaping". We provide residential landscaping services. 
Contact: info@greengardens.com, (555) 123-4567, www.greengardens.com
```

### Detailed Description
```
I'm starting a consulting firm called "Strategic Solutions Inc." We help small businesses 
optimize their operations and increase profitability. My email is john@strategicsolutions.com 
and I'm on LinkedIn @johnsmith.
```

## Troubleshooting

### Mock AI Issues
- **No generation**: Check console for errors
- **Poor results**: Add more details to your prompt
- **Missing info**: Include specific contact details in prompt

### OpenAI Issues
- **API Key Error**: Verify key is correct and has credits
- **Rate Limits**: Wait a moment and try again
- **Model Error**: Check if model name is correct
- **Network Error**: Check internet connection

### General Issues
- **Provider Not Showing**: Check environment variables
- **Generation Stuck**: Refresh page and try again
- **Unexpected Results**: Try a more detailed prompt

## Cost Considerations

### Mock AI
- **Cost**: Free
- **Limits**: None
- **Quality**: Good for testing and basic use

### OpenAI
- **Cost**: Pay per API call
- **Limits**: Based on your OpenAI plan
- **Quality**: Excellent, contextual understanding

**Estimated OpenAI Costs:**
- GPT-3.5-turbo: ~$0.002 per generation
- GPT-4: ~$0.03 per generation

## Future Enhancements

### Planned Features
- [ ] Supabase AI integration
- [ ] Custom AI model support
- [ ] Batch generation
- [ ] Template learning
- [ ] Multi-language support
- [ ] Image generation for logos
- [ ] Industry-specific fine-tuning

### Advanced Configuration
- [ ] Custom prompts per industry
- [ ] A/B testing different models
- [ ] Generation analytics
- [ ] User feedback integration

## Support

### Getting Help
1. Check this guide first
2. Look at console errors
3. Verify environment variables
4. Test with mock AI first
5. Check OpenAI dashboard for API issues

### Common Solutions
- **Restart dev server** after changing environment variables
- **Clear browser cache** if seeing old behavior
- **Check API credits** in OpenAI dashboard
- **Verify API key permissions** in OpenAI settings

The AI generator is now significantly more intelligent and ready for production use with either the enhanced mock AI or real OpenAI integration!
