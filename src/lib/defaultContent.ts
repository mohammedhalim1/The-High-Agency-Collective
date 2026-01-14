// Default content factories for all pages

import { 
  AboutPageContent, 
  ServicesPageContent, 
  ContactPageContent, 
  TransformPageContent 
} from '@/types/pageContent'

export function createDefaultAboutContent(): AboutPageContent {
  return {
    hero: {
      title: "THE High Agency Collective",
      subtitle: "Elegant Self-Leadership for Ambitious Women",
      description: "At THE High Agency Collective, I help ambitious women stop playing small and step fully into elegant self-leadership. Through holistic mindset transformation, strategic reinvention, and refined lifestyle curation, I guide women in becoming the most authentic, self-led version of themselves—inside and out.",
      quote: "This is about more than surface-level success; it's about embodying self assurance, high standards, and undeniable feminine presence. Becoming her—the woman who leads her life with intention, grace, and power. As a Psychiatric and Mental Health Nurse Practitioner, I bring both clinical expertise and soulful coaching to guide this deep transformation.",
      backgroundImage: "/assets/coach_portrait.jpg"
    },
    coreValues: {
      title: "Core Values",
      description: "The principles that guide every session, every conversation, and every transformation.",
      items: [
        {
          title: "Authenticity",
          description: "Your truth matters. We create space for you to express who you really are, without masks or pretense.",
          icon: "A"
        },
        {
          title: "Balance", 
          description: "Honoring both your strength and softness, your ambition and your need for rest, your giving and receiving.",
          icon: "B"
        },
        {
          title: "Empowerment",
          description: "You already have everything you need within you. I simply help you remember and access your innate power.",
          icon: "E"
        }
      ]
    },
    credentials: {
      title: "Credentials & Training",
      items: [
        {
          title: "Certified Life Coach",
          organization: "International Coach Federation (ICF)"
        },
        {
          title: "Feminine Leadership Certification",
          organization: "Institute for Feminine Leadership"
        },
        {
          title: "Inner Child Healing",
          organization: "Trauma-Informed Healing Methods"
        },
        {
          title: "Sacred Feminine Studies",
          organization: "Divine Feminine Academy"
        }
      ]
    },
    cta: {
      title: "Ready to Begin?",
      description: "Every transformation starts with a single step. Let's take that step together.",
      buttonText: "Book a Session",
      buttonLink: "/contact"
    }
  }
}

export function createDefaultServicesContent(): ServicesPageContent {
  return {
    hero: {
      title: "Coaching Services",
      description: "Choose the path that resonates with your heart and honors where you are in your journey right now."
    },
    services: {
      items: [
        {
          title: "Clarity Session",
          subtitle: "Single Deep Dive",
          description: "A focused 90-minute session to gain clarity on your current challenges and create a pathway forward.",
          features: [
            { text: "Deep exploration of your current situation" },
            { text: "Identification of core limiting beliefs" },
            { text: "Personalized action plan" },
            { text: "Resource recommendations" }
          ],
          price: "$197",
          icon: "🌿",
          image: "/assets/service_clarity.jpg"
        },
        {
          title: "Monthly Deep Work",
          subtitle: "4 Sessions Package",
          description: "Consistent monthly support for ongoing transformation and accountability in your feminine power journey.",
          features: [
            { text: "Four 75-minute coaching sessions" },
            { text: "Email support between sessions" },
            { text: "Customized practices and exercises" },
            { text: "Progress tracking and adjustments" }
          ],
          price: "$697",
          icon: "🌙",
          image: "/assets/service_monthly.jpg",
          popular: true
        },
        {
          title: "Feminine Flow Package",
          subtitle: "3-Month Transformation",
          description: "A comprehensive journey of feminine awakening, career alignment, and deep inner work over three months.",
          features: [
            { text: "Twelve 75-minute sessions" },
            { text: "Unlimited email and voice message support" },
            { text: "Custom meditation and journaling practices" },
            { text: "Feminine cycle alignment guidance" },
            { text: "Career transition support" },
            { text: "Integration practices for lasting change" }
          ],
          price: "$1,997",
          icon: "🌸",
          image: "/assets/service_flow.jpg"
        }
      ]
    },
    comparison: {
      title: "Which Path is Right for You?",
      description: "Understanding the difference between single sessions and comprehensive packages.",
      singleSessions: {
        title: "Single Sessions",
        items: [
          { text: "Perfect for gaining immediate clarity" },
          { text: "Quick breakthrough on specific issues" },
          { text: "No long-term commitment" },
          { text: "Great for trying out the coaching style" }
        ]
      },
      packagePrograms: {
        title: "Package Programs", 
        items: [
          { text: "Deep, lasting transformation" },
          { text: "Ongoing support and accountability" },
          { text: "Time to integrate new patterns" },
          { text: "Comprehensive feminine awakening journey" }
        ]
      }
    },
    cta: {
      title: "Ready to Choose Your Path?",
      description: "Still not sure which option is right for you? Let's have a conversation to explore what would serve you best.",
      buttonText: "Schedule a Discovery Call",
      buttonLink: "/contact"
    }
  }
}

