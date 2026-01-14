import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

interface TermsContent {
  title?: string;
  content?: string;
  sections?: Array<{
    title: string;
    content: string;
    subsections?: Array<{
      title: string;
      content: string;
    }>;
  }>;
}

const TermsConditions = () => {
  const { data: pageData, isLoading, error } = usePageContent('terms-conditions');

  // Enable real-time updates
  useRealtimeContent('terms-conditions');

  // Default fallback content
  const defaultContent: TermsContent = {
    title: "Terms and Conditions",
    content: "Client agrees to the following:",
    sections: [
      {
        title: "Courses:",
        content: "",
        subsections: [
          {
            title: "Use of Courses:",
            content: "All courses and content are the property of Tashaniyi Byrd and the High Agency Collective. Course content may only be used in the manner of personal use. Permission to use the material in any other way must be obtained in writing from Tashaniyi Byrd and the High Agency Collective. These materials are for the sole use of individuals registered for the course. As a course registrant, you may view and read all materials that are included in the course dashboard. You may also print any or all screen and pdf file pages for your personal use in taking the course, but you may not share, communicate, publish or in any manner distribute to other parties the course, login and password, recordings, references, links or any other materials. The terms and conditions regarding use of materials apply upon registration for the course, while you are taking the course, and upon and after completing, withdrawing from or terminating the course."
          },
          {
            title: "Course Access:",
            content: "Only course registrants have access to the course dashboard."
          },
          {
            title: "Refunds for Courses:",
            content: "You may withdraw from an online program at any time. However, once you have joined and have logged in to the course, you will not receive a refund for any reason."
          },
          {
            title: "Effective Period:",
            content: "Once a course is joined, lifetime access will be granted, however, registrant may be removed from course at any time if policies have been abused."
          }
        ]
      },
      {
        title: "1:1 Coaching Services:",
        content: "The services provided by Tashaniyi Byrd are generally conducted via Zoom. 1:1 coaching is a partnership focused on developing the client's awareness, thinking, and abilities in order to help the client identify and achieve her personal development goals. In coaching conversations, Tashaniyi Byrd will be direct and honest and encourage the Client to do the same. The success of the coaching engagement depends upon the Client's commitment and openness to the process. If the Client believes that coaching is not working as desired, the Client agrees to communicate this to the Coach. Please note that life coaching should not be used as a substitute for counseling, psychotherapy, psychoanalysis, mental health care, or substance abuse treatment and will not be used in place of any form of diagnosis, treatment, or therapy."
      },
      {
        title: "Coaching Confidentiality:",
        content: "Tashaniyi Byrd fully protects the privacy and confidentiality of the communications with her Clients. At no time will Tashaniyi Byrd voluntarily divulge the coaching relationship between herself and her Clients without vocal permission from the Clients, unless required to do so by law."
      },
      {
        title: "Coaching Session:",
        content: "At the scheduled appointment time, the Client agrees to join the Zoom call and begin the session. The Coach and client commit to start and finish each session on time. If the client is more than 10 minutes late for a coaching session, the Coach will assume the session is canceled and the client will receive a refund of 50% of their session fee."
      },
      {
        title: "Cancellations & Reschedules:",
        content: "All sessions must be rescheduled or canceled at least 12 hours prior to appointment. If session is not rescheduled or canceled 12 hours prior, a 50% refund will be received, and a new session will need to be booked. (Monthly package cancellations determined upon request). To reschedule or cancel, email info@thehacollective.com and selective reschedule or cancel within the booking receipt confirmed in the clients email."
      }
    ]
  };

  // Use content from Supabase or fallback to default
  const content: TermsContent = pageData?.content || defaultContent;

  console.log('🔄 Terms page rendering with data from:', pageData ? 'Supabase' : 'default fallback');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{color: 'var(--button-primary)'}} />
      </div>
    );
  }

  if (error) {
    console.error('❌ Error loading terms content:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">
            {content.title || defaultContent.title}
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            {content.content && (
              <p>{content.content}</p>
            )}
            
            {(content.sections || defaultContent.sections!).map((section, index) => (
              <section key={index}>
                <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">
                  {section.title}
                </h2>
                
                {section.content && (
                  <p>{section.content}</p>
                )}
                
                {section.subsections && (
                  <div className="space-y-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="font-semibold">{subsection.title}</h3>
                        <p dangerouslySetInnerHTML={{ 
                          __html: subsection.content.replace(
                            /info@thehacollective\.com/g, 
                            '<a href="mailto:info@thehacollective.com" class="text-primary hover:underline">info@thehacollective.com</a>'
                          )
                        }} />
                      </div>
                    ))}
                  </div>
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

export default TermsConditions;
