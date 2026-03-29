import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award, Zap, Briefcase, Globe, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PromoBanner from '@/components/PromoBanner';
import { Button } from '@/components/ui/button';
import { courses } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '@/assets/edsec-logo-new.png';

const programCTA: Record<string, string> = {
  'Foundation Tech Program': 'Enroll & Choose Course',
  'Applied Technology Program': 'Enroll & Choose Track',
  'Advanced AI & Software Engineering': 'Enroll & Choose Specialization',
};

const Index = () => {
  const { isDark } = useTheme();
  const domains = ['Data Science', 'Data Analytics', 'Web Development', 'Python Full Stack', 'AI & ML'];
  const benefits = [
    { title: 'Real-world Projects', desc: 'Build portfolio-grade applications from day one', icon: Briefcase },
    { title: 'Expert Mentorship', desc: 'Learn directly from industry professionals', icon: Zap },
    { title: 'MSME Certification', desc: 'Govt-backed MSME certified recognition', icon: Award },
    { title: 'Career Support', desc: 'Resume, interview prep & LinkedIn', icon: Globe },
  ];

  const accent   = isDark ? '#14B8A6' : '#0D9488';
  const pageBg   = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg   = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const sec3Bg   = isDark ? 'bg-[#121818]' : 'bg-[#CCFBF1]';
  const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const subClr   = isDark ? 'text-[#99F6E4]' : 'text-[#0D9488]';
  const priceClr = isDark ? 'text-[#2DD4BF]' : 'text-[#0D9488]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const dotClr   = isDark ? 'bg-[#14B8A6]' : 'bg-[#0D9488]';
  const cardBg   = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.15)]' : 'bg-[#F0FDFA] border-[rgba(13,148,136,0.15)]';
  const cardGlow = isDark
    ? 'hover:shadow-[0_0_28px_rgba(20,184,166,0.55)] hover:border-[rgba(20,184,166,0.5)]'
    : 'hover:shadow-[0_0_22px_rgba(13,148,136,0.38)] hover:border-[rgba(13,148,136,0.45)]';
  const badgeBg  = isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]';
  const divider  = isDark ? 'bg-[rgba(20,184,166,0.13)]' : 'bg-[rgba(13,148,136,0.12)]';
  const benCard  = isDark ? 'bg-[#121818] border border-[rgba(20,184,166,0.12)] hover:shadow-[0_0_20px_rgba(20,184,166,0.38)]' : 'bg-white border border-[rgba(13,148,136,0.12)] hover:shadow-[0_0_15px_rgba(13,148,136,0.28)]';
  const domainCard = isDark
    ? 'bg-[#121818] border border-[rgba(20,184,166,0.13)] text-[#99F6E4] hover:text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:border-[rgba(20,184,166,0.55)]'
    : 'bg-white border border-[rgba(13,148,136,0.13)] text-[#374151] hover:text-[#0D9488] hover:shadow-[0_0_15px_rgba(13,148,136,0.32)] hover:border-[rgba(13,148,136,0.5)]';
  const btnPrimary = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_18px_rgba(20,184,166,0.45)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_14px_rgba(13,148,136,0.4)]';
  const btnOutline = isDark
    ? 'border border-[rgba(20,184,166,0.35)] text-[#E6FFFA] hover:bg-[rgba(20,184,166,0.08)] bg-transparent'
    : 'border border-[rgba(13,148,136,0.35)] text-[#0F172A] hover:bg-[rgba(13,148,136,0.06)] bg-transparent';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <PromoBanner />
      <Navbar />

      {/* HERO */}
      <section className={`${pageBg} relative overflow-hidden py-20 md:py-28 min-h-[calc(100vh-72px)] flex items-center`}>
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.18),transparent_60%)]' : 'bg-[radial-gradient(ellipse_at_top_left,rgba(13,148,136,0.07),transparent_60%)]'}`} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${isDark ? 'bg-[#14B8A6]/13 text-[#2DD4BF] border border-[rgba(20,184,166,0.22)]' : 'bg-[#0D9488]/10 text-[#0D9488] border border-[rgba(13,148,136,0.2)]'}`}>
                <Sparkles className="h-3.5 w-3.5" />
                MSME Certified Training Institute
              </div>
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-tight ${titleClr}`}>
                Empowering Future<br />
                <span style={{ color: accent }}>Innovators</span>
              </h1>
              <p className={`text-xl md:text-2xl mb-3 font-medium ${subClr}`}>
                Build Skills. Gain Experience. Get Industry Ready.
              </p>
              <p className={`text-base mb-10 max-w-xl ${mutedClr}`}>
                Join India's leading MSME certified institute for hands-on learning, elite mentorship, and portfolio-grade industry development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/enroll">
                  <Button size="lg" className={`w-full sm:w-auto h-13 px-8 font-bold tracking-wide border-0 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 glow-button ${btnPrimary}`}>
                    Enroll Now
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" className={`w-full sm:w-auto h-13 px-8 font-semibold transition-all duration-300 hover:scale-105 ${btnOutline}`}>
                    Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className={`flex items-center gap-8 mt-10 pt-8 border-t ${isDark ? 'border-[rgba(20,184,166,0.13)]' : 'border-gray-200'}`}>
                {[['500+', 'Students Trained'], ['3', 'Programs'], ['100%', 'MSME Certified']].map(([num, label]) => (
                  <div key={label}>
                    <p className={`text-2xl font-extrabold ${accentClr}`}>{num}</p>
                    <p className={`text-xs ${mutedClr}`}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="animate-float relative">
                <div className={`absolute inset-0 blur-3xl rounded-full ${isDark ? 'bg-[rgba(20,184,166,0.22)]' : 'bg-[rgba(13,148,136,0.1)]'}`} />
                <img src={logo} alt="EDSEC Innovations"
                  className={`relative max-h-96 max-w-full object-contain transition-transform duration-500 hover:scale-105 rounded-2xl ${
                    isDark ? 'drop-shadow-[0_0_45px_rgba(20,184,166,0.6)]' : 'brightness-90'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className={`${sec2Bg} py-14`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`${cardBg} ${cardGlow} border rounded-2xl p-8 text-center max-w-4xl mx-auto transition-all duration-300`}>
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${titleClr}`}>Trusted Excellence in Tech Education</h2>
            <p className={`text-base md:text-lg leading-relaxed ${mutedClr}`}>
              Edsec Innovations is an MSME-certified startup training institute headquartered in Bengaluru, dedicated to transforming aspiring professionals into industry-ready experts through comprehensive internship programs combining theory with real-world project experience.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className={`${sec3Bg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className={`text-3xl md:text-5xl font-extrabold mb-4 ${titleClr}`}>Internship Programs</h2>
            <p className={`text-lg font-medium ${mutedClr}`}>Elite pathways from zero to industry-ready, guaranteed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.filter(c => c.category === 'main').map((course) => (
              <div key={course.id} className={`${cardBg} ${cardGlow} border rounded-2xl p-6 flex flex-col transition-all duration-500 hover:scale-105 hover:-translate-y-2`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badgeBg}`}>{course.duration}</span>
                  <span className={`text-2xl font-extrabold ${priceClr}`}>₹{course.price}</span>
                </div>
                <h3 className={`text-xl font-bold mb-1 ${titleClr}`}>{course.title}</h3>
                <p className={`text-xs mb-4 ${subClr}`}>{course.description}</p>
                <div className={`h-px mb-4 ${divider}`} />
                <div className="mb-4">
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accentClr}`}>Available Domains</h4>
                  <ul className="space-y-2">
                    {course.domains.map((d, i) => (
                      <li key={i} className={`flex items-center text-sm ${mutedClr}`}>
                        <span className={`inline-block h-1.5 w-1.5 rounded-full mr-2 flex-shrink-0 ${dotClr}`} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`h-px mb-4 ${divider}`} />
                <div className="mb-6 flex-grow">
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accentClr}`}>Includes</h4>
                  <ul className="space-y-2">
                    {course.features.map((f, i) => (
                      <li key={i} className={`flex items-start text-sm ${mutedClr}`}>
                        <CheckCircle2 className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${accentClr}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/enroll" state={{ predefinedCourse: course.title }}>
                  <Button className={`w-full font-semibold tracking-wide rounded-xl transition-all duration-300 hover:scale-105 border-0 glow-button ${btnPrimary}`}>
                    {programCTA[course.title] || 'Enroll Now'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={`${sec2Bg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${titleClr}`}>Program Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className={`${benCard} rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 hover:-translate-y-2`}>
                <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 ${isDark ? 'bg-[#14B8A6]/10' : 'bg-[#0D9488]/10'}`}>
                  <b.icon className={`h-6 w-6 ${accentClr}`} />
                </div>
                <h3 className={`text-base font-bold mb-2 ${titleClr}`}>{b.title}</h3>
                <p className={`text-sm ${mutedClr}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section className={`${pageBg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${titleClr}`}>Featured Domains</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {domains.map((d, i) => (
              <div key={i} className={`${domainCard} rounded-2xl border text-center flex items-center justify-center min-h-[110px] transition-all duration-500 hover:scale-105 hover:-translate-y-1`}>
                <span className="font-semibold text-sm px-3">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${sec2Bg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`${cardBg} ${cardGlow} border rounded-3xl p-12 text-center max-w-3xl mx-auto transition-all duration-300`}>
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-5 ${titleClr}`}>Ready to Kickstart Your Career?</h2>
            <p className={`text-lg mb-8 ${mutedClr}`}>Join hundreds of successful students who have upgraded their skills with EDSEC.</p>
            <Link to="/enroll">
              <Button size="lg" className={`h-14 px-10 font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-105 hover:-translate-y-1 glow-button ${btnPrimary}`}>
                Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
