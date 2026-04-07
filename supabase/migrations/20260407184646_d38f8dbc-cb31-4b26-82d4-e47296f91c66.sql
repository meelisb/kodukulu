
-- Create tags table
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text,
  UNIQUE (user_id, name)
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own tags" ON public.tags
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create cost_tags junction table
CREATE TABLE public.cost_tags (
  cost_id uuid NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE RESTRICT,
  PRIMARY KEY (cost_id, tag_id)
);
ALTER TABLE public.cost_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own cost_tags" ON public.cost_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.expenses WHERE id = cost_id AND user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.expenses WHERE id = cost_id AND user_id = auth.uid())
  );
