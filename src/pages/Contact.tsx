import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';
import { ContactPageContent, SocialLink } from '@/types/pageContent';
import { createDefaultContactContent } from '@/lib/defaultContent';

const Contact = (): JSX.Element => {
  const { data: pageData, isLoading } = usePageContent('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  // Enable real-time updates
  useRealtimeContent('contact');

  // Default fallback content
  const defaultContent: ContactPageContent = createDefaultContactContent();

  // Use content from Supabase or fallback to default
  const content: ContactPageContent = pageData?.content || defaultContent;

  // Log data source for debugging
  console.log('📞 Contact page rendering with data from:', pageData ? 'Supabase' : 'default fallback');
  if (pageData) {
    console.log('📊 Contact data freshness:', {
      slug: pageData.slug,
      updated_at: pageData.updated_at,
      fetched_at: new Date().toISOString()
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
      <section 
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('${content.hero?.backgroundImage || defaultContent.hero.backgroundImage}')`,
        }}
      >
        <div className="absolute inset-0" style={{background: 'var(--overlay)'}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-light mb-6 heading-primary">
            {content.hero?.title || defaultContent.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-light-muted max-w-3xl mx-auto leading-relaxed body-text">
            {content.hero?.description || defaultContent.hero.description}
          </p>
        </div>
      </section>

      <div className="py-20 section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 heading-primary" style={{color: 'var(--text-primary)'}}>
                {content.form?.title || defaultContent.form.title}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 body-text" style={{color: 'var(--text-primary)'}}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl focus:ring-2 transition-all duration-200 shadow-sm body-text"
                    style={{
                      border: '1px solid var(--card-background-end)',
                      background: 'var(--text-light)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--button-shadow)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    placeholder={content.form?.namePlaceholder || defaultContent.form.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 body-text" style={{color: 'var(--text-primary)'}}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl focus:ring-2 transition-all duration-200 shadow-sm body-text"
                    style={{
                      border: '1px solid var(--card-background-end)',
                      background: 'var(--text-light)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--button-shadow)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    placeholder={content.form?.emailPlaceholder || defaultContent.form.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 body-text" style={{color: 'var(--text-primary)'}}>
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl focus:ring-2 transition-all duration-200 resize-none shadow-sm body-text"
                    style={{
                      border: '1px solid var(--card-background-end)',
                      background: 'var(--text-light)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--button-shadow)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    placeholder={content.form?.messagePlaceholder || defaultContent.form.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full cta-button text-lg"
                >
                  {content.form?.submitButtonText || defaultContent.form.submitButtonText}
                </button>
              </form>
            </div>

            {/* Contact Info & Booking */}
            <div className="space-y-12">
              {/* Direct Booking */}
              <div className="card-white p-8">
                <h3 className="text-2xl font-bold mb-4 heading-primary" style={{color: 'var(--text-primary)'}}>
                  {content.booking?.title || defaultContent.booking.title}
                </h3>
                <p className="mb-6 leading-relaxed body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
                  {content.booking?.description || defaultContent.booking.description}
                </p>
                                                <div className="rounded-2xl shadow-sm overflow-hidden" style={{background: 'var(--text-light)', border: '1px solid var(--card-background-end)'}}>
                  <div className="p-4 text-center" style={{background: 'var(--card-background-end)'}}>
                    <h4 className="text-lg font-semibold heading-secondary" style={{color: 'var(--text-primary)'}}>
                      Book Your 30-Minute Session Below
                    </h4>
                  </div>
                  <div className="p-2">
                    {(content.booking?.calendlyUrl || defaultContent.booking?.calendlyUrl) ? (
                      <iframe
                        src={content.booking?.calendlyUrl || defaultContent.booking?.calendlyUrl}
                        width="100%"
                        height="700"
                        frameBorder="0"
                        scrolling="no"
                        title="Schedule a meeting with us"
                        style={{border: 'none', borderRadius: '8px'}}
                      ></iframe>
                    ) : (
                      <div className="p-8 rounded-xl text-center" style={{background: 'var(--background)'}}>
                        <p className="text-sm body-text" style={{color: 'var(--text-primary)', opacity: 0.6}}>
                          [Calendly Integration Placeholder]
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-2xl font-bold mb-6 heading-primary" style={{color: 'var(--text-primary)'}}>
                  {content.socialLinks?.title || defaultContent.socialLinks.title}
                </h3>
                <div className="space-y-4">
                  {(content.socialLinks?.items || defaultContent.socialLinks.items).map((link: SocialLink, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      className="flex items-center p-4 card-white hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: 'var(--gradient-primary)'}}>
                        <span className="text-light font-bold">{link.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold heading-secondary" style={{color: 'var(--text-primary)'}}>{link.platform}</p>
                        <p className="text-sm body-text" style={{color: 'var(--text-primary)', opacity: 0.7}}>{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Alt CTA */}
              <div className="card-white p-8 text-center">
                <h3 className="text-xl font-bold mb-4 heading-primary" style={{color: 'var(--text-primary)'}}>
                  {content.alternative?.title || defaultContent.alternative.title}
                </h3>
                <p className="mb-6 body-text" style={{color: 'var(--text-primary)', opacity: 0.8}}>
                  {content.alternative?.description || defaultContent.alternative.description}
                </p>
                {content.contact?.driveLink && (
                  <a
                    href={content.contact.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondary-button shadow-lg"
                  >
                    Download the Journal
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