export function createDefaultContactContent(): ContactPageContent {
  return {
    hero: {
      title: "Let's Connect",
      description: "Your transformation journey begins with a conversation. I'm here to listen, support, and guide you forward.",
      backgroundImage: "/assets/contact_background.jpg"
    },
    form: {
      title: "Send me a message",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "your.email@example.com",
      messagePlaceholder: "Tell me about what you're experiencing and what kind of support you're looking for...",
      submitButtonText: "Send Message",
      formspreeUrl: "https://formspree.io/f/xvgqqrdl"
    },
    booking: {
      title: "Ready to begin your transformation?",
      description: "Book a 30-minute session below:",
      placeholderText: "Book a Session", calendlyUrl: "https://calendly.com/tashaniyi/30min"
    },
    socialLinks: {
      title: "Connect with me",
      items: [
        {
          platform: "Instagram",
          url: "https://instagram.com/awakenherpower",
          icon: "IG",
          description: "Daily inspiration & insights"
        },
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/in/awakenherpower", 
          icon: "LI",
          description: "Professional insights & articles"
        },
        {
          platform: "Email",
          url: "mailto:hello@awakenherpower.com",
          icon: "@",
          description: "hello@awakenherpower.com"
        }
      ]
    },
    alternative: {
      title: "Not ready to talk?",
      description: "That's perfectly okay. Sometimes we need to dip our toes in the water first.",
      buttonText: "Try a Clarity Session"
    }
  }
}

export function createDefaultTransformContent(): TransformPageContent {
  return {
    hero: {
      title: "Your Transformation",
      subtitle: "Journey",
      description: "Every woman's path is unique, but the journey of awakening follows a beautiful pattern.",
      instruction: "Scroll to experience the transformation ↓"
    },
    stages: {
      items: [
        {
          title: "Feeling Lost",
          description: "You know something needs to change, but you're not sure what or how. The path forward feels unclear.",
          image: "/assets/transform_1_lost.jpg",
          emotion: "Confusion",
          order: 1
        },
        {
          title: "Discovery",
          description: "Through gentle exploration, you begin to uncover your authentic self and what truly matters to you.",
          image: "/assets/transform_2_discovery.jpg",
          emotion: "Curiosity", 
          order: 2
        },
        {
          title: "Confidence",
          description: "As clarity emerges, you start taking aligned action and trusting your inner wisdom more deeply.",
          image: "/assets/transform_3_confidence.jpg",
          emotion: "Strength",
          order: 3
        },
        {
          title: "Empowered",
          description: "You now move through life with purpose, embracing your feminine power and creating meaningful change.",
          image: "/assets/transform_4_empowered.jpg",
          emotion: "Freedom",
          order: 4
        }
      ]
    },
    cta: {
      title: "Your Journey Awaits",
      description: "Every transformation begins with a single step. What stage resonates most with where you are right now?",
      primaryButtonText: "Explore Services",
      primaryButtonLink: "/services",
      secondaryButtonText: "Start Today",
      secondaryButtonLink: "/contact"
    }
  }
}
