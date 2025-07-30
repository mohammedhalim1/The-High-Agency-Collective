const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Refund & Cancellation Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p>Client agrees to the following:</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Refunds for Online Programs:</h2>
              <p>You may withdraw from an online program at any time. However, once you have joined and have logged in to the course, you will not receive a refund for any reason.</p>
              <p>Once a course is joined, lifetime access will be granted, however, registrant may be removed from course at any time if policies have been abused.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Refunds for Retreats</h2>
              <p>All sales for retreats are final, please email <a href="mailto:info@thehacollective.com" className="text-primary hover:underline">info@thehacollective.com</a> if you have any questions regarding the retreats.</p>
              <p>Once the retreat training recordings have been posted, lifetime access will be granted, however, registrant may be removed from course at any time if policies have been abused.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Refunds for Coaching</h2>
              <p>At the scheduled appointment time, the Client agrees to join the Zoom call and begin the session. The Coach and client commit to start and finish each session on time. If the client is more than 10 minutes late for a coaching session, the Coach will assume the session is canceled and the client will receive a refund of 50% of their session fee.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Cancellations & Reschedules</h2>
              <p>All sessions must be rescheduled or canceled at least 12 hours prior to appointment. If session is not rescheduled or canceled 12 hours prior, a 50% refund will be received, and a new session will need to be booked. (Monthly package cancellations determined upon request)</p>
              <p>To reschedule or cancel, email <a href="mailto:info@thehacollective.com" className="text-primary hover:underline">info@thehacollective.com</a> and selective reschedule or cancel within the booking receipt confirmed in the clients email.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RefundPolicy;
