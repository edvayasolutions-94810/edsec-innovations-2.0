import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import InternshipCard from '@/components/InternshipCard';
import { Button } from '@/components/ui/button';
import { courses } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';
import { Award, Zap, Briefcase, Globe, GraduationCap } from 'lucide-react';

const Internship = () => {
  const { isDark } = useTheme();
  const internships = courses.filter(c => c.category === 'main');

  const pageBg   = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg   = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const sec3Bg   = isDark ? 'bg-[#121818]' : 'bg-[#CCFBF1]';
  const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const accentBg  = isDark ? 'bg-[#14B8A6]/12' : 'bg-[#0D9488]/10';
  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.14)]' : 'bg-white border-[rgba(13,148,136,0.14)]';
  const btnPrimary = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_16px_rgba(20,184,166,0.45)] hover:shadow-[0_0_24px_rgba(20,184,166,0.65)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_14px_rgba(13,148,136,0.4)] hover:shadow-[0_0_20px_rgba(13,148,136,0.6)]';
  const btnOutline = isDark
    ? 'border border-[rgba(20,184,166,0.35)] text-[#E6FFFA] hover:bg-[rgba(20,184,166,0.08)] bg-transparent'
    : 'border border-[rgba(13,148,136,0.35)] text-[#0F172A] hover:bg-[rgba(13,148,136,0.06)] bg-transparent';

  const benefits = [
    { icon: Award, title: 'MSME Certified', desc: 'Government-recognized certification adding verified value to your resume' },
    { icon: Briefcase, title: 'Real Industry Projects', desc: 'Work on actual projects to build a strong, verifiable portfolio' },
    { icon: Zap, title: 'Expert Mentorship', desc: 'Direct guidance from experienced industry professionals throughout' },
    { icon: Globe, title: 'Career Support', desc: 'Resume building, interview prep, LinkedIn optimization and placement help' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <Navbar />

      {/* Hero */}
      <section className={`${sec2Bg} py-20 relative overflow-hidden`}>
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.14),transparent_65%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.07),transparent_65%)]'}`} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${accentBg}`}>
            <GraduationCap className={`h-8 w-8 ${accentClr}`} />
          </div>
          <h1 className={`text-4xl md:text-6xl font-extrabold mb-5 ${titleClr}`}>
            Internship Programs
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${mutedClr}`}>
            MSME-certified internships with hands-on industry projects, expert mentorship, and real career outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/enroll">
              <Button size="lg" className={`h-13 px-8 font-bold border-0 rounded-xl transition-all duration-300 hover:scale-105 glow-button ${btnPrimary}`}>
                Enroll Now
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" className={`h-13 px-8 font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${btnOutline}`}>
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className={`${pageBg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${titleClr}`}>Certified IT Internship Slabs</h2>
            <p className={`text-lg ${mutedClr}`}>Transform your career through structured, MSME-certified technical and analytical programs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {internships.map((course, index) => (
              <InternshipCard key={course.id} course={course} index={index} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/contact">
              <Button size="lg" variant="outline" className={`h-12 px-8 font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${btnOutline}`}>
                Have Questions? Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`${sec3Bg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className={`text-3xl md:text-4xl font-extrabold text-center mb-12 ${titleClr}`}>
            What Makes Our Internships Special?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className={`${cardBg} border rounded-2xl p-6 flex gap-4 transition-all duration-500 hover:scale-105 hover:-translate-y-1 ${isDark ? 'hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:border-[rgba(20,184,166,0.4)]' : 'hover:shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:border-[rgba(13,148,136,0.4)]'}`}>
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${accentBg}`}>
                  <b.icon className={`h-5 w-5 ${accentClr}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-base mb-1.5 ${titleClr}`}>{b.title}</h3>
                  <p className={`text-sm ${mutedClr}`}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Internship;
