
-- Make user_id and category_id NOT NULL
ALTER TABLE public.expenses ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.expenses ALTER COLUMN category_id SET NOT NULL;

-- Add foreign key for category_id (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expenses_category_id_fkey'
  ) THEN
    ALTER TABLE public.expenses 
      ADD CONSTRAINT expenses_category_id_fkey 
      FOREIGN KEY (category_id) REFERENCES public.categories(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own expenses"
ON public.expenses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses"
ON public.expenses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
ON public.expenses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
ON public.expenses FOR DELETE
USING (auth.uid() = user_id);
