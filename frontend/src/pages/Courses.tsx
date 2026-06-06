import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { domainData } from '@/data/domainData';
import DomainDetailModal from '@/components/DomainDetailModal';
import type { DomainData } from '@/data/domainData';

const TABS = [
  { id: '1-month-skill',   label: 'Foundation Tech Program',    duration: '1 Month',  price: '₹1,999' },
  { id: '3-month-industry',label: 'Advanced Technology Program',   duration: '3 Months', price: '₹3,499' },
  { id: '5-month-advanced',label: 'Professional Internship Program', duration: '5 Months', price: '₹4,999' },
];

const levelColors = {
  Beginner:     { dark: 'bg-emerald-500/15 text-emerald-400', light: 'bg-emerald-100 text-emerald-700' },
  Intermediate: { dark: 'bg-amber-500/15 text-amber-400',     light: 'bg-amber-100 text-amber-700' },
  Advanced:     { dark: 'bg-rose-500/15 text-rose-400',       light: 'bg-rose-100 text-rose-700' },
};

const Courses = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('1-month-skill');
  const [selectedDomain, setSelectedDomain] = useState<DomainData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && TABS.find(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const pageBg    = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg    = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const titleClr  = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr  = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';

  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.15)]' : 'bg-white border-[rgba(13,148,136,0.15)]';
  const cardGlow  = isDark
    ? 'hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:border-[rgba(20,184,166,0.5)]'
    : 'hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] hover:border-[rgba(13,148,136,0.45)]';

  const activeTabCls = isDark
    ? 'bg-[#14B8A6] text-white shadow-[0_0_16px_rgba(20,184,166,0.45)]'
    : 'bg-[#0D9488] text-white shadow-[0_0_12px_rgba(13,148,136,0.4)]';
  const inactiveTabCls = isDark
    ? 'bg-[#121818] text-[#99F6E4] border border-[rgba(20,184,166,0.15)] hover:border-[rgba(20,184,166,0.4)] hover:bg-[#14B8A6]/10'
    : 'bg-[#F0FDFA] text-[#0F172A] border border-[rgba(13,148,136,0.15)] hover:border-[rgba(13,148,136,0.35)] hover:bg-[#0D9488]/10';

  const domains = domainData.filter(d => d.programId === activeTab);
  const activeProgram = TABS.find(t => t.id === activeTab)!;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <Navbar />

      {/* Header */}
      <section className={`${sec2Bg} py-14`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${isDark ? 'bg-[#14B8A6]/12' : 'bg-[#0D9488]/10'}`}>
            <BookOpen className={`h-7 w-7 ${accentClr}`} />
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${titleClr}`}>Our Programs</h1>
          <p className={`text-lg max-w-2xl mx-auto ${mutedClr}`}>
            MSME certified internship programs with structured domains — click any domain to see the full syllabus.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className={`${pageBg} pt-12 pb-2`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id ? activeTabCls : inactiveTabCls
                }`}
              >
                <span className="text-left">
                  <span className="block font-bold">{tab.label}</span>
                  <span className={`text-xs font-normal ${activeTab === tab.id ? 'text-white/80' : mutedClr}`}>
                    {tab.duration}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Domain cards */}
      <section className={`${pageBg} py-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {domains.map((domain) => {
              const lvl = levelColors[domain.level];
              const lvlCls = isDark ? lvl.dark : lvl.light;
              return (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className={`${cardBg} ${cardGlow} border rounded-2xl p-5 flex flex-col text-left transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer w-full`}
                >
                  <div className="flex justify-between items-start w-full mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${lvlCls}`}>{domain.level}</span>
                    <span className={`text-base font-extrabold ${accentClr}`}>₹{domain.price}</span>
                  </div>
                  <h3 className={`font-bold text-base mb-2 ${titleClr}`}>{domain.name}</h3>
                  <p className={`text-sm flex-grow mb-4 text-left ${mutedClr}`}>{domain.tagline}</p>
                  <div className="flex items-center justify-between gap-1.5 mt-auto w-full pt-3 border-t border-slate-200/10">
                    <span className={`text-xs font-semibold flex items-center gap-1 ${accentClr}`}>
                      <Clock className="h-3 w-3" /> {domain.duration}
                    </span>
                    <div className="flex items-center gap-2">
                      {domain.brochureUrl && (
                        <a
                          href={domain.brochureUrl}
                          download={domain.brochureFilename}
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
                      <span className={`text-xs font-semibold flex items-center gap-0.5 ${accentClr}`}>
                        Syllabus <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Domain detail modal */}
      {selectedDomain && (
        <div onClick={() => setSelectedDomain(null)}>
          <DomainDetailModal domain={selectedDomain} onClose={() => setSelectedDomain(null)} />
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Courses;
