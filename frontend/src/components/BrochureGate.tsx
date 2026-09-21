import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail, validatePhone, validateRequired } from '@/utils/validation';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { FileDown, Mail, Phone, User, KeyRound, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface BrochureGateProps {
  programId: string;
  programTitle?: string;
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  triggerClassName?: string;
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PROGRAM_NAMES: Record<string, string> = {
  'full-stack-web-dev': 'Full Stack Web Development',
  'generative-ai': 'Generative AI',
  'python-ai-ml': 'Python with AI/ML',
  'git-resume': 'Git & Resume',
};

export const BrochureGate: React.FC<BrochureGateProps> = ({
  programId,
  programTitle,
  triggerText = '📄 Download Brochure',
  triggerVariant = 'outline',
  triggerClassName = '',
  triggerSize = 'default',
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const { isDark } = useTheme();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const displayName = programTitle || PROGRAM_NAMES[programId] || 'Course';

  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    otp?: string;
    general?: string;
  }>({});

  // 60-second cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Reset form when modal closes
  const handleModalClose = (isOpenState: boolean) => {
    setOpen(isOpenState);
    if (!isOpenState) {
      setTimeout(() => {
        setStep('form');
        setOtp('');
        setSessionId('');
        setErrors({});
      }, 300);
    }
  };

  const validateForm = () => {
    const errs: { name?: string; email?: string; phone?: string } = {};
    if (!validateRequired(name)) {
      errs.name = 'Please enter your full name.';
    }
    if (!validateEmail(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!validatePhone(phone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/brochures/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          programId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Unable to dispatch verification SMS. Please verify your mobile number.' });
        return;
      }

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setStep('otp');
      setCooldown(60);
      toast.success(data.message || 'Verification code sent via SMS!');
    } catch (err: any) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Trigger Download
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setErrors({ otp: 'Please enter the 6-digit verification code.' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/brochures/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          programId,
          otp: otp.trim(),
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ otp: data.message || 'Verification failed. Please check the code.' });
        return;
      }

      const { token } = data;
      if (!token) {
        setErrors({ general: 'Invalid server response. Please request a new code.' });
        return;
      }

      setStep('success');
      toast.success('Verification successful! Starting download...');

      // Immediately trigger single-use download
      await triggerDownload(token);

      // Automatically close modal after download starts
      setTimeout(() => {
        handleModalClose(false);
      }, 2500);
    } catch (err: any) {
      setErrors({ general: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Helper to fetch file via validated single-use token and save blob
  const triggerDownload = async (token: string) => {
    try {
      const downloadUrl = `/api/brochures/download?token=${encodeURIComponent(token)}`;
      const res = await fetch(downloadUrl);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Download token rejected.');
      }

      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${programId}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      console.error('Download error:', err);
      toast.error(err.message || 'Failed to download brochure file.');
    }
  };

  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const btnPrimary = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_14px_rgba(20,184,166,0.35)]'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]';
  const inputBg = isDark
    ? 'bg-[#121818] border-[rgba(20,184,166,0.25)] text-[#E6FFFA] focus:border-[#14B8A6]'
    : 'bg-white border-slate-300 text-[#0F172A] focus:border-[#0D9488]';

  return (
    <>
      {/* Trigger Button or Custom Children */}
      {children ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer inline-block">
          {children}
        </span>
      ) : (
        <Button
          type="button"
          variant={triggerVariant}
          size={triggerSize}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className={`font-semibold rounded-xl transition-all duration-300 ${triggerClassName}`}
        >
          {triggerText}
        </Button>
      )}

      {/* Gated Download Modal */}
      <Dialog open={open} onOpenChange={handleModalClose}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className={`glass-modal max-w-md p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
            isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]'
          }`}
        >
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2.5 rounded-2xl ${
                  isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'
                }`}
              >
                <FileDown className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold tracking-tight">
                  Download Program Brochure
                </DialogTitle>
                <p className={`text-xs font-semibold uppercase tracking-wider ${accentClr}`}>
                  {displayName}
                </p>
              </div>
            </div>
            <DialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {step === 'form' &&
                'Enter your contact details to receive a 6-digit SMS verification code on your mobile phone.'}
              {step === 'otp' &&
                `We've sent a 6-digit SMS code to +91 ${phone.slice(0, 2)}******${phone.slice(-2)}. Enter it below to unlock your brochure.`}
              {step === 'success' && 'Verification confirmed! Your brochure download is starting now.'}
            </DialogDescription>
          </DialogHeader>

          {/* General Error Alert */}
          {errors.general && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* STEP 1: Details Form */}
          {step === 'form' && (
            <form onSubmit={handleRequestOtp} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="lead-name" className="text-xs font-bold uppercase tracking-wider">
                  Full Name
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3.5 top-3 h-4 w-4 opacity-50" />
                  <Input
                    id="lead-name"
                    type="text"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={`pl-10 h-11 rounded-xl ${inputBg} ${
                      errors.name ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="lead-email" className="text-xs font-bold uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 opacity-50" />
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`pl-10 h-11 rounded-xl ${inputBg} ${
                      errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lead-phone" className="text-xs font-bold uppercase tracking-wider">
                    Mobile Number
                  </Label>
                  <span className="text-[10px] font-semibold text-teal-500">SMS Verification</span>
                </div>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-3 text-xs font-bold opacity-60">+91</span>
                  <Input
                    id="lead-phone"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`pl-12 h-11 rounded-xl ${inputBg} ${
                      errors.phone ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-12 mt-2 font-bold rounded-xl flex items-center justify-center gap-2 glow-button ${btnPrimary}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Sending SMS OTP...
                  </>
                ) : (
                  <>
                    Send SMS Verification Code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="otp-input" className="text-xs font-bold uppercase tracking-wider">
                  6-Digit Verification Code
                </Label>
                <div className="relative mt-1.5">
                  <KeyRound className="absolute left-3.5 top-3 h-4 w-4 opacity-50" />
                  <Input
                    id="otp-input"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
                    }}
                    className={`pl-10 h-12 text-center text-lg tracking-[6px] font-bold rounded-xl ${inputBg} ${
                      errors.otp ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    autoFocus
                  />
                </div>
                {errors.otp && <p className="text-[11px] text-rose-500 mt-1.5">{errors.otp}</p>}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="opacity-70 hover:opacity-100 transition-opacity underline"
                >
                  Edit contact details
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={() => handleRequestOtp()}
                  className={`font-semibold ${
                    cooldown > 0
                      ? 'opacity-40 cursor-not-allowed'
                      : `${accentClr} hover:underline cursor-pointer`
                  }`}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className={`w-full h-12 font-bold rounded-xl flex items-center justify-center gap-2 glow-button ${btnPrimary}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Verify &amp; Download Brochure <FileDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* STEP 3: Success State */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-teal-500/20 text-teal-400">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold">Brochure Download Initiated</h3>
              <p className="text-xs opacity-75 max-w-xs mx-auto">
                Your PDF brochure is now downloading. You may close this window.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BrochureGate;
