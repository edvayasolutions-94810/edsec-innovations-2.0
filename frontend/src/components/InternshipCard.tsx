import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Course } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDown } from 'lucide-react';
import { domainData } from '@/data/domainData';

interface InternshipCardProps {
  course: Course;
  index: number;
}

const InternshipCard = ({ course, index }: InternshipCardProps) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const getProgramSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const programUrl = `/programs/${getProgramSlug(course.title)}`;

  const cardBg = isDark ? 'bg-[#121818]' : 'bg-white';
  const cardGlow = isDark
    ? 'hover:shadow-[0_0_28px_rgba(20,184,166,0.55)] hover:border-[rgba(20,184,166,0.5)]'
    : 'hover:shadow-[0_0_22px_rgba(13,148,136,0.38)] hover:border-[rgba(13,148,136,0.45)]';
  const badgeBg = isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]';
  const priceClr = isDark ? 'text-[#2DD4BF]' : 'text-[#0D9488]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';

  const programDomains = domainData.filter(d => course.domains.includes(d.name));

  useEffect(() => {
    if (!showDropdown) return;
    const handleOutsideClick = () => setShowDropdown(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showDropdown]);

  return (
    <div
      onClick={() => navigate(programUrl)}
      className={`text-left ${cardBg} ${cardGlow} border ${isDark ? 'border-[#14B8A6]/20' : 'border-[#0D9488]/20'} rounded-2xl p-6 flex flex-col transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer w-full group h-full`}
    >
      <div className="flex justify-between items-start mb-4 w-full">
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badgeBg}`}>
          {course.duration}
        </span>
        <div className="text-right">
          <span className={`text-2xl font-extrabold ${priceClr}`}>₹{course.price}</span>
          <span className={`block text-[10px] uppercase font-bold mt-0.5 ${mutedClr}`}>
            – Single Program
          </span>
        </div>
      </div>
      
      <h3 className={`text-xl font-bold mb-1 ${titleClr}`}>{course.title}</h3>
      <p className={`text-[11px] font-medium uppercase tracking-wider mb-4 ${accentClr}`}>
        Click to view domains & program details
      </p>
      
      <p className={`text-sm mb-6 flex-grow ${mutedClr}`}>
        {course.description}
      </p>
      
      <div className="mt-auto w-full flex items-center gap-3 relative">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(programUrl);
          }}
          className={`flex-1 font-semibold tracking-wide rounded-xl border-0 transition-colors duration-300 glow-button ${
            isDark 
              ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_12px_rgba(20,184,166,0.35)]' 
              : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]'
          }`}
        >
          View Details
        </Button>
        <div className="relative">
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            variant="outline"
            className={`px-4 font-semibold rounded-xl border flex items-center gap-1.5 transition-all duration-300 ${
              isDark
                ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
                : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
            }`}
          >
            📄 Brochure <ChevronDown className="h-3.5 w-3.5" />
          </Button>

          {showDropdown && (
            <div 
              className={`absolute bottom-full right-0 mb-2 w-64 rounded-xl border p-2 shadow-2xl z-20 backdrop-blur-md ${
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
                    onClick={() => setShowDropdown(false)}
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
  );
};

export default InternshipCard;
