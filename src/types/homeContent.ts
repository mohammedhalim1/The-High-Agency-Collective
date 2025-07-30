// TypeScript interfaces for Home page content structure

export interface HeroSection {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  ctaText: string
  ctaLink: string
}

export interface Pillar {
  title: string
  description: string
  image: string
}

export interface PillarsSection {
  title: string
  description: string
  items: Pillar[]
}

export interface QuoteSection {
  text: string
  author: string
  backgroundImage: string
}

export interface Testimonial {
  name: string
  text: string
  role: string
  image1?: string
  image2?: string
  image3?: string
}

export interface TestimonialsSection {
  title: string
  description: string
  items: Testimonial[]
}

export interface CTASection {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
}

export interface HomePageContent {
  hero: HeroSection
  pillars: PillarsSection
  quote: QuoteSection
  testimonials: TestimonialsSection
  cta: CTASection
}

// Utility types for content management
export type ContentSection = 'hero' | 'pillars' | 'quote' | 'testimonials' | 'cta'
export type ContentFieldValue = string | number | boolean
export type PillarField = keyof Pillar
export type TestimonialField = keyof Testimonial

// Type guard to check if content is valid HomePageContent
export function isValidHomePageContent(content: unknown): content is HomePageContent {
  if (!content || typeof content !== 'object') return false
  
  const c = content as Record<string, unknown>
  
  return (
    typeof c.hero === 'object' &&
    typeof c.pillars === 'object' &&
    typeof c.quote === 'object' &&
    typeof c.testimonials === 'object' &&
    typeof c.cta === 'object'
  )
}

// Default content factory function with proper typing
export function createDefaultHomePageContent(): HomePageContent {
  return {
    hero: {
      title: "Step into Elegant Self-Leadership.",
      subtitle: "Own your Power. Shape your Story.", 
      description: "Embrace your feminine strength, align with your deepest truth, and create a life that flows with purpose and joy.",
      backgroundImage: "/assets/hero_woman_spa.jpg",
      ctaText: "Work With Me",
      ctaLink: "/contact"
    },
    pillars: {
      title: "The Three Pillars",
      description: "A holistic approach to awakening your feminine power through emotional wellness, career alignment, and authentic self-expression.",
      items: [
        {
          title: "Emotional Wellness",
          description: "Heal deep wounds, release limiting beliefs, and cultivate emotional intelligence that serves your highest self.",
          image: "/assets/pillar_emotion.jpg"
        },
        {
          title: "Career Alignment",
          description: "Discover your soul's calling and create a career path that honors both your ambitions and your values.",
          image: "/assets/pillar_career.jpg"
        },
        {
          title: "Feminine Power Activation",
          description: "Embrace your intuition, creativity, and natural cycles to live in harmony with your feminine essence.",
          image: "/assets/pillar_feminine.jpg"
        }
      ]
    },
    quote: {
      text: "The most powerful thing you can do is to begin to honor the woman you're becoming while loving the woman you've been.",
      author: "Your journey starts with self-compassion",
      backgroundImage: "/assets/bubblebath_reflection.jpg"
    },
    testimonials: {
      title: "Transformation Stories",
      description: "Real women, real breakthroughs, real power awakened.",
      items: [
                {
          name: "Sarah Martinez",
          text: "Working with this coach transformed how I see myself. I finally feel aligned with my true purpose and confident in my feminine power.",
          role: "Marketing Director",
          image1: "",
          image2: "",
          image3: ""
        },
        {
          name: "Amara Johnson",
          text: "The deep inner work we did together helped me break through patterns that were holding me back. I'm living authentically now.",
          role: "Entrepreneur",
          image1: "",
          image2: "",
          image3: ""
        },
        {
          name: "Elena Rodriguez",
          text: "I discovered strength I didn't know I had. This journey awakened something beautiful within me that I'm still exploring.",
          role: "Creative Director",
          image1: "",
          image2: "",
          image3: ""
        }
      ]
    },
    cta: {
      title: "Take the First Step",
      description: "Your transformation begins with a single conversation. Let's talk about where you are and where you want to be.",
      buttonText: "Book Your Clarity Session",
      buttonLink: "/contact",
      backgroundImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&q=80"
    }
  }
}
