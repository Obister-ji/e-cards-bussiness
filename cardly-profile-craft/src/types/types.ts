
import { Database } from '@/integrations/supabase/types';

export interface BusinessCard {
  id: string;
  name: string;
  tagline: string;
  logo?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  description?: string;
  theme?: string;
  badge?: string;
  animations?: string[];
  effects?: string[];
  cardUrl?: string; // Instagram-style permanent URL
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessCardFormData {
  name: string;
  tagline: string;
  logo?: FileList;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  description?: string;
  theme?: string;
  badge?: string;
  cardUrl?: string;
}

export type SocialPlatform = 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'link';

// Supabase specific types
export type SupabaseBusinessCard = Database['public']['Tables']['business_cards']['Row'];

// Type conversion utility
export const convertToBusinessCard = (card: SupabaseBusinessCard): BusinessCard => {
  return {
    id: card.id,
    name: card.name,
    tagline: card.tagline || '',
    logo: card.logo || undefined,
    email: card.email || undefined,
    phone: card.phone || undefined,
    website: card.website || undefined,
    instagram: card.instagram || undefined,
    whatsapp: card.whatsapp || undefined,
    description: card.description || undefined,
    theme: card.theme || undefined,
    badge: card.badge || undefined,
    animations: card.animations || undefined,
    effects: card.effects || undefined,
    cardUrl: (card as any).card_url || undefined,
    createdAt: new Date(card.created_at),
    updatedAt: new Date(card.updated_at)
  };
};
