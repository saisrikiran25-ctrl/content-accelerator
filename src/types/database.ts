// Database types for ContentAccelerator

export type VerticalType = 'legal' | 'healthcare' | 'ecommerce' | 'tech' | 'accounting' | 'finance' | 'real_estate' | 'custom';
export type ContentType = 'blog' | 'article' | 'case_study' | 'product_description' | 'email' | 'landing_page';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  company_name: string | null;
  vertical: VerticalType;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandVoice {
  id: string;
  user_id: string;
  name: string;
  formality: number;
  complexity: number;
  warmth: number;
  confidence: number;
  sample_phrases: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBrief {
  id: string;
  user_id: string;
  title: string;
  content_type: ContentType;
  topic: string | null;
  keywords: string[];
  target_audience: string | null;
  tone: string;
  word_count: number;
  additional_notes: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface ContentPiece {
  id: string;
  user_id: string;
  brief_id: string | null;
  title: string;
  content: string | null;
  seo_score: number;
  readability_score: number;
  word_count: number;
  status: ContentStatus;
  compliance_flags: Record<string, unknown>;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Vertical configuration
export interface VerticalConfig {
  id: VerticalType;
  name: string;
  description: string;
  icon: string;
  color: string;
  complianceRules: ComplianceRule[];
  templates: string[];
}

export interface ComplianceRule {
  id: string;
  name: string;
  required: boolean;
  description: string;
}

// Content Brief Wizard types
export interface ContentBriefFormData {
  contentType: ContentType;
  title: string;
  topic: string;
  keywords: string[];
  targetAudience: string;
  tone: 'professional' | 'casual' | 'technical';
  wordCount: number;
  additionalNotes: string;
}
