import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { validateEmail, validatePhone } from '@/utils/validation';
import { courses } from '@/data/courses';
import { useTheme } from '@/contexts/ThemeContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Enroll = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  
  const { predefinedCourse, predefinedDomain } = location.state || {};
  const initialCourse = predefinedCourse || '';
  const selectedCourseDef = initialCourse ? courses.find(c => c.title === initialCourse) : null;
  const initialDuration = selectedCourseDef ? selectedCourseDef.duration : '';
  const initialPrice = selectedCourseDef ? `₹${selectedCourseDef.price}` : '';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    course_name: initialCourse,
    course_duration: initialDuration,
    domainSelected: predefinedDomain || '',
    price_paid: initialPrice,
    qualification: '',
    message: '',
  });
  
  const [activeBatches, setActiveBatches] = useState<{ _id: string, courseId: string, startDate: string, endDate: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(`${API_URL}/batches/active`);
        setActiveBatches(res.data);
      } catch (err) {
        console.error('Failed to fetch batches', err);
      }
    };
    fetchBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone || !formData.course_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/students/enroll`, formData);
      toast.success('Enrollment submitted successfully! We will contact you soon.');
      navigate('/');
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (value: string) => {
    const selectedCourseDef = courses.find(c => c.title === value);
    setFormData({
      ...formData,
      course_name: value,
      course_duration: selectedCourseDef ? selectedCourseDef.duration : '',
      price_paid: selectedCourseDef ? `₹${selectedCourseDef.price}` : '',
      domainSelected: ''
    });
  };

  // Theme Colors
  const pageBg    = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg    = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-white border-[rgba(13,148,136,0.15)]';
  const cardGlow  = isDark
    ? 'hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:border-[rgba(20,184,166,0.4)]'
    : 'hover:shadow-[0_0_15px_rgba(13,148,136,0.28)] hover:border-[rgba(13,148,136,0.35)]';
  const titleClr  = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr  = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const labelClr  = isDark ? 'text-[#99F6E4]' : 'text-[#0D9488]';
  const inputCls  = isDark
    ? 'bg-[#0B0F0F] border-[rgba(20,184,166,0.3)] text-[#E6FFFA] placeholder:text-[#64748B] focus-visible:ring-[#14B8A6] rounded-xl'
    : 'bg-[#F9FAFB] border-[rgba(13,148,136,0.3)] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#0D9488] rounded-xl';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const accentBg  = isDark ? 'bg-[#14B8A6]/10' : 'bg-[#0D9488]/10';
  const btnClass  = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_14px_rgba(20,184,166,0.4)] hover:shadow-[0_0_22px_rgba(20,184,166,0.6)] hover:scale-[1.02]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_12px_rgba(13,148,136,0.3)] hover:shadow-[0_0_18px_rgba(13,148,136,0.5)] hover:scale-[1.02]';
  const popoverBg = isDark ? 'bg-[#0B0F0F] border-[rgba(20,184,166,0.2)] text-[#E6FFFA]' : 'bg-white border-[rgba(13,148,136,0.2)] text-[#0F172A]';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <Navbar />

      <section className={`${sec2Bg} py-16 text-center`}>
        <div className="container mx-auto px-4">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 ${accentBg}`}>
            <GraduationCap className={`h-8 w-8 ${accentClr}`} />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${titleClr}`}>Student Enrollment</h1>
          <p className={`text-lg max-w-2xl mx-auto ${mutedClr}`}>
            Fill in the form below to enroll in your preferred MSME-certified program. We'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className={`${pageBg} py-16`}>
        <div className="container mx-auto px-4">
          <div className={`${cardBg} ${cardGlow} max-w-2xl mx-auto rounded-3xl p-8 transition-all duration-300`}>
            <h2 className={`text-2xl font-bold mb-7 ${titleClr}`}>Enrollment Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className={`block text-sm font-semibold mb-2 ${labelClr}`}>Full Name *</label>
                  <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" required maxLength={100} className={`h-12 ${inputCls}`} />
                </div>
                <div>
                  <label htmlFor="phone" className={`block text-sm font-semibold mb-2 ${labelClr}`}>Phone Number *</label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXXXXXXX" required maxLength={20} className={`h-12 ${inputCls}`} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${labelClr}`}>Email Address *</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required maxLength={255} className={`h-12 ${inputCls}`} />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClr}`}>Select Program *</label>
                <Select value={formData.course_name} onValueChange={handleCourseChange}>
                  <SelectTrigger className={`h-12 w-full ${inputCls}`}>
                    <SelectValue placeholder="Choose a program" />
                  </SelectTrigger>
                  <SelectContent className={popoverBg}>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.title} className="cursor-pointer focus:bg-[#14B8A6]/20">
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.course_duration && (
                  <div className={`mt-3 flex items-center text-sm font-semibold px-4 py-3 rounded-xl border ${isDark ? 'bg-[#14B8A6]/10 text-[#2DD4BF] border-[#14B8A6]/20' : 'bg-[#0D9488]/10 text-[#0F766E] border-[#0D9488]/20'}`}>
                    <Clock className={`w-4 h-4 mr-2 ${accentClr}`} />
                    <span>Program Timeline: <span className="ml-1 font-bold">{formData.course_duration}</span></span>
                  </div>
                )}
              </div>

              {formData.course_name && (
                <div className="animate-fade-in-up">
                  <label className={`block text-sm font-semibold mb-2 ${labelClr}`}>Select Domain *</label>
                  <Select value={formData.domainSelected} onValueChange={(value) => setFormData({ ...formData, domainSelected: value })}>
                    <SelectTrigger className={`h-12 w-full ${inputCls}`}>
                      <SelectValue placeholder="Choose a domain" />
                    </SelectTrigger>
                    <SelectContent className={popoverBg}>
                      {courses.find(c => c.title === formData.course_name)?.domains?.map((domain) => (
                        <SelectItem key={domain} value={domain} className="cursor-pointer focus:bg-[#14B8A6]/20">
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label htmlFor="qualification" className={`block text-sm font-semibold mb-2 ${labelClr}`}>Highest Qualification</label>
                <Input id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. B.Tech, BCA, 12th Pass" maxLength={100} className={`h-12 ${inputCls}`} />
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-semibold mb-2 ${labelClr}`}>Additional Message</label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Any questions or additional info..." rows={4} maxLength={2000} className={`resize-none ${inputCls}`} />
              </div>

              <Button type="submit" disabled={isSubmitting} className={`w-full h-14 font-bold tracking-wide rounded-xl mt-6 transition-all duration-300 glow-button ${btnClass}`}>
                {isSubmitting ? 'Submitting...' : 'Submit Enrollment Request'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Enroll;
