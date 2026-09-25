import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateEmail, validatePhone, validateRequired } from '@/utils/validation';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { Calendar, Clock, Sparkles, CheckCircle2, User, Phone, Mail, BookOpen } from 'lucide-react';
import { courses } from '@/data/courses';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl.includes('your-edsec-backend') || (envUrl.includes('localhost') && window.location.hostname !== 'localhost')) {
    return '/api';
  }
  return envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`;
};
const API_URL = getApiUrl();

const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:30 AM - 12:30 PM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
  '06:00 PM - 07:00 PM'
];

interface BookDemoModalProps {
  programInterest?: string;
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  triggerClassName?: string;
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  programInterest,
  triggerText = '✨ Book a Free Demo Class',
  triggerVariant = 'default',
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

  const todayStr = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [selectedProgram, setSelectedProgram] = useState(programInterest || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleModalClose = (isOpenState: boolean) => {
    setOpen(isOpenState);
    if (!isOpenState) {
      setTimeout(() => {
        setSubmitted(false);
        setErrors({});
      }, 300);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!validateRequired(name)) errs.name = 'Please enter your full name.';
    if (!validatePhone(phone)) errs.phone = 'Please enter a valid phone number.';
    if (!validateEmail(email)) errs.email = 'Please enter a valid email address.';
    if (!preferredDate) errs.preferredDate = 'Please pick a preferred date.';
    if (!preferredTime) errs.preferredTime = 'Please select a preferred slot.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/demo-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          preferredDate,
          preferredTime,
          programInterest: programInterest || selectedProgram || 'General Demo',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to submit demo class request.' });
        return;
      }

      setSubmitted(true);
      toast.success("Thanks! We'll confirm your demo slot shortly.");
    } catch (err: any) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
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
      {children ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer inline-block">
          {children}
        </span>
      ) : (
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
          onClick={() => setOpen(true)}
        >
          {triggerText}
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleModalClose}>
        <DialogContent
          className={`sm:max-w-[480px] p-0 overflow-hidden border ${
            isDark
              ? 'bg-[#0B0F0F] border-[rgba(20,184,166,0.25)] text-[#E6FFFA]'
              : 'bg-white border-[rgba(13,148,136,0.2)] text-[#0F172A]'
          }`}
        >
          <div className="relative p-6 sm:p-7">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold">Demo Class Reserved!</h3>
                <p className={`text-sm max-w-sm mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Thanks <strong className={accentClr}>{name}</strong>! We've received your request for{' '}
                  <span className="font-semibold">{preferredDate} at {preferredTime}</span>.
                  Our academic counselor will WhatsApp/call you shortly with the meeting link.
                </p>
                <div className="pt-4">
                  <Button onClick={() => handleModalClose(false)} className={`w-full ${btnPrimary}`}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <DialogHeader className="text-left mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? 'bg-[#14B8A6]/15 text-[#2DD4BF]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
                      <Sparkles className="w-3 h-3" /> 100% Free · 1-on-1 Guidance
                    </span>
                  </div>
                  <DialogTitle className="text-2xl font-black tracking-tight">
                    Book a Free Demo Class
                  </DialogTitle>
                  <DialogDescription className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Experience our live mentor sessions, curriculum walkthrough, and interactive code labs before enrolling.
                  </DialogDescription>
                </DialogHeader>

                {errors.general && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 opacity-50" />
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`pl-9 h-11 ${inputBg}`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 opacity-50" />
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className={`pl-9 h-11 ${inputBg}`}
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 opacity-50" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className={`pl-9 h-11 ${inputBg}`}
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Program selection if not predefined */}
                  {!programInterest && (
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Program of Interest
                      </label>
                      <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                        <SelectTrigger className={`h-11 w-full ${inputBg}`}>
                          <SelectValue placeholder="Select program topic" />
                        </SelectTrigger>
                        <SelectContent className={isDark ? 'bg-[#0B0F0F] border-[rgba(20,184,166,0.2)] text-[#E6FFFA]' : 'bg-white'}>
                          {courses.map((c) => (
                            <SelectItem key={c.id} value={c.title}>
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 opacity-50" />
                        <Input
                          type="date"
                          min={todayStr}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className={`pl-9 h-11 ${inputBg}`}
                        />
                      </div>
                      {errors.preferredDate && <p className="text-[11px] text-red-400 mt-1">{errors.preferredDate}</p>}
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Preferred Slot *
                      </label>
                      <Select value={preferredTime} onValueChange={setPreferredTime}>
                        <SelectTrigger className={`h-11 w-full ${inputBg}`}>
                          <SelectValue placeholder="Choose time slot" />
                        </SelectTrigger>
                        <SelectContent className={isDark ? 'bg-[#0B0F0F] border-[rgba(20,184,166,0.2)] text-[#E6FFFA]' : 'bg-white'}>
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 font-bold text-sm tracking-wide rounded-xl mt-2 ${btnPrimary}`}
                  >
                    {loading ? 'Confirming Demo Slot...' : 'Reserve My Free Demo Slot →'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookDemoModal;
