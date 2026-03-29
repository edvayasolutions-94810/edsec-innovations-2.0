import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Award, CheckCircle2, Download, Layers, Box, Briefcase } from 'lucide-react';
import { courses } from '@/data/courses';
import { toast } from 'sonner';
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

        // Construct the filename based on the domain (e.g., "SQL Language" -> "SQL_Language.pdf")
        const filename = `${selectedDomain.replace(/ /g, '_')}.pdf`;
        const syllabusUrl = `/syllabus/${filename}`;

        // Create an anchor and trigger download
        const link = document.createElement('a');
        link.href = syllabusUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${selectedDomain} syllabus downloaded successfully!`);
    };

    if (!course) {
        return (
            <div className="min-h-screen section-alt-1 flex flex-col">
                <Navbar />
                <div className="container-sudur flex-grow flex items-center justify-center my-20">
                    <div className="card-sudur text-center">
                        <h1 className="text-4xl font-bold mb-4 text-[#F9FAFB]">Program Not Found</h1>
                        <Link to="/">
                            <Button className="bg-[#14B8A6] hover:bg-[#0D9488] shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:-translate-y-1 transition-all h-12 px-8 text-white">
                                Return to Homepage
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Set default domain if none selected but available
    if (!selectedDomain && course.domains && course.domains.length > 0) {
        setSelectedDomain(course.domains[0]);
    }

    return (
        <div className="min-h-screen fade-in-scroll">
            <Navbar />

            <section className="section-alt-1 section-padding min-h-[calc(100vh-64px)] relative">
                <div className="absolute inset-0 bg-gradient-radial from-[#0F172A] via-[#0B0F19] to-transparent opacity-60 pointer-events-none"></div>
                <div className="container-sudur relative z-10">

                    <div className="flex items-center space-x-4 mb-6">
                        <Link to="/" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors text-sm font-semibold tracking-wide flex items-center gap-1">
                            &larr; BACK TO PROGRAMS
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Column */}
                        <div className="lg:col-span-8 flex flex-col gap-8">

                            <div className="card-sudur animate-slide-in">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="inline-flex items-center space-x-1 text-xs font-bold leading-none bg-[#3B82F6]/10 text-[#60A5FA] px-3 py-1.5 rounded-full border border-[#3B82F6]/20">
                                        <Clock className="h-3 w-3" />
                                        <span>{course.duration}</span>
                                    </span>
                                    <span className="inline-flex items-center space-x-1 text-xs font-bold leading-none bg-[#10B981]/10 text-[#34D399] px-3 py-1.5 rounded-full border border-[#10B981]/20">
                                        <Briefcase className="h-3 w-3" />
                                        <span>Internship</span>
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#E6FFFA] leading-tight">
                                    {course.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-[#14B8A6] font-bold tracking-tight mb-8">
                                    ₹{course.price} <span className="text-sm text-[#99F6E4] font-medium">/ complete track</span>
                                </p>

                                <p className="text-[#99F6E4] text-lg leading-relaxed mb-6">
                                    {course.detailedDescription || course.description}
                                </p>

                                <div className="bg-[#0D1515] rounded-lg p-5 border border-[rgba(20,184,166,0.2)] grid grid-cols-1 md:grid-cols-2 gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                                    {course.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start space-x-3">
                                            <CheckCircle2 className="h-5 w-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                                            <span className="text-[#D1D5DB] font-medium text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card-sudur animate-slide-in" style={{ animationDelay: '100ms' }}>
                                <h2 className="text-2xl font-bold mb-6 text-[#E6FFFA] flex items-center gap-2">
                                    <Layers className="h-6 w-6 text-[#14B8A6]" /> Domain Configuration
                                </h2>
                                <p className="text-[#99F6E4] mb-6">
                                    Select your primary specialization domain for this internship. Your choice determines the curriculum track, projects, and final MSME certificate specialization.
                                </p>

                                <div className="p-6 border border-[#14B8A6]/30 rounded-xl bg-[rgba(20,184,166,0.05)]">
                                    <label className="block text-sm font-bold text-[#E6FFFA] mb-3 uppercase tracking-wider">
                                        Active Domain Track
                                    </label>
                                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                                        <SelectTrigger className="w-full bg-[#0B0F0F] border-[rgba(20,184,166,0.2)] text-[#E6FFFA] h-14 text-lg">
                                            <SelectValue placeholder="Select a domain" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0B0F0F] border-[rgba(20,184,166,0.2)]">
                                            {course.domains.map((domain) => (
                                                <SelectItem key={domain} value={domain} className="text-[#F9FAFB] focus:bg-[#3B82F6]/20">
                                                    {domain}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {selectedDomain && (
                                        <div className="mt-6 animate-fade-in text-[#D1D5DB] text-sm leading-relaxed p-4 bg-[#0B0F19] rounded-lg border border-[rgba(255,255,255,0.05)]">
                                            <strong className="text-[#3B82F6] block mb-2 font-bold text-base">Track Details: {selectedDomain}</strong>
                                            Master the core concepts, industry tools, and practical applications in this specialized track. In this domain, you will complete structured functional projects mirroring enterprise demands to ensure complete job readiness.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Sticky Sidebar */}
                        <div className="lg:col-span-4 relative">
                            <div className="sticky top-28 flex flex-col gap-6">

                                <div className="card-sudur shadow-2xl overflow-hidden p-0 border-[#3B82F6]/30 relative animate-slide-in" style={{ animationDelay: '200ms' }}>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#14B8A6] shadow-[0_0_15px_rgba(20,184,166,0.6)]"></div>
                                    <div className="p-6 md:p-8">
                                        <h3 className="text-xl font-bold text-[#E6FFFA] mb-2">Ready to Start?</h3>
                                        <p className="text-sm text-[#99F6E4] mb-8">
                                            Secure your spot in the <strong className="text-white">{selectedDomain || 'selected'}</strong> track.
                                        </p>

                                        <Button
                                            onClick={navigateToEnroll}
                                            className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.8)] hover:-translate-y-1 transition-all h-14 font-bold text-lg rounded-xl mb-4"
                                        >
                                            Enroll Now
                                        </Button>

                                        <Button
                                            onClick={handleDownloadSyllabus}
                                            variant="outline"
                                            className="w-full bg-transparent border border-[#14B8A6] text-[#E6FFFA] hover:bg-[#14B8A6]/10 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] h-12 font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                                        >
                                            <Download className="h-4 w-4" /> Download Syllabus PDF
                                        </Button>
                                    </div>
                                </div>

                                <div className="card-sudur bg-[#10B981]/5 border-[#10B981]/20 animate-slide-in" style={{ animationDelay: '300ms' }}>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#10B981]/20 p-3 rounded-lg flex-shrink-0">
                                            <Award className="h-6 w-6 text-[#10B981]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#F9FAFB] mb-1">MSME Certified</h4>
                                            <p className="text-xs text-[#94A3B8] leading-relaxed">
                                                This entire pathway operates under the strict guidelines of MSME certifications ensuring national corporate recognition.
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
