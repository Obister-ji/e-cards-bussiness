#!/usr/bin/env node

/**
 * OpenAI Setup Verification Script
 * Run this to check if your OpenAI configuration is correct
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying OpenAI Setup...\n');

// Check if .env.local exists
const envPath = '.env.local';
const envExists = fs.existsSync(envPath);

console.log(`📁 Environment file (.env.local): ${envExists ? '✅ Found' : '❌ Missing'}`);

if (!envExists) {
  console.log('\n❌ Setup incomplete!');
  console.log('📋 Next steps:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Add your OpenAI API key');
  console.log('3. Run this script again');
  console.log('\nCommand: cp .env.example .env.local');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Check required variables
const checks = [
  {
    key: 'VITE_AI_PROVIDER',
    expected: 'openai',
    description: 'AI Provider'
  },
  {
    key: 'VITE_OPENAI_API_KEY',
    expected: /^sk-[a-zA-Z0-9-_]+$/,
    description: 'OpenAI API Key'
  },
  {
    key: 'VITE_AI_MODEL',
    expected: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'],
    description: 'AI Model'
  }
];

let allGood = true;

console.log('\n🔧 Configuration Check:');

checks.forEach(check => {
  const value = envVars[check.key];
  let status = '❌';
  let message = 'Missing';

  if (value) {
    if (typeof check.expected === 'string') {
      if (value === check.expected) {
        status = '✅';
        message = value;
      } else {
        status = '⚠️';
        message = `Expected "${check.expected}", got "${value}"`;
        allGood = false;
      }
    } else if (check.expected instanceof RegExp) {
      if (check.expected.test(value)) {
        status = '✅';
        message = `${value.substring(0, 10)}...`;
      } else {
        status = '❌';
        message = 'Invalid format';
        allGood = false;
      }
    } else if (Array.isArray(check.expected)) {
      if (check.expected.includes(value)) {
        status = '✅';
        message = value;
      } else {
        status = '⚠️';
        message = `Expected one of: ${check.expected.join(', ')}`;
        allGood = false;
      }
    }
  } else {
    allGood = false;
  }

  console.log(`${status} ${check.description}: ${message}`);
});

// Additional checks
console.log('\n🔍 Additional Checks:');

// Check if API key looks like placeholder
const apiKey = envVars['VITE_OPENAI_API_KEY'];
if (apiKey && (apiKey.includes('your_openai_api_key_here') || apiKey.includes('your-actual-api-key-here'))) {
  console.log('❌ API Key: Still using placeholder value');
  allGood = false;
} else if (apiKey && apiKey.startsWith('sk-')) {
  console.log('✅ API Key: Format looks correct');
} else {
  console.log('❌ API Key: Invalid or missing');
  allGood = false;
}

// Check temperature value
const temperature = envVars['VITE_AI_TEMPERATURE'];
if (temperature) {
  const temp = parseFloat(temperature);
  if (temp >= 0 && temp <= 1) {
    console.log(`✅ Temperature: ${temperature} (valid range)`);
  } else {
    console.log(`⚠️ Temperature: ${temperature} (should be 0.0-1.0)`);
  }
} else {
  console.log('⚠️ Temperature: Not set (will use default)');
}

// Check timeout value
const timeout = envVars['VITE_AI_TIMEOUT'];
if (timeout) {
  const timeoutMs = parseInt(timeout);
  if (timeoutMs > 0 && timeoutMs <= 120000) {
    console.log(`✅ Timeout: ${timeout}ms (${timeoutMs/1000}s)`);
  } else {
    console.log(`⚠️ Timeout: ${timeout}ms (should be 1000-120000)`);
  }
} else {
  console.log('⚠️ Timeout: Not set (will use 30s default)');
}

// Check fallback mode
const fallbackMode = envVars['VITE_AI_FALLBACK_MODE'];
if (fallbackMode) {
  if (['mock', 'error'].includes(fallbackMode)) {
    console.log(`✅ Fallback Mode: ${fallbackMode}`);
  } else {
    console.log(`⚠️ Fallback Mode: ${fallbackMode} (should be 'mock' or 'error')`);
  }
} else {
  console.log('⚠️ Fallback Mode: Not set (will use mock default)');
}

// Check debug logging
const debugLogging = envVars['VITE_AI_DEBUG_LOGGING'];
if (debugLogging) {
  if (['true', 'false'].includes(debugLogging)) {
    console.log(`✅ Debug Logging: ${debugLogging}`);
  } else {
    console.log(`⚠️ Debug Logging: ${debugLogging} (should be 'true' or 'false')`);
  }
} else {
  console.log('⚠️ Debug Logging: Not set (will use false default)');
}

// Check max tokens
const maxTokens = envVars['VITE_AI_MAX_TOKENS'];
if (maxTokens) {
  const tokens = parseInt(maxTokens);
  if (tokens > 0 && tokens <= 4000) {
    console.log(`✅ Max Tokens: ${maxTokens}`);
  } else {
    console.log(`⚠️ Max Tokens: ${maxTokens} (should be 1-4000)`);
  }
} else {
  console.log('⚠️ Max Tokens: Not set (will use default)');
}

// Final result
console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Setup Complete!');
  console.log('\n✅ Your OpenAI configuration looks good!');
  console.log('\n📋 Next steps:');
  console.log('1. Restart your development server: bun run dev');
  console.log('2. Go to the "AI Test" tab in your app');
  console.log('3. Look for "Provider: OpenAI" with green checkmark');
  console.log('4. Test the AI generation');
  console.log('\n🚀 You\'re ready to use real AI generation!');
} else {
  console.log('❌ Setup Issues Found');
  console.log('\n📋 To fix:');
  console.log('1. Check the issues marked with ❌ or ⚠️ above');
  console.log('2. Edit your .env.local file');
  console.log('3. Run this script again');
  console.log('\n💡 Need help? Check setup-openai.md for detailed instructions');
}

console.log('\n📚 Resources:');
console.log('• OpenAI API Keys: https://platform.openai.com/api-keys');
console.log('• Setup Guide: ./setup-openai.md');
console.log('• Accuracy Guide: ./AI_ACCURACY_IMPROVEMENTS.md');
console.log('• Billing Setup: https://platform.openai.com/account/billing');

if (allGood) {
  console.log('\n🎯 Next Steps:');
  console.log('1. Test the enhanced AI accuracy using the "AI Test" tab');
  console.log('2. Try the 5 different test scenarios to see accuracy improvements');
  console.log('3. Generate real business cards with the "AI Generator" tab');
  console.log('4. Check the accuracy assessment in test results');
}
