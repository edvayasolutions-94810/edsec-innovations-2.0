import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Clock, Award, CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { Course } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';

interface CourseCardProps { course: Course; }

const CourseCard = ({ course }: CourseCardProps) => {
  const { isDark } = useTheme();

  const cardBg   = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-[#F0FDFA] border-[rgba(13,148,136,0.15)]';
  const cardGlow = isDark
    ? 'hover:shadow-[0_0_28px_rgba(20,184,166,0.55)] hover:border-[rgba(20,184,166,0.5)]'
    : 'hover:shadow-[0_0_22px_rgba(13,148,136,0.38)] hover:border-[rgba(13,148,136,0.45)]';
  const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const priceClr = isDark ? 'text-[#2DD4BF]' : 'text-[#0D9488]';
  const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const dotClr   = isDark ? 'bg-[#14B8A6]' : 'bg-[#0D9488]';
  const badgeBg  = isDark ? 'bg-[#14B8A6]/15 text-[#99F6E4]' : 'bg-[#0D9488]/10 text-[#0D9488]';
  const divider  = isDark ? 'border-[rgba(20,184,166,0.12)]' : 'border-[rgba(13,148,136,0.1)]';
  const btnClass = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_14px_rgba(20,184,166,0.4)] hover:shadow-[0_0_22px_rgba(20,184,166,0.6)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_10px_rgba(13,148,136,0.3)] hover:shadow-[0_0_18px_rgba(13,148,136,0.5)]';
  const dlBtnClass = isDark
    ? 'border-[rgba(20,184,166,0.35)] text-[#14B8A6] hover:bg-[#14B8A6]/10'
    : 'border-[rgba(13,148,136,0.35)] text-[#0D9488] hover:bg-[#0D9488]/10';

  const handleDownload = () => {
    if (!course.downloadBrochure) return;
    const link = document.createElement('a');
    link.href = course.downloadBrochure.url;
    link.download = course.downloadBrochure.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`${cardBg} ${cardGlow} border rounded-2xl p-6 flex flex-col h-full transition-all duration-500 ease-in-out hover:scale-105 hover:-translate-y-2`}>
      {/* Image */}
      <div className="relative h-44 overflow-hidden rounded-xl mb-5 group">
        <img src={course.image} alt={course.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeBg}`}>{course.duration}</span>
        </div>
      </div>

      {/* Title + Price */}
      <div className="flex items-start justify-between mb-2">
        <h3 className={`text-lg font-bold leading-tight flex-1 pr-2 ${titleClr}`}>{course.title}</h3>
        <span className={`text-xl font-extrabold flex-shrink-0 ${priceClr}`}>₹{course.price}</span>
      </div>

      {/* Meta */}
      <div className={`flex items-center gap-2 text-xs mb-3 ${mutedClr}`}>
        <Award className="h-3.5 w-3.5" /> <span>{course.type}</span>
        <span className="opacity-40">·</span>
        <Clock className="h-3.5 w-3.5" /> <span>{course.duration}</span>
      </div>

      <p className={`text-sm mb-4 line-clamp-2 ${mutedClr}`}>{course.description}</p>
      <div className={`border-t ${divider} mb-4`} />

      {/* Domains */}
      <div className="mb-4 flex-grow">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accentClr}`}>Domains Available</p>
        <ul className="space-y-1.5">
          {course.domains.map((d, i) => (
            <li key={i} className={`flex items-center text-sm ${mutedClr}`}>
              <span className={`h-1.5 w-1.5 rounded-full mr-2 flex-shrink-0 ${dotClr}`} />
              {d}
            </li>
          ))}
        </ul>
      </div>

      <div className={`border-t ${divider} mb-4`} />

      {/* Features */}
      <div className="mb-5">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accentClr}`}>Includes</p>
        <ul className="space-y-1.5">
          {course.features.slice(0, 3).map((f, i) => (
            <li key={i} className={`flex items-start text-sm ${mutedClr}`}>
              <CheckCircle2 className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${accentClr}`} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <Link to={`/course/${course.id}`} state={{ predefinedCourse: course.title }} className="flex-1">
          <Button className={`w-full font-semibold tracking-wide rounded-xl transition-all duration-300 hover:scale-105 glow-button ${btnClass}`}>
            View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
        {course.downloadBrochure && (
          <Button variant="outline" size="icon" onClick={handleDownload}
            className={`flex-shrink-0 rounded-xl transition-all duration-300 hover:scale-110 ${dlBtnClass}`}
            title="Download Brochure">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
