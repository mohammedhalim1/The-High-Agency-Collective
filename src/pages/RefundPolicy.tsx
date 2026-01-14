import { usePageContent, useRealtimeContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

interface RefundContent {
  title?: string;
  content?: string;
  sections?: Array<{
    title: string;
    content: string;
  }>;
}

const RefundPolicy = () => {
  const { data: pageData, isLoading, error } = usePageContent('refund-policy');

  // Enable real-time updates
  useRealtimeContent('refund-policy');

  // Default fallback content
  const defaultContent: RefundContent = {
    title: "Refund & Cancellation Policy",
    content: "Client agrees to the following:",
    sections: [
      {
        title: "Refunds for Online Programs:",
        content: "You may withdraw from an online program at any time. However, once you have joined and have logged in to the course, you will not receive a refund for any reason. Once a course is joined, lifetime access will be granted, however, registrant may be removed from course at any time if policies have been abused."
      },
      {
        title: "Refunds for Retreats",
        content: "All sales for retreats are final, please email info@thehacollective.com if you have any questions regarding the retreats. Once the retreat training recordings have been posted, lifetime access will be granted, however, registrant may be removed from course at any time if policies have been abused."
      },
      {
        title: "Refunds for Coaching",
        content: "At the scheduled appointment time, the Client agrees to join the Zoom call and begin the session. The Coach and client commit to start and finish each session on time. If the client is more than 10 minutes late for a coaching session, the Coach will assume the session is canceled and the client will receive a refund of 50% of their session fee."
      },
      {
        title: "Cancellations & Reschedules",
        content: "All sessions must be rescheduled or canceled at least 12 hours prior to appointment. If session is not rescheduled or canceled 12 hours prior, a 50% refund will be received, and a new session will need to be booked. (Monthly package cancellations determined upon request). To reschedule or cancel, email info@thehacollective.com and selective reschedule or cancel within the booking receipt confirmed in the clients email."
      }
    ]
  };

  // Use content from Supabase or fallback to default
  const content: RefundContent = pageData?.content || defaultContent;

  console.log('🔄 Refund page rendering with data from:', pageData ? 'Supabase' : 'default fallback');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{color: 'var(--button-primary)'}} />
      </div>
    );
  }

  if (error) {
    console.error('❌ Error loading refund content:', error);
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
                <p dangerouslySetInnerHTML={{ 
                  __html: section.content.replace(
                    /info@thehacollective\.com/g, 
                    '<a href="mailto:info@thehacollective.com" class="text-primary hover:underline">info@thehacollective.com</a>'
                  )
                }} />
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

export default RefundPolicy;
