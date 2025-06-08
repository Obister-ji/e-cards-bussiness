import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Download, RefreshCw, Image } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { 
  generateFaviconFromLogo, 
  applyFaviconToPage, 
  downloadFavicon,
  FaviconUrls 
} from '@/utils/faviconGenerator';

const FaviconSetup: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [faviconUrls, setFaviconUrls] = useState<FaviconUrls | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  // Logo path - using the logo from the logo folder
  const logoPath = '/logo/logo.jpeg';

  const generateFavicons = async () => {
    setIsGenerating(true);
    
    try {
      // Convert relative path to absolute URL for the image
      const logoUrl = new URL(logoPath, window.location.origin).href;
      
      toast({
        title: "Generating Favicons",
        description: "Converting your logo to favicon formats...",
      });

      const favicons = await generateFaviconFromLogo(logoUrl);
      setFaviconUrls(favicons);
      
      toast({
        title: "Favicons Generated",
        description: "All favicon sizes have been generated successfully!",
      });
      
    } catch (error) {
      console.error('Favicon generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate favicons. Please check if the logo file exists.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyFavicons = () => {
    if (!faviconUrls) return;
    
    try {
      applyFaviconToPage(faviconUrls);
      setIsApplied(true);
      
      toast({
        title: "Favicon Applied",
        description: "Your logo is now the website favicon! Check the browser tab.",
      });
      
    } catch (error) {
      console.error('Favicon application error:', error);
      toast({
        title: "Application Failed",
        description: "Failed to apply favicon to the page.",
        variant: "destructive",
      });
    }
  };

  const downloadAllFavicons = () => {
    if (!faviconUrls) return;
    
    const downloads = [
      { url: faviconUrls.ico, name: 'favicon.ico' },
      { url: faviconUrls.png16, name: 'favicon-16x16.png' },
      { url: faviconUrls.png32, name: 'favicon-32x32.png' },
      { url: faviconUrls.png48, name: 'favicon-48x48.png' },
      { url: faviconUrls.png64, name: 'favicon-64x64.png' },
      { url: faviconUrls.png128, name: 'favicon-128x128.png' },
      { url: faviconUrls.png256, name: 'favicon-256x256.png' },
      { url: faviconUrls.png512, name: 'favicon-512x512.png' },
      { url: faviconUrls.appleTouchIcon, name: 'apple-touch-icon.png' },
    ];
    
    downloads.forEach(({ url, name }, index) => {
      setTimeout(() => {
        downloadFavicon(url, name);
      }, index * 200); // Stagger downloads
    });
    
    toast({
      title: "Downloading Favicons",
      description: "All favicon files are being downloaded...",
    });
  };

  // Auto-generate on component mount
  useEffect(() => {
    generateFavicons();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Image className="w-4 h-4 text-white" />
          </div>
          <span>Favicon Setup</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Logo Preview */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <img 
              src={logoPath} 
              alt="Logo" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                console.error('Logo failed to load:', logoPath);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Source Logo: {logoPath}
          </p>
        </div>

        {/* Status */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div><strong>Status:</strong> {isApplied ? '✅ Applied to website' : '⏳ Ready to apply'}</div>
              <div><strong>Generated:</strong> {faviconUrls ? '✅ All sizes created' : '⏳ Generating...'}</div>
              <div><strong>Formats:</strong> ICO, PNG (16x16 to 512x512), Apple Touch Icon</div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Favicon Preview */}
        {faviconUrls && (
          <div className="space-y-4">
            <h3 className="font-medium">Generated Favicons:</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { size: '16x16', url: faviconUrls.png16 },
                { size: '32x32', url: faviconUrls.png32 },
                { size: '48x48', url: faviconUrls.png48 },
                { size: '64x64', url: faviconUrls.png64 },
              ].map(({ size, url }) => (
                <div key={size} className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center mx-auto">
                    <img src={url} alt={`Favicon ${size}`} className="max-w-full max-h-full" />
                  </div>
                  <p className="text-xs text-gray-500">{size}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={generateFavicons}
            disabled={isGenerating}
            variant="outline"
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>

          <Button
            onClick={applyFavicons}
            disabled={!faviconUrls || isGenerating}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isApplied ? 'Applied ✅' : 'Apply to Website'}
          </Button>

          <Button
            onClick={downloadAllFavicons}
            disabled={!faviconUrls || isGenerating}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>

        {/* Instructions */}
        <Alert>
          <Image className="h-4 w-4" />
          <AlertDescription>
            <div className="text-sm space-y-2">
              <div><strong>How it works:</strong></div>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Logo is automatically converted to multiple favicon sizes</li>
                <li>Click "Apply to Website" to use as favicon immediately</li>
                <li>Click "Download All" to get files for production deployment</li>
                <li>Check your browser tab to see the new favicon!</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>

        {/* Technical Details */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div><strong>Generated Formats:</strong></div>
          <div>• ICO: 32x32 (legacy browsers)</div>
          <div>• PNG: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512</div>
          <div>• Apple Touch Icon: 256x256 (iOS devices)</div>
          <div>• Android Chrome: 192x192, 512x512 (PWA support)</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaviconSetup;
