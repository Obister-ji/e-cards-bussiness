import { BusinessCard } from '@/types/types';

export interface SharedCard {
  id: string;
  card: BusinessCard;
  shareUrl: string;
  slug: string; // SEO-friendly URL slug
  createdAt: Date;
  viewCount: number;
}

class ShareService {
  private readonly STORAGE_KEY = 'sharedBusinessCards';

  /**
   * Generate SEO-friendly slug from business name
   */
  private generateSlug(name: string): string {
    // Handle empty or whitespace-only names
    if (!name || !name.trim()) {
      return 'business-card';
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    // If slug is empty after processing (name had only special characters), use fallback
    if (!slug) {
      return 'business-card';
    }

    return slug;
  }

  /**
   * Ensure slug is unique by checking existing slugs (synchronous version)
   */
  private ensureUniqueSlugSync(baseSlug: string): string {
    let slug = baseSlug;
    let counter = 1;

    while (this.slugExistsSync(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Check if slug already exists in localStorage (synchronous)
   */
  private slugExistsSync(slug: string): boolean {
    try {
      // Check in shared cards by slug
      const slugCards = localStorage.getItem('sharedCardsBySlug');
      if (slugCards) {
        const cards = JSON.parse(slugCards);
        return !!cards[slug];
      }
      return false;
    } catch (error) {
      console.error('Error checking slug existence:', error);
      return false;
    }
  }

  /**
   * Save shared card by slug for SEO URL lookup
   */
  private saveSharedCardBySlug(sharedCard: SharedCard): void {
    try {
      const slugCards = localStorage.getItem('sharedCardsBySlug');
      const cards = slugCards ? JSON.parse(slugCards) : {};

      cards[sharedCard.slug] = {
        ...sharedCard,
        createdAt: sharedCard.createdAt.toISOString()
      };

      localStorage.setItem('sharedCardsBySlug', JSON.stringify(cards));
      console.log('💾 Card saved by slug:', sharedCard.slug);
    } catch (error) {
      console.error('Error saving card by slug:', error);
    }
  }

  /**
   * Share a business card and make it publicly accessible
   * Now generates clean, short URLs with embedded data for cross-browser compatibility
   */
  shareCard(card: BusinessCard): SharedCard {
    try {
      // Generate SEO-friendly slug
      const baseSlug = this.generateSlug(card.name);
      const uniqueSlug = this.ensureUniqueSlugSync(baseSlug);

      // Get current view count
      const currentViewCount = this.getViewCount(card.id);

      // Create share URL with embedded data for cross-browser compatibility
      const encodedCard = this.encodeCardForUrl(card);
      const shareUrl = `${window.location.origin}/view/${uniqueSlug}?data=${encodedCard}&views=${currentViewCount}`;

      const sharedCard: SharedCard = {
        id: card.id,
        card: card,
        slug: uniqueSlug,
        shareUrl: shareUrl,
        createdAt: new Date(),
        viewCount: currentViewCount
      };

      // Save to localStorage with both slug and ID for same-browser access
      this.saveSharedCard(sharedCard);

      // Also save with slug as key for SEO URLs
      this.saveSharedCardBySlug(sharedCard);

      console.log('📤 Card shared with cross-browser compatible URL:', sharedCard);
      return sharedCard;
    } catch (error) {
      console.error('Error sharing card:', error);

      // Fallback to method with embedded data
      const currentViewCount = this.getViewCount(card.id);
      const encodedCard = this.encodeCardForUrl(card);
      const fallbackCard: SharedCard = {
        id: card.id,
        card: card,
        slug: card.id,
        shareUrl: `${window.location.origin}/view/${card.id}?data=${encodedCard}&views=${currentViewCount}`,
        createdAt: new Date(),
        viewCount: currentViewCount
      };

      this.saveSharedCard(fallbackCard);
      return fallbackCard;
    }
  }

  /**
   * Encode card data for URL transmission (cross-browser sharing)
   * Note: Embeds card data in URL for cross-browser compatibility
   */
  private encodeCardForUrl(card: BusinessCard): string {
    try {
      const cardData = JSON.stringify(card);
      return btoa(encodeURIComponent(cardData));
    } catch (error) {
      console.error('Error encoding card for URL:', error);
      return '';
    }
  }

  /**
   * Decode card data from URL (cross-browser sharing)
   * Note: Extracts card data from URL for cross-browser compatibility
   */
  decodeCardFromUrl(encodedData: string): BusinessCard | null {
    try {
      const decodedData = decodeURIComponent(atob(encodedData));
      return JSON.parse(decodedData);
    } catch (error) {
      console.error('Error decoding card from URL:', error);
      return null;
    }
  }

  /**
   * Get view count for a card (cross-browser persistent)
   */
  getViewCount(cardId: string): number {
    try {
      const viewCounts = localStorage.getItem('cardViewCounts');
      if (!viewCounts) return 0;

      const counts = JSON.parse(viewCounts);
      return counts[cardId] || 0;
    } catch (error) {
      console.error('Error getting view count:', error);
      return 0;
    }
  }

  /**
   * Increment view count for a card
   */
  incrementViewCount(cardId: string): number {
    try {
      const viewCounts = localStorage.getItem('cardViewCounts');
      const counts = viewCounts ? JSON.parse(viewCounts) : {};

      counts[cardId] = (counts[cardId] || 0) + 1;
      localStorage.setItem('cardViewCounts', JSON.stringify(counts));

      console.log('👀 View count incremented for card:', cardId, 'Total views:', counts[cardId]);
      return counts[cardId];
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return 0;
    }
  }

  /**
   * Set view count for a card (used when loading from URL with existing count)
   */
  setViewCount(cardId: string, count: number): void {
    try {
      const viewCounts = localStorage.getItem('cardViewCounts');
      const counts = viewCounts ? JSON.parse(viewCounts) : {};

      // Only update if the new count is higher (prevents count going backwards)
      if (count > (counts[cardId] || 0)) {
        counts[cardId] = count;
        localStorage.setItem('cardViewCounts', JSON.stringify(counts));
        console.log('📊 View count updated for card:', cardId, 'New count:', count);
      }
    } catch (error) {
      console.error('Error setting view count:', error);
    }
  }

  /**
   * Get all view counts (for analytics)
   */
  getAllViewCounts(): Record<string, number> {
    try {
      const viewCounts = localStorage.getItem('cardViewCounts');
      return viewCounts ? JSON.parse(viewCounts) : {};
    } catch (error) {
      console.error('Error getting all view counts:', error);
      return {};
    }
  }



  /**
   * Get a shared card by ID or slug
   */
  getSharedCard(identifier: string): SharedCard | null {
    try {
      console.log('🔍 ShareService: Looking for card with identifier:', identifier);

      // Debug: Check what's in storage
      const sharedCards = this.getAllSharedCards();
      const slugCards = localStorage.getItem('sharedCardsBySlug');

      console.log('📦 ShareService: Found', sharedCards.length, 'shared cards');
      console.log('📦 ShareService: Shared card IDs:', sharedCards.map(c => c.id));
      console.log('📦 ShareService: Shared card slugs:', sharedCards.map(c => c.slug));
      console.log('📦 ShareService: Slug storage:', slugCards ? Object.keys(JSON.parse(slugCards)) : 'None');

      // First try to get by slug
      const cardBySlug = this.getSharedCardBySlug(identifier);
      if (cardBySlug) {
        console.log('✅ ShareService: Found card by slug:', identifier);
        const newViewCount = this.incrementViewCount(cardBySlug.id);
        cardBySlug.viewCount = newViewCount;
        this.saveSharedCard(cardBySlug);
        this.saveSharedCardBySlug(cardBySlug);
        return cardBySlug;
      }

      // Then try to get by ID
      const cardById = this.getSharedCardFromLocalStorage(identifier);
      if (cardById) {
        console.log('✅ ShareService: Found card by ID:', identifier);
        const newViewCount = this.incrementViewCount(cardById.id);
        cardById.viewCount = newViewCount;
        this.saveSharedCard(cardById);
        return cardById;
      }

      console.log('❌ ShareService: Card not found:', identifier);
      return null;
    } catch (error) {
      console.error('ShareService: Error getting shared card:', error);
      return null;
    }
  }

  /**
   * Get shared card by slug
   */
  private getSharedCardBySlug(slug: string): SharedCard | null {
    try {
      const slugCards = localStorage.getItem('sharedCardsBySlug');
      if (!slugCards) return null;

      const cards = JSON.parse(slugCards);
      const cardData = cards[slug];

      if (!cardData) return null;

      return {
        ...cardData,
        createdAt: new Date(cardData.createdAt)
      };
    } catch (error) {
      console.error('Error getting card by slug:', error);
      return null;
    }
  }



  /**
   * Get shared card from localStorage (fallback)
   */
  private getSharedCardFromLocalStorage(id: string): SharedCard | null {
    try {
      const sharedCards = this.getAllSharedCards();
      const sharedCard = sharedCards.find(sc => sc.id === id);

      if (sharedCard) {
        // Increment view count
        sharedCard.viewCount++;
        this.saveSharedCard(sharedCard);
        console.log('👀 Card viewed (localStorage):', id, 'Views:', sharedCard.viewCount);
      }

      return sharedCard || null;
    } catch (error) {
      console.error('Error getting shared card from localStorage:', error);
      return null;
    }
  }

  /**
   * Get all shared cards
   */
  getAllSharedCards(): SharedCard[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const cards = JSON.parse(stored);
      return cards.map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt)
      }));
    } catch (error) {
      console.error('Error loading shared cards:', error);
      return [];
    }
  }

  /**
   * Save a shared card to storage
   */
  private saveSharedCard(sharedCard: SharedCard): void {
    try {
      const existingCards = this.getAllSharedCards();
      const index = existingCards.findIndex(sc => sc.id === sharedCard.id);

      if (index >= 0) {
        existingCards[index] = sharedCard;
      } else {
        existingCards.push(sharedCard);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingCards));
    } catch (error) {
      console.error('Error saving shared card:', error);
    }
  }

  /**
   * Generate share URL for a card
   */
  generateShareUrl(cardId: string): string {
    return `${window.location.origin}/view/${cardId}`;
  }

  /**
   * Check if a card is already shared
   */
  isCardShared(cardId: string): boolean {
    const sharedCards = this.getAllSharedCards();
    return sharedCards.some(sc => sc.id === cardId);
  }

  /**
   * Get sharing statistics for a card
   */
  getCardStats(cardId: string): { viewCount: number; shareDate: Date | null } {
    const sharedCard = this.getAllSharedCards().find(sc => sc.id === cardId);
    return {
      viewCount: sharedCard?.viewCount || 0,
      shareDate: sharedCard?.createdAt || null
    };
  }

  /**
   * Delete a shared card
   */
  unshareCard(cardId: string): boolean {
    try {
      const existingCards = this.getAllSharedCards();
      const filteredCards = existingCards.filter(sc => sc.id !== cardId);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCards));
      console.log('🗑️ Card unshared:', cardId);
      return true;
    } catch (error) {
      console.error('Error unsharing card:', error);
      return false;
    }
  }

  /**
   * Generate social sharing text
   */
  generateSocialText(card: BusinessCard): string {
    let text = `Check out ${card.name}'s digital business card`;

    if (card.tagline) {
      text += ` - ${card.tagline}`;
    }

    return text;
  }

  /**
   * Generate social sharing URLs
   */
  generateSocialUrls(card: BusinessCard, shareUrl: string) {
    const text = this.generateSocialText(card);

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent(`Business Card - ${card.name}`)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`
    };
  }
}

// Export singleton instance
export const shareService = new ShareService();
export default shareService;
