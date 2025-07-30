// Type definitions for all page content structures

// About Page Types
export interface AboutHeroSection {
  title: string
  subtitle: string
  description: string
  quote: string
  backgroundImage: string
}

export interface CoreValue {
  title: string
  description: string
  icon: string
}

export interface CoreValuesSection {
  title: string
  description: string
  items: CoreValue[]
}

export interface Credential {
  title: string
  organization: string
}

export interface CredentialsSection {
  title: string
  items: Credential[]
}

export interface AboutCTASection {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export interface AboutPageContent {
  hero: AboutHeroSection
  coreValues: CoreValuesSection
  credentials: CredentialsSection
  cta: AboutCTASection
}

// Services Page Types
export interface ServiceFeature {
  text: string
}

export interface Service {
  title: string
  subtitle: string
  description: string
  features: ServiceFeature[]
  price: string
  icon: string
  image: string
  popular?: boolean
}

export interface ServicesHeroSection {
  title: string
  description: string
}

export interface ServicesSection {
  items: Service[]
}

export interface ComparisonItem {
  text: string
}

export interface ComparisonSection {
  title: string
  description: string
  singleSessions: {
    title: string
    items: ComparisonItem[]
  }
  packagePrograms: {
    title: string
    items: ComparisonItem[]
  }
}

export interface ServicesCTASection {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export interface ServicesPageContent {
  hero: ServicesHeroSection
  services: ServicesSection
  comparison: ComparisonSection
  cta: ServicesCTASection
}

// Contact Page Types
export interface ContactHeroSection {
  title: string
  description: string
  backgroundImage: string
}

export interface ContactFormSection {
  title: string
  namePlaceholder: string
  emailPlaceholder: string
  messagePlaceholder: string
  submitButtonText: string
}

export interface BookingSection {
  title: string
  description: string
  placeholderText: string
  calendlyUrl?: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
  description: string
}

export interface SocialLinksSection {
  title: string
  items: SocialLink[]
}

export interface ContactAlternativeSection {
  title: string
  description: string
  buttonText: string
}

export interface ContactPageContent {
  hero: ContactHeroSection
  form: ContactFormSection
  booking: BookingSection
  socialLinks: SocialLinksSection
  alternative: ContactAlternativeSection
}

// Transform Page Types
export interface TransformationStage {
  title: string
  description: string
  image: string
  emotion: string
  order: number
}

export interface TransformHeroSection {
  title: string
  subtitle: string
  description: string
  instruction: string
}

export interface TransformStagesSection {
  items: TransformationStage[]
}

export interface TransformCTASection {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

export interface TransformPageContent {
  hero: TransformHeroSection
  stages: TransformStagesSection
  cta: TransformCTASection
}

// Union type for all page content
export type PageContentType = 
  | { page: 'home', content: import('./homeContent').HomePageContent }
  | { page: 'about', content: AboutPageContent }
  | { page: 'services', content: ServicesPageContent }
  | { page: 'contact', content: ContactPageContent }
  | { page: 'transform', content: TransformPageContent }

// Page content field values
export type PageContentFieldValue = string | number | boolean

// Generic content section type
export type ContentSection = string

// Type guards
export function isAboutPageContent(content: unknown): content is AboutPageContent {
  if (!content || typeof content !== 'object') return false
  const c = content as Record<string, unknown>
  return typeof c.hero === 'object' && typeof c.coreValues === 'object' && typeof c.credentials === 'object' && typeof c.cta === 'object'
}

export function isServicesPageContent(content: unknown): content is ServicesPageContent {
  if (!content || typeof content !== 'object') return false
  const c = content as Record<string, unknown>
  return typeof c.hero === 'object' && typeof c.services === 'object' && typeof c.comparison === 'object' && typeof c.cta === 'object'
}

export function isContactPageContent(content: unknown): content is ContactPageContent {
  if (!content || typeof content !== 'object') return false
  const c = content as Record<string, unknown>
  return typeof c.hero === 'object' && typeof c.form === 'object' && typeof c.booking === 'object'
}

export function isTransformPageContent(content: unknown): content is TransformPageContent {
  if (!content || typeof content !== 'object') return false
  const c = content as Record<string, unknown>
  return typeof c.hero === 'object' && typeof c.stages === 'object' && typeof c.cta === 'object'
}
