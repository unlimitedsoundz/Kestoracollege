-- Create tuition_rates table
CREATE TABLE IF NOT EXISTS public.tuition_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    degree_level TEXT NOT NULL, 
    field TEXT NOT NULL,
    annual_fee DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(degree_level, field)
);

-- Insert Official Rates
INSERT INTO public.tuition_rates (degree_level, field, annual_fee) VALUES
('BACHELOR', 'BUSINESS', 4000.00),
('BACHELOR', 'ARTS', 4000.00),
('BACHELOR', 'TECHNOLOGY', 6000.00),
('BACHELOR', 'SCIENCE', 7500.00),
('MASTER', 'BUSINESS', 6000.00),
('MASTER', 'ARTS', 6000.00),
('MASTER', 'TECHNOLOGY', 6000.00),
('MASTER', 'SCIENCE', 9500.00)
ON CONFLICT (degree_level, field) DO UPDATE 
SET annual_fee = EXCLUDED.annual_fee, updated_at = NOW();

-- Enable RLS
ALTER TABLE public.tuition_rates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to tuition rates
CREATE POLICY "Tuition rates are viewable by everyone" ON public.tuition_rates FOR SELECT USING (true);
