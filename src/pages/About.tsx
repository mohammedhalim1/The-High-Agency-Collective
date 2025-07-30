import { Link } from 'react-router-dom';
import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';
import { AboutPageContent, CoreValue, Credential } from '@/types/pageContent';
import { createDefaultAboutContent as createDefault } from '@/lib/defaultContent';

const About = (): JSX.Element => {
  const { data: pageData, isLoading } = usePageContent('about');

  // Enable real-time updates
  useRealtimeContent('about');

  // Default fallback content
  const defaultContent: AboutPageContent = createDefault();

  // Use content from Supabase or fallback to default
  const content: AboutPageContent = pageData?.content || defaultContent;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 heading-primary" style={{color: 'var(--text-primary)'}}>
                {content.hero?.title || defaultContent.hero.title}
              </h1>
              <blockquote className="text-2xl md:text-3xl font-light mb-8 leading-relaxed heading-primary" style={{color: 'var(--button-primary)'}}>
                {content.hero?.subtitle || defaultContent.hero.subtitle}
              </blockquote>
              <p className="text-lg leading-relaxed mb-8 body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
                {content.hero?.description || defaultContent.hero.description}
              </p>
              <p className="text-lg leading-relaxed body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
                {content.hero?.quote || defaultContent.hero.quote}
              </p>
            </div>
            <div className="relative">
              <div 
                className="w-full h-96 bg-cover bg-center rounded-3xl shadow-2xl"
                style={{
                  backgroundImage: `url('${content.hero?.backgroundImage || defaultContent.hero.backgroundImage}')`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20" style={{background: 'var(--background)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 heading-primary" style={{color: 'var(--text-primary)'}}>
              {content.coreValues?.title || defaultContent.coreValues.title}
            </h2>
            <p className="text-xl max-w-2xl mx-auto body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
              {content.coreValues?.description || defaultContent.coreValues.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(content.coreValues?.items || defaultContent.coreValues.items).map((value: CoreValue, index: number) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg" style={{background: 'var(--gradient-primary)'}}>
                  <span className="text-3xl text-light font-bold heading-primary">
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 heading-primary" style={{color: 'var(--text-primary)'}}>
                  {value.title}
                </h3>
                <p className="leading-relaxed body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 section-divider">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 heading-primary" style={{color: 'var(--text-primary)'}}>
            {content.credentials?.title || defaultContent.credentials.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(content.credentials?.items || defaultContent.credentials.items).map((credential: Credential, index: number) => (
              <div key={index} className="card-white p-8">
                <h3 className="text-xl font-semibold mb-2 heading-primary" style={{color: 'var(--text-primary)'}}>
                  {credential.title}
                </h3>
                <p className="body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
                  {credential.organization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book a Session CTA */}
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

export default About;
