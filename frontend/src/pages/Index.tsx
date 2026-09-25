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
import { BookDemoModal } from '@/components/BookDemoModal';
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
  const [activeProjTab, setActiveProjTab] = useState<'web' | 'genai' | 'python' | 'git'>('web');
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
      title: 'Practical Tech Experience',
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
    { name: 'Full Stack Web Dev', icon: Globe },
    { name: 'Generative AI', icon: Cpu },
    { name: 'Python', icon: Code },
    { name: 'Machine Learning', icon: BarChart3 },
    { name: 'Deep Learning', icon: Cpu },
    { name: 'React & Next.js', icon: Globe },
    { name: 'Node.js & APIs', icon: Layers },
    { name: 'MongoDB', icon: Database },
    { name: 'Git & GitHub', icon: GitBranch },
    { name: 'LLMs & RAG', icon: Cpu }
  ];

  const projects = {
    web: [
      { 
        title: 'Full-Stack E-Commerce Platform', 
        desc: 'A dynamic web application with React, Next.js, Node.js, and MongoDB featuring JWT authentication and real-time inventory.', 
        tags: ['React', 'Next.js', 'Node.js', 'MongoDB'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'AI-Integrated SaaS Dashboard', 
        desc: 'A production web app with AI-assisted features, TypeScript type-safety, and interactive real-time metrics.', 
        tags: ['TypeScript', 'Next.js', 'Tailwind', 'AI API'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
      }
    ],
    genai: [
      { 
        title: 'RAG Enterprise Document Assistant', 
        desc: 'An intelligent retrieval-augmented generation system indexing PDF documentation using vector search and Claude/GPT.', 
        tags: ['Generative AI', 'Vector DB', 'RAG', 'Python'],
        image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'Autonomous Multi-Modal AI Agent', 
        desc: 'An agentic workflow system with tool calling, self-correction, vision capabilities, and LLMOps telemetry.', 
        tags: ['AI Agents', 'LLMOps', 'Multimodal', 'LangChain'],
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80'
      }
    ],
    python: [
      { 
        title: 'End-to-End Predictive ML Pipeline', 
        desc: 'An automated machine learning engine handling data wrangling, feature engineering, cross-validation, and deployment.', 
        tags: ['Python', 'NumPy', 'Pandas', 'scikit-learn'],
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'Deep Learning Vision Classifier', 
        desc: 'A PyTorch convolutional neural network trained for high-accuracy medical image classification with model optimization.', 
        tags: ['PyTorch', 'CNNs', 'Deep Learning', 'Matplotlib'],
        image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=500&q=80'
      }
    ],
    git: [
      { 
        title: 'Collaborative Open-Source Framework', 
        desc: 'A multi-developer GitHub repository with branching strategies, automated pull request validation, and CI/CD pipelines.', 
        tags: ['Git', 'GitHub', 'CI/CD', 'Code Review'],
        image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=500&q=80'
      },
      { 
        title: 'Production Portfolio & Career Kit', 
        desc: 'An ATS-optimized developer resume, showcase GitHub profile READMEs, and technical interview demonstration kits.', 
        tags: ['Portfolio', 'Resume', 'LinkedIn', 'Career'],
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=500&q=80'
      }
    ]
  };

  const journeySteps = [
    { title: 'Enroll', desc: 'Select your track and register.' },
    { title: 'Learn', desc: 'Master fundamentals through guided sessions.' },
    { title: 'Build Projects', desc: 'Create real portfolio-grade applications.' },
    { title: 'Project Experience', desc: 'Work under professional tech workflows.' },
    { title: 'Certification', desc: 'Get MSME-certified credentials.' },
    { title: 'Career Growth', desc: 'Apply to top tech jobs with confidence.' }
  ];

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Full Stack Developer at TechCorp',
      content: 'The Full Stack Web Development program gave me the exact hands-on experience I needed. Building modern Next.js and Node.js applications with AI integration helped me land my first software engineering job!',
      rating: 5,
      cohort: 'Full Stack Web Dev Cohort'
    },
    {
      name: 'Aditi Rao',
      role: 'Generative AI Engineer at NeuroTech',
      content: 'Working through Transformers, RAG architectures, and autonomous AI agents gave me immense confidence. The mentorship and real-world project reviews prepared me thoroughly for corporate technical interviews.',
      rating: 5,
      cohort: 'Generative AI Cohort'
    },
    {
      name: 'Kunal Sen',
      role: 'ML Engineer at DataSphere',
      content: 'The Python with AI/ML flagship program was comprehensive and practical. The progression from core Python to deep learning and GenAI applications helped me build a standout portfolio.',
      rating: 5,
      cohort: 'Python with AI/ML Cohort'
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
      <section className="relative overflow-hidden py-20 md:py-28 min-h-[calc(100vh-72px)] flex items-center">
        {/* Developer Grid & Glow Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a60a_1px,transparent_1px),linear-gradient(to_bottom,#14b8a60a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.18),transparent_60%)]' : 'bg-[radial-gradient(circle_at_30%_30%,rgba(13,148,136,0.06),transparent_60%)]'}`} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left animate-fade-in-up">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border shadow-sm ${isDark ? 'bg-[#14B8A6]/10 text-[#2DD4BF] border-[#14B8A6]/25' : 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/25'}`}>
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                MSME Certified Training Institute
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-[1.15] ${titleClr}`}>
                Next-Gen <span className={`${accentClr} relative inline-block`}>Tech Education</span> & Career Portal
              </h1>
              <p className={`text-xl md:text-2xl mb-4 font-bold tracking-tight ${subClr}`}>
                Build Skills. Gain Experience. Get Industry Ready.
              </p>
              <p className={`text-base md:text-lg mb-10 max-w-2xl leading-relaxed ${mutedClr}`}>
                Join India's leading MSME-certified learning hub. Elevate your potential with hands-on labs, elite mentorship, and portfolio-grade industry development designed for modern developers.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-14">
                <Link to="/enroll">
                  <Button size="lg" className={`w-full sm:w-auto h-14 px-9 text-base font-bold tracking-wide rounded-full border-0 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 glow-button ${btnPrimary}`}>
                    Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <BookDemoModal
                  triggerVariant="outline"
                  triggerSize="lg"
                  triggerClassName={`w-full sm:w-auto h-14 px-8 text-base font-bold rounded-full transition-all duration-300 hover:scale-105 ${btnOutline} border-2 flex items-center justify-center gap-2`}
                  triggerText="✨ Book Free Demo"
                />
                <Link to="/courses">
                  <Button size="lg" variant="ghost" className={`w-full sm:w-auto h-14 px-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 ${subClr}`}>
                    Explore Programs
                  </Button>
                </Link>
              </div>

              {/* Counters Section in modern card strip */}
              <div className={`grid grid-cols-3 gap-4 pt-8 border-t ${isDark ? 'border-[rgba(20,184,166,0.15)]' : 'border-slate-200'}`}>
                {[
                  { value: 500, label: 'Students Trained', suffix: '+' },
                  { value: 4, label: 'Flagship Programs', suffix: '' },
                  { value: 100, label: 'MSME Certified', suffix: '%' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all duration-300 ${cardBg}`}>
                    <p className={`text-2xl sm:text-3xl md:text-4xl font-black ${accentClr}`}>
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider mt-1.5 ${mutedClr}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Premium Visuals */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
              <div className="animate-float relative w-full max-w-[480px]">
                <div className={`absolute inset-0 blur-[60px] rounded-full opacity-65 ${isDark ? 'bg-[rgba(20,184,166,0.28)]' : 'bg-[rgba(13,148,136,0.14)]'}`} />
                
                {/* Student coding image inside a premium rounded container */}
                <div className={`relative rounded-3xl overflow-hidden border p-2.5 shadow-2xl ${isDark ? 'bg-[#0D1515]/90 border-[#14B8A6]/30' : 'bg-white border-slate-200'} backdrop-blur-md`}>
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" 
                    alt="Students Collaborating & Coding" 
                    className="rounded-2xl w-full h-[340px] object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Floating logo card */}
                  <div className={`absolute bottom-6 right-6 px-4 py-2.5 rounded-2xl border flex items-center justify-center backdrop-blur-md shadow-xl ${isDark ? 'bg-[#0B0F0F]/90 border-[#14B8A6]/35' : 'bg-white/95 border-slate-200'}`}>
                    <img src={logo} alt="EdSec Logo" className="h-8 w-auto object-contain" />
                  </div>
                </div>

                {/* Overlapping small code snippet widget */}
                <div className={`absolute -bottom-6 -left-6 p-4 rounded-2xl border flex items-center gap-3 backdrop-blur-md shadow-xl transition-transform hover:scale-105 duration-300 ${isDark ? 'bg-[#121818]/95 border-[#14B8A6]/35 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <div className={`p-2.5 rounded-xl ${isDark ? 'bg-[#14B8A6]/20' : 'bg-[#0D9488]/10'}`}>
                    <Code className={`h-5 w-5 ${accentClr}`} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Curriculum</p>
                    <p className="text-xs font-extrabold">Project-Based Learning</p>
                  </div>
                </div>

                {/* Overlapping rating badge */}
                <div className={`absolute -top-5 -right-5 px-4 py-2.5 rounded-2xl border flex items-center gap-2 backdrop-blur-md shadow-xl transition-transform hover:scale-105 duration-300 ${isDark ? 'bg-[#121818]/95 border-[#14B8A6]/35 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <div className="flex text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold">4.9 / 5.0</p>
                    <p className="text-[10px] opacity-60 font-semibold">Student Rating</p>
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
              EdSec Innovations is an MSME-certified training institute headquartered in Bengaluru. We bridge the gap between academic theory and real-world technology demands through project-driven certified programs, professional developer guidance, and validated certification frameworks.
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
                className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full ${cardBg} ${cardGlow}`}
              >
                <div className={`p-4 rounded-2xl self-start mb-6 ${isDark ? 'bg-[#14B8A6]/12 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-xl font-extrabold mb-3 ${titleClr}`}>{item.title}</h3>
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
              Get hands-on command over the most in-demand skills, frameworks, and tools in modern tech domains.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {technologies.map((tech, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-3xl border text-center flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg ${cardBg} ${isDark ? 'hover:border-[#14B8A6]/40' : 'hover:border-[#0D9488]/40'}`}
              >
                <div className={`p-3.5 rounded-2xl mb-4 ${isDark ? 'bg-[#14B8A6]/10 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
                  <tech.icon className="h-6 w-6" />
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
              You won't just learn theory. You will build and deploy real applications to create a verified, industry-grade portfolio.
            </p>
          </div>

          {/* Project Tabs - Segmented Pill Control */}
          <div className="flex justify-center mb-12">
            <div className={`inline-flex flex-wrap gap-1.5 p-1.5 rounded-full border ${isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-slate-100 border-slate-200'}`}>
              {[
                { id: 'web', label: 'Full Stack Web Dev' },
                { id: 'genai', label: 'Generative AI' },
                { id: 'python', label: 'Python with AI/ML' },
                { id: 'git', label: 'Git & Career' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProjTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                    activeProjTab === tab.id
                      ? (isDark ? 'bg-[#14B8A6] text-white shadow-[0_0_14px_rgba(20,184,166,0.4)]' : 'bg-[#0D9488] text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]')
                      : (isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60')
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects[activeProjTab].map((proj, idx) => (
              <div 
                key={idx} 
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 ${cardBg} ${cardGlow}`}
              >
                {/* Project Cover Image */}
                <div className="h-52 w-full overflow-hidden relative p-3 pb-0">
                  <img 
                    src={(proj as any).image} 
                    alt={proj.title} 
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className={`text-xl font-extrabold mb-2.5 ${titleClr}`}>{proj.title}</h3>
                    <p className={`text-sm leading-relaxed mb-6 ${mutedClr}`}>{proj.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-200/10">
                    {proj.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${isDark ? 'bg-white/5 border-white/10 text-teal-300' : 'bg-black/5 border-black/10 text-teal-700'}`}
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
              Your Learning & Career Journey
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
              Real reviews and outcomes from graduates of our certified programs.
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

            {/* Carousel Navigation & Dots */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button 
                onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                className={`p-3 rounded-full border transition-all duration-300 hover:scale-110 ${
                  isDark ? 'bg-[#121818] border-slate-800 text-slate-300 hover:border-[#14B8A6]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#0D9488]'
                }`}
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentTestimonial === idx
                        ? `w-8 ${isDark ? 'bg-[#14B8A6]' : 'bg-[#0D9488]'}`
                        : `w-2.5 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

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
              Have questions about our certified programs and courses? We have answers.
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
                a: "Yes, you will receive an MSME-recognized completion certificate along with a letter of recommendation upon successful completion of the course and project requirements."
              },
              {
                q: "Is hands-on project work included?",
                a: "Yes, all programs include comprehensive, portfolio-grade project development and professional exposure with real-world workflows."
              },
              {
                q: "What technologies are covered?",
                a: "We specialize in Full Stack Web Development (React, Next.js, Node.js, MongoDB), Generative AI (LLMs, RAG, AI Agents), Python with AI/ML (NumPy, Pandas, PyTorch, Deep Learning), and Git & Career Preparation."
              },
              {
                q: "Can students learn remotely?",
                a: "Yes, our programs are fully remote and designed to fit flexibly around your academic or professional schedule."
              }
            ].map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`faq-${idx}`} 
                className={`border rounded-2xl px-6 py-1.5 transition-all duration-300 ${cardBg}`}
              >
                <AccordionTrigger className={`text-left font-bold text-base hover:no-underline py-4 ${titleClr} hover:${accentClr} transition-colors`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className={`text-sm leading-relaxed pb-4 ${mutedClr}`}>
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
                <Button size="lg" className={`w-full sm:w-auto h-14 px-10 font-bold tracking-wide rounded-full border-0 transition-all duration-300 hover:scale-105 hover:-translate-y-1 glow-button ${btnPrimary}`}>
                  Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a 
                href="https://wa.me/918660132700?text=Hi!%20I%20would%20like%20to%20talk%20to%20a%20mentor%20about%20EdSec%20Innovations%20programs."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className={`w-full sm:w-auto h-14 px-8 font-bold rounded-full transition-all duration-300 hover:scale-105 ${btnOutline}`}>
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
