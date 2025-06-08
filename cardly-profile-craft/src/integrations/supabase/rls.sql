
-- Enable Row Level Security for business_cards table
ALTER TABLE public.business_cards ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own cards
CREATE POLICY "Users can view their own business cards"
  ON public.business_cards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own cards
CREATE POLICY "Users can create their own business cards"
  ON public.business_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own cards
CREATE POLICY "Users can update their own business cards"
  ON public.business_cards
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to delete their own cards
CREATE POLICY "Users can delete their own business cards"
  ON public.business_cards
  FOR DELETE
  USING (auth.uid() = user_id);
