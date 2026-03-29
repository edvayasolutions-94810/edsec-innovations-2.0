import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Terms & Conditions</h1>
            
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">1. General Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By enrolling in any course or internship program at Edsec Innovations, you agree to comply with and be bound by these terms and conditions. 
                    Please read them carefully before proceeding with your enrollment.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">2. Enrollment & Payment</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • All course fees must be paid in full or as per the agreed payment plan before the commencement of the course.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • Once enrolled, course fees are non-refundable except in cases where Edsec Innovations cancels the course.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • Students must maintain regular attendance and complete all assigned projects to be eligible for certification.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">3. Data Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • Edsec Innovations respects your privacy and is committed to protecting your personal information.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • We collect personal data including name, email, phone number, and educational qualifications solely for the purpose of course administration and communication.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • Your personal information will not be shared with third parties without your explicit consent, except where required by law.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • We use industry-standard security measures to protect your data from unauthorized access, disclosure, or misuse.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">4. Internship Completion & Certification</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • To receive an MSME certified completion certificate, students must:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Complete all assigned modules and coursework</li>
                    <li>Successfully complete the required real-world project</li>
                    <li>Maintain a minimum attendance of 80%</li>
                    <li>Pass all assessments and evaluations</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-2">
                    • Certificates will be issued within 30 days of course completion.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">5. Certificate Validity</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • All certificates issued by Edsec Innovations are MSME certified and valid across India.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • Certificates are non-transferable and issued in the name of the enrolled student only.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • In case of any discrepancies or issues with certificates, students must contact us within 30 days of issuance.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">6. Code of Conduct</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • Students are expected to maintain professional behavior during all classes and interactions.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • Plagiarism or any form of academic dishonesty will result in immediate disqualification from the program.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • Edsec Innovations reserves the right to terminate enrollment for any violation of conduct policies.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">7. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    • All course materials, including lectures, presentations, and resources, are the intellectual property of Edsec Innovations.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • Students may not reproduce, distribute, or share course materials without prior written permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">8. Modifications</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Edsec Innovations reserves the right to modify these terms and conditions at any time. 
                    Students will be notified of any significant changes via email or through our website.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">9. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For any questions or concerns regarding these terms and conditions, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: <a href="mailto:edsecinnovations@gmail.com" className="text-primary hover:underline">edsecinnovations@gmail.com</a><br />
                    Phone: 8660132700
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Last Updated: January 2025
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

export default Terms;
