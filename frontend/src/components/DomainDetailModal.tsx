import { X, CheckCircle2, BookOpen, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DomainData } from '@/data/domainData';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  domain: DomainData;
  onClose: () => void;
}

const levelColors = {
  Beginner:     { dark: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', light: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Intermediate: { dark: 'bg-amber-500/15 text-amber-400 border-amber-500/20',     light: 'bg-amber-100 text-amber-700 border-amber-200' },
  Advanced:     { dark: 'bg-rose-500/15 text-rose-400 border-rose-500/20',         light: 'bg-rose-100 text-rose-700 border-rose-200' },
};

const DomainDetailModal = ({ domain, onClose }: Props) => {
  const { isDark } = useTheme();
  const [openModule, setOpenModule] = useState<number | null>(0);

  const overlayBg  = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  const modalBg    = isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.2)]' : 'bg-white border-[rgba(13,148,136,0.2)]';
  const headerBg   = isDark ? 'bg-[#0B1A1A]' : 'bg-[#F0FDFA]';
  const titleClr   = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr   = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const accentClr  = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const accentBg   = isDark ? 'bg-[#14B8A6]/10' : 'bg-[#0D9488]/10';
  const moduleHdr  = isDark ? 'bg-[#0F1C1C] border-[rgba(20,184,166,0.15)] hover:border-[rgba(20,184,166,0.35)]' : 'bg-[#F0FDFA] border-[rgba(13,148,136,0.15)] hover:border-[rgba(13,148,136,0.3)]';
  const moduleBody = isDark ? 'bg-[#0B1515] border-[rgba(20,184,166,0.1)]' : 'bg-white border-[rgba(13,148,136,0.08)]';
  const lvl        = levelColors[domain.level];
  const lvlCls     = isDark ? lvl.dark : lvl.light;
  const btnClass   = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_18px_rgba(20,184,166,0.45)] hover:shadow-[0_0_28px_rgba(20,184,166,0.65)] hover:scale-105'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_14px_rgba(13,148,136,0.4)] hover:shadow-[0_0_22px_rgba(13,148,136,0.6)] hover:scale-105';
  const closeBtnCls = isDark
    ? 'text-[#94A3B8] hover:text-[#E6FFFA] hover:bg-[#14B8A6]/10'
    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#0D9488]/10';

  return (
    <div className={overlayBg} style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div
        className={`${modalBg} border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${headerBg} px-7 pt-7 pb-5 border-b ${isDark ? 'border-[rgba(20,184,166,0.12)]' : 'border-[rgba(13,148,136,0.1)]'} flex-shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${lvlCls}`}>
                  {domain.level}
                </span>
                <span className={`flex items-center gap-1 text-xs ${mutedClr}`}>
                  <Clock className="h-3.5 w-3.5" /> {domain.duration}
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]'}`}>
                  ₹{domain.price}
                </span>
              </div>
              <h2 className={`text-2xl font-extrabold mb-1 ${titleClr}`}>{domain.name}</h2>
              <p className={`text-sm font-medium ${accentClr}`}>{domain.tagline}</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${closeBtnCls}`}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${accentClr}`}>About This Domain</h3>
            <p className={`text-sm leading-relaxed ${mutedClr}`}>{domain.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${accentClr}`}>Program Includes</h3>
            <ul className="space-y-2">
              {domain.features.map((f, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${mutedClr}`}>
                  <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${accentClr}`} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Syllabus accordion */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${accentClr}`}>
              Full Syllabus ({domain.syllabus.length} Modules)
            </h3>
            <div className="space-y-2">
              {domain.syllabus.map((mod, i) => (
                <div key={i} className={`${moduleBody} border rounded-xl overflow-hidden`}>
                  <button
                    onClick={() => setOpenModule(openModule === i ? null : i)}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left border ${moduleHdr} rounded-xl transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${accentBg} ${accentClr}`}>
                        {i + 1}
                      </span>
                      <span className={`text-sm font-semibold ${titleClr}`}>{mod.title}</span>
                    </div>
                    {openModule === i
                      ? <ChevronUp className={`h-4 w-4 ${accentClr}`} />
                      : <ChevronDown className={`h-4 w-4 ${mutedClr}`} />
                    }
                  </button>
                  {openModule === i && (
                    <ul className="px-4 pb-3 pt-1 space-y-1.5">
                      {mod.topics.map((topic, j) => (
                        <li key={j} className={`flex items-start gap-2 text-sm ${mutedClr}`}>
                          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${isDark ? 'bg-[#14B8A6]' : 'bg-[#0D9488]'}`} />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className={`px-7 py-5 border-t ${isDark ? 'border-[rgba(20,184,166,0.12)]' : 'border-[rgba(13,148,136,0.1)]'} flex-shrink-0 ${headerBg}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-xs ${mutedClr}`}>Ready to start?</p>
              <p className={`text-sm font-bold ${titleClr}`}>{domain.programTitle} · ₹{domain.price}</p>
            </div>
            <Link to="/enroll" state={{ predefinedCourse: domain.programTitle, domain: domain.name }} onClick={onClose}>
              <Button className={`h-11 px-7 font-bold rounded-xl transition-all duration-300 glow-button ${btnClass}`}>
                Enroll Now →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainDetailModal;
