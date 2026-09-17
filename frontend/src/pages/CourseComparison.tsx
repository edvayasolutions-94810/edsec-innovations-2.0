import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Award, ChevronRight } from 'lucide-react';
import { courses, Course } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CourseComparison = () => {
  const { isDark } = useTheme();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const addCourse = (courseId: string) => {
    if (selectedCourses.length < 3 && !selectedCourses.includes(courseId)) {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(id => id !== courseId));
  };

  const selectedCourseData = selectedCourses
    .map(id => courses.find(c => c.id === id))
    .filter(Boolean) as Course[];

  const allSkills = [...new Set(selectedCourseData.flatMap(c => c.domains || []))];

  const pageBg    = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg    = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const titleClr  = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr  = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-white border-[rgba(13,148,136,0.18)]';
  const cardGlow  = isDark
    ? 'hover:shadow-[0_0_24px_rgba(20,184,166,0.35)]'
    : 'hover:shadow-[0_4px_20px_rgba(13,148,136,0.15)]';
  const btnPrimary = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_14px_rgba(20,184,166,0.4)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_0_12px_rgba(13,148,136,0.3)]';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <Navbar />

      <section className={`py-16 md:py-20 ${sec2Bg} border-b ${isDark ? 'border-[#14B8A6]/10' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 animate-fade-in">
            <span className={`inline-flex items-center text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF] border-[#14B8A6]/25' : 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20'}`}>
              Side-by-Side Analysis
            </span>
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight ${titleClr}`}>Compare Programs</h1>
            <p className={`text-base md:text-lg max-w-2xl mx-auto ${mutedClr}`}>
              Compare up to 3 programs side-by-side to find the perfect track for your professional goals.
            </p>
          </div>

          {/* Course Selector */}
          <div className="max-w-md mx-auto mb-12">
            <Select onValueChange={addCourse}>
              <SelectTrigger className={`h-13 rounded-2xl ${isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.25)] text-[#E6FFFA]' : 'bg-white border-slate-300 text-[#0F172A]'}`}>
                <SelectValue placeholder="Add a program to compare..." />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.25)] text-[#E6FFFA]' : 'bg-white border-slate-200 text-[#0F172A]'}>
                {courses
                  .filter(c => !selectedCourses.includes(c.id))
                  .map(course => (
                    <SelectItem key={course.id} value={course.id} className="cursor-pointer focus:bg-[#14B8A6]/20">
                      {course.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className={`text-xs font-semibold mt-2.5 text-center ${mutedClr}`}>
              {selectedCourses.length}/3 programs selected
            </p>
          </div>

          {selectedCourseData.length === 0 ? (
            <div className={`text-center py-16 rounded-3xl border ${cardBg}`}>
              <p className={`text-base font-medium ${mutedClr}`}>
                Select programs from the dropdown above to view side-by-side comparisons.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="grid gap-6 min-w-[640px]" style={{ gridTemplateColumns: `repeat(${selectedCourseData.length}, minmax(280px, 1fr))` }}>
                {/* Course Cards */}
                {selectedCourseData.map(course => (
                  <div key={course.id} className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${cardBg} ${cardGlow}`}>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                      aria-label="Remove course"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>

                    <div>
                      <div className="relative h-40 overflow-hidden rounded-2xl mb-4">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDark ? 'bg-black/70 text-teal-300' : 'bg-white/90 text-teal-800'}`}>
                            {course.duration}
                          </span>
                        </div>
                      </div>

                      <h3 className={`text-xl font-extrabold mb-1.5 ${titleClr}`}>{course.title}</h3>
                      <p className={`text-xl font-extrabold mb-4 ${accentClr}`}>₹{course.price}</p>

                      <p className={`text-xs leading-relaxed mb-5 ${mutedClr}`}>{course.description}</p>

                      <h4 className={`font-bold text-xs uppercase tracking-wider mb-2.5 ${titleClr}`}>Key Inclusions:</h4>
                      <ul className="space-y-1.5 mb-5">
                        {course.features.map((f, i) => (
                          <li key={i} className="text-xs flex items-start gap-2">
                            <CheckCircle2 className={`h-4 w-4 ${accentClr} flex-shrink-0 mt-0.5`} />
                            <span className={mutedClr}>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {course.domains && (
                        <div className="mb-6">
                          <h4 className={`font-bold text-xs uppercase tracking-wider mb-2 ${titleClr}`}>Domains:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {course.domains.map((domain, i) => (
                              <span key={i} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${isDark ? 'bg-white/5 border-white/10 text-teal-300' : 'bg-black/5 border-black/10 text-teal-800'}`}>
                                {domain}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Link to={`/course/${course.id}`}>
                      <Button className={`w-full font-bold rounded-xl h-11 transition-all ${btnPrimary}`}>
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Skills Matrix */}
              {allSkills.length > 0 && selectedCourseData.length > 1 && (
                <div className={`mt-10 p-8 rounded-3xl border ${cardBg}`}>
                  <h3 className={`text-xl font-extrabold mb-5 ${titleClr}`}>Specialization Domains Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200/10">
                          <th className={`text-left py-3 px-4 font-bold text-sm ${titleClr}`}>Domain Track</th>
                          {selectedCourseData.map(c => (
                            <th key={c.id} className={`text-center py-3 px-4 font-bold text-sm ${titleClr}`}>{c.title}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allSkills.map(skill => (
                          <tr key={skill} className="border-b border-slate-200/5">
                            <td className={`py-3 px-4 text-xs font-medium ${mutedClr}`}>{skill}</td>
                            {selectedCourseData.map(c => (
                              <td key={c.id} className="text-center py-3 px-4">
                                {c.domains?.includes(skill) ? (
                                  <CheckCircle2 className={`h-4.5 w-4.5 ${accentClr} mx-auto`} />
                                ) : (
                                  <span className="text-slate-500 opacity-30 text-xs">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CourseComparison;
