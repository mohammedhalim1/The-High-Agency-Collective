import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';
import { TransformPageContent, TransformationStage } from '@/types/pageContent';
import { createDefaultTransformContent } from '@/lib/defaultContent';

const Transform = (): JSX.Element => {
  const { data: pageData, isLoading } = usePageContent('transform');
  const [currentStage, setCurrentStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Enable real-time updates
  useRealtimeContent('transform');

  // Default fallback content
  const defaultContent: TransformPageContent = createDefaultTransformContent();

  // Use content from Supabase or fallback to default
  const content: TransformPageContent = pageData?.content || defaultContent;
  const stages: TransformationStage[] = content.stages?.items || defaultContent.stages.items;

  // Log data source for debugging
  console.log('✨ Transform page rendering with data from:', pageData ? 'Supabase' : 'default fallback');
  if (pageData) {
    console.log('📊 Transform data freshness:', {
      slug: pageData.slug,
      updated_at: pageData.updated_at,
      fetched_at: new Date().toISOString()
    });
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
      
      const stageIndex = Math.floor(progress * stages.length);
      setCurrentStage(Math.min(stageIndex, stages.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stages.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{color: 'var(--button-primary)'}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50" style={{background: 'var(--card-background-end)'}}>
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${scrollProgress * 100}%`,
            background: 'var(--gradient-primary)'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center section-divider">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 heading-primary" style={{color: 'var(--text-primary)'}}>
            {content.hero?.title || defaultContent.hero.title}
            <span className="block text-3xl md:text-4xl font-light mt-2" style={{color: 'var(--button-primary)'}}>
              {content.hero?.subtitle || defaultContent.hero.subtitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
            {content.hero?.description || defaultContent.hero.description}
          </p>
          <p className="text-lg body-text" style={{color: 'var(--text-primary)', opacity: 0.7}}>
            {content.hero?.instruction || defaultContent.hero.instruction}
          </p>
        </div>
      </section>

      {/* Transformation Stages */}
      {stages.map((stage: TransformationStage, index: number) => (
        <section 
          key={index}
          className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
            index === currentStage ? 'opacity-100' : 'opacity-60'
          }`}
          style={{
            background: index % 2 === 0 
              ? 'var(--gradient-primary)' 
              : 'var(--gradient-secondary)',
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(var(--overlay), var(--overlay)), url('${stage.image}')`,
            }}
          />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-light">
            <div className={`transform transition-all duration-1000 ${
              index === currentStage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
            }`}>
              <div className="text-6xl md:text-8xl font-light mb-4 text-light-muted heading-primary">
                {String(stage.order).padStart(2, '0')}
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-light heading-primary">
                {stage.title}
              </h2>
              
              <div className="text-lg md:text-xl font-medium mb-8 text-light-muted heading-secondary">
                {stage.emotion}
              </div>
              
              <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto text-light body-text">
                {stage.description}
              </p>
              
              {index === stages.length - 1 && (
                <div className="mt-12 animate-fade-in">
                  <Link
                    to={content.cta?.secondaryButtonLink || defaultContent.cta.secondaryButtonLink}
                    className="secondary-button shadow-2xl"
                    style={{
                      background: 'var(--text-light)',
                      color: 'var(--button-primary)',
                      border: 'none'
                    }}
                  >
                    Let's Begin Your Journey
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA Section */}
      <section className="py-32 section-divider">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 heading-primary" style={{color: 'var(--text-primary)'}}>
            {content.cta?.title || defaultContent.cta.title}
          </h2>
          <p className="text-xl md:text-2xl mb-12 leading-relaxed body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
            {content.cta?.description || defaultContent.cta.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Link
              to={content.cta?.primaryButtonLink || defaultContent.cta.primaryButtonLink}
              className="cta-button text-lg"
            >
              {content.cta?.primaryButtonText || defaultContent.cta.primaryButtonText}
            </Link>
            <Link
              to={content.cta?.secondaryButtonLink || defaultContent.cta.secondaryButtonLink}
              className="secondary-button text-lg"
            >
              {content.cta?.secondaryButtonText || defaultContent.cta.secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transform;
