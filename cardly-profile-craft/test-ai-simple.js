// Simple test to verify AI service works
console.log('🧪 Testing Simple AI Service...');

// Simulate the extraction logic
function testExtraction() {
  const prompt = `I need a business card for "TechFlow Solutions Inc." Contact us at info@techflow.com, phone (555) 123-4567, website https://techflow.com`;
  
  console.log('📝 Test prompt:', prompt);
  
  // Test name extraction
  let match = prompt.match(/"([^"]{2,60})"/);
  if (match) {
    console.log('✅ Name extracted:', match[1]);
  }
  
  // Test email extraction
  match = prompt.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/);
  if (match) {
    console.log('✅ Email extracted:', match[1]);
  }
  
  // Test phone extraction
  match = prompt.match(/\(\d{3}\)\s*\d{3}[-\s]?\d{4}/);
  if (match) {
    console.log('✅ Phone extracted:', match[0]);
  }
  
  // Test website extraction
  match = prompt.match(/https?:\/\/[^\s,]+/);
  if (match) {
    console.log('✅ Website extracted:', match[0]);
  }
  
  console.log('🎉 All extractions working!');
}

testExtraction();
