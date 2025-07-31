import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';
import { ServicesPageContent, Service, ServiceFeature, ComparisonItem } from '@/types/pageContent';
import { createDefaultServicesContent } from '@/lib/defaultContent';

const Services = (): JSX.Element => {
  const { data: pageData, isLoading } = usePageContent('services');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Enable real-time updates
  useRealtimeContent('services');

  // Default fallback content
  const defaultContent: ServicesPageContent = createDefaultServicesContent();

  // Use content from Supabase or fallback to default
  const content: ServicesPageContent = pageData?.content || defaultContent;
  const services: Service[] = content.services?.items || defaultContent.services.items;

  // Log data source for debugging
  console.log('💼 Services page rendering with data from:', pageData ? 'Supabase' : 'default fallback');
  if (pageData) {
    console.log('📊 Services data freshness:', {
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
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 heading-primary" style={{color: 'var(--text-primary)'}}>
            {content.hero?.title || defaultContent.hero.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
            {content.hero?.description || defaultContent.hero.description}
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20" style={{background: 'var(--background)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service: Service, index: number) => (
              <div
                key={index}
                className="relative p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
                style={{
                  background: 'var(--gradient-primary)',
                  boxShadow: hoveredCard === index 
                    ? '0 25px 50px var(--button-shadow)' 
                    : '0 15px 30px var(--button-shadow)'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 rounded-full text-sm font-medium body-text" style={{background: 'var(--text-primary)', color: 'var(--text-light)'}}>
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-light mb-2 heading-primary">
                    {service.title}
                  </h3>
                  <p className="text-light-muted text-lg font-medium mb-4 heading-secondary">
                    {service.subtitle}
                  </p>
                  <div className="text-3xl font-bold text-light mb-4 heading-primary">
                    {service.price}
                  </div>
                </div>

                <p className="text-light-muted text-center mb-8 leading-relaxed body-text">
                  {service.description}
                </p>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature: ServiceFeature, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-start">
                      <span className="text-light mr-3 mt-1">✓</span>
                      <span className="text-light-muted text-sm leading-relaxed body-text">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="w-full h-64 bg-cover bg-center rounded-2xl mb-6 opacity-90 shadow-lg"
                  style={{
                    backgroundImage: `url('${service.image}')`,
                  }}
                ></div>

                <Link
                  to="/contact"
                  className={`w-full block text-center px-6 py-4 rounded-full font-medium transition-all duration-300 transform body-text ${
                    hoveredCard === index ? 'scale-105' : ''
                  }`}
                  style={{
                    background: 'var(--text-light)',
                    color: 'var(--button-primary)'
                  }}
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Block */}
      <section className="py-20 section-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 heading-primary" style={{color: 'var(--text-primary)'}}>
              {content.comparison?.title || defaultContent.comparison.title}
            </h2>
            <p className="text-xl max-w-2xl mx-auto body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
              {content.comparison?.description || defaultContent.comparison.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Single Sessions */}
            <div className="card-white p-8">
              <h3 className="text-2xl font-bold mb-6 text-center heading-primary" style={{color: 'var(--text-primary)'}}>
                {content.comparison?.singleSessions?.title || defaultContent.comparison.singleSessions.title}
              </h3>
              <div className="space-y-4">
                {(content.comparison?.singleSessions?.items || defaultContent.comparison.singleSessions.items).map((item: ComparisonItem, index: number) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-3 mt-1" style={{color: 'var(--button-primary)'}}>✓</span>
                    <span className="body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Sessions */}
            <div className="card-white p-8" style={{border: '2px solid var(--button-primary)'}}>
              <h3 className="text-2xl font-bold mb-6 text-center heading-primary" style={{color: 'var(--text-primary)'}}>
                {content.comparison?.packagePrograms?.title || defaultContent.comparison.packagePrograms.title}
              </h3>
              <div className="space-y-4">
                {(content.comparison?.packagePrograms?.items || defaultContent.comparison.packagePrograms.items).map((item: ComparisonItem, index: number) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-3 mt-1" style={{color: 'var(--button-primary)'}}>✓</span>
                    <span className="body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-light mb-6 heading-primary">
            {content.cta?.title || defaultContent.cta.title}
          </h2>
          <p className="text-xl text-light-muted mb-8 leading-relaxed body-text">
            {content.cta?.description || defaultContent.cta.description}
          </p>
          <Link
            to={content.cta?.buttonLink || defaultContent.cta.buttonLink}
            className="secondary-button shadow-lg"
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

export default Services;
