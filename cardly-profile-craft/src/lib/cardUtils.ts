
import { BusinessCard, SupabaseBusinessCard, convertToBusinessCard } from "@/types/types";
import { supabase } from "@/integrations/supabase/client";

// Check if a string is a valid UUID
export const isValidUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

// Create a proper UUID for new cards
export const generateCardId = (): string => {
  // RFC4122 compliant UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Save card to Supabase
export const saveCard = async (card: BusinessCard): Promise<BusinessCard> => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);

      // Fallback to localStorage in development
      if (import.meta.env.DEV) {
        console.log('🔧 Using localStorage fallback for saving card');
        saveCardToLocalStorage(card);
        return card;
      }

      throw new Error("Failed to authenticate user");
    }

    if (!user) {
      // In development, use localStorage
      if (import.meta.env.DEV) {
        console.log('🔧 Using localStorage fallback for saving card (no user)');
        saveCardToLocalStorage(card);
        return card;
      }

      throw new Error("User must be logged in to save cards");
    }

    // If this is a mock user (development), use localStorage
    if (import.meta.env.DEV && user.id?.startsWith('dev-user-')) {
      console.log('🔧 Using localStorage for mock user');
      saveCardToLocalStorage(card);
      return card;
    }

    // Ensure required fields are present
    if (!card.name || !card.tagline) {
      throw new Error("Business name and tagline are required");
    }

    // Prepare card data for Supabase
    // Note: animations and effects columns might not exist yet in the database
    const cardData = {
      name: card.name,
      tagline: card.tagline,
      logo: card.logo || null,
      email: card.email || null,
      phone: card.phone || null,
      website: card.website || null,
      instagram: card.instagram || null,
      whatsapp: card.whatsapp || null,
      description: card.description || null,
      theme: card.theme || null,
      badge: card.badge || null,
      animations: card.animations || null,
      effects: card.effects || null,
      card_url: card.cardUrl || null,
      user_id: user.id,
      updated_at: new Date().toISOString()
    };

    // Generate a new UUID if needed
    const cardId = card.id && isValidUUID(card.id) ? card.id : generateCardId();

    let savedCard: any;

    if (card.id && isValidUUID(card.id)) {
      // First, check if the card exists and belongs to the user
      const { data: existingCard, error: checkError } = await supabase
        .from('business_cards')
        .select('id')
        .eq('id', card.id)
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no row is found

      if (checkError) {
        console.error("Error checking card existence:", checkError);
        throw new Error(`Failed to check if card exists: ${checkError.message}`);
      }

      if (!existingCard) {
        console.log("Card not found or doesn't belong to user, creating new card instead");
        // Card doesn't exist or doesn't belong to user, create a new one
        const { data, error } = await supabase
          .from('business_cards')
          .insert([{
            ...cardData,
            id: cardId,
            created_at: new Date().toISOString()
          }])
          .select()
          .maybeSingle();

        if (error) {
          console.error("Error creating card:", error);
          // Check if the error is related to missing columns
          if (error.message.includes("animations") || error.message.includes("effects") || error.message.includes("badge") || error.message.includes("theme")) {
            throw new Error(`Database schema error: Required columns (theme, badge, animations, or effects) are missing from the business_cards table. Please run the database migration to add these columns.`);
          }
          throw new Error(`Failed to create card: ${error.message}`);
        }

        savedCard = data;
      } else {
        // Card exists and belongs to user, update it
        const { data, error } = await supabase
          .from('business_cards')
          .update(cardData)
          .eq('id', card.id)
          .eq('user_id', user.id)
          .select()
          .maybeSingle();

        if (error) {
          console.error("Error updating card:", error);
          // Check if the error is related to missing columns
          if (error.message.includes("animations") || error.message.includes("effects") || error.message.includes("badge") || error.message.includes("theme")) {
            throw new Error(`Database schema error: Required columns (theme, badge, animations, or effects) are missing from the business_cards table. Please run the database migration to add these columns.`);
          }
          throw new Error(`Failed to update card: ${error.message}`);
        }

        savedCard = data;
      }
    } else {
      // Either creating a new card or the existing ID is not a valid UUID
      // In either case, we'll create a new record with a valid UUID
      const { data, error } = await supabase
        .from('business_cards')
        .insert([{
          ...cardData,
          id: cardId,
          created_at: new Date().toISOString()
        }])
        .select()
        .maybeSingle(); // Use maybeSingle instead of single

      if (error) {
        console.error("Error creating card:", error);
        // Check if the error is related to missing columns
        if (error.message.includes("animations") || error.message.includes("effects") || error.message.includes("badge") || error.message.includes("theme")) {
          throw new Error(`Database schema error: Required columns (theme, badge, animations, or effects) are missing from the business_cards table. Please run the database migration to add these columns.`);
        }
        throw new Error(`Failed to create card: ${error.message}`);
      }

      // If we had an old non-UUID ID, try to delete that record
      if (card.id && !isValidUUID(card.id)) {
        try {
          // Attempt to delete the old record, but don't throw if it fails
          await supabase
            .from('business_cards')
            .delete()
            .eq('id', card.id)
            .eq('user_id', user.id);
        } catch (deleteError) {
          console.warn("Could not delete old card record:", deleteError);
          // Continue anyway, as we've already created a new record
        }
      }

      savedCard = data;
    }

    // If we didn't get data back from the database, use the original card data
    // This can happen if the database doesn't return the inserted/updated row
    if (!savedCard) {
      console.warn("No data returned from database, using original card data");

      // Create a SupabaseBusinessCard-like object from our card data
      savedCard = {
        id: cardId,
        name: card.name,
        tagline: card.tagline,
        logo: card.logo || null,
        email: card.email || null,
        phone: card.phone || null,
        website: card.website || null,
        instagram: card.instagram || null,
        whatsapp: card.whatsapp || null,
        description: card.description || null,
        theme: card.theme || null,
        badge: card.badge || null,
        animations: card.animations || null,
        effects: card.effects || null,
        card_url: card.cardUrl || null,
        user_id: user.id,
        created_at: card.createdAt ? card.createdAt.toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    // Convert the saved card to our BusinessCard type and return it
    return convertToBusinessCard(savedCard as SupabaseBusinessCard);
  } catch (error) {
    console.error("Error in saveCard:", error);

    // Fallback to localStorage in development
    if (import.meta.env.DEV) {
      console.log('🔧 Using localStorage fallback for saving card (general error)');
      saveCardToLocalStorage(card);
      return card;
    }

    throw error;
  }
};

