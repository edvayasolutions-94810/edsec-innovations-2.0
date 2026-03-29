import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { sendContactEmail } from '@/services/api';
import { validateEmail } from '@/utils';
import { useTheme } from '@/contexts/ThemeContext';

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageBg    = isDark ? 'bg-[#0B0F0F]' : 'bg-white';
  const sec2Bg    = isDark ? 'bg-[#0D1515]' : 'bg-[#F0FDFA]';
  const cardBg    = isDark ? 'bg-[#121818] border-[rgba(20,184,166,0.18)]' : 'bg-white border-[rgba(13,148,136,0.15)]';
  const cardGlow  = isDark
    ? 'hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:border-[rgba(20,184,166,0.4)]'
    : 'hover:shadow-[0_0_15px_rgba(13,148,136,0.28)] hover:border-[rgba(13,148,136,0.35)]';
  const titleClr  = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const mutedClr  = isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]';
  const labelClr  = isDark ? 'text-[#99F6E4]' : 'text-[#0D9488]';
  const inputCls  = isDark
    ? 'bg-[#0D1515] border-[rgba(20,184,166,0.3)] text-[#E6FFFA] placeholder:text-[#6B7280] focus-visible:ring-[#14B8A6] rounded-xl'
    : 'bg-white border-[rgba(13,148,136,0.3)] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#0D9488] rounded-xl';
  const accentClr = isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]';
  const accentBg  = isDark ? 'bg-[#14B8A6]/10' : 'bg-[#0D9488]/10';
  const btnClass  = isDark
    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 shadow-[0_0_14px_rgba(20,184,166,0.4)] hover:shadow-[0_0_22px_rgba(20,184,166,0.6)] hover:scale-105'
    : 'bg-[#0D9488] hover:bg-[#0F766E] text-white border-0 shadow-[0_0_12px_rgba(13,148,136,0.3)] hover:shadow-[0_0_18px_rgba(13,148,136,0.5)] hover:scale-105';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    try {
      await sendContactEmail(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactItems = [
    { icon: MapPin, title: 'Our Location', content: '#84, 2nd floor, Guniagrahara, Annapoorneshwari Layout, Near ATD Provision Store, Lakshmi pura cross, Shivakote Post, Bangalore - 89' },
    { icon: Phone, title: 'Phone', content: '8660132700', href: 'tel:8660132700' },
    { icon: Mail, title: 'Email', content: 'edsecinnovations@gmail.com', href: 'mailto:edsecinnovations@gmail.com' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <Navbar />

      {/* Header */}
      <section className={`${sec2Bg} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${accentBg}`}>
            <MessageSquare className={`h-7 w-7 ${accentClr}`} />
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${titleClr}`}>Contact Us</h1>
          <p className={`text-lg max-w-2xl mx-auto ${mutedClr}`}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className={`${pageBg} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

            {/* Form — wider column */}
            <div className={`lg:col-span-3 ${cardBg} ${cardGlow} border rounded-2xl p-8 transition-all duration-300`}>
              <h2 className={`text-2xl font-bold mb-7 ${titleClr}`}>Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Full Name *</label>
                    <Input name="name" type="text" value={formData.name} onChange={handleChange}
                      placeholder="Enter your full name" required className={`h-11 ${inputCls}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Email Address *</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange}
                      placeholder="your.email@example.com" required className={`h-11 ${inputCls}`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Phone Number</label>
                  <Input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                    placeholder="+91 XXXXXXXXXX" className={`h-11 ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Message *</label>
                  <Textarea name="message" value={formData.message} onChange={handleChange}
                    placeholder="Tell us how we can help you..." rows={5} required
                    className={`resize-none ${inputCls}`} />
                </div>
                <Button type="submit" disabled={isSubmitting}
                  className={`w-full h-12 font-semibold tracking-wide rounded-xl gap-2 transition-all duration-300 glow-button ${btnClass}`}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Info column */}
            <div className="lg:col-span-2 space-y-4">
              {contactItems.map((item, i) => (
                <div key={i} className={`${cardBg} ${cardGlow} border rounded-2xl p-5 flex gap-4 transition-all duration-300`}>
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${accentBg}`}>
                    <item.icon className={`h-5 w-5 ${accentClr}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm mb-1 ${titleClr}`}>{item.title}</h3>
                    {item.href ? (
                      <a href={item.href} className={`text-sm ${mutedClr} hover:${accentClr} transition-colors`}>
                        {item.content}
                      </a>
                    ) : (
                      <p className={`text-sm ${mutedClr} leading-relaxed`}>{item.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className={`${cardBg} border rounded-2xl overflow-hidden transition-all duration-300 ${cardGlow}`}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.685351664168!2d77.51468651037233!3d13.055694887224095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae235735f4dd35%3A0xe5a3e1eb32c3c6f6!2sGuniagrahara%2C%20Bengaluru%2C%20Karnataka%20560090!5e0!3m2!1sen!2sin!4v1709403165203!5m2!1sen!2sin"
                  width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" className="rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
