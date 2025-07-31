import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2, Star } from 'lucide-react';
import { HomePageContent, Testimonial, createDefaultHomePageContent } from '@/types/homeContent';
import PageFetchVerification from '@/components/PageFetchVerification';

const Home = (): JSX.Element => {
  const { data: pageData, isLoading } = usePageContent('home');

  // Enable real-time updates
  useRealtimeContent('home');

  // Default fallback content
  const defaultContent: HomePageContent = createDefaultHomePageContent();

  // Use content from Supabase or fallback to default
  const content: HomePageContent = pageData?.content || defaultContent;
  const testimonials: Testimonial[] = content.testimonials?.items || defaultContent.testimonials.items;

  // Log data source for debugging
  console.log('🏠 Home page rendering with data from:', pageData ? 'Supabase' : 'default fallback');
  if (pageData) {
    console.log('📊 Home data freshness:', {
      slug: pageData.slug,
      updated_at: pageData.updated_at,
      fetched_at: new Date().toISOString()
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{color: 'var(--button-primary)'}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${content.hero?.backgroundImage || defaultContent.hero.backgroundImage}')`,
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0" style={{background: 'var(--overlay)'}}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-light mb-6 leading-tight heading-primary">
            {content.hero?.title || defaultContent.hero.title}
            <span className="block text-3xl md:text-4xl font-light text-light-muted mt-2">
              {content.hero?.subtitle || defaultContent.hero.subtitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-light-muted mb-8 leading-relaxed max-w-2xl mx-auto body-text">
            {content.hero?.description || defaultContent.hero.description}
          </p>
          <Link
            to={content.hero?.ctaLink || defaultContent.hero.ctaLink}
            className="cta-button text-lg"
          >
            {content.hero?.ctaText || defaultContent.hero.ctaText}
          </Link>
        </div>
      </section>

      {/* The 3 Pillars Section */}
      <section className="py-20 section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 heading-primary" style={{color: 'var(--text-primary)'}}>
              {content.pillars?.title || defaultContent.pillars.title}
            </h2>
            <p className="text-xl max-w-2xl mx-auto body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
              {content.pillars?.description || defaultContent.pillars.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content.pillars?.items || defaultContent.pillars.items).map((pillar, index: number) => (
              <div key={index} className="card-white p-8 text-center">
                <div 
                  className="w-32 h-32 bg-cover bg-center rounded-full mx-auto mb-6 shadow-lg"
                  style={{
                    backgroundImage: `url('${pillar.image}')`,
                    border: '4px solid var(--card-background-end)'
                  }}
                ></div>
                <h3 className="text-2xl font-bold mb-4 heading-primary" style={{color: 'var(--button-primary)'}}>
                  {pillar.title}
                </h3>
                <p className="body-text leading-relaxed" style={{color: 'var(--text-primary)', opacity: 0.8}}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote & Visual Section */}
      <section 
        className="relative py-32 text-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${content.quote?.backgroundImage || defaultContent.quote.backgroundImage}')`,
        }}
      >
        <div className="absolute inset-0" style={{background: 'var(--overlay)'}}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="text-3xl md:text-4xl font-light text-light mb-8 leading-relaxed heading-primary">
            "{content.quote?.text || defaultContent.quote.text}"
          </blockquote>
          <p className="text-xl text-light-muted body-text">
            — {content.quote?.author || defaultContent.quote.author}
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{background: 'var(--background)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 heading-primary" style={{color: 'var(--text-primary)'}}>
              {content.testimonials?.title || defaultContent.testimonials.title}
            </h2>
            <p className="text-xl body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
              {content.testimonials?.subtitle || defaultContent.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index: number) => (
              <div key={index} className="card-white p-8 text-center">
                {/* Client Image */}
                <div 
                  className="w-20 h-20 bg-cover bg-center rounded-full mx-auto mb-6 shadow-lg"
                  style={{
                    backgroundImage: `url('${testimonial.image || '/assets/women_diverse_group.jpg'}')`,
                    border: '4px solid var(--card-background-end)'
                  }}
                ></div>

                {/* 5-Star Rating */}
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star 
                      key={starIndex} 
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg mb-6 leading-relaxed body-text" style={{color: 'var(--text-primary)', opacity: 0.9}}>
                  "{testimonial.testimonialText || testimonial.text}"
                </blockquote>

                {/* Client Name */}
                <div className="font-semibold text-lg heading-secondary" style={{color: 'var(--button-primary)'}}>
                  {testimonial.name}
                </div>

                {/* Client Role */}
                <div className="text-sm body-text mt-1" style={{color: 'var(--text-primary)', opacity: 0.7}}>
                  {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Banner */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(var(--overlay), var(--overlay)), url('${content.cta?.backgroundImage || defaultContent.cta.backgroundImage}')`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-light mb-6 heading-primary">
            {content.cta?.title || defaultContent.cta.title}
          </h2>
          <p className="text-xl text-light-muted mb-8 leading-relaxed body-text">
            {content.cta?.description || defaultContent.cta.description}
          </p>
          <Link
            to={content.cta?.buttonLink || defaultContent.cta.buttonLink}
            className="secondary-button text-lg"
            style={{
              background: 'var(--text-light)',
              color: 'var(--button-primary)',
              border: 'none'
            }}
          >
            {content.cta?.buttonText || defaultContent.cta.buttonText}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
