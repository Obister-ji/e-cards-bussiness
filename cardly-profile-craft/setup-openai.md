# 🚀 OpenAI Setup Guide - Step by Step

## Quick Setup (5 minutes)

### **Step 1: Get OpenAI API Key**

1. **Visit OpenAI Platform**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Sign in** or create a new account
3. **Click "Create new secret key"**
4. **Name it**: "Cardly Business Cards" 
5. **Copy the key** (starts with `sk-`) - **Save it securely!**

### **Step 2: Create Environment File**

**Copy the example file:**
```bash
cp .env.example .env.local
```

**Or create `.env.local` manually with this content:**
```env
# ===========================================
# AI SERVICE CONFIGURATION
# ===========================================

VITE_AI_PROVIDER=openai

# ===========================================
# OPENAI CONFIGURATION
# ===========================================

# Replace with your actual OpenAI API key
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here

# Model settings (these are good defaults)
VITE_AI_MODEL=gpt-3.5-turbo
VITE_AI_MAX_TOKENS=500
VITE_AI_TEMPERATURE=0.7

# ===========================================
# SUPABASE CONFIGURATION (Already Configured)
# ===========================================

VITE_SUPABASE_URL=https://sooomjmnfmwpfbypjqqj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb29tam1uZm13cGZieXBqcXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDM1MzYsImV4cCI6MjA2MzA3OTUzNn0.KOPygh9UDJeTxDfzwRBzsWKUJmc2Qm5-MlZJYYkiF6k
```

### **Step 3: Replace API Key**

**Edit `.env.local` and replace:**
```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

**With your real key:**
```env
VITE_OPENAI_API_KEY=sk-proj-abc123...your-real-key
```

### **Step 4: Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
bun run dev
```

### **Step 5: Verify Setup**

1. **Go to your app** (usually http://localhost:5173)
2. **Click "AI Test" tab**
3. **Look for**: "Provider: OpenAI" with green checkmark ✅
4. **Click "Test AI Generation"**
5. **Should see**: Real AI-generated content

---

## 🎯 What You'll Get with OpenAI

### **Enhanced Intelligence**
- **Contextual Understanding**: Better interpretation of complex prompts
- **Natural Language Processing**: Understands nuanced business descriptions
- **Creative Content**: More varied and professional taglines/descriptions
- **Industry Expertise**: Better industry-specific knowledge

### **Example Results Comparison**

**Mock AI Result:**
```
Name: "TechCorp"
Tagline: "Innovative Tech Solutions"
Description: "Cutting-edge technology solutions for modern businesses."
```

**OpenAI Result:**
```
Name: "TechCorp"
Tagline: "Transforming Ideas into Digital Reality"
Description: "We specialize in custom software development and digital transformation, helping businesses leverage cutting-edge technology to achieve their goals and stay ahead of the competition."
```

---

## 💰 Cost Information

### **Pricing (as of 2024)**
- **GPT-3.5-turbo**: ~$0.002 per business card generation
- **GPT-4**: ~$0.03 per business card generation

### **Usage Estimates**
- **100 generations/month**: ~$0.20 (GPT-3.5) or ~$3.00 (GPT-4)
- **500 generations/month**: ~$1.00 (GPT-3.5) or ~$15.00 (GPT-4)

### **Recommended Model**
- **Start with GPT-3.5-turbo**: Fast, cost-effective, excellent results
- **Upgrade to GPT-4**: If you need maximum creativity and sophistication

---

## 🔧 Advanced Configuration

### **Model Options**
```env
# Fast and cost-effective (recommended)
VITE_AI_MODEL=gpt-3.5-turbo

# Most advanced (higher cost)
VITE_AI_MODEL=gpt-4

# Latest GPT-4 variant
VITE_AI_MODEL=gpt-4-turbo-preview
```

### **Creativity Settings**
```env
# Conservative (consistent results)
VITE_AI_TEMPERATURE=0.3

# Balanced (recommended)
VITE_AI_TEMPERATURE=0.7

# Creative (more varied results)
VITE_AI_TEMPERATURE=1.0
```

### **Response Length**
```env
# Shorter responses (lower cost)
VITE_AI_MAX_TOKENS=300

# Standard (recommended)
VITE_AI_MAX_TOKENS=500

# Longer responses (higher cost)
VITE_AI_MAX_TOKENS=800
```

---

## 🚨 Troubleshooting

### **Common Issues**

#### **"Provider: Mock AI" still showing**
- ✅ Check `.env.local` exists in project root
- ✅ Verify `VITE_AI_PROVIDER=openai`
- ✅ Restart development server
- ✅ Clear browser cache

#### **"API Key Error"**
- ✅ Check API key is correct (starts with `sk-`)
- ✅ Verify no extra spaces in `.env.local`
- ✅ Check OpenAI account has billing set up
- ✅ Verify API key has proper permissions

#### **"Rate Limit" or "Quota Exceeded"**
- ✅ Check OpenAI usage dashboard
- ✅ Add billing information
- ✅ Increase usage limits
- ✅ Wait a few minutes and try again

#### **"Network Error"**
- ✅ Check internet connection
- ✅ Verify no firewall blocking OpenAI API
- ✅ Try again in a few minutes

### **Fallback Behavior**
If OpenAI fails for any reason, the system automatically falls back to the enhanced mock AI, so your app keeps working!

---

## ✅ Success Checklist

- [ ] Got OpenAI API key from platform.openai.com
- [ ] Created `.env.local` file in project root
- [ ] Added API key to `VITE_OPENAI_API_KEY`
- [ ] Set `VITE_AI_PROVIDER=openai`
- [ ] Restarted development server
- [ ] Verified "Provider: OpenAI" shows in AI Test tab
- [ ] Tested generation and got intelligent results
- [ ] Set up billing in OpenAI account (if needed)

---

## 🎉 You're Ready!

Once setup is complete:

1. **Go to "AI Generator" tab**
2. **Enter detailed business description**
3. **Select industry**
4. **Click "Generate Card"**
5. **Get professional, AI-powered results!**

The AI generator will now use real OpenAI intelligence to create sophisticated, contextual business cards based on your descriptions.

**Need help?** Check the "AI Test" tab to verify your setup and troubleshoot any issues.
