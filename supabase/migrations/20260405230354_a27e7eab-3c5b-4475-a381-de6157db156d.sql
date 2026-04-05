
-- 1. Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Add user_id and category_id to expenses (nullable for now)
ALTER TABLE public.expenses
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT;

-- 3. handle_new_user trigger for default categories
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, sort_order) VALUES
    (NEW.id, 'Ehitus', 1),
    (NEW.id, 'Sisustus', 2),
    (NEW.id, 'Haljastus', 3),
    (NEW.id, 'Tööriistad/tarvikud', 4),
    (NEW.id, 'Majapidamine', 5),
    (NEW.id, 'Auto', 6);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
