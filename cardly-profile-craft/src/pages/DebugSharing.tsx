import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusinessCard } from '@/types/types';
import { shareService } from '@/lib/shareService';
import { useToast } from '@/hooks/use-toast';

const DebugSharing: React.FC = () => {
  const { toast } = useToast();
  const [testCardId, setTestCardId] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});

  const refreshDebugInfo = () => {
    const sharedCards = localStorage.getItem('sharedBusinessCards');
    const sharedCardsBySlug = localStorage.getItem('sharedCardsBySlug');
    const businessCards = localStorage.getItem('businessCards');

    setDebugInfo({
      sharedCards: sharedCards ? JSON.parse(sharedCards) : null,
      sharedCardsBySlug: sharedCardsBySlug ? JSON.parse(sharedCardsBySlug) : null,
      businessCards: businessCards ? JSON.parse(businessCards) : null,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  useEffect(() => {
    refreshDebugInfo();
  }, []);

  const createTestCard = () => {
    const testCard: BusinessCard = {
      id: `test-card-${Date.now()}`,
      name: 'Test Company Inc',
      tagline: 'Testing Cross-Browser Sharing',
      description: 'This is a test card for debugging sharing functionality.',
      email: 'test@example.com',
      phone: '+1 (555) 123-4567',
      website: 'https://test.com',
      theme: 'minimalist-black-gold',
      badge: 'premium'
    };

    // Save to businessCards
    const existingCards = localStorage.getItem('businessCards');
    const cards = existingCards ? JSON.parse(existingCards) : [];
    cards.push(testCard);
    localStorage.setItem('businessCards', JSON.stringify(cards));

    // Share the card
    const sharedCard = shareService.shareCard(testCard);
    
    setTestCardId(testCard.id);
    refreshDebugInfo();

    toast({
      title: "Test Card Created",
      description: `Card ID: ${testCard.id}\nShare URL: ${sharedCard.shareUrl}`,
    });

    console.log('🧪 Test card created:', testCard);
    console.log('📤 Test card shared:', sharedCard);
  };

  const testCardLookup = () => {
    if (!testCardId) {
      toast({
        title: "No Test Card",
        description: "Create a test card first",
        variant: "destructive",
      });
      return;
    }

    console.log('🔍 Testing card lookup for ID:', testCardId);
    const foundCard = shareService.getSharedCard(testCardId);
    
    if (foundCard) {
      toast({
        title: "Card Found!",
        description: `Found card: ${foundCard.card.name}`,
      });
      console.log('✅ Card found:', foundCard);
    } else {
      toast({
        title: "Card Not Found",
        description: "Card lookup failed",
        variant: "destructive",
      });
      console.log('❌ Card not found');
    }

    refreshDebugInfo();
  };

  const clearAllData = () => {
    localStorage.removeItem('sharedBusinessCards');
    localStorage.removeItem('sharedCardsBySlug');
    localStorage.removeItem('businessCards');
    setTestCardId('');
    refreshDebugInfo();
    
    toast({
      title: "Data Cleared",
      description: "All localStorage data has been cleared",
    });
  };

  const testShareUrl = () => {
    if (!testCardId) {
      toast({
        title: "No Test Card",
        description: "Create a test card first",
        variant: "destructive",
      });
      return;
    }

    const sharedCard = shareService.getSharedCard(testCardId);
    if (sharedCard) {
      const url = sharedCard.shareUrl;
      window.open(url, '_blank');
      
      toast({
        title: "Opening Share URL",
        description: url,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Sharing Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={createTestCard} className="w-full">
              Create Test Card
            </Button>
            <Button onClick={testCardLookup} variant="outline" className="w-full">
              Test Card Lookup
            </Button>
            <Button onClick={testShareUrl} variant="outline" className="w-full">
              Open Share URL
            </Button>
            <Button onClick={clearAllData} variant="destructive" className="w-full">
              Clear All Data
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-card-id">Current Test Card ID:</Label>
            <Input
              id="test-card-id"
              value={testCardId}
              readOnly
              placeholder="No test card created yet"
            />
          </div>

          <Button onClick={refreshDebugInfo} variant="outline" className="w-full">
            Refresh Debug Info
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 Debug Information</CardTitle>
          <p className="text-sm text-gray-500">Last updated: {debugInfo.timestamp}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Business Cards:</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.businessCards, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Shared Cards (by ID):</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.sharedCards, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Shared Cards (by Slug):</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.sharedCardsBySlug, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Create Test Card</strong> - Creates a test business card and shares it</li>
            <li><strong>Test Card Lookup</strong> - Tests if the card can be found by ID</li>
            <li><strong>Open Share URL</strong> - Opens the share URL in a new tab</li>
            <li><strong>Check Console</strong> - Look at browser console for detailed logs</li>
            <li><strong>Test Cross-Browser</strong> - Copy share URL and test in different browser</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugSharing;
