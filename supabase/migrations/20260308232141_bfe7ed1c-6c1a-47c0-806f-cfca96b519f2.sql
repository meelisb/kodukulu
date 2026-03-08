
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Ehitus', 'Sisustus', 'Haljastus', 'Tööriistad/tarvikud', 'Majapidamine', 'Auto')),
  amount NUMERIC(10,2) NOT NULL,
  fuel_quantity FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
