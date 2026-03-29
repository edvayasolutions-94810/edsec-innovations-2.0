import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { Course } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';

interface InternshipCardProps {
  course: Course;
  index: number;
}

const InternshipCard = ({ course, index }: InternshipCardProps) => {
  const { isDark } = useTheme();

  // tier-specific header bg
  const headerBgs: string[] = [
    isDark ? 'bg-[#0D4D47]' : 'bg-[#0D9488]', // 1-month
    isDark ? 'bg-[#065F5A]' : 'bg-[#0F766E]', // 3-month
    isDark ? 'bg-[#134E4A]' : 'bg-[#115E59]', // 5-month
  ];
  const headerBg = headerBgs[index] ?? headerBgs[0];

  const cardBg   = isDark ? 'bg-[#0F1C1C] border-[rgba(20,184,166,0.2)]' : 'bg-white border-[rgba(13,148,136,0.2)]';
  const glowHover = isDark
    ? 'hover:shadow-[0_0_28px_rgba(20,184,166,0.5)] hover:border-[rgba(20,184,166,0.5)]'
    : 'hover:shadow-[0_0_22px_rgba(13,148,136,0.38)] hover:border-[rgba(13,148,136,0.4)]';
  const domainPill = isDark ? 'bg-[#14B8A6]/12 text-[#2DD4BF] border border-[rgba(20,184,166,0.2)]' : 'bg-[#0D9488]/10 text-[#0F766E] border border-[rgba(13,148,136,0.2)]';
  const featClr   = isDark ? 'text-[#99F6E4]' : 'text-[#374151]';
  const checkClr  = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const headerTag = 'bg-white/15 backdrop-blur-sm text-white border border-white/25';
  const btnCls    = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] shadow-[0_0_18px_rgba(20,184,166,0.45)] hover:shadow-[0_0_28px_rgba(20,184,166,0.65)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] shadow-[0_0_14px_rgba(13,148,136,0.4)] hover:shadow-[0_0_22px_rgba(13,148,136,0.6)]';

  return (
    <div className={`${cardBg} ${glowHover} border rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2`}>
      {/* Colored header */}
      <div className={`${headerBg} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className={`inline-block px-3 py-1 mb-3 rounded-full text-xs font-bold tracking-wider uppercase ${headerTag}`}>
            <Clock className="inline h-3 w-3 mr-1" />{course.duration}
          </div>
          <h3 className="text-2xl font-extrabold mb-3 leading-tight">{course.title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold">₹{course.price}</span>
            <span className="text-white/70 text-sm font-medium">/ complete program</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Domains */}
        {course.domains?.length > 0 && (
          <div className="mb-6">
            <h4 className={`flex items-center text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]'}`}>
              <Layers className="w-3.5 h-3.5 mr-1.5" /> Domains Covered
            </h4>
            <div className="flex flex-wrap gap-2">
              {course.domains.map((domain, i) => (
                <span key={i} className={`px-3 py-1 rounded-lg text-xs font-semibold ${domainPill}`}>
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mb-8 flex-grow">
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]'}`}>Program Includes</h4>
          <ul className="space-y-2.5">
            {course.features.map((feature, i) => (
              <li key={i} className={`flex items-start text-sm ${featClr}`}>
                <CheckCircle2 className={`w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5 ${checkClr}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link to="/enroll" state={{ predefinedCourse: course.title }} className="block w-full">
            <button className={`relative w-full overflow-hidden rounded-xl p-3.5 flex items-center justify-center text-white font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 glow-button ${btnCls}`}>
              Enroll Now
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
