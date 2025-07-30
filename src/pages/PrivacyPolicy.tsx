const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Type of Information Collected:</h2>
              <p>We receive, collect and store any information you enter on our website or provide us in any other way. In addition, we collect the Internet protocol (IP) address used to connect your computer to the Internet; login; e-mail address; password; computer and connection information and purchase history. We may use software tools to measure and collect session information, including page response times, length of visits to certain pages, page interaction information, and methods used to browse away from the page. We also collect personally identifiable information (including name, email, password, communications); payment details (including credit card information), comments, feedback, product reviews, recommendations, and personal profile.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Purpose of Collecting Information</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>To provide and operate the Services;</li>
                <li>To provide our Users with ongoing customer assistance and technical support;</li>
                <li>To be able to contact our Visitors and Users with general or personalized service-related notices and promotional messages;</li>
                <li>To create aggregated statistical data and other aggregated and/or inferred Non-personal Information, which we or our business partners may use to provide and improve our respective services;</li>
                <li>To comply with any applicable laws and regulations.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">How We Store, Use, Share and Disclose Site Visitor's Personal Information?</h2>
              <p>Our company is hosted on the Netlify platform. Netlify provides us with the online platform that allows us to sell our products and services to you. Your data may be stored through Netlify's data storage, databases and the general Netlify applications. They store your data on secure servers behind a firewall.</p>
              <p>All direct payment gateways offered by Netlify and used by our company adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">How We Communicate With Site Visitors</h2>
              <p>We may contact you to notify you regarding your account, to troubleshoot problems with your account, to resolve a dispute, to collect fees or monies owed, to poll your opinions through surveys or questionnaires, to send updates about our company, or as otherwise necessary to contact you to enforce our User Agreement, applicable national laws, and any agreement we may have with you. For these purposes we may contact you via email, telephone, text messages, and postal mail.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">How We Use Cookies & Other Tracking Tools</h2>
              <p>If your website tracks personal information through the use of cookies, for example, you must make this clear to your site visitors. Be clear about what tracking tools (e.g. cookies, flash cookies, web beacons, etc.,) your website employs, what personal information they gather and why they are being used.</p>
              <p>It's important to note that third-party services, such as Google Analytics or other applications offered through the Netlify App Market, placing cookies or utilizing other tracking technologies through Netlify's services, may have their own policies regarding how they collect and store information. As these are external services, such practices are not covered by the Netlify Privacy Policy.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">How Visitors Can Withdraw Their Consent</h2>
              <p>If you don't want us to process your data anymore, please contact us at <a href="mailto:info@thehacollective.com" className="text-primary hover:underline">info@thehacollective.com</a> or unsubscribe through the next email campaign.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Questions & Contact Information</h2>
              <p>If you would like to: access, correct, amend or delete any personal information we have about you, you are invited to contact us at <a href="mailto:info@thehacollective.com" className="text-primary hover:underline">info@thehacollective.com</a></p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
