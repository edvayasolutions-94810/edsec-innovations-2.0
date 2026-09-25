import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, Clock, Layers, BookOpen, CheckCircle2, Award, Briefcase, HelpCircle, Check, GraduationCap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import BrochureGate from '@/components/BrochureGate';
import { courses } from '@/data/courses';
import { domainData, DomainData } from '@/data/domainData';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const getProgramSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedDomain, setSelectedDomain] = useState<DomainData | null>(null);
  const course = courses.find(
    c => c.id === programId || getProgramSlug(c.title) === programId
  );

  const programDomains = domainData.filter(d => d.programId === course?.id);

  useEffect(() => {
    if (!course) {
      navigate('/courses', { replace: true });
    }
  }, [course, navigate]);

  if (!course) return null;

  const getProjects = () => {
    switch (course.id) {
      case 'full-stack-web-dev':
        return [
          { title: 'Responsive Multi-Page Web Platform', desc: 'Build responsive, accessible, and high-performance websites using semantic HTML5, modern CSS3 (Flexbox/Grid), and ES6+ JavaScript.' },
          { title: 'Modern React & Next.js Application', desc: 'Develop dynamic, component-driven web applications with TypeScript, Next.js App Router, SSR, and production REST APIs.' },
          { title: 'AI-Powered Full Stack Capstone', desc: 'Engineer complete full-stack systems with Node.js, Express, MongoDB, secure JWT authentication, and AI API integrations.' }
        ];
      case 'generative-ai':
        return [
          { title: 'Foundational ML Training & Evaluation Suite', desc: 'Implement supervised and unsupervised machine learning algorithms, mathematical optimizations, and model validations.' },
          { title: 'RAG & Vector Search Document Intelligence', desc: 'Construct end-to-end question-answering systems using transformer embeddings, vector databases, and advanced prompt engineering.' },
          { title: 'Production Autonomous AI Agent System', desc: 'Architect and deploy multi-modal autonomous agentic workflows with LLMOps observability, monitoring, and cloud hosting.' }
        ];
      case 'python-ai-ml':
        return [
          { title: 'Data Wrangling & Interactive Analytics Suite', desc: 'Perform exploratory data analysis, data transformations, and statistical visualizations using NumPy, Pandas, and Matplotlib.' },
          { title: 'End-to-End Predictive ML Pipeline', desc: 'Design, tune, and validate regression, classification, and clustering machine learning models on real-world datasets.' },
          { title: 'Deep Learning Vision & GenAI Capstone', desc: 'Train deep neural networks with PyTorch/TensorFlow and build real-world AI applications powered by LLMs and RAG.' }
        ];
      case 'git-resume':
      default:
        return [
          { title: 'Open-Source Collaborative Git Workflow', desc: 'Simulate team development with branches, pull requests, merge conflict resolutions, rebasing, and GitHub Actions.' },
          { title: 'Industry Portfolio & Job-Ready Career Kit', desc: 'Craft an ATS-optimized technical resume, curated GitHub repository showcases, and a technical interview preparation kit.' }
        ];
    }
  };
  const projects = getProjects();

  const bgClr = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const textClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const cardBg = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.15)]' : 'bg-white border-[rgba(13,148,136,0.15)]';
  const iconBg = isDark ? 'bg-[#14B8A6]/20' : 'bg-[#0D9488]/15';

  const btnPrimary = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_18px_rgba(20,184,166,0.45)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_0_14px_rgba(13,148,136,0.4)]';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClr}`}>
      <Navbar />

      {/* Breadcrumb */}
      <div className={`pt-24 pb-4 ${sec2Bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className={`flex text-sm ${mutedClr}`} aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="inline-flex items-center hover:text-[#14B8A6] transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link to="/courses" className="hover:text-[#14B8A6] transition-colors">
                    Courses
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className={`font-semibold ${textClr}`}>{course.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`relative pt-12 pb-20 overflow-hidden ${sec2Bg}`}>
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_50%)]' : 'bg-[radial-gradient(ellipse_at_top_right,rgba(13,148,136,0.08),transparent_50%)]'}`} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
            <Clock className="w-3.5 h-3.5" />
            {course.duration} · Complete Program
          </span>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight ${textClr}`}>
            {course.title}
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mb-10 leading-relaxed ${mutedClr}`}>
            {course.detailedDescription || course.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 relative">
            <Link to="/enroll" state={{ predefinedCourse: course.title }} className="w-full sm:w-auto">
              <Button size="lg" className={`w-full sm:w-auto h-14 px-8 text-base font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-105 glow-button ${btnPrimary}`}>
                Enroll Now · ₹{course.price}
              </Button>
            </Link>
            <BrochureGate
              programId={course.brochureProgramId || course.id}
              programTitle={course.title}
              triggerVariant="outline"
              triggerClassName={`w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                isDark
                  ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
                  : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
              }`}
              triggerText="📄 Download Brochure"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            {/* Domains & Tracks Covered */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Layers className={`w-6 h-6 ${accentClr}`} />
                </div>
                <h2 className={`text-2xl font-bold ${textClr}`}>Specialization Tracks &amp; Levels</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programDomains.map((data, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedDomain(data)}
                    className="text-left p-6 rounded-2xl glass-card flex flex-col h-full cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <BookOpen className={`w-8 h-8 ${accentClr}`} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${textClr}`}>{data.name}</h3>
                    <p className={`text-sm leading-relaxed flex-grow mb-4 ${mutedClr}`}>
                      {data.tagline}
                    </p>
                    <div className="flex items-center justify-between gap-1.5 mt-auto pt-3 border-t border-slate-200/10 w-full">
                      <div onClick={(e) => e.stopPropagation()}>
                        <BrochureGate
                          programId={data.brochureProgramId || data.programId || course.id}
                          programTitle={data.name}
                          triggerVariant="outline"
                          triggerClassName={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                            isDark
                              ? 'border-[#14B8A6]/35 text-[#14B8A6] hover:bg-[#14B8A6]/10'
                              : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
                          }`}
                          triggerText="📄 Brochure"
                        />
                      </div>
                      <div className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-0.5 ${accentClr} opacity-80 hover:opacity-100`}>
                        View Syllabus <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Covered */}
            {course.skillsCovered && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${iconBg}`}>
                    <CheckCircle2 className={`w-6 h-6 ${accentClr}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${textClr}`}>Skills You Will Master</h2>
                </div>
                <div className={`border rounded-2xl p-6 md:p-8 ${cardBg}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.skillsCovered.map((skill, idx) => (
                      <div key={idx} className={`flex items-center gap-3 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-[#14B8A6]/20' : 'bg-[#0D9488]/10'} ${accentClr}`}>
                          <Check className="w-4.5 h-4.5" />
                        </div>
                        <span className={`text-sm font-semibold ${textClr}`}>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Learning Outcomes */}
            {course.outcome && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${iconBg}`}>
                    <Award className={`w-6 h-6 ${accentClr}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${textClr}`}>Learning Outcomes</h2>
                </div>
                <div className={`border rounded-2xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-r ${isDark ? 'from-[#14B8A6]/10 to-[#0891B2]/5 border-[#14B8A6]/20' : 'from-[#0D9488]/10 to-[#0891B2]/5 border-[#0D9488]/20'}`}>
                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 flex-shrink-0">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-2 ${textClr}`}>Upon Successful Completion:</h4>
                      <p className={`text-sm md:text-base leading-relaxed ${textClr}`}>
                        {course.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Included */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Briefcase className={`w-6 h-6 ${accentClr}`} />
                </div>
                <h2 className={`text-2xl font-bold ${textClr}`}>Real-World Projects Included</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl border flex flex-col h-full ${cardBg} hover:shadow-lg transition-all duration-300`}>
                    <h3 className={`text-lg font-bold mb-2 ${textClr}`}>{project.title}</h3>
                    <p className={`text-sm mb-4 flex-grow leading-relaxed ${mutedClr}`}>
                      {project.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Workflows & Career Exposure */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Briefcase className={`w-6 h-6 ${accentClr}`} />
                </div>
                <h2 className={`text-2xl font-bold ${textClr}`}>Industry &amp; Career Workflows</h2>
              </div>
              <div className={`border rounded-2xl p-6 md:p-8 ${cardBg}`}>
                <p className={`text-sm md:text-base leading-relaxed mb-6 ${mutedClr}`}>
                  Graduate with verified technical competence. Our curriculum bridges the gap between theoretical knowledge and professional software engineering, preparing you for real-world developer roles.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className={`font-bold mb-1.5 ${textClr}`}>Industry Workflows</h4>
                    <p className={`text-xs ${mutedClr}`}>Experience agile methodologies, documentation practices, and deployment pipelines mirroring real corporate development teams.</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className={`font-bold mb-1.5 ${textClr}`}>Professional Growth</h4>
                    <p className={`text-xs ${mutedClr}`}>Collaborate on projects, participate in code reviews, and build a resume-ready technical portfolio.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-[#0D1515] border-[#14B8A6]/25 shadow-lg' : 'bg-[#F0FDFA] border-[#0D9488]/25 shadow-md'}`}>
              <h3 className={`text-xl font-bold mb-3 ${textClr}`}>Ready to accelerate your career?</h3>
              <p className={`text-sm mb-6 ${mutedClr}`}>Enroll today in {course.title} and choose your preferred learning track.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative">
                <Link to="/enroll" state={{ predefinedCourse: course.title }} className="w-full sm:w-auto">
                  <Button size="lg" className={`w-full sm:w-auto h-12 px-8 font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-105 glow-button ${btnPrimary}`}>
                    Apply Now &amp; Register
                  </Button>
                </Link>
                <BrochureGate
                  programId={course.brochureProgramId || course.id}
                  programTitle={course.title}
                  triggerVariant="outline"
                  triggerClassName={`w-full sm:w-auto h-12 px-6 font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    isDark
                      ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
                      : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
                  }`}
                  triggerText="📄 Download Brochure"
                />
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <HelpCircle className={`w-6 h-6 ${accentClr}`} />
                </div>
                <h2 className={`text-2xl font-bold ${textClr}`}>Frequently Asked Questions</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className={`border-b ${isDark ? 'border-[#14B8A6]/20' : 'border-[#0D9488]/20'}`}>
                  <AccordionTrigger className={`text-left font-semibold ${textClr} hover:no-underline hover:text-[#14B8A6]`}>Who is this program for?</AccordionTrigger>
                  <AccordionContent className={`${mutedClr}`}>
                    This program is designed for students and professionals looking to gain hands-on, practical experience in the tech industry. Whether you are a beginner starting from scratch or looking to upskill, the curriculum is structured to support your learning curve.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className={`border-b ${isDark ? 'border-[#14B8A6]/20' : 'border-[#0D9488]/20'}`}>
                  <AccordionTrigger className={`text-left font-semibold ${textClr} hover:no-underline hover:text-[#14B8A6]`}>Will I receive a verified certificate?</AccordionTrigger>
                  <AccordionContent className={`${mutedClr}`}>
                    Yes! Upon successful completion of the course and capstone projects, you will receive an MSME-recognized course completion certificate and a letter of recommendation based on your performance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className={`border-b ${isDark ? 'border-[#14B8A6]/20' : 'border-[#0D9488]/20'}`}>
                  <AccordionTrigger className={`text-left font-semibold ${textClr} hover:no-underline hover:text-[#14B8A6]`}>Is career and interview support included?</AccordionTrigger>
                  <AccordionContent className={`${mutedClr}`}>
                    We provide dedicated career acceleration support including resume optimization, GitHub portfolio curation, and technical interview preparation to help you land modern developer roles.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Benefits Widget */}
            <div className={`p-6 rounded-2xl border ${cardBg}`}>
              <h3 className={`text-lg font-bold mb-6 ${textClr}`}>Program Highlights</h3>
              <ul className="space-y-4">
                {course.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${accentClr}`} />
                    <span className={`text-sm font-medium leading-relaxed ${textClr}`}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certification Widget */}
            <div className={`p-6 rounded-2xl border ${cardBg}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Award className={`w-5 h-5 ${accentClr}`} />
                </div>
                <h3 className={`text-lg font-bold ${textClr}`}>Govt. MSME Certification</h3>
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${mutedClr}`}>
                Earn a recognized credential to boost your profile and stand out to technical recruiters and top companies.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center text-sm ${textClr}`}><ChevronRight className={`w-4 h-4 mr-1 ${accentClr}`}/> MSME Recognized Certificate</li>
                <li className={`flex items-center text-sm ${textClr}`}><ChevronRight className={`w-4 h-4 mr-1 ${accentClr}`}/> Letter of Recommendation</li>
              </ul>
            </div>

            {/* Career Opportunities Widget */}
            <div className={`p-6 rounded-2xl border ${cardBg}`}>
              <h3 className={`text-lg font-bold mb-4 ${textClr}`}>Target Career Roles</h3>
              <div className="flex flex-wrap gap-2">
                {['Software Engineer', 'Full Stack Developer', 'AI / ML Engineer', 'Python Developer', 'Prompt Engineer'].map((role, i) => (
                  <span key={i} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-black/5 border-black/10 text-gray-700'}`}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      {/* Domain Detail Modal */}
      <Dialog open={!!selectedDomain} onOpenChange={(open) => !open && setSelectedDomain(null)}>
        <DialogContent className={`glass-modal max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl ${isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]'}`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className={`w-6 h-6 ${accentClr}`} />
              {selectedDomain?.name}
            </DialogTitle>
            <DialogDescription className={`${mutedClr} mt-2 text-base`}>
              {selectedDomain?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textClr}`}>
                <Layers className={`w-5 h-5 ${accentClr}`} />
                Detailed Curriculum
              </h3>
              <div className="space-y-4">
                {selectedDomain?.syllabus.map((module, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-[#121818] border-[#14B8A6]/10' : 'bg-slate-50 border-[#0D9488]/10'}`}>
                    <h4 className={`font-semibold mb-3 flex items-center gap-2 ${textClr}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${isDark ? 'bg-[#14B8A6]' : 'bg-[#0D9488]'}`}>
                        {idx + 1}
                      </div>
                      {module.title}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm pl-8">
                      {module.topics.map((topic, tidx) => (
                        <li key={tidx} className={`flex items-start gap-2 ${mutedClr}`}>
                          <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${accentClr}`} />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-black/10'} flex items-center gap-3`}>
              <div className="flex-1">
                <BrochureGate
                  programId={selectedDomain?.brochureProgramId || selectedDomain?.programId || course.id}
                  programTitle={selectedDomain?.name || course.title}
                  triggerVariant="outline"
                  triggerClassName={`w-full font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                    isDark
                      ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
                      : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
                  }`}
                  triggerText="📄 Download Brochure"
                />
              </div>
              <Button 
                onClick={() => setSelectedDomain(null)}
                className={`flex-1 font-bold rounded-xl transition-all duration-300 ${
                  isDark ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white' : 'bg-[#0D9488] hover:bg-[#0F766E] text-white'
                }`}
              >
                Close Syllabus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramDetail;
