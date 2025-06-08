import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, TestTube } from "lucide-react";
import { BusinessCard } from '@/types/types';
import ShareModal from '@/components/ShareModal';
import { useToast } from '@/hooks/use-toast';

const ShareButtonTest: React.FC = () => {
  const { toast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);

  // Test business card data
  const testCard: BusinessCard = {
    id: 'test-card-123',
    name: 'John Smith',
    tagline: 'Digital Marketing Expert',
    description: 'Helping businesses grow through innovative digital strategies.',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://johnsmith.com',
    instagram: 'johnsmith',
    whatsapp: '+15551234567',
    theme: 'minimalist-black-gold',
    badge: 'premium'
  };

  const handleShareClick = () => {
    console.log('🔄 Share button clicked in test component');
    toast({
      title: "Share Button Clicked",
      description: "Opening share modal...",
    });
    setShowShareModal(true);
  };

  const handleCloseModal = () => {
    console.log('❌ Share modal closed');
    setShowShareModal(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="w-5 h-5 text-blue-500" />
          <span>Share Button Test</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Test the share button functionality:</p>
        </div>

        {/* Test Share Button */}
        <Button
          onClick={handleShareClick}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Test Share Button</span>
        </Button>

        {/* Status */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Modal State: {showShareModal ? '✅ Open' : '❌ Closed'}</div>
          <div>Test Card: {testCard.name}</div>
          <div>Check console for debug logs</div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm">
          <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
            Test Steps:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
            <li>Click "Test Share Button"</li>
            <li>ShareModal should open</li>
            <li>Try QR code generation</li>
            <li>Test social sharing buttons</li>
            <li>Check console for any errors</li>
          </ol>
        </div>
      </CardContent>

      {/* Share Modal */}
      <ShareModal
        card={testCard}
        isOpen={showShareModal}
        onClose={handleCloseModal}
      />
    </Card>
  );
};

export default ShareButtonTest;
