import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, Award, Zap, Briefcase, Globe, Sparkles, 
  Code, Cpu, GraduationCap, BookOpen, Users, Lightbulb, 
  ChevronRight, ChevronLeft, MessageSquare, HelpCircle, Layers, Check,
  Database, BarChart3, GitBranch, Megaphone, Eye, ShieldAlert,
  Server, Laptop, AwardPlayIcon, Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PromoBanner from '@/components/PromoBanner';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '@/assets/edsec-logo-new.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1500, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const increment = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [value, duration, hasStarted]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
};

const Index = () => {
  const { isDark } = useTheme();
  const [activeProjTab, setActiveProjTab] = useState<'python' | 'web' | 'marketing' | 'ar'>('python');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Styling Tokens
  const pageBg   = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg   = isDark ? 'bg-[#0D1515]' : 'bg-[#F8FAFC]';
  const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const subClr   = isDark ? 'text-[#99F6E4]' : 'text-[#0D9488]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const cardBg   = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.15)]' : 'bg-white border-[rgba(13,148,136,0.15)]';
  const cardGlow = isDark
    ? 'hover:shadow-[0_0_28px_rgba(20,184,166,0.55)] hover:border-[rgba(20,184,166,0.5)]'
    : 'hover:shadow-[0_0_22px_rgba(13,148,136,0.22)] hover:border-[rgba(13,148,136,0.45)]';
  const btnPrimary = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_18px_rgba(20,184,166,0.45)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_14px_rgba(13,148,136,0.4)]';
  const btnOutline = isDark
    ? 'border border-[rgba(20,184,166,0.35)] text-[#E6FFFA] hover:bg-[rgba(20,184,166,0.08)] bg-transparent'
    : 'border border-[rgba(13,148,136,0.35)] text-[#0F172A] hover:bg-[rgba(13,148,136,0.06)] bg-transparent';

  // Data Structures
  const whyChooseUs = [
    {
      title: 'Industry-Oriented Learning',
      desc: 'Syllabus designed by industry tech leads to mirror actual day-to-day corporate tasks and workflows.',
      icon: Laptop
    },
    {
      title: 'Project-Based Training',
      desc: 'Focus on writing clean code and shipping real products rather than just watching lecture videos.',
      icon: Code
    },
    {
      title: 'Internship Opportunities',
      desc: 'Gain hands-on experience under professional mentorship to prepare for a successful career transition.',
      icon: Briefcase
    },
    {
      title: 'Career-Focused Programs',
      desc: 'Get guidance on resume building, LinkedIn branding, and mock interviews to stand out to hiring managers.',
      icon: Globe
    },
    {
      title: 'Certification Support',
      desc: 'Earn official credentials including government-registered MSME certificates to validate your skills.',
      icon: Award
    },
    {
      title: 'Mentor Guidance',
      desc: 'Interact directly with working professionals who provide code reviews, architecture reviews, and debug sessions.',
      icon: Users
    }
  ];

  const technologies = [
    { name: 'Python', icon: Code },
    { name: 'SQL', icon: Database },
    { name: 'Artificial Intelligence', icon: Cpu },
    { name: 'Machine Learning', icon: Cpu },
    { name: 'Data Analytics', icon: BarChart3 },
    { name: 'Web Development', icon: Globe },
    { name: 'Git & GitHub', icon: GitBranch },
    { name: 'APIs', icon: Layers },
    { name: 'Digital Marketing', icon: Megaphone },
    { name: 'Augmented Reality', icon: Eye }
  ];

  const projects = {
    python: [
      { 
        title: 'Automated Report Generator', 
        desc: 'A utility script that parses CSV/Excel data, runs statistical models, and generates PDF charts automatically.', 
        tags: ['Python', 'Pandas', 'ReportLab'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'Custom Web Scraper & Parser', 
        desc: 'An advanced data collection tool that scrapes e-commerce pricing details and alerts users of price drops.', 
        tags: ['Python', 'Scrapy', 'BeautifulSoup'],
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80'
      }
    ],
    web: [
      { 
        title: 'E-Commerce SaaS Dashboard', 
        desc: 'A full-stack React and Node application with integrated billing, user management, and real-time inventory tracking.', 
        tags: ['React', 'Node.js', 'MongoDB'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'Real-time Chat Platform', 
        desc: 'A Socket.io powered messaging app with chat rooms, media sharing, and real-time status indicators.', 
        tags: ['Vite', 'Express', 'Socket.io'],
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=500&q=80'
      }
    ],
    marketing: [
      { 
        title: 'SEO Growth Campaign', 
        desc: 'A multi-channel marketing campaign that increased organic search engine traffic by 180% in 30 days.', 
        tags: ['SEO', 'Google Analytics', 'Ahrefs'],
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'SaaS Product Launch Ads', 
        desc: 'A conversion-focused search and display ad campaign built on Google Ads with 4.5% click-through rate.', 
        tags: ['Google Ads', 'Copywriting', 'Analytics'],
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80'
      }
    ],
    ar: [
      { 
        title: 'Interactive Product Catalog', 
        desc: 'An AR portal allowing users to place and customize 3D furniture models inside their living rooms.', 
        tags: ['Augmented Reality', 'Unity', 'ARCore'],
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'Educational Space Explorer', 
        desc: 'An immersive mobile application that projects interactive 3D solar system models onto physical markers.', 
        tags: ['WebXR', 'Three.js', 'A-Frame'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80'
      }
    ]
  };

  const journeySteps = [
    { title: 'Enroll', desc: 'Select your track and register.' },
    { title: 'Learn', desc: 'Master fundamentals through guided sessions.' },
    { title: 'Build Projects', desc: 'Create real portfolio-grade applications.' },
    { title: 'Internship Experience', desc: 'Work under professional tech workflows.' },
    { title: 'Certification', desc: 'Get MSME-certified credentials.' },
    { title: 'Career Growth', desc: 'Apply to top tech jobs with confidence.' }
  ];

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Data Analyst at TechCorp',
      content: 'The Advanced Technology Program helped me transition from a non-tech background. The mentor support was outstanding, and the Power BI capstone project got me my first job!',
      rating: 5,
      cohort: 'Data Analytics Cohort'
    },
    {
      name: 'Aditi Rao',
      role: 'Frontend Developer at WebSolutions',
      content: 'Building real full-stack web applications and deploying them live gave me immense confidence. The MSME certificate is a great addition to my profile.',
      rating: 5,
      cohort: 'Web Development Cohort'
    },
    {
      name: 'Kunal Sen',
      role: 'AI Engineer at Brainwave',
      content: 'The Professional Internship Program was intense but rewarding. The hands-on coding and weekly feedback on my machine learning models prepared me perfectly for interviews.',
      rating: 5,
      cohort: 'AI & Machine Learning Cohort'
    }
  ];

  // Auto-play testimonial carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <PromoBanner />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-32 min-h-[calc(100vh-72px)] flex items-center">
        {/* Developer Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a60a_1px,transparent_1px),linear-gradient(to_bottom,#14b8a60a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.18),transparent_60%)]' : 'bg-[radial-gradient(circle_at_30%_30%,rgba(13,148,136,0.06),transparent_60%)]'}`} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left animate-fade-in-up">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${isDark ? 'bg-[#14B8A6]/10 text-[#2DD4BF] border-[#14B8A6]/20' : 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20'}`}>
                <Sparkles className="h-3.5 w-3.5" />
                MSME Certified Training Institute
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight ${titleClr}`}>
                Next-Gen <span className={accentClr}>Tech Education</span> & Internship Portal
              </h1>
              <p className={`text-xl md:text-2xl mb-4 font-semibold ${subClr}`}>
                Build Skills. Gain Experience. Get Industry Ready.
              </p>
              <p className={`text-base md:text-lg mb-10 max-w-2xl leading-relaxed ${mutedClr}`}>
                Join India's leading MSME-certified learning hub. Elevate your potential with hands-on labs, elite mentorship, and portfolio-grade industry development designed for modern developers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <Link to="/enroll">
                  <Button size="lg" className={`w-full sm:w-auto h-14 px-10 text-base font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 glow-button ${btnPrimary}`}>
                    Enroll Now
                  </Button>
                </Link>
                <Link to="/internship">
                  <Button size="lg" className={`w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${btnOutline}`}>
                    Explore Programs <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                  </Button>
                </Link>
              </div>

              {/* Counters Section */}
              <div className={`flex flex-wrap items-center gap-8 md:gap-12 pt-10 border-t ${isDark ? 'border-[rgba(20,184,166,0.13)]' : 'border-gray-200'}`}>
                {[
                  { value: 500, label: 'Students Trained', suffix: '+' },
                  { value: 3, label: 'Programs', suffix: '' },
                  { value: 100, label: 'MSME Certified', suffix: '%' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <p className={`text-3xl md:text-4xl font-extrabold ${accentClr}`}>
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${mutedClr}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Premium Visuals */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
              <div className="animate-float relative w-full max-w-[480px]">
                <div className={`absolute inset-0 blur-[60px] rounded-full opacity-65 ${isDark ? 'bg-[rgba(20,184,166,0.28)]' : 'bg-[rgba(13,148,136,0.14)]'}`} />
                
                {/* Student coding image inside a premium glassmorphic border frame */}
                <div className={`relative rounded-3xl overflow-hidden border p-2 shadow-2xl ${isDark ? 'bg-[#0D1515]/90 border-[#14B8A6]/25' : 'bg-slate-50/90 border-slate-200'} backdrop-blur-md`}>
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" 
                    alt="Students Collaborating & Coding" 
                    className="rounded-2xl w-full h-[320px] object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Floating logo card */}
                  <div className={`absolute bottom-5 right-5 p-3.5 rounded-2xl border flex items-center justify-center backdrop-blur-md shadow-lg ${isDark ? 'bg-[#0B0F0F]/90 border-[#14B8A6]/30' : 'bg-white/95 border-slate-200'}`}>
                    <img src={logo} alt="EdSec Logo" className="h-9 w-auto object-contain" />
                  </div>
                </div>

                {/* Overlapping small code snippet widget */}
                <div className={`absolute -bottom-6 -left-6 p-4 rounded-2xl border flex items-center gap-3 backdrop-blur-md shadow-lg transition-transform hover:scale-105 duration-300 ${isDark ? 'bg-[#121818]/90 border-[#14B8A6]/30 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-[#14B8A6]/20' : 'bg-[#0D9488]/10'}`}>
                    <Code className={`h-5 w-5 ${accentClr}`} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Curriculum</p>
                    <p className="text-xs font-extrabold">Project-Based Learning</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST & MISSION */}
      <section className={`${sec2Bg} py-20 relative border-t border-b ${isDark ? 'border-[#14B8A6]/10' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-6 tracking-tight ${titleClr}`}>
              Trusted Excellence in Tech Education
            </h2>
            <p className={`text-base md:text-lg leading-relaxed ${mutedClr}`}>
              EdSec Innovations is an MSME-certified training institute headquartered in Bengaluru. We bridge the gap between academic theory and real-world technology demands through project-driven internship slabs, professional developer guidance, and validated certification frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE EDSEC INNOVATIONS */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 inline-block ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
              Our Key Pillars
            </span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${titleClr}`}>
              Why Choose EdSec Innovations
            </h2>
            <p className={`text-base mt-3 max-w-2xl mx-auto ${mutedClr}`}>
              Everything you need to launch, accelerate, or transition your professional technical career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col h-full ${cardBg} ${cardGlow}`}
              >
                <div className={`p-3.5 rounded-2xl self-start mb-6 ${isDark ? 'bg-[#14B8A6]/10 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${titleClr}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${mutedClr}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES ECOSYSTEM */}
      <section className={`${sec2Bg} py-24 relative border-t border-b ${isDark ? 'border-[#14B8A6]/10' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 inline-block ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
              Skills Stack
            </span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${titleClr}`}>
              Technologies You Will Master
            </h2>
            <p className={`text-base mt-3 max-w-2xl mx-auto ${mutedClr}`}>
              Get hand-on command over the most demanding skills, frameworks, and tools in modern tech domains.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {technologies.map((tech, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg ${cardBg} ${isDark ? 'hover:border-[#14B8A6]/40' : 'hover:border-[#0D9488]/40'}`}
              >
                <div className={`p-3 rounded-xl mb-4 ${isDark ? 'bg-[#14B8A6]/10 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
                  <tech.icon className="h-5 w-5" />
                </div>
                <span className={`font-bold text-sm tracking-wide ${titleClr}`}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT SHOWCASE */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 inline-block ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
              Hands-On Experience
            </span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${titleClr}`}>
              Real Industry Projects
            </h2>
            <p className={`text-base mt-3 max-w-2xl mx-auto ${mutedClr}`}>
              You won't just learn theory. You will build and deploy real applications to build a strong professional portfolio.
            </p>
          </div>

          {/* Project Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {[
              { id: 'python', label: 'Python Projects' },
              { id: 'web', label: 'Web Dev Projects' },
              { id: 'marketing', label: 'Digital Marketing' },
              { id: 'ar', label: 'AR Projects' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveProjTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeProjTab === tab.id
                    ? (isDark ? 'bg-[#14B8A6] text-white shadow-lg' : 'bg-[#0D9488] text-white shadow-md')
                    : (isDark ? 'bg-[#121818] text-slate-300 border border-slate-800 hover:border-[#14B8A6]' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-[#0D9488]')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects[activeProjTab].map((proj, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 ${cardBg} ${cardGlow}`}
              >
                {/* Project Cover Image */}
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    src={(proj as any).image} 
                    alt={proj.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className={`text-xl font-extrabold mb-2 ${titleClr}`}>{proj.title}</h3>
                    <p className={`text-sm leading-relaxed mb-6 ${mutedClr}`}>{proj.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proj.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className={`text-xs font-semibold px-3 py-1 rounded-md border ${isDark ? 'bg-white/5 border-white/10 text-teal-300' : 'bg-black/5 border-black/10 text-teal-700'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT JOURNEY SECTION */}
      <section className={`${sec2Bg} py-24 relative border-t border-b ${isDark ? 'border-[#14B8A6]/10' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 inline-block ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
              Roadmap
            </span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${titleClr}`}>
              Your Learning & Internship Journey
            </h2>
            <p className={`text-base mt-3 max-w-2xl mx-auto ${mutedClr}`}>
              A structured, step-by-step pathway from registration to career growth.
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:flex items-center justify-between relative max-w-6xl mx-auto pt-10">
            {/* Connecting Horizontal Line */}
            <div className={`absolute top-[76px] left-[5%] right-[5%] h-0.5 ${isDark ? 'bg-[#14B8A6]/20' : 'bg-[#0D9488]/20'}`} />

            {journeySteps.map((step, idx) => (
              <div key={idx} className="relative z-10 w-40 text-center flex flex-col items-center group">
                {/* Node */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-4 border transition-all duration-300 group-hover:scale-110 ${
                  isDark 
                    ? 'bg-[#121818] border-[#14B8A6]/30 text-[#2DD4BF] group-hover:border-[#14B8A6] group-hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]' 
                    : 'bg-white border-[#0D9488]/30 text-[#0D9488] group-hover:border-[#0D9488] group-hover:shadow-[0_0_12px_rgba(13,148,136,0.3)]'
                }`}>
                  {idx + 1}
                </div>
                <h3 className={`font-bold text-sm mb-1.5 group-hover:text-[#14B8A6] transition-colors ${titleClr}`}>{step.title}</h3>
                <p className={`text-xs opacity-80 ${mutedClr}`}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet Timeline */}
          <div className="lg:hidden max-w-lg mx-auto space-y-8 relative before:absolute before:left-7 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#14B8A6]/20">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start relative z-10">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border flex-shrink-0 ${
                  isDark ? 'bg-[#121818] border-[#14B8A6]/30 text-[#2DD4BF]' : 'bg-white border-[#0D9488]/30 text-[#0D9488]'
                }`}>
                  {idx + 1}
                </div>
                <div className="pt-2">
                  <h3 className={`font-bold text-base mb-1 ${titleClr}`}>{step.title}</h3>
                  <p className={`text-sm ${mutedClr}`}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 inline-block ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
              Success Stories
            </span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${titleClr}`}>
              What Our Students Say
            </h2>
            <p className={`text-base mt-3 max-w-2xl mx-auto ${mutedClr}`}>
              Real reviews and outcomes from graduates of our internship slabs.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="max-w-3xl mx-auto relative px-4">
            <div className={`p-8 md:p-12 rounded-3xl border relative transition-all duration-500 shadow-xl ${cardBg}`}>
              {/* Star Ratings */}
              <div className="flex gap-1.5 mb-6 text-amber-400">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className={`text-lg md:text-xl font-medium leading-relaxed italic mb-8 ${titleClr}`}>
                "{testimonials[currentTestimonial].content}"
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center gap-4 border-t pt-6 border-slate-200/10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${isDark ? 'bg-[#14B8A6]' : 'bg-[#0D9488]'}`}>
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div>
                  <h4 className={`font-bold text-base ${titleClr}`}>{testimonials[currentTestimonial].name}</h4>
                  <p className={`text-xs ${mutedClr}`}>{testimonials[currentTestimonial].role}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-black/5 text-gray-700 border border-black/10'}`}>
                  {testimonials[currentTestimonial].cohort}
                </span>
              </div>
            </div>

            {/* Carousel Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                className={`p-3 rounded-full border transition-all duration-300 hover:scale-110 ${
                  isDark ? 'bg-[#121818] border-slate-800 text-slate-300 hover:border-[#14B8A6]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#0D9488]'
                }`}
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                className={`p-3 rounded-full border transition-all duration-300 hover:scale-110 ${
                  isDark ? 'bg-[#121818] border-slate-800 text-slate-300 hover:border-[#14B8A6]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#0D9488]'
                }`}
                aria-label="Next Testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className={`${sec2Bg} py-24 relative border-t border-b ${isDark ? 'border-[#14B8A6]/10' : 'border-slate-100'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 inline-block ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
              FAQ
            </span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${titleClr}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-base mt-3 ${mutedClr}`}>
              Have questions about our programs and internships? We have answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              {
                q: "Is prior experience required?",
                a: "No prior experience is required. Our programs are designed to take you from the absolute fundamentals to advanced industry standards."
              },
              {
                q: "Are programs beginner-friendly?",
                a: "Yes, all programs start with basic foundation modules and offer guided mentor support to help beginners transition smoothly."
              },
              {
                q: "Will certificates be provided?",
                a: "Yes, you will receive an MSME-certified internship completion certificate along with a letter of recommendation upon successful completion of the course and project requirements."
              },
              {
                q: "Are internships available?",
                a: "Yes, all programs include project-based internship offerings and professional exposure with real-world client workflows."
              },
              {
                q: "What technologies are covered?",
                a: "We cover Python, SQL, Web Development, AI, Machine Learning, Data Analytics, APIs, Git/GitHub, Digital Marketing, and AR."
              },
              {
                q: "Can students learn remotely?",
                a: "Yes, our programs are fully remote and designed to fit flexibly around your academic or professional schedule."
              }
            ].map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`faq-${idx}`} 
                className={`border rounded-2xl px-6 py-2 transition-all duration-300 ${cardBg}`}
              >
                <AccordionTrigger className={`text-left font-bold text-base hover:no-underline text-teal-500 hover:text-teal-400`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className={`text-sm leading-relaxed mt-2 ${mutedClr}`}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`${cardBg} ${cardGlow} border rounded-3xl p-12 text-center max-w-4xl mx-auto transition-all duration-300 relative overflow-hidden`}>
            <div className={`absolute inset-0 pointer-events-none opacity-40 ${isDark ? 'bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.06),transparent_70%)]'}`} />
            
            <h2 className={`text-3xl md:text-5xl font-extrabold mb-6 tracking-tight ${titleClr}`}>
              Ready to Kickstart Your Tech Journey?
            </h2>
            <p className={`text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${mutedClr}`}>
              Join hundreds of successful students who have upgraded their technical skills and built real corporate projects with EdSec Innovations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/enroll">
                <Button size="lg" className={`w-full sm:w-auto h-14 px-10 font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-105 hover:-translate-y-1 glow-button ${btnPrimary}`}>
                  Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a 
                href="https://wa.me/918660132700?text=Hi!%20I%20would%20like%20to%20talk%20to%20a%20mentor%20about%20EdSec%20Innovations%20programs."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className={`w-full sm:w-auto h-14 px-8 font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${btnOutline}`}>
                  Talk to a Mentor
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
