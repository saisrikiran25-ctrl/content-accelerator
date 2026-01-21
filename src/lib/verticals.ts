import { VerticalConfig, VerticalType } from '@/types/database';

export const verticalConfigs: Record<VerticalType, VerticalConfig> = {
  legal: {
    id: 'legal',
    name: 'Legal',
    description: 'Law firms, attorneys, and legal service providers',
    icon: 'Scale',
    color: 'hsl(215, 70%, 50%)',
    complianceRules: [
      { id: 'disclaimer', name: 'Disclaimer Statement', required: true, description: 'Legal disclaimer for non-advice content' },
      { id: 'attorney_bio', name: 'Attorney Bio Box', required: true, description: 'Author credentials and bar information' },
      { id: 'jurisdiction', name: 'Jurisdiction Disclosure', required: true, description: 'States/jurisdictions where attorney is licensed' },
      { id: 'cta_language', name: 'CTA Review', required: false, description: 'Ensure CTAs comply with bar advertising rules' },
    ],
    templates: ['Legal Blog Post', 'Case Study', 'Practice Area Page', 'Attorney Bio'],
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Hospitals, clinics, and medical practices',
    icon: 'Heart',
    color: 'hsl(340, 70%, 50%)',
    complianceRules: [
      { id: 'medical_disclaimer', name: 'Medical Disclaimer', required: true, description: 'Not a substitute for professional medical advice' },
      { id: 'hipaa_notice', name: 'HIPAA Notice', required: false, description: 'Privacy practices notice when applicable' },
      { id: 'fda_disclaimer', name: 'FDA Disclaimer', required: false, description: 'Required for supplement/drug content' },
      { id: 'author_credentials', name: 'Medical Review Notice', required: true, description: 'Reviewed by qualified healthcare professional' },
    ],
    templates: ['Health Blog', 'Condition Guide', 'Treatment Overview', 'Provider Bio'],
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online stores and retail businesses',
    icon: 'ShoppingCart',
    color: 'hsl(145, 70%, 40%)',
    complianceRules: [
      { id: 'pricing', name: 'Pricing Accuracy', required: true, description: 'Current and accurate pricing information' },
      { id: 'shipping', name: 'Shipping Policy', required: false, description: 'Delivery timeframes and policies' },
      { id: 'returns', name: 'Return Policy', required: false, description: 'Refund and return information' },
      { id: 'product_claims', name: 'Product Claims', required: true, description: 'Verify product claims are accurate' },
    ],
    templates: ['Product Description', 'Category Page', 'Buying Guide', 'Brand Story'],
  },
  tech: {
    id: 'tech',
    name: 'Technology',
    description: 'SaaS companies and tech startups',
    icon: 'Cpu',
    color: 'hsl(270, 70%, 50%)',
    complianceRules: [
      { id: 'data_privacy', name: 'Data Privacy Notice', required: false, description: 'How user data is handled' },
      { id: 'security', name: 'Security Claims', required: true, description: 'Verify security-related claims' },
      { id: 'integration_info', name: 'Integration Accuracy', required: false, description: 'Accurate integration/compatibility info' },
    ],
    templates: ['Technical Blog', 'Feature Announcement', 'Tutorial', 'Case Study'],
  },
  accounting: {
    id: 'accounting',
    name: 'Accounting',
    description: 'CPAs, bookkeepers, and financial advisors',
    icon: 'Calculator',
    color: 'hsl(45, 70%, 45%)',
    complianceRules: [
      { id: 'tax_disclaimer', name: 'Tax Advice Disclaimer', required: true, description: 'Not intended as tax advice' },
      { id: 'regulatory', name: 'Regulatory Compliance', required: true, description: 'SEC/FINRA compliance when applicable' },
      { id: 'credentials', name: 'Professional Credentials', required: true, description: 'CPA/certification disclosure' },
    ],
    templates: ['Tax Guide', 'Financial Tips Blog', 'Service Page', 'Industry Update'],
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    description: 'Banks, investment firms, and fintech',
    icon: 'TrendingUp',
    color: 'hsl(160, 70%, 40%)',
    complianceRules: [
      { id: 'risk_disclaimer', name: 'Risk Disclaimer', required: true, description: 'Investment risk disclosure' },
      { id: 'regulatory', name: 'Regulatory Disclosures', required: true, description: 'SEC/FINRA required disclosures' },
      { id: 'performance', name: 'Past Performance', required: false, description: 'Past performance disclaimers' },
    ],
    templates: ['Market Analysis', 'Investment Guide', 'Product Page', 'Educational Content'],
  },
  real_estate: {
    id: 'real_estate',
    name: 'Real Estate',
    description: 'Brokers, agents, and property managers',
    icon: 'Home',
    color: 'hsl(25, 70%, 50%)',
    complianceRules: [
      { id: 'fair_housing', name: 'Fair Housing', required: true, description: 'Fair housing compliance' },
      { id: 'license', name: 'License Disclosure', required: true, description: 'Agent/broker license number' },
      { id: 'mls_accuracy', name: 'MLS Accuracy', required: false, description: 'Accurate listing information' },
    ],
    templates: ['Property Listing', 'Neighborhood Guide', 'Market Report', 'Agent Bio'],
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Define your own industry and rules',
    icon: 'Settings',
    color: 'hsl(0, 0%, 50%)',
    complianceRules: [],
    templates: ['Blog Post', 'Landing Page', 'Email Newsletter', 'Social Post'],
  },
};

export const getVerticalConfig = (vertical: VerticalType): VerticalConfig => {
  return verticalConfigs[vertical];
};

export const getAllVerticals = (): VerticalConfig[] => {
  return Object.values(verticalConfigs);
};
