import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const pageBg    = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-white border-[rgba(13,148,136,0.15)]';
  const cardGlow  = isDark
    ? 'shadow-[0_0_30px_rgba(20,184,166,0.1)]'
    : 'shadow-[0_0_20px_rgba(13,148,136,0.1)]';
  const titleClr  = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr  = isDark ? 'text-[#94A3B8]' : 'text-[#64748B]';
  const labelClr  = isDark ? 'text-[#99F6E4]' : 'text-[#0D9488]';
  const inputCls  = isDark
    ? 'bg-[#0B0F0F] border-[rgba(20,184,166,0.3)] text-[#E6FFFA] placeholder:text-[#64748B] focus-visible:ring-[#14B8A6] rounded-xl'
    : 'bg-[#F9FAFB] border-[rgba(13,148,136,0.3)] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#0D9488] rounded-xl';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const accentBg  = isDark ? 'bg-[#14B8A6]/15' : 'bg-[#0D9488]/10';
  const btnClass  = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_14px_rgba(20,184,166,0.4)] transition-all glow-button'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_12px_rgba(13,148,136,0.3)] transition-all glow-button';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/students/login`, { email });
      localStorage.setItem('studentAuth', JSON.stringify(res.data));
      toast.success('Login Successful!');
      navigate('/student/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${pageBg}`}>
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle radial bg */}
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1),transparent_60%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.05),transparent_60%)]'}`} />
        
        <Card className={`relative z-10 w-full max-w-md ${cardBg} ${cardGlow} rounded-3xl border`}>
          <CardHeader className={`text-center pb-6 border-b ${isDark ? 'border-[rgba(20,184,166,0.15)]' : 'border-[rgba(13,148,136,0.1)]'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 mt-2 ${accentBg}`}>
              <GraduationCap className={`h-8 w-8 ${accentClr}`} />
            </div>
            <CardTitle className={`text-2xl font-extrabold ${titleClr}`}>Student Portal</CardTitle>
            <CardDescription className={`font-medium mt-1 ${mutedClr}`}>
              Enter your registered email to view your enrollment details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-7">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelClr}`}>Email Address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={`h-12 ${inputCls}`}
                  required
                />
              </div>
              <Button type="submit" className={`w-full h-12 font-bold tracking-wide rounded-xl mt-2 ${btnClass}`} disabled={loading}>
                {loading ? 'Logging in...' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default StudentLogin;
