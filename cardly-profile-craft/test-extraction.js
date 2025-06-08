// Simple test to verify extraction logic
const testPrompt = `I need a business card for "TechFlow Solutions Inc." We provide web development services. Contact us at info@techflow.com, phone (555) 123-4567, website https://techflow.com, Instagram @techflowsolutions.`;

console.log('Testing extraction with prompt:', testPrompt);

// Test business name extraction
function extractBusinessName(prompt) {
  console.log('\n🔍 Testing business name extraction...');
  
  // Quoted names (highest priority)
  const quotedMatch = prompt.match(/"([^"]{2,60})"/);
  if (quotedMatch) {
    console.log('✅ Found quoted name:', quotedMatch[1]);
    return quotedMatch[1];
  }
  
  // Explicit declarations
  const explicitMatch = prompt.match(/(?:for|called|named)\s+([^.,;!?\n]{2,60})/i);
  if (explicitMatch) {
    console.log('✅ Found explicit name:', explicitMatch[1]);
    return explicitMatch[1];
  }
  
  console.log('❌ No business name found');
  return 'Professional Business';
}

// Test email extraction
function extractEmail(prompt) {
  console.log('\n🔍 Testing email extraction...');
  
  const emailMatch = prompt.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/);
  if (emailMatch) {
    console.log('✅ Found email:', emailMatch[1]);
    return emailMatch[1];
  }
  
  console.log('❌ No email found');
  return undefined;
}

// Test phone extraction
function extractPhone(prompt) {
  console.log('\n🔍 Testing phone extraction...');
  
  const phoneMatch = prompt.match(/\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/);
  if (phoneMatch) {
    console.log('✅ Found phone:', phoneMatch[0]);
    return phoneMatch[0];
  }
  
  console.log('❌ No phone found');
  return undefined;
}

// Test website extraction
function extractWebsite(prompt) {
  console.log('\n🔍 Testing website extraction...');
  
  const websiteMatch = prompt.match(/https?:\/\/[^\s,]+|www\.[^\s,]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/);
  if (websiteMatch) {
    let website = websiteMatch[0];
    if (!website.startsWith('http')) {
      website = 'https://' + website;
    }
    console.log('✅ Found website:', website);
    return website;
  }
  
  console.log('❌ No website found');
  return undefined;
}

// Test Instagram extraction
function extractInstagram(prompt) {
  console.log('\n🔍 Testing Instagram extraction...');
  
  const instagramMatch = prompt.match(/@([a-zA-Z0-9._]{1,30})/);
  if (instagramMatch) {
    console.log('✅ Found Instagram:', '@' + instagramMatch[1]);
    return '@' + instagramMatch[1];
  }
  
  console.log('❌ No Instagram found');
  return undefined;
}

// Run all tests
const results = {
  name: extractBusinessName(testPrompt),
  email: extractEmail(testPrompt),
  phone: extractPhone(testPrompt),
  website: extractWebsite(testPrompt),
  instagram: extractInstagram(testPrompt)
};

console.log('\n📊 EXTRACTION RESULTS:');
console.log('Name:', results.name);
console.log('Email:', results.email);
console.log('Phone:', results.phone);
console.log('Website:', results.website);
console.log('Instagram:', results.instagram);

console.log('\n✅ Expected Results:');
console.log('Name: TechFlow Solutions Inc.');
console.log('Email: info@techflow.com');
console.log('Phone: (555) 123-4567');
console.log('Website: https://techflow.com');
console.log('Instagram: @techflowsolutions');