// localStorage fallback functions for development
const getCardsFromLocalStorage = (): BusinessCard[] => {
  try {
    const stored = localStorage.getItem('businessCards');
    if (!stored) return [];

    const cards = JSON.parse(stored);
    return cards.map((card: any) => ({
      ...card,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading cards from localStorage:', error);
    return [];
  }
};

const saveCardToLocalStorage = (card: BusinessCard): void => {
  try {
    const existingCards = getCardsFromLocalStorage();
    const index = existingCards.findIndex(c => c.id === card.id);

    if (index >= 0) {
      existingCards[index] = card;
    } else {
      existingCards.push(card);
    }

    localStorage.setItem('businessCards', JSON.stringify(existingCards));
  } catch (error) {
    console.error('Error saving card to localStorage:', error);
    throw error;
  }
};

const deleteCardFromLocalStorage = (id: string): void => {
  try {
    const existingCards = getCardsFromLocalStorage();
    const filteredCards = existingCards.filter(c => c.id !== id);
    localStorage.setItem('businessCards', JSON.stringify(filteredCards));
  } catch (error) {
    console.error('Error deleting card from localStorage:', error);
    throw error;
  }
};

// Get all cards from Supabase (with localStorage fallback)
export const getCards = async (): Promise<BusinessCard[]> => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);

      // Fallback to localStorage in development
      if (import.meta.env.DEV) {
        console.log('🔧 Using localStorage fallback for cards');
        return getCardsFromLocalStorage();
      }

      throw new Error("Failed to authenticate user");
    }

    if (!user) {
      // In development with mock user, use localStorage
      if (import.meta.env.DEV && user?.id?.startsWith('dev-user-')) {
        return getCardsFromLocalStorage();
      }
      return [];
    }

    // First, check if the user has any cards
    const { count, error: countError } = await supabase
      .from('business_cards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error("Error counting cards:", countError);

      // Fallback to localStorage in development
      if (import.meta.env.DEV) {
        console.log('🔧 Using localStorage fallback for cards (count error)');
        return getCardsFromLocalStorage();
      }

      throw new Error(`Failed to count cards: ${countError.message}`);
    }

    // If user has no cards, return empty array
    if (count === 0) {
      return [];
    }

    // Fetch all cards for the user
    const { data, error } = await supabase
      .from('business_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching cards:", error);

      // Fallback to localStorage in development
      if (import.meta.env.DEV) {
        console.log('🔧 Using localStorage fallback for cards (fetch error)');
        return getCardsFromLocalStorage();
      }

      throw new Error(`Failed to fetch cards: ${error.message}`);
    }

    return data ? data.map((card: SupabaseBusinessCard) => convertToBusinessCard(card)) : [];
  } catch (error) {
    console.error("Error in getCards:", error);

    // Fallback to localStorage in development
    if (import.meta.env.DEV) {
      console.log('🔧 Using localStorage fallback for cards (general error)');
      return getCardsFromLocalStorage();
    }

    throw error;
  }
};

