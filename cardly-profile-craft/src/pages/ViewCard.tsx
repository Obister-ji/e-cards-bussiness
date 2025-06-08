import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Eye } from "lucide-react";
import { BusinessCard } from '@/types/types';
import CardPreview from '@/components/CardPreview';
import { downloadVCard } from '@/lib/cardUtils';
import { useToast } from '@/hooks/use-toast';
import { shareService } from '@/lib/shareService';
import ViewCardShareModal from '@/components/ViewCardShareModal';
import ViewCountAnalytics from '@/components/ViewCountAnalytics';

const ViewCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const loadCard = async () => {
      if (!id) {
        setError('No card ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Loading card with identifier:', id);
        console.log('🔍 Current URL:', window.location.href);

        // Check if card data is embedded in URL (cross-browser sharing)
        const encodedData = searchParams.get('data');
        if (encodedData) {
          console.log('📦 Found encoded card data in URL');
          const decodedCard = shareService.decodeCardFromUrl(encodedData);

          if (decodedCard) {
            console.log('✅ Successfully decoded card from URL:', decodedCard.name);

            // Get view count from URL or increment existing count
            const urlViewCount = parseInt(searchParams.get('views') || '0');
            const currentViewCount = shareService.getViewCount(decodedCard.id);

            // Set the higher count (URL count or existing count)
            shareService.setViewCount(decodedCard.id, Math.max(urlViewCount, currentViewCount));

            // Increment view count for this visit
            const newViewCount = shareService.incrementViewCount(decodedCard.id);

            setCard(decodedCard);
            setViewCount(newViewCount);

            console.log('👀 View count updated:', {
              urlCount: urlViewCount,
              existingCount: currentViewCount,
              newCount: newViewCount
            });

            // Save to localStorage for future access
            const sharedCard = shareService.shareCard(decodedCard);
            console.log('💾 Card saved to localStorage for future access');

            // Clean up URL (remove data parameter)
            const cleanUrl = `/view/${sharedCard.slug}`;
            window.history.replaceState(null, '', cleanUrl);

            return; // Exit early, we found the card
          } else {
            console.log('❌ Failed to decode card data from URL');
          }
        }

        // Debug: Check what's in localStorage
        const sharedCards = localStorage.getItem('sharedBusinessCards');
        const sharedCardsBySlug = localStorage.getItem('sharedCardsBySlug');
        const businessCards = localStorage.getItem('businessCards');

        console.log('📦 SharedCards in localStorage:', sharedCards ? JSON.parse(sharedCards) : 'None');
        console.log('📦 SharedCardsBySlug in localStorage:', sharedCardsBySlug ? JSON.parse(sharedCardsBySlug) : 'None');
        console.log('📦 BusinessCards in localStorage:', businessCards ? JSON.parse(businessCards) : 'None');

        // Try to get shared card (supports both slug and ID)
        const sharedCard = shareService.getSharedCard(id);

        if (sharedCard) {
          console.log('✅ Found shared card:', sharedCard.slug);
          setCard(sharedCard.card);
          setViewCount(sharedCard.viewCount);
        } else {
          console.log('❌ Card not found in shared cards, checking localStorage...');

          // Fallback: check localStorage for regular cards
          const savedCards = localStorage.getItem('businessCards');
          if (savedCards) {
            const cards: BusinessCard[] = JSON.parse(savedCards);
            console.log('📋 Found', cards.length, 'cards in businessCards');
            console.log('📋 Card IDs:', cards.map(c => c.id));

            const foundCard = cards.find(c => c.id === id);

            if (foundCard) {
              console.log('✅ Found card in localStorage, auto-sharing...');
              setCard(foundCard);

              // Auto-share the card if it's being viewed via URL
              try {
                const autoSharedCard = shareService.shareCard(foundCard);
                console.log('📤 Card auto-shared with URL:', autoSharedCard.shareUrl);

                // Update URL to use SEO-friendly slug if different
                if (autoSharedCard.slug !== id && autoSharedCard.slug !== foundCard.id) {
                  console.log('🔄 Updating URL from', id, 'to', autoSharedCard.slug);
                  window.history.replaceState(null, '', `/view/${autoSharedCard.slug}`);
                }
              } catch (shareError) {
                console.error('Failed to auto-share card:', shareError);
              }
            } else {
              console.log('❌ Card not found in localStorage either');
              console.log('❌ Looking for ID:', id);
              console.log('❌ Available IDs:', cards.map(c => c.id));
              setError('Card not found. This card may have been deleted or the link is invalid.');
            }
          } else {
            console.log('❌ No cards found in localStorage');
            setError('Card not found. This card may have been deleted or the link is invalid.');
          }
        }
      } catch (err) {
        console.error('Error loading card:', err);
        setError('Failed to load card. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [id]);

  const handleDownload = () => {
    if (!card) return;

    try {
      downloadVCard(card);
      toast({
        title: "Contact Downloaded",
        description: "Business card contact information has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading business card...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600 dark:text-red-400">
              Card Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              {error || 'The business card you\'re looking for could not be found.'}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="premium-action-button flex items-center border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 hover:border-yellow-400 px-6 py-3 rounded-full shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105 font-semibold group relative overflow-hidden backdrop-blur-sm"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>

              <div className="relative z-10 flex items-center">
                <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:tracking-wide transition-all duration-300">Share</span>
              </div>
            </Button>
            <Button
              onClick={handleDownload}
              className="premium-action-button flex items-center bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 border-2 border-blue-400 hover:border-blue-300 font-semibold group relative overflow-hidden"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>

              <div className="relative z-10 flex items-center">
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:tracking-wide transition-all duration-300">Save Contact</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Business Card */}
        <div className="flex justify-center">
          <CardPreview
            card={card}
            className="w-full max-w-md transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Card Info */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">
              {card.name}
            </CardTitle>
            {card.tagline && (
              <p className="text-center text-slate-600 dark:text-slate-400">
                {card.tagline}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {card.description && (
              <p className="text-center text-slate-700 dark:text-slate-300 mb-4">
                {card.description}
              </p>
            )}

            <div className="text-center space-y-2">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <p>Tap "Save Contact" to add this business card to your contacts</p>
              </div>
              {viewCount > 0 && (
                <div className="flex items-center justify-center space-x-1 text-xs text-slate-400 dark:text-slate-500">
                  <Eye className="w-3 h-3" />
                  <span>{viewCount} view{viewCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Analytics */}
        <ViewCountAnalytics card={card} />

        {/* Share Modal */}
        {card && (
          <ViewCardShareModal
            card={card}
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            shareUrl={window.location.href}
          />
        )}
      </div>
    </div>
  );
};

export default ViewCard;
