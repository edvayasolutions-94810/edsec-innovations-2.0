import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Course } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import BrochureGate from '@/components/BrochureGate';

interface ProgramCardProps {
  course: Course;
  index?: number;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ course }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const programUrl = `/programs/${course.id}`;

  const cardBg = isDark ? 'bg-[#121818]' : 'bg-white';
  const cardGlow = isDark
    ? 'hover:shadow-[0_0_28px_rgba(20,184,166,0.55)] hover:border-[rgba(20,184,166,0.5)]'
    : 'hover:shadow-[0_0_22px_rgba(13,148,136,0.38)] hover:border-[rgba(13,148,136,0.45)]';
  const badgeBg = isDark ? 'bg-[#14B8A6]/20 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]';
  const priceClr = isDark ? 'text-[#2DD4BF]' : 'text-[#0D9488]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const dotClr = isDark ? 'bg-[#14B8A6]' : 'bg-[#0D9488]';
  const divider = isDark ? 'border-[rgba(20,184,166,0.12)]' : 'border-[rgba(13,148,136,0.12)]';

  return (
    <div
      onClick={() => navigate(programUrl)}
      className={`text-left glass-card rounded-3xl p-6 flex flex-col transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer w-full group h-full relative`}
    >
      {/* Visual Image Header */}
      <div className="relative h-48 overflow-hidden rounded-2xl mb-5 group/img bg-slate-900/10">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border ${badgeBg} ${isDark ? 'border-teal-500/30' : 'border-teal-600/20'}`}>
            <Clock className="h-3 w-3" />
            {course.duration}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 text-teal-300 backdrop-blur-md border border-white/10">
            {course.domains.length} {course.domains.length === 1 ? 'Track' : 'Levels'}
          </span>
        </div>
      </div>

      {/* Header: Title + Price */}
      <div className="flex justify-between items-start mb-2 gap-3">
        <h3 className={`text-xl font-extrabold leading-snug ${titleClr}`}>
          {course.title}
        </h3>
        <div className="text-right flex-shrink-0">
          <span className={`text-2xl font-black ${priceClr}`}>₹{course.price}</span>
          <span className={`block text-[10px] uppercase font-bold tracking-wider ${mutedClr}`}>
            Complete Program
          </span>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${mutedClr}`}>
        {course.description}
      </p>

      <div className={`border-t ${divider} mb-4`} />

      {/* Domain/Track Pills Preview */}
      <div className="mb-4 flex-grow">
        <p className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${accentClr}`}>
          <BookOpen className="h-3.5 w-3.5" /> Specialization Tracks
        </p>
        <div className="flex flex-wrap gap-1.5">
          {course.domains.map((d, i) => (
            <span
              key={i}
              className={`inline-flex items-center text-xs px-2.5 py-1 rounded-lg border font-medium ${
                isDark
                  ? 'bg-white/5 border-white/10 text-teal-200'
                  : 'bg-black/5 border-black/10 text-teal-800'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 flex-shrink-0 ${dotClr}`} />
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Key Inclusions Preview */}
      {course.features && course.features.length > 0 && (
        <div className="mb-6">
          <ul className="space-y-1.5">
            {course.features.slice(0, 2).map((feature, idx) => (
              <li key={idx} className={`text-xs flex items-start gap-2 ${mutedClr}`}>
                <CheckCircle2 className={`h-3.5 w-3.5 ${accentClr} flex-shrink-0 mt-0.5`} />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto w-full flex items-center gap-2 relative pt-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(programUrl);
          }}
          className={`flex-1 font-bold tracking-wide rounded-xl border-0 transition-all duration-300 hover:scale-[1.02] glow-button ${
            isDark
              ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_14px_rgba(20,184,166,0.35)]'
              : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]'
          }`}
        >
          View Details <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>

        <BrochureGate
          programId={course.id}
          programTitle={course.title}
          triggerVariant="outline"
          triggerClassName={`px-3.5 font-semibold rounded-xl border flex items-center gap-1.5 transition-all duration-300 ${
            isDark
              ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
              : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10'
          }`}
          triggerText="📄 Brochure"
        />
      </div>
    </div>
  );
};

export default ProgramCard;
