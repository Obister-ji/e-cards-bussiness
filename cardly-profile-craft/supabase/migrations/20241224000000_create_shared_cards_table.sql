-- Create shared_cards table for public card sharing
CREATE TABLE IF NOT EXISTS shared_cards (
    id UUID PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    card_data JSONB NOT NULL,
    share_url TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_shared_cards_slug ON shared_cards(slug);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_shared_cards_created_at ON shared_cards(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE shared_cards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (anyone can view shared cards)
CREATE POLICY "Allow public read access to shared cards" ON shared_cards
    FOR SELECT USING (true);

-- Create policy to allow insert/update for authenticated users
CREATE POLICY "Allow authenticated users to share cards" ON shared_cards
    FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_shared_cards_updated_at 
    BEFORE UPDATE ON shared_cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE shared_cards IS 'Publicly accessible shared business cards';
COMMENT ON COLUMN shared_cards.id IS 'Original business card ID';
COMMENT ON COLUMN shared_cards.slug IS 'SEO-friendly URL slug (e.g., john-smith-marketing)';
COMMENT ON COLUMN shared_cards.card_data IS 'Complete business card data as JSON';
COMMENT ON COLUMN shared_cards.share_url IS 'Full shareable URL';
COMMENT ON COLUMN shared_cards.view_count IS 'Number of times this card has been viewed';
COMMENT ON COLUMN shared_cards.created_at IS 'When the card was first shared';
COMMENT ON COLUMN shared_cards.updated_at IS 'When the card was last updated';
