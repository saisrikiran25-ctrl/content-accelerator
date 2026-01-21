-- Create enum types for content system
CREATE TYPE public.vertical_type AS ENUM ('legal', 'healthcare', 'ecommerce', 'tech', 'accounting', 'finance', 'real_estate', 'custom');
CREATE TYPE public.content_type AS ENUM ('blog', 'linkedin', 'case_study', 'product_description', 'email', 'landing_page');
CREATE TYPE public.content_status AS ENUM ('draft', 'scheduled', 'published', 'archived');

-- Profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  company_name TEXT,
  vertical vertical_type DEFAULT 'custom',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Brand voice profiles
CREATE TABLE public.brand_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default',
  formality INTEGER DEFAULT 50 CHECK (formality >= 0 AND formality <= 100),
  complexity INTEGER DEFAULT 50 CHECK (complexity >= 0 AND complexity <= 100),
  warmth INTEGER DEFAULT 50 CHECK (warmth >= 0 AND warmth <= 100),
  confidence INTEGER DEFAULT 50 CHECK (confidence >= 0 AND confidence <= 100),
  sample_phrases TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Content briefs table
CREATE TABLE public.content_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type content_type NOT NULL DEFAULT 'blog',
  topic TEXT,
  keywords TEXT[] DEFAULT '{}',
  target_audience TEXT,
  tone TEXT DEFAULT 'professional',
  word_count INTEGER DEFAULT 1000,
  additional_notes TEXT,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Content pieces (generated content)
CREATE TABLE public.content_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brief_id UUID REFERENCES public.content_briefs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  readability_score INTEGER DEFAULT 0 CHECK (readability_score >= 0 AND readability_score <= 100),
  word_count INTEGER DEFAULT 0,
  status content_status DEFAULT 'draft',
  compliance_flags JSONB DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pieces ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Brand voices policies
CREATE POLICY "Users can view their own brand voices"
  ON public.brand_voices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand voices"
  ON public.brand_voices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand voices"
  ON public.brand_voices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand voices"
  ON public.brand_voices FOR DELETE
  USING (auth.uid() = user_id);

-- Content briefs policies
CREATE POLICY "Users can view their own briefs"
  ON public.content_briefs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own briefs"
  ON public.content_briefs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own briefs"
  ON public.content_briefs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own briefs"
  ON public.content_briefs FOR DELETE
  USING (auth.uid() = user_id);

-- Content pieces policies
CREATE POLICY "Users can view their own content"
  ON public.content_pieces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content"
  ON public.content_pieces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content"
  ON public.content_pieces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content"
  ON public.content_pieces FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_voices_updated_at
  BEFORE UPDATE ON public.brand_voices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_briefs_updated_at
  BEFORE UPDATE ON public.content_briefs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_pieces_updated_at
  BEFORE UPDATE ON public.content_pieces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();