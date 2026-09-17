import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import { Button } from '@/components/ui/button';
import { Clock, Award, CheckCircle2, Download, Layers, Briefcase, ChevronRight } from 'lucide-react';
import { courses } from '@/data/courses';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const InternshipDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const course = courses.find(c => c.id === courseId);
    const [selectedDomain, setSelectedDomain] = useState<string>('');

    const navigateToEnroll = () => {
        navigate('/enroll', { state: { predefinedCourse: course?.title, predefinedDomain: selectedDomain } });
    };

    const handleDownloadSyllabus = () => {
        if (!selectedDomain) {
            toast.error("Please select a domain first to download its syllabus.");
            return;
        }

        // Construct the filename based on the domain
        const filename = `${selectedDomain.replace(/ /g, '_')}.pdf`;
        const syllabusUrl = `/syllabus/${filename}`;

        const link = document.createElement('a');
        link.href = syllabusUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${selectedDomain} syllabus downloaded successfully!`);
    };

    const pageBg   = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
    const sec2Bg   = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
    const titleClr = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
    const mutedClr = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
    const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
    const cardBg   = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-white border-[rgba(13,148,136,0.18)]';
    const cardGlow = isDark
        ? 'shadow-[0_0_25px_rgba(20,184,166,0.12)]'
        : 'shadow-[0_4px_20px_rgba(13,148,136,0.08)]';
    const btnPrimary = isDark
        ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_16px_rgba(20,184,166,0.45)]'
        : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_0_14px_rgba(13,148,136,0.35)]';
    const btnOutline = isDark
        ? 'border border-[rgba(20,184,166,0.35)] text-[#E6FFFA] hover:bg-[rgba(20,184,166,0.08)] bg-transparent'
        : 'border border-[rgba(13,148,136,0.35)] text-[#0F172A] hover:bg-[rgba(13,148,136,0.06)] bg-transparent';

    if (!course) {
        return (
            <div className={`min-h-screen flex flex-col ${pageBg}`}>
                <Navbar />
                <div className="flex-grow flex items-center justify-center my-20 px-4">
                    <div className={`text-center p-10 rounded-3xl border ${cardBg}`}>
                        <h1 className={`text-3xl font-extrabold mb-4 ${titleClr}`}>Program Not Found</h1>
                        <Link to="/courses">
                            <Button className={`h-12 px-8 font-bold rounded-full ${btnPrimary}`}>
                                Return to Programs
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!selectedDomain && course.domains && course.domains.length > 0) {
        setSelectedDomain(course.domains[0]);
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
            <Navbar />

            <section className={`py-16 md:py-20 min-h-[calc(100vh-72px)] relative border-b ${isDark ? 'border-[#14B8A6]/10' : 'border-slate-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

                    {/* Back link */}
                    <div className="mb-8">
                        <Link to="/courses" className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#14B8A6] ${mutedClr}`}>
                            &larr; Back to all programs
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Column */}
                        <div className="lg:col-span-8 flex flex-col gap-8">

                            <div className={`${cardBg} ${cardGlow} border rounded-3xl p-8 md:p-10 transition-all`}>
                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF] border-[#14B8A6]/30' : 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20'}`}>
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{course.duration}</span>
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
                                        <Briefcase className="h-3.5 w-3.5" />
                                        <span>MSME Internship</span>
                                    </span>
                                </div>

                                <h1 className={`text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight ${titleClr}`}>
                                    {course.title}
                                </h1>
                                <p className={`text-2xl font-extrabold tracking-tight mb-6 ${accentClr}`}>
                                    ₹{course.price} <span className={`text-xs font-semibold uppercase tracking-wider ${mutedClr}`}>/ complete program</span>
                                </p>

                                <p className={`text-base md:text-lg leading-relaxed mb-8 ${mutedClr}`}>
                                    {course.detailedDescription || course.description}
                                </p>

                                <div className={`rounded-2xl p-6 border grid grid-cols-1 md:grid-cols-2 gap-4 ${isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.15)]' : 'bg-[#F0FDFA] border-[rgba(13,148,136,0.15)]'}`}>
                                    {course.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className={`h-4.5 w-4.5 ${accentClr} flex-shrink-0 mt-0.5`} />
                                            <span className={`text-sm font-medium ${titleClr}`}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Domain Selection */}
                            <div className={`${cardBg} ${cardGlow} border rounded-3xl p-8 md:p-10 transition-all`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-[#14B8A6]/15' : 'bg-[#0D9488]/10'}`}>
                                        <Layers className={`h-6 w-6 ${accentClr}`} />
                                    </div>
                                    <h2 className={`text-2xl font-extrabold tracking-tight ${titleClr}`}>Domain Specialization</h2>
                                </div>
                                <p className={`text-sm md:text-base leading-relaxed mb-6 ${mutedClr}`}>
                                    Choose your domain specialization for this program. Your selection tailors the curriculum, project assignments, and your verified MSME certificate title.
                                </p>

                                <div className={`p-6 border rounded-2xl ${isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.2)]' : 'bg-[#F0FDFA] border-[rgba(13,148,136,0.2)]'}`}>
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${titleClr}`}>
                                        Active Domain Track
                                    </label>
                                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                                        <SelectTrigger className={`w-full h-13 text-base rounded-xl ${isDark ? 'bg-[#0B0F0F] border-[rgba(20,184,166,0.25)] text-[#E6FFFA]' : 'bg-white border-slate-300 text-[#0F172A]'}`}>
                                            <SelectValue placeholder="Select a domain" />
                                        </SelectTrigger>
                                        <SelectContent className={isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.25)] text-[#E6FFFA]' : 'bg-white border-slate-200 text-[#0F172A]'}>
                                            {course.domains.map((domain) => (
                                                <SelectItem key={domain} value={domain} className="cursor-pointer focus:bg-[#14B8A6]/20">
                                                    {domain}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {selectedDomain && (
                                        <div className={`mt-5 text-sm leading-relaxed p-4 rounded-xl border ${isDark ? 'bg-black/30 border-white/5 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700'}`}>
                                            <strong className={`block mb-1 font-bold ${accentClr}`}>Track Details: {selectedDomain}</strong>
                                            Master hands-on technical competencies, industry tools, and real workflows in this specialization. You will ship functional projects aligned with enterprise engineering standards.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Sticky Sidebar */}
                        <div className="lg:col-span-4 relative">
                            <div className="sticky top-28 flex flex-col gap-6">

                                <div className={`${cardBg} ${cardGlow} border rounded-3xl p-8 relative overflow-hidden`}>
                                    <h3 className={`text-xl font-extrabold mb-2 ${titleClr}`}>Enroll in Program</h3>
                                    <p className={`text-sm mb-6 ${mutedClr}`}>
                                        Secure your seat in the <strong className={accentClr}>{selectedDomain || 'chosen'}</strong> track.
                                    </p>

                                    <Button
                                        onClick={navigateToEnroll}
                                        className={`w-full h-14 font-bold text-base rounded-xl mb-3 glow-button ${btnPrimary}`}
                                    >
                                        Enroll Now <ChevronRight className="ml-1 h-5 w-5" />
                                    </Button>

                                    <Button
                                        onClick={handleDownloadSyllabus}
                                        variant="outline"
                                        className={`w-full h-12 font-semibold rounded-xl flex items-center justify-center gap-2 ${btnOutline}`}
                                    >
                                        <Download className="h-4 w-4" /> Download Syllabus PDF
                                    </Button>
                                </div>

                                <div className={`border rounded-3xl p-6 ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/80 border-emerald-200'}`}>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-emerald-500/15 text-emerald-400 p-3 rounded-2xl flex-shrink-0">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-base mb-1 ${titleClr}`}>MSME Certified</h4>
                                            <p className={`text-xs leading-relaxed ${mutedClr}`}>
                                                All curricula, projects, and certifications are fully accredited under Government MSME guidelines for complete national recognition.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
            <FloatingContact />
        </div>
    );
};

export default InternshipDetails;
