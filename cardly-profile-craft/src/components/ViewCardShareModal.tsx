import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, MessageSquare, Facebook, Twitter, Linkedin, Mail, QrCode } from "lucide-react";
import { BusinessCard } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import QRCodeGenerator from './QRCodeGenerator';

interface ViewCardShareModalProps {
  card: BusinessCard;
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ViewCardShareModal: React.FC<ViewCardShareModalProps> = ({ 
  card, 
  isOpen, 
  onClose, 
  shareUrl 
}) => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Business card link copied to clipboard successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out ${card.name}'s digital business card`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);
    
    let url = '';

    switch(platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`Business Card - ${card.name}`)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  const useNativeShare = async () => {
    const shareData = {
      title: `${card.name} - Business Card`,
      text: `Check out ${card.name}'s digital business card`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Business card shared successfully.",
        });
      } else {
        // Fallback to copy
        await copyToClipboard();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share Failed",
          description: "Failed to share. Link copied to clipboard instead.",
          variant: "destructive",
        });
        await copyToClipboard();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-primary" />
            <span>Share Business Card</span>
          </DialogTitle>
          <DialogDescription>
            Share {card.name}'s business card with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex space-x-2">
            {navigator.share && (
              <Button
                onClick={useNativeShare}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            )}
            <Button
              onClick={() => setShowQR(!showQR)}
              variant="outline"
              className="flex-1"
            >
              <QrCode className="mr-2 h-4 w-4" />
              {showQR ? 'Hide QR' : 'Show QR'}
            </Button>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="flex flex-col items-center space-y-3 py-4">
              <QRCodeGenerator 
                value={shareUrl} 
                size={160}
                className="bg-white p-2 rounded-lg shadow-sm"
              />
              <p className="text-xs text-gray-500 text-center">
                Scan to view business card instantly
              </p>
            </div>
          )}

          {/* Share Link */}
          <div className="space-y-2">
            <Label htmlFor="share-link" className="text-sm font-medium">
              Share Link
            </Label>
            <div className="flex space-x-2">
              <Input
                id="share-link"
                value={shareUrl}
                readOnly
                className="flex-1 text-sm"
                placeholder="Generating share link..."
              />
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Share on Social Media
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => shareToSocial('whatsapp')}
                variant="outline"
                className="flex items-center justify-center space-x-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
              <Button
                onClick={() => shareToSocial('linkedin')}
                variant="outline"
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </Button>
              <Button
                onClick={() => shareToSocial('twitter')}
                variant="outline"
                className="flex items-center justify-center space-x-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </Button>
              <Button
                onClick={() => shareToSocial('facebook')}
                variant="outline"
                className="flex items-center justify-center space-x-2 text-blue-800 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </Button>
            </div>
            
            {/* Email Share */}
            <Button
              onClick={() => shareToSocial('email')}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
            >
              <Mail className="w-4 h-4" />
              <span>Share via Email</span>
            </Button>
          </div>

          {/* Card Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {card.name}
              </div>
              {card.tagline && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {card.tagline}
                </div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Digital Business Card
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Anyone with this link can view the business card. 
            The card will open in their browser with full contact information.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCardShareModal;
