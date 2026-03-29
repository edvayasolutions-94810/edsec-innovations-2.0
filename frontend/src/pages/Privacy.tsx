import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Privacy Policy</h1>
            
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    At Edsec Innovations, we collect the following types of personal information when you interact with our website, enroll in courses, or contact us:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Full name, email address, and phone number</li>
                    <li>Educational qualifications and academic background</li>
                    <li>Payment and billing information for course enrollment</li>
                    <li>Communication records including emails and contact form submissions</li>
                    <li>Browser type, IP address, and device information collected automatically</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Processing course enrollments and managing student records</li>
                    <li>Communicating course updates, schedules, and important announcements</li>
                    <li>Issuing MSME certified completion certificates</li>
                    <li>Responding to inquiries and providing student support</li>
                    <li>Improving our courses, website, and overall learning experience</li>
                    <li>Sending promotional materials about new courses (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">3. Data Protection & Security</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We are committed to safeguarding your personal data and employ the following measures:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Encrypted data transmission using SSL/TLS protocols</li>
                    <li>Secure storage of personal information on protected servers</li>
                    <li>Restricted access to personal data limited to authorized personnel only</li>
                    <li>Regular security audits and vulnerability assessments</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">4. Sharing of Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We do not sell, trade, or rent your personal information to third parties. We may share your data only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>With certification authorities for issuing valid MSME certificates</li>
                    <li>With payment processors to complete secure transactions</li>
                    <li>When required by law or regulatory authorities</li>
                    <li>With your explicit consent for any other purpose</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">5. Cookies & Tracking</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Our website may use cookies and similar tracking technologies to enhance your browsing experience. These are used to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Improve website performance and content delivery</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-2">
                    You can control cookie settings through your browser preferences. Disabling cookies may affect some website functionality.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    As a user, you have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Right to access and review your personal information</li>
                    <li>Right to request correction of inaccurate data</li>
                    <li>Right to request deletion of your personal data</li>
                    <li>Right to withdraw consent for marketing communications</li>
                    <li>Right to lodge a complaint with relevant data protection authorities</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">7. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable laws. Student records and certification data may be retained for a longer period for verification purposes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">8. Third-Party Links</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our website may contain links to external websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any external websites you visit.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">9. Updates to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Edsec Innovations reserves the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">10. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: <a href="mailto:edsecinnovations@gmail.com" className="text-primary hover:underline">edsecinnovations@gmail.com</a><br />
                    Phone: 8660132700
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Last Updated: February 2026
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Privacy;
