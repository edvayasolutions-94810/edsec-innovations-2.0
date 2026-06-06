import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, Clock, Layers, BookOpen, CheckCircle2, Award, Briefcase, HelpCircle, ChevronDown, Check, GraduationCap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { courses } from '@/data/courses';
import { domainData } from '@/data/domainData';
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
import { DomainData } from '@/data/domainData';

const getProgramSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const ProgramDetails = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedDomain, setSelectedDomain] = useState<DomainData | null>(null);
  const [showHeroDropdown, setShowHeroDropdown] = useState(false);
  const [showBottomDropdown, setShowBottomDropdown] = useState(false);

  const course = courses.find(c => getProgramSlug(c.title) === programId);

  const programDomains = domainData.filter(d => course?.domains.includes(d.name));

  useEffect(() => {
    if (!showHeroDropdown) return;
    const handleClose = () => setShowHeroDropdown(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [showHeroDropdown]);

  useEffect(() => {
    if (!showBottomDropdown) return;
    const handleClose = () => setShowBottomDropdown(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [showBottomDropdown]);

  useEffect(() => {
    if (!course) {
      navigate('/internship');
    }
  }, [course, navigate]);

  if (!course) return null;

  const getProjects = () => {
    switch(course.id) {
      case '1-month-skill':
        return [
          { title: 'E-Commerce Database System', desc: 'Design and implement a robust SQL database architecture for an online retail store.' },
          { title: 'AR Product Viewer', desc: 'Build an augmented reality application that lets users visualize products in their physical space.' }
        ];
      case '3-month-industry':
        return [
          { title: 'Customer Churn Prediction', desc: 'Analyze customer data and build models to predict churn.' },
          { title: 'AI-Powered CRM System', desc: 'Develop a full-stack web application integrating generative AI for automated responses.' }
        ];
      case '5-month-advanced':
      default:
        return [
          { title: 'Autonomous Trading Bot', desc: 'Engineer a machine learning pipeline that predicts stock movements.' },
          { title: 'Enterprise SaaS Platform', desc: 'Architect and deploy a multi-tenant Python Full Stack application.' }
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
                  <Link to="/internship" className="hover:text-[#14B8A6] transition-colors">
                    Internship Programs
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
            {course.duration}
          </span>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight ${textClr}`}>
            {course.title}
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mb-10 leading-relaxed ${mutedClr}`}>
            {course.detailedDescription || course.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 relative">
            <Link to="/enroll" state={{ predefinedCourse: course.title }} className="w-full sm:w-auto">
              <Button size="lg" className={`w-full sm:w-auto h-14 px-8 text-base font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-105 glow-button ${btnPrimary}`}>
                Apply for Internship
              </Button>
            </Link>
            <div className="relative w-full sm:w-auto">
              <Button
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHeroDropdown(!showHeroDropdown);
                }}
                variant="outline"
                className={`w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                  isDark
                    ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
                    : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
                }`}
              >
                📄 Download Brochure <ChevronDown className="h-4 w-4" />
              </Button>
              {showHeroDropdown && (
                <div 
                  className={`absolute top-full left-0 mt-2 w-64 rounded-xl border p-2 shadow-2xl z-20 backdrop-blur-md ${
                    isDark 
                      ? 'bg-[#0D1515]/95 border-[rgba(20,184,166,0.3)] text-white' 
                      : 'bg-white/95 border-[rgba(13,148,136,0.25)] text-slate-800'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-1 opacity-60 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    Select Brochure
                  </p>
                  <div className="space-y-1">
                    {programDomains.map((d) => (
                      <a
                        key={d.id}
                        href={d.brochureUrl}
                        download={d.brochureFilename}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowHeroDropdown(false)}
                        className={`flex items-center justify-between text-xs px-2.5 py-2.5 rounded-lg font-medium transition-all ${
                          isDark 
                            ? 'hover:bg-[#14B8A6]/15 text-slate-200 hover:text-white' 
                            : 'hover:bg-[#0D9488]/10 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <span>{d.name}</span>
                        <span className="opacity-60 text-[10px]">PDF &darr;</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            {/* Domains Covered */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Layers className={`w-6 h-6 ${accentClr}`} />
                </div>
                <h2 className={`text-2xl font-bold ${textClr}`}>Domains Covered</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.domains.map((domain, idx) => {
                  const data = domainData.find(d => d.name === domain);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => data && setSelectedDomain(data)}
                      className={`text-left p-6 rounded-2xl border flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cardBg} ${data ? 'cursor-pointer hover:border-[#14B8A6]/50' : 'cursor-default'}`}
                    >
                      <div className="flex justify-between items-start mb-4 w-full">
                        <BookOpen className={`w-8 h-8 ${accentClr}`} />
                        {data && (
                          <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${isDark ? 'bg-[#14B8A6]/10' : 'bg-[#0D9488]/10'} ${accentClr}`}>₹{data.price}</span>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${textClr}`}>{domain}</h3>
                      <p className={`text-sm leading-relaxed flex-grow mb-4 ${mutedClr}`}>
                        {data ? data.tagline : 'Master core concepts, advanced techniques, and practical applications essential for modern industry standards in this specific domain.'}
                      </p>
                      {data && (
                        <div className="flex items-center justify-between gap-1.5 mt-auto pt-3 border-t border-slate-200/10 w-full">
                          {data.brochureUrl && (
                            <a
                              href={data.brochureUrl}
                              download={data.brochureFilename}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                                isDark
                                  ? 'border-[#14B8A6]/35 text-[#14B8A6] hover:bg-[#14B8A6]/10'
                                  : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
                              }`}
                              title="Download Brochure"
                            >
                              📄 Brochure
                            </a>
                          )}
                          <div className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-0.5 ${accentClr} opacity-80 hover:opacity-100`}>
                            View Syllabus <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills Covered */}
            {course.skillsCovered && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${iconBg}`}>
                    <CheckCircle2 className={`w-6 h-6 ${accentClr}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${textClr}`}>Skills Covered</h2>
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
                    <div className={`p-3 rounded-2xl bg-teal-500/20 text-teal-400 flex-shrink-0`}>
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
                <h2 className={`text-2xl font-bold ${textClr}`}>Projects Included</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl border flex flex-col h-full ${cardBg} hover:shadow-lg transition-all duration-300`}>
                    <h3 className={`text-lg font-bold mb-2 ${textClr}`}>{project.title}</h3>
                    <p className={`text-sm mb-4 flex-grow ${mutedClr}`}>
                      {project.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Internship Opportunities */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Briefcase className={`w-6 h-6 ${accentClr}`} />
                </div>
                <h2 className={`text-2xl font-bold ${textClr}`}>Internship Opportunities</h2>
              </div>
              <div className={`border rounded-2xl p-6 md:p-8 ${cardBg}`}>
                <p className={`text-sm md:text-base leading-relaxed mb-6 ${mutedClr}`}>
                  Graduate with verified experience. Our internship programs bridge the gap between academic work and professional software development, preparing you for real roles in top tech companies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className={`font-bold mb-1.5 ${textClr}`}>Industry Workflows</h4>
                    <p className={`text-xs ${mutedClr}`}>Experience agile methodologies, documentation practices, and deployment pipelines mirroring real development environments.</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className={`font-bold mb-1.5 ${textClr}`}>Professional Growth</h4>
                    <p className={`text-xs ${mutedClr}`}>Collaborate with team members, participate in code reviews, and build a resume-worthy work history.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Now Bottom CTA */}
            <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-[#0D1515] border-[#14B8A6]/25 shadow-lg' : 'bg-[#F0FDFA] border-[#0D9488]/25 shadow-md'}`}>
              <h3 className={`text-xl font-bold mb-3 ${textClr}`}>Ready to accelerate your career?</h3>
              <p className={`text-sm mb-6 ${mutedClr}`}>Enroll today in the {course.title} and choose your preferred tech domain slab.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative">
                <Link to="/enroll" state={{ predefinedCourse: course.title }} className="w-full sm:w-auto">
                  <Button size="lg" className={`w-full sm:w-auto h-12 px-8 font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-105 glow-button ${btnPrimary}`}>
                    Apply Now &amp; Register
                  </Button>
                </Link>
                <div className="relative w-full sm:w-auto">
                  <Button
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBottomDropdown(!showBottomDropdown);
                    }}
                    variant="outline"
                    className={`w-full sm:w-auto h-12 px-6 font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all duration-300 ${
                      isDark
                        ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
                        : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
                    }`}
                  >
                    📄 Download Brochure <ChevronDown className="h-4 w-4" />
                  </Button>
                  {showBottomDropdown && (
                    <div 
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-xl border p-2 shadow-2xl z-20 backdrop-blur-md ${
                        isDark 
                          ? 'bg-[#0D1515]/95 border-[rgba(20,184,166,0.3)] text-white' 
                          : 'bg-white/95 border-[rgba(13,148,136,0.25)] text-slate-800'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-1 opacity-60 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                        Select Brochure
                      </p>
                      <div className="space-y-1 text-left">
                        {programDomains.map((d) => (
                          <a
                            key={d.id}
                            href={d.brochureUrl}
                            download={d.brochureFilename}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setShowBottomDropdown(false)}
                            className={`flex items-center justify-between text-xs px-2.5 py-2 rounded-lg font-medium transition-all ${
                              isDark 
                                ? 'hover:bg-[#14B8A6]/15 text-slate-200 hover:text-white' 
                                : 'hover:bg-[#0D9488]/10 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <span>{d.name}</span>
                            <span className="opacity-60 text-[10px]">PDF &darr;</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                    This program is designed for students and professionals looking to gain hands-on, practical experience in the tech industry. Whether you are a beginner or looking to upskill, the curriculum adapts to your pace.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className={`border-b ${isDark ? 'border-[#14B8A6]/20' : 'border-[#0D9488]/20'}`}>
                  <AccordionTrigger className={`text-left font-semibold ${textClr} hover:no-underline hover:text-[#14B8A6]`}>Will I receive a certificate?</AccordionTrigger>
                  <AccordionContent className={`${mutedClr}`}>
                    Yes, upon successful completion, you will receive an MSME-certified internship completion certificate and a letter of recommendation based on your performance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className={`border-b ${isDark ? 'border-[#14B8A6]/20' : 'border-[#0D9488]/20'}`}>
                  <AccordionTrigger className={`text-left font-semibold ${textClr} hover:no-underline hover:text-[#14B8A6]`}>Is there placement assistance?</AccordionTrigger>
                  <AccordionContent className={`${mutedClr}`}>
                    We provide comprehensive career support including resume building, LinkedIn optimization, and interview preparation to help you secure your next role.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Benefits Widget */}
            <div className={`p-6 rounded-2xl border ${cardBg}`}>
              <h3 className={`text-lg font-bold mb-6 ${textClr}`}>Program Benefits</h3>
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
                <h3 className={`text-lg font-bold ${textClr}`}>Certification</h3>
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${mutedClr}`}>
                Earn a government-recognized credential to boost your profile and stand out to top recruiters.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center text-sm ${textClr}`}><ChevronRight className={`w-4 h-4 mr-1 ${accentClr}`}/> MSME Certified Internship</li>
                <li className={`flex items-center text-sm ${textClr}`}><ChevronRight className={`w-4 h-4 mr-1 ${accentClr}`}/> Letter of Recommendation</li>
              </ul>
            </div>

            {/* Career Opportunities Widget */}
            <div className={`p-6 rounded-2xl border ${cardBg}`}>
              <h3 className={`text-lg font-bold mb-4 ${textClr}`}>Career Opportunities</h3>
              <div className="flex flex-wrap gap-2">
                {['Software Engineer', 'Data Analyst', 'Full Stack Developer', 'AI Specialist'].map((role, i) => (
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
        <DialogContent className={`max-w-2xl max-h-[85vh] overflow-y-auto ${isDark ? 'bg-[#0B0F0F] text-white border-[#14B8A6]/20' : 'bg-white text-slate-900 border-[#0D9488]/20'}`}>
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
                Course Syllabus
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
              {selectedDomain?.brochureUrl && (
                <a
                  href={selectedDomain.brochureUrl}
                  download={selectedDomain.brochureFilename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    variant="outline"
                    className={`w-full font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                      isDark
                        ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
                        : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
                    }`}
                  >
                    📄 Download Brochure
                  </Button>
                </a>
              )}
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

export default ProgramDetails;
