import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '@/assets/edsec-logo-new.png';
import GoogleTranslate from './GoogleTranslate';

const Footer = () => {
  const { isDark } = useTheme();

  // Footer colors adapt to theme
  const bg      = isDark ? 'bg-[#060A0A]' : 'bg-[#F0FDFA]';
  const text    = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const heading = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
  const link    = 'hover:text-[#14B8A6] transition-colors duration-300';
  const divider = isDark ? 'border-[rgba(20,184,166,0.12)]' : 'border-[rgba(13,148,136,0.2)]';
  const logoCls = isDark 
    ? 'brightness-110 drop-shadow-[0_0_10px_rgba(20,184,166,0.45)]' 
    : 'brightness-90';

  const socials = [
    { href: 'https://www.facebook.com/share/1Ckk8LXs8B/', label: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
    { href: 'https://www.instagram.com/edsecinnovations?utm_source=qr&igsh=NGg3aGllbTV0bnBr', label: 'Instagram', icon: <Instagram className="h-5 w-5" /> },
    { href: 'https://x.com/EdsecInnovation', label: 'X', icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { href: 'https://www.linkedin.com/company/edsec-innovations/', label: 'LinkedIn', icon: <Linkedin className="h-5 w-5" /> },
    { href: 'https://youtube.com/@edsecinnovations?si=gp8I6-gbmDJif6yb', label: 'YouTube', icon: <Youtube className="h-5 w-5" /> },
  ];

  return (
    <footer className={`${bg} ${text} border-t ${divider}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 lg:pr-10">
            <img src={logo} alt="EDSEC Innovations"
              className={`h-14 w-auto object-contain transition-all duration-300 hover:scale-105 mb-5 ${logoCls}`} />
            <p className="text-sm leading-relaxed mb-6 opacity-80">
              MSME certified training institute empowering the next generation of tech professionals through hands-on internships, real-world projects, and expert mentorship.
            </p>
            <div className="flex items-center gap-4">
              {socials.map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={`${link} hover:scale-125 inline-block opacity-60 hover:opacity-100`} aria-label={label}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${heading}`}>Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/courses', label: 'All Programs' },
                { to: '/internship', label: 'Internship Programs' },
                { to: '/enroll', label: 'Enroll Now' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/terms', label: 'Terms & Conditions' },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className={`opacity-70 ${link}`}>{label}</Link></li>
              ))}
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${heading}`}>Get in Touch</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#14B8A6]" />
                <p className="opacity-70 leading-relaxed">
                  #84, 2nd floor, Guniagrahara, Annapoorneshwari Layout, Near ATD Provision Store, Lakshmi pura cross, Shivakote Post, Bangalore - 89
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#14B8A6]" />
                <a href="tel:8660132700" className={`opacity-70 ${link}`}>8660132700</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#14B8A6]" />
                <a href="mailto:edsecinnovations@gmail.com" className={`opacity-70 ${link} text-xs`}>
                  edsecinnovations@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t ${divider} mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-50`}>
          <p>© {new Date().getFullYear()} Edsec Innovations Pvt. Ltd. All Rights Reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <GoogleTranslate />
            <Link to="/privacy" className={link}>Privacy Policy</Link>
            <Link to="/terms" className={link}>Terms of Service</Link>
            <Link to="/admin-login" className={`ml-2 text-xs font-semibold ${link} hover:text-[#14B8A6] opacity-30 hover:opacity-100 transition-opacity`}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
