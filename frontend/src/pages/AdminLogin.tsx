import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import API_URL from '@/services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Login failed. Check your credentials.');
        return;
      }

      localStorage.setItem('adminToken', data.token);
      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 500);
    } catch (err) {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F0F] px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.12),transparent_70%)] z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#14B8A6]/15 border border-[#14B8A6]/30 mb-4">
            <ShieldCheck className="h-8 w-8 text-[#14B8A6]" />
          </div>
          <h1 className="text-3xl font-bold text-[#E6FFFA] tracking-tight">Admin Access</h1>
          <p className="text-[#94A3B8] mt-2 text-sm">
            Restricted area — EDSEC Innovations staff only
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1515] border border-[rgba(20,184,166,0.2)] rounded-2xl p-8 shadow-[0_0_40px_rgba(20,184,166,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#99F6E4] mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#14B8A6]" />
                <Input
                  type="email"
                  id="admin-email"
                  placeholder="admin@edsec.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB] placeholder:text-[#6B7280] focus:border-[#14B8A6] h-11"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#99F6E4] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#14B8A6]" />
                <Input
                  type="password"
                  id="admin-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB] placeholder:text-[#6B7280] focus:border-[#14B8A6] h-11"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all"
            >
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#4B5563] mt-6">
          © {new Date().getFullYear()} EDSEC Innovations. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
