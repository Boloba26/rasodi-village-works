-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'director', 'manager', 'staff', 'security');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'ongoing', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('unpaid', 'partially_paid', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (Core User Data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DIRECTORS INFO
CREATE TABLE IF NOT EXISTS public.directors_info (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    id_number TEXT UNIQUE,
    portfolio TEXT, -- Finance, Operations, Agriculture, Youth Development, etc.
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MANAGEMENT INFO
CREATE TABLE IF NOT EXISTS public.management_info (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    portfolio TEXT, -- Operations Manager, Finance Manager, Projects Manager, ICT Manager
    performance_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WORKERS REGISTRY (General Workers)
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    skills TEXT[], -- e.g., ['farming', 'admin', 'photography']
    contact_info TEXT,
    id_number TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATTENDANCE TRACKING
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    check_in TIMESTAMPTZ DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SECURITY SHIFTS & LOGS
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    shift_start TIMESTAMPTZ NOT NULL,
    shift_end TIMESTAMPTZ,
    incident_reported BOOLEAN DEFAULT FALSE,
    incident_details TEXT,
    check_in_location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES REGISTRY
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT, -- Internet Cafe, Photography, Video Editing, Farming, etc.
    base_price NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE BOOKINGS / REQUESTS
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_contact TEXT,
    request_details TEXT,
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed
    total_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS & TASKS
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to_worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
    assigned_to_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    status job_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'unpaid',
    payment_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FINANCIAL TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type transaction_type NOT NULL,
    category TEXT NOT NULL, -- Donation, Service Income, Grant, Wages, Operations, etc.
    amount NUMERIC NOT NULL,
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directors_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.management_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles." ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Workers Policies
CREATE POLICY "Workers viewable by authenticated users." ON public.workers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers and Admins can manage workers." ON public.workers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'director'))
);

-- Jobs Policies
CREATE POLICY "Jobs viewable by authenticated users." ON public.jobs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers and Admins can manage jobs." ON public.jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Financial Policies
CREATE POLICY "Financials viewable by Admins and Directors." ON public.financial_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'director'))
);
CREATE POLICY "Admins can insert transactions." ON public.financial_transactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'staff');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed initial services
INSERT INTO public.services (name, category, description) VALUES
('Internet Cafe', 'ICT', 'High-speed internet access for the community'),
('Photography', 'Media', 'Professional photography services'),
('Video Editing', 'Media', 'Video production and editing'),
('Business Plans', 'Business', 'Creating business plans and company profiles'),
('Lobola Contracts', 'Legal', 'Drafting of Lobola agreement contracts'),
('SARS Correspondence', 'Finance', 'Tax assistance and SARS filing'),
('CIPC Services', 'Business', 'Company registration and CIPC filings'),
('CIDB Services', 'Construction', 'CIDB registration and compliance'),
('CSD Services', 'Business', 'Central Supplier Database registration'),
('Soup Kitchen', 'Community', 'Daily food program'),
('Farming', 'Agriculture', 'Agricultural projects and farming activities'),
('Sports', 'Recreation', 'Community sports activities'),
('Culture', 'Recreation', 'Cultural heritage programs')
ON CONFLICT (name) DO NOTHING;