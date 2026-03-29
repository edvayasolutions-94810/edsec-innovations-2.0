import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, BookOpen, Calendar, CreditCard, Award, AlignLeft, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

const API_URL = 'http://localhost:5000/api';
const tempAdminToken = 'admin-bypass-token';

interface StudentData {
  _id: string;
  full_name: string;
  email: string;
  course_name: string;
  course_duration: string;
  batch_selected: string;
  price_paid: string;
  payment_status: string;
  status: string;
  enrollment_date: string;
}

const StudentDashboard = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    const data = localStorage.getItem('studentAuth');
    if (data) {
      setStudent(JSON.parse(data));
    } else {
      navigate('/student/login');
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!student || student.payment_status === 'Paid') return;
    try {
      await axios.put(
        `${API_URL}/students/${student._id}/pay`,
        { payment_status: 'Paid' },
        { headers: { Authorization: `Bearer ${tempAdminToken}` } }
      );
      const updatedStudent = { ...student, payment_status: 'Paid' };
      setStudent(updatedStudent);
      localStorage.setItem('studentAuth', JSON.stringify(updatedStudent));
      toast.success('Payment Processed Successfully!');
    } catch (err) {
      toast.error('Failed to process payment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentAuth');
    navigate('/student/login');
  };

  if (!student) return null;

  const pageBg    = isDark ? 'bg-[#0B0F0F]' : 'bg-[#F9FAFB]';
  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-white border-[rgba(13,148,136,0.15)]';
  const titleClr  = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr  = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const accentBg  = isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0F766E]';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${pageBg}`}>
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gradient-to-r from-[rgba(20,184,166,0.1)] to-transparent p-6 rounded-3xl border border-[rgba(20,184,166,0.2)]">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl border ${accentBg} border-[rgba(20,184,166,0.25)]`}>
              <GraduationCap className={`h-7 w-7 ${accentClr}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-extrabold ${titleClr}`}>Welcome, {student.full_name}</h1>
              <p className={`text-sm font-medium mt-1 ${mutedClr}`}>Review your live enrollment parameters below.</p>
            </div>
          </div>
          <Button onClick={handleLogout} className={`h-11 px-5 rounded-xl font-semibold transition-all hover:scale-105 border ${isDark ? 'bg-[#121818] hover:bg-[#1A2525] text-[#E6FFFA] border-[rgba(20,184,166,0.3)]' : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[rgba(13,148,136,0.3)]'}`}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Core Details (Span 2) */}
          <Card className={`border ${cardBg} shadow-sm md:col-span-2 rounded-3xl overflow-hidden`}>
            <CardHeader className={`border-b ${isDark ? 'border-[rgba(20,184,166,0.1)] bg-[#0D1515]' : 'border-[rgba(13,148,136,0.1)] bg-[#F0FDFA]'}`}>
              <CardTitle className={`text-lg flex items-center gap-2 ${titleClr}`}>
                <BookOpen className={`h-4 w-4 ${accentClr}`} /> Enrollment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold block mb-1.5 ${mutedClr}`}>Enrolled Course</label>
                <p className={`font-bold text-lg ${titleClr}`}>{student.course_name || 'Not Available'}</p>
              </div>
              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold block mb-1.5 ${mutedClr}`}>Course Duration</label>
                <p className={`font-semibold flex items-center gap-2 ${accentClr}`}>
                  <AlignLeft className="h-4 w-4" /> {student.course_duration || 'Not Available'}
                </p>
              </div>
              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold block mb-1.5 ${mutedClr}`}>Batch Schedule</label>
                <p className={`font-semibold flex items-center gap-2 ${titleClr}`}>
                  <Calendar className={`h-4 w-4 ${accentClr}`} /> {student.batch_selected || 'TBD'}
                </p>
              </div>
              <div>
                <label className={`text-xs uppercase tracking-wider font-semibold block mb-1.5 ${mutedClr}`}>Enrollment Date</label>
                <p className={`font-semibold ${titleClr}`}>{new Date(student.enrollment_date).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Overview (Sidebar) */}
          <Card className={`border rounded-3xl shadow-lg relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#0B1515] to-[#14B8A6]/20 border-[#14B8A6]/30' : 'bg-gradient-to-br from-[#0D9488]/5 to-[#0D9488]/15 border-[#0D9488]/20'}`}>
            <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <div className={`flex items-center gap-2 font-bold mb-6 text-sm uppercase tracking-wider ${titleClr}`}>
                  <ShieldCheck className={`h-5 w-5 ${accentClr}`} /> Status Overview
                </div>
                
                <div className="mb-7">
                  <label className={`text-xs font-semibold mb-2 block ${mutedClr}`}>Account Phase</label>
                  <span className={`inline-flex px-3 py-1.5 text-xs font-bold uppercase rounded-full border ${
                    student.status === 'Selected' 
                    ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
                    : isDark ? 'bg-white/10 text-white border-white/20' : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    {student.status || 'Not Selected'}
                  </span>
                </div>
                
                <div>
                  <label className={`text-xs font-semibold mb-2 block ${mutedClr}`}>Financial State</label>
                  <div className="flex flex-col gap-3 items-start">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-bold uppercase rounded-full border ${
                        student.payment_status === 'Paid' 
                        ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
                        : 'bg-orange-500/20 text-orange-500 border-orange-500/30'
                      }`}>
                        {student.payment_status}
                      </span>
                      {student.price_paid && <span className={`text-sm font-bold ${titleClr}`}>({student.price_paid})</span>}
                    </div>
                    {student.payment_status !== 'Paid' && (
                      <Button
                        onClick={handlePayment}
                        className={`mt-2 flex gap-2 items-center font-bold tracking-wide rounded-xl shadow-lg border-0 transition-all hover:scale-105 ${isDark ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white' : 'bg-[#0D9488] hover:bg-[#0F766E] text-white'}`}
                      >
                        <CreditCard className="h-4 w-4" /> PAY NOW
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className={`mt-8 pt-4 border-t text-xs font-medium ${isDark ? 'border-[rgba(255,255,255,0.1)] text-[#94A3B8]' : 'border-[rgba(0,0,0,0.1)] text-[#64748B]'}`}>
                {student.email}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
