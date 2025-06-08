import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import FaviconSetup from '@/components/FaviconSetup';

const FaviconTest: React.FC = () => {
  const navigate = useNavigate();

  const openInNewTab = () => {
    window.open(window.location.origin, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Button
            onClick={openInNewTab}
            variant="outline"
            className="flex items-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Favicon Setup & Test
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Convert your logo to favicon and apply it to the website
          </p>
        </div>

        {/* Instructions */}
        <Alert>
          <Download className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div><strong>How to test the favicon:</strong></div>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Click "Apply to Website" below to set the favicon</li>
                <li>Look at your browser tab - you should see your logo instead of the default icon</li>
                <li>Click "Open in New Tab" to test in a fresh tab</li>
                <li>The favicon will persist across page refreshes and navigation</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>

        {/* Favicon Setup Component */}
        <FaviconSetup />

        {/* Current Favicon Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Browser Tab Favicon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Look at your browser tab to see the current favicon. After applying the new favicon, 
                you should see your logo instead of the default browser icon.
              </div>
              
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <p className="text-xs text-gray-500">Before</p>
                  <p className="text-xs">Default Icon</p>
                </div>
                
                <div className="flex items-center">
                  <span className="text-2xl">→</span>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                    <img 
                      src="/logo/logo.jpeg" 
                      alt="Your Logo" 
                      className="w-12 h-12 object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.textContent = '❌ Logo not found';
                      }}
                    />
                    <span className="text-xs text-red-500 hidden">❌ Logo not found</span>
                  </div>
                  <p className="text-xs text-gray-500">After</p>
                  <p className="text-xs">Your Logo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong>Logo Source:</strong> <code>/logo/logo.jpeg</code>
              </div>
              
              <div>
                <strong>Generated Formats:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>ICO format for legacy browser support</li>
                  <li>PNG formats: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512</li>
                  <li>Apple Touch Icon for iOS devices</li>
                  <li>Android Chrome icons for PWA support</li>
                </ul>
              </div>
              
              <div>
                <strong>HTML Meta Tags:</strong>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="theme-color" content="#000000">`}
                </pre>
              </div>
              
              <div>
                <strong>Browser Support:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>✅ Chrome/Edge</div>
                  <div>✅ Firefox</div>
                  <div>✅ Safari</div>
                  <div>✅ Mobile browsers</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Your logo will appear as the website favicon in browser tabs, bookmarks, and browser history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaviconTest;
