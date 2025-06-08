
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Link, Copy, Share2, MessageSquare, Facebook, Twitter, Linkedin } from "lucide-react";
import { BusinessCard } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import QRCodeGenerator from './QRCodeGenerator';
import { shareService } from '@/lib/shareService';

interface ShareModalProps {
  card: BusinessCard;
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ card, isOpen, onClose }) => {
  const { toast } = useToast();
  const [cardUrl, setCardUrl] = React.useState('');

  React.useEffect(() => {
    // Share the card and get the URL
    try {
      const sharedCard = shareService.shareCard(card);
      setCardUrl(sharedCard.shareUrl);
      console.log('📤 Card shared with SEO URL:', sharedCard.shareUrl);
    } catch (error) {
      console.error('Error sharing card:', error);
      // Fallback to basic URL
      setCardUrl(`${window.location.origin}/view/${card.id}`);
    }
  }, [card]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
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
    const socialUrls = shareService.generateSocialUrls(card, cardUrl);
    const url = socialUrls[platform as keyof typeof socialUrls];

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-montserrat text-slate-900 dark:text-white">Share Your Card</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Share this business card with others using the link or QR code.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-5">
          {/* Real QR Code */}
          <QRCodeGenerator
            value={cardUrl}
            size={180}
            className="bg-white p-2 rounded-lg shadow-sm"
          />

          <div className="text-sm text-center text-slate-500 dark:text-slate-400 font-medium">
            Scan this QR code to instantly access this business card
          </div>
        </div>

        <div className="space-y-4">
          {/* Share Link */}
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={cardUrl}
                readOnly
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <Button
              size="icon"
              onClick={copyToClipboard}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>

          {/* Social Sharing */}
          <div className="space-y-2">
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
          </div>
        </div>

        <DialogFooter className="sm:justify-start mt-4">
          <div className="w-full flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
