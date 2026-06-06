import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Target, Users, Award, TrendingUp, MapPin } from 'lucide-react';
import { courses } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';

const About = () => {
  const { isDark } = useTheme();

  const goals = [
    { icon: Award, title: 'Certified Excellence', description: 'Providing MSME certified internship opportunities that are recognized across industries' },
    { icon: Users, title: 'Real-World Experience', description: 'Offering hands-on project exposure with mentorship from industry experts' },
    { icon: TrendingUp, title: 'Career Growth', description: 'Building practical skills that accelerate career advancement and job readiness' },
    { icon: Target, title: 'Expanding Horizons', description: 'Growing into non-technical programs to serve diverse learning needs' }
  ];

  const mainPrograms = courses.filter(c => c.category === 'main');

  const pageBg   = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg   = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const sec3Bg   = isDark ? 'bg-[#121818]' : 'bg-[#CCFBF1]';
  const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const accentBg  = isDark ? 'bg-[#14B8A6]/12' : 'bg-[#0D9488]/10';
  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.14)]' : 'bg-white border-[rgba(13,148,136,0.14)]';
  const cardGlow  = isDark
    ? 'hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:border-[rgba(20,184,166,0.4)]'
    : 'hover:shadow-[0_0_15px_rgba(13,148,136,0.28)] hover:border-[rgba(13,148,136,0.35)]';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <Navbar />

      {/* Hero Section */}
      <section className={`${sec2Bg} py-20 relative overflow-hidden flex items-center justify-center min-h-[40vh]`}>
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.14),transparent_65%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.07),transparent_65%)]'}`} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight ${titleClr}`}>
            About Edsec Innovations
          </h1>
          <p className={`text-xl max-w-3xl mx-auto font-medium ${mutedClr}`}>
            Empowering the next generation of tech professionals through certified training and real-world experience
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className={`${pageBg} py-20`}>
        <div className="container mx-auto px-4">
          <div className={`${cardBg} ${cardGlow} max-w-4xl mx-auto text-center rounded-3xl p-8 md:p-12 transition-all duration-300`}>
            <h2 className={`text-3xl font-bold mb-6 ${titleClr}`}>Who We Are</h2>
            <p className={`text-lg leading-relaxed mb-4 ${mutedClr}`}>
              Edsec Innovations is an MSME-certified startup training institute headquartered in Bengaluru,
              dedicated to transforming aspiring professionals into industry-ready experts.
            </p>
            <p className={`text-lg leading-relaxed ${mutedClr}`}>
              We bridge the gap between academic learning and industry requirements through our comprehensive
              internship programs that combine theoretical knowledge with practical, real-world project experience.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Goals */}
      <section className={`${sec3Bg} py-20`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-extrabold text-center mb-12 ${titleClr}`}>Our Mission & Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <div key={index} className={`${cardBg} ${cardGlow} p-6 rounded-2xl flex items-start space-x-4 transition-all duration-300`}>
                    <div className={`${accentBg} p-3 rounded-xl flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${accentClr}`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${titleClr}`}>{goal.title}</h3>
                      <p className={`text-sm ${mutedClr}`}>{goal.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className={`${pageBg} py-20`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-12 ${titleClr}`}>Programs Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mainPrograms.map((program, idx) => (
                <div key={idx} className={`${cardBg} ${cardGlow} p-8 rounded-2xl transition-all duration-300`}>
                  <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-4 ${accentBg}`}>
                    <Target className={`h-6 w-6 ${accentClr}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${titleClr}`}>{program.title}</h3>
                  <div className={`text-sm font-semibold mb-3 ${accentClr}`}>{program.duration} Framework</div>
                  <p className={`text-xs ${mutedClr}`}>Structured paths for specialized outcomes.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className={`${sec2Bg} py-20`}>
        <div className="container mx-auto px-4">
          <div className={`${cardBg} ${cardGlow} max-w-4xl mx-auto rounded-3xl p-8 md:p-12 transition-all duration-300`}>
            <h2 className={`text-3xl font-bold text-center mb-8 ${titleClr}`}>Our Location</h2>
            <div className={`flex items-center justify-center gap-3 mb-8 text-sm md:text-base font-medium ${mutedClr}`}>
              <MapPin className={`h-6 w-6 flex-shrink-0 ${accentClr}`} />
              <p className="text-center">
                #84, 2nd floor, Guniagrahara, Annapoorneshwari Layout, <br className="hidden md:block" />
                Near ATD Provision Store, Lakshmi pura cross, Shivakote Post, Bangalore - 89
              </p>
            </div>
            <div className={`w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border transition-all duration-300 ${isDark ? 'border-[rgba(20,184,166,0.2)]' : 'border-[rgba(13,148,136,0.15)]'}`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.685351664168!2d77.51468651037233!3d13.055694887224095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae235735f4dd35%3A0xe5a3e1eb32c3c6f6!2sGuniagrahara%2C%20Bengaluru%2C%20Karnataka%20560090!5e0!3m2!1sen!2sin!4v1709403165203!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
