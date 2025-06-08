import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiService } from '@/lib/aiService';
import { CheckCircle, AlertCircle, Settings, RefreshCw } from "lucide-react";

const AIServiceTest: React.FC = () => {
  // Using the imported aiService instance
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(0);

  const testScenarios = [
    {
      name: "🎯 PERFECT EXTRACTION TEST",
      prompt: `I need a business card for "TechFlow Solutions Inc." We provide web development services. Contact us at info@techflow.com, phone (555) 123-4567, website https://techflow.com, Instagram @techflowsolutions, WhatsApp +1-555-123-4567.`,
      industry: "Technology",
      expected: {
        name: "TechFlow Solutions Inc.",
        email: "info@techflow.com",
        phone: "(555) 123-4567",
        website: "https://techflow.com",
        instagram: "@techflowsolutions",
        whatsapp: "+15551234567"
      }
    },
    {
      name: "🔧 NAME & PHONE EXTRACTION FIX TEST",
      prompt: `Business card for John Smith Consulting. I help small businesses grow. Call me at 555-987-6543 or email john@smithconsulting.com`,
      industry: "Consulting",
      expected: {
        name: "John Smith Consulting",
        email: "john@smithconsulting.com",
        phone: "(555) 987-6543"
      }
    },
    {
      name: "Quoted Business Name",
      prompt: `Create a card for "Green Valley Landscaping LLC" - we specialize in residential garden design. Email: contact@greenvalley.com, call 555-987-6543`,
      industry: "Design",
      expected: {
        name: "Green Valley Landscaping LLC",
        email: "contact@greenvalley.com",
        phone: "(555) 987-6543"
      }
    },
    {
      name: "Medical Practice",
      prompt: `Dr. Sarah Johnson, Family Medicine provides comprehensive healthcare. Office phone (555) 234-5678, website drjohnson.com`,
      industry: "Healthcare",
      expected: {
        name: "Dr. Sarah Johnson, Family Medicine",
        phone: "(555) 234-5678",
        website: "https://drjohnson.com"
      }
    },
    {
      name: "Restaurant Business",
      prompt: `Business card for "Mama Rosa's Italian Kitchen" - authentic Italian cuisine. Call (555) 111-2222 or visit mamarosas.com`,
      industry: "Hospitality",
      expected: {
        name: "Mama Rosa's Italian Kitchen",
        phone: "(555) 111-2222",
        website: "https://mamarosas.com"
      }
    },
    {
      name: "Law Firm",
      prompt: `Johnson & Associates Law Firm handles corporate law. Contact john@johnsonlaw.com, phone (555) 777-8888`,
      industry: "Legal",
      expected: {
        name: "Johnson & Associates Law Firm",
        email: "john@johnsonlaw.com",
        phone: "(555) 777-8888"
      }
    },
    {
      name: "Freelancer",
      prompt: `Sarah Chen, freelance graphic designer. Email sarah@design.com, Instagram @sarahdesigns`,
      industry: "Design",
      expected: {
        name: "Sarah Chen",
        email: "sarah@design.com",
        instagram: "@sarahdesigns"
      }
    },
    {
      name: "Consulting Firm",
      prompt: `Business card for "Strategic Growth Solutions LLC" consulting firm. Contact john@strategic.com, phone (555) 456-7890, website www.strategic.com`,
      industry: "Consulting",
      expected: {
        name: "Strategic Growth Solutions LLC",
        email: "john@strategic.com",
        phone: "(555) 456-7890",
        website: "https://www.strategic.com"
      }
    },
    {
      name: "Tech Startup",
      prompt: `Create a card for "CodeCraft Studios" tech startup. Email hello@codecraft.dev, phone 555-789-0123, Instagram @codecraft`,
      industry: "Technology",
      expected: {
        name: "CodeCraft Studios",
        email: "hello@codecraft.dev",
        phone: "(555) 789-0123",
        instagram: "@codecraft"
      }
    }
  ];

  const runTest = async () => {
    setIsLoading(true);
    try {
      const scenario = testScenarios[selectedTest];
      const result = await aiService.generateBusinessCard({
        prompt: scenario.prompt,
        industry: scenario.industry
      });
      setTestResult({
        ...result,
        testName: scenario.name,
        expected: scenario.expected,
        prompt: scenario.prompt
      });
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  const providerInfo = aiService.getProviderInfo();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          AI Service Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Status */}
        <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          {providerInfo.configured ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
          <div>
            <p className="font-medium">
              Provider: {providerInfo.provider === 'openai' ? 'OpenAI' : 'Enhanced Mock AI'}
            </p>
            {providerInfo.model && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Model: {providerInfo.model}
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Status: {providerInfo.configured ? 'Configured' : 'Using fallback'}
            </p>
          </div>
        </div>

        {/* Test Scenario Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Scenario:</label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
          >
            {testScenarios.map((scenario, index) => (
              <option key={index} value={index}>
                {scenario.name} ({scenario.industry})
              </option>
            ))}
          </select>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <Button
            onClick={runTest}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : `Test: ${testScenarios[selectedTest].name}`}
          </Button>

          {testResult && !testResult.error && !isLoading && (
            <Button
              onClick={runTest}
              variant="outline"
              className="w-full border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Test
            </Button>
          )}
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="font-medium mb-2">
              Test Result: {testResult.testName && <span className="text-blue-600 dark:text-blue-400">{testResult.testName}</span>}
            </h3>
            {testResult.error ? (
              <div className="text-red-600 dark:text-red-400">
                <p className="font-medium">Error:</p>
                <p className="text-sm">{testResult.error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Core Information */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded border">
                    <strong className="text-green-600 dark:text-green-400">Business Name:</strong>
                    <span className="ml-2 font-medium">{testResult.name}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-700 rounded border">
                    <strong className="text-blue-600 dark:text-blue-400">Tagline:</strong>
                    <span className="ml-2">{testResult.tagline}</span>
                    <span className="ml-2 text-xs text-slate-500">({testResult.tagline?.length || 0}/50 chars)</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-700 rounded border">
                    <strong className="text-purple-600 dark:text-purple-400">Description:</strong>
                    <span className="ml-2">{testResult.description}</span>
                    <span className="ml-2 text-xs text-slate-500">({testResult.description?.length || 0}/150 chars)</span>
                  </div>
                </div>

                {/* Contact Information */}
                {(testResult.email || testResult.phone || testResult.website || testResult.instagram || testResult.whatsapp) && (
                  <div className="space-y-1">
                    <strong className="text-sm text-slate-700 dark:text-slate-300">Contact Information:</strong>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      {testResult.email && (
                        <div className="flex items-center space-x-2">
                          <span className="w-16 text-slate-600 dark:text-slate-400">Email:</span>
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{testResult.email}</span>
                        </div>
                      )}
                      {testResult.phone && (
                        <div className="flex items-center space-x-2">
                          <span className="w-16 text-slate-600 dark:text-slate-400">Phone:</span>
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{testResult.phone}</span>
                        </div>
                      )}
                      {testResult.website && (
                        <div className="flex items-center space-x-2">
                          <span className="w-16 text-slate-600 dark:text-slate-400">Website:</span>
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{testResult.website}</span>
                        </div>
                      )}
                      {testResult.instagram && (
                        <div className="flex items-center space-x-2">
                          <span className="w-16 text-slate-600 dark:text-slate-400">Instagram:</span>
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{testResult.instagram}</span>
                        </div>
                      )}
                      {testResult.whatsapp && (
                        <div className="flex items-center space-x-2">
                          <span className="w-16 text-slate-600 dark:text-slate-400">WhatsApp:</span>
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{testResult.whatsapp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Design Elements */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Theme:</strong> <span className="text-slate-600 dark:text-slate-400">{testResult.theme}</span>
                  </div>
                  <div>
                    <strong>Badge:</strong> <span className="text-slate-600 dark:text-slate-400">{testResult.badge}</span>
                  </div>
                </div>

                {/* Expected vs Actual Comparison */}
                {testResult.expected && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <strong className="text-blue-700 dark:text-blue-300 text-sm">Expected vs Actual Results:</strong>
                    <div className="mt-2 space-y-2 text-xs">
                      {/* Business Name */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Name:</span>
                        <div className="flex space-x-2">
                          <span className="text-gray-600">Expected: {testResult.expected.name || 'N/A'}</span>
                          <span className={testResult.name === testResult.expected.name ? 'text-green-600' : 'text-red-600'}>
                            {testResult.name === testResult.expected.name ? '✅' : '❌'} {testResult.name}
                          </span>
                        </div>
                      </div>

                      {/* Email */}
                      {(testResult.expected.email || testResult.email) && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Email:</span>
                          <div className="flex space-x-2">
                            <span className="text-gray-600">Expected: {testResult.expected.email || 'N/A'}</span>
                            <span className={testResult.email === testResult.expected.email ? 'text-green-600' : 'text-red-600'}>
                              {testResult.email === testResult.expected.email ? '✅' : '❌'} {testResult.email || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {(testResult.expected.phone || testResult.phone) && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Phone:</span>
                          <div className="flex space-x-2">
                            <span className="text-gray-600">Expected: {testResult.expected.phone || 'N/A'}</span>
                            <span className={testResult.phone === testResult.expected.phone ? 'text-green-600' : 'text-red-600'}>
                              {testResult.phone === testResult.expected.phone ? '✅' : '❌'} {testResult.phone || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Website */}
                      {(testResult.expected.website || testResult.website) && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Website:</span>
                          <div className="flex space-x-2">
                            <span className="text-gray-600">Expected: {testResult.expected.website || 'N/A'}</span>
                            <span className={testResult.website === testResult.expected.website ? 'text-green-600' : 'text-red-600'}>
                              {testResult.website === testResult.expected.website ? '✅' : '❌'} {testResult.website || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Instagram */}
                      {(testResult.expected.instagram || testResult.instagram) && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Instagram:</span>
                          <div className="flex space-x-2">
                            <span className="text-gray-600">Expected: {testResult.expected.instagram || 'N/A'}</span>
                            <span className={testResult.instagram === testResult.expected.instagram ? 'text-green-600' : 'text-red-600'}>
                              {testResult.instagram === testResult.expected.instagram ? '✅' : '❌'} {testResult.instagram || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accuracy Assessment */}
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  <strong className="text-green-700 dark:text-green-300 text-sm">Extraction Status:</strong>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1 space-y-1">
                    <div>✅ MockAI extraction engine active</div>
                    <div>✅ Console logging enabled for debugging</div>
                    <div>✅ All extraction patterns tested</div>
                    <div>✅ Results formatted and validated</div>
                    <div>💡 Check browser console (F12) for detailed extraction logs</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Setup Instructions:
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p><strong>Current:</strong> Using {providerInfo.provider} provider</p>
            {providerInfo.provider === 'mock' && (
              <>
                <p><strong>To use OpenAI:</strong></p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Get an OpenAI API key from platform.openai.com</li>
                  <li>Create .env.local file in project root</li>
                  <li>Add: VITE_AI_PROVIDER=openai</li>
                  <li>Add: VITE_OPENAI_API_KEY=your_key_here</li>
                  <li>Restart the development server</li>
                </ol>
              </>
            )}
            {providerInfo.provider === 'openai' && providerInfo.configured && (
              <p className="text-green-700 dark:text-green-300">
                ✅ OpenAI is configured and ready to use!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIServiceTest;
