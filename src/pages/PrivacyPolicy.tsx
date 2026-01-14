import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

interface PrivacyContent {
  title?: string;
  sections?: Array<{
    title: string;
    content?: string;
    listItems?: string[];
  }>;
}

const PrivacyPolicy = () => {
  const { data: pageData, isLoading, error } = usePageContent('privacy-policy');

  // Enable real-time updates
  useRealtimeContent('privacy-policy');

  // Default fallback content
  const defaultContent: PrivacyContent = {
    title: "Privacy Policy",
    sections: [
      {
        title: "Type of Information Collected:",
        content: "We receive, collect and store any information you enter on our website or provide us in any other way. In addition, we collect the Internet protocol (IP) address used to connect your computer to the Internet; login; e-mail address; password; computer and connection information and purchase history. We may use software tools to measure and collect session information, including page response times, length of visits to certain pages, page interaction information, and methods used to browse away from the page. We also collect personally identifiable information (including name, email, password, communications); payment details (including credit card information), comments, feedback, product reviews, recommendations, and personal profile."
      },
      {
        title: "Purpose of Collecting Information",
        listItems: [
          "To provide and operate the Services;",
          "To provide our Users with ongoing customer assistance and technical support;",
          "To be able to contact our Visitors and Users with general or personalized service-related notices and promotional messages;",
          "To create aggregated statistical data and other aggregated and/or inferred Non-personal Information, which we or our business partners may use to provide and improve our respective services;",
          "To comply with any applicable laws and regulations."
        ]
      },
      {
        title: "How We Store, Use, Share and Disclose Site Visitor's Personal Information?",
        content: "Our company is hosted on the Netlify platform. Netlify provides us with the online platform that allows us to sell our products and services to you. Your data may be stored through Netlify's data storage, databases and the general Netlify applications. They store your data on secure servers behind a firewall. All direct payment gateways offered by Netlify and used by our company adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers."
      },
      {
        title: "How We Communicate With Site Visitors",
        content: "We may contact you to notify you regarding your account, to troubleshoot problems with your account, to resolve a dispute, to collect fees or monies owed, to poll your opinions through surveys or questionnaires, to send updates about our company, or as otherwise necessary to contact you to enforce our User Agreement, applicable national laws, and any agreement we may have with you. For these purposes we may contact you via email, telephone, text messages, and postal mail."
      },
      {
        title: "How We Use Cookies & Other Tracking Tools",
        content: "If your website tracks personal information through the use of cookies, for example, you must make this clear to your site visitors. Be clear about what tracking tools (e.g. cookies, flash cookies, web beacons, etc.,) your website employs, what personal information they gather and why they are being used. It's important to note that third-party services, such as Google Analytics or other applications offered through the Netlify App Market, placing cookies or utilizing other tracking technologies through Netlify's services, may have their own policies regarding how they collect and store information. As these are external services, such practices are not covered by the Netlify Privacy Policy."
      },
      {
        title: "How Visitors Can Withdraw Their Consent",
        content: "If you don't want us to process your data anymore, please contact us at info@thehacollective.com or unsubscribe through the next email campaign."
      },
      {
        title: "Questions & Contact Information",
        content: "If you would like to: access, correct, amend or delete any personal information we have about you, you are invited to contact us at info@thehacollective.com"
      }
    ]
  };

  // Use content from Supabase or fallback to default
  const content: PrivacyContent = pageData?.content || defaultContent;

  console.log('🔄 Privacy page rendering with data from:', pageData ? 'Supabase' : 'default fallback');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{color: 'var(--button-primary)'}} />
      </div>
    );
  }

  if (error) {
    console.error('❌ Error loading privacy content:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">
            {content.title || defaultContent.title}
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            {(content.sections || defaultContent.sections!).map((section, index) => (
              <section key={index}>
                <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">
                  {section.title}
                </h2>
                
                {section.content && (
                  <p dangerouslySetInnerHTML={{ 
                    __html: section.content.replace(
                      /info@thehacollective\.com/g, 
                      '<a href="mailto:info@thehacollective.com" class="text-primary hover:underline">info@thehacollective.com</a>'
                    )
                  }} />
                )}
                
                {section.listItems && (
                  <ol className="list-decimal list-inside space-y-2">
                    {section.listItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>

          {/* Display data source for debugging */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500">
            Data source: {pageData ? `Supabase (updated: ${pageData.updated_at})` : 'Default fallback'}
            {pageData && (
              <span className="ml-2">• Fresh fetch at: {new Date().toISOString()}</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