// Get a specific card by ID
export const getCardById = async (id: string): Promise<BusinessCard | undefined> => {
  try {
    // Check if the ID is a valid UUID
    if (!isValidUUID(id)) {
      console.warn("Invalid UUID format for card ID:", id);
      return undefined;
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      throw new Error("Failed to authenticate user");
    }

    if (!user) {
      return undefined;
    }

    const { data, error } = await supabase
      .from('business_cards')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching card by ID:", error);
      throw new Error(`Failed to fetch card: ${error.message}`);
    }

    return data ? convertToBusinessCard(data as SupabaseBusinessCard) : undefined;
  } catch (error) {
    console.error("Error in getCardById:", error);
    return undefined; // Return undefined instead of throwing to avoid breaking the UI
  }
};

// Delete a card by ID
export const deleteCard = async (id: string): Promise<void> => {
  try {
    // We'll use the isValidUUID utility function defined at the top of the file

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);

      // Fallback to localStorage in development
      if (import.meta.env.DEV) {
        console.log('🔧 Using localStorage fallback for deleting card');
        deleteCardFromLocalStorage(id);
        return;
      }

      throw new Error("Failed to authenticate user");
    }

    if (!user) {
      // In development, use localStorage
      if (import.meta.env.DEV) {
        console.log('🔧 Using localStorage fallback for deleting card (no user)');
        deleteCardFromLocalStorage(id);
        return;
      }

      throw new Error("User must be logged in to delete cards");
    }

    // If this is a mock user (development), use localStorage
    if (import.meta.env.DEV && user.id?.startsWith('dev-user-')) {
      console.log('🔧 Using localStorage for deleting card (mock user)');
      deleteCardFromLocalStorage(id);
      return;
    }

    // If the ID is not a valid UUID, we might not be able to delete it directly
    if (!isValidUUID(id)) {
      console.warn("Attempting to delete a card with non-UUID format:", id);

      // Try to find cards by user that might match this ID (if it's stored in a different format)
      const { data: userCards } = await supabase
        .from('business_cards')
        .select('*')
        .eq('user_id', user.id);

      // Log the found cards for debugging
      console.log("User cards:", userCards);

      // Continue with the delete attempt anyway
    }

    const { error } = await supabase
      .from('business_cards')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user owns the card

    if (error) {
      console.error("Error deleting card:", error);
      throw new Error(`Failed to delete card: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteCard:", error);

    // Fallback to localStorage in development
    if (import.meta.env.DEV) {
      console.log('🔧 Using localStorage fallback for deleting card (general error)');
      deleteCardFromLocalStorage(id);
      return;
    }

    throw error;
  }
};

// Generate a vCard for download
export const generateVCard = (card: BusinessCard): string => {
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.name}`,
    `ORG:${card.name};${card.tagline}`,
    card.phone ? `TEL;TYPE=CELL:${card.phone}` : '',
    card.email ? `EMAIL:${card.email}` : '',
    card.website ? `URL:${card.website}` : '',
    `NOTE:${card.description || card.tagline}`,
    'END:VCARD'
  ].filter(line => line !== '').join('\n');

  return vCardData;
};

// Download vCard file
export const downloadVCard = (card: BusinessCard): void => {
  const vCardData = generateVCard(card);
  const blob = new Blob([vCardData], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${card.name.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Share card to different platforms
export const shareCard = (card: BusinessCard, platform: string, cardUrl?: string): void => {
  const url = cardUrl || window.location.href;
  const text = `Check out ${card.name}'s digital business card`;

  let shareUrl = '';

  switch(platform) {
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      break;
    case 'link':
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }, () => {
        alert('Failed to copy link. Please try again.');
      });
      return;
    default:
      return;
  }

  window.open(shareUrl, '_blank');
};

// Handle image upload and return a data URL
export const handleImageUpload = async (file: File): Promise<string> => {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("User must be logged in to upload images");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('business-card-assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('business-card-assets')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};
