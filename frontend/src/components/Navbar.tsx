import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '@/assets/edsec-logo-new.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isActive = (path: string) => location.pathname === path;



  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'internship', path: '/internship' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' },
  ];

  const navBg = isDark
    ? 'bg-[rgba(11,15,15,0.88)] text-[#E6FFFA] border-[rgba(20,184,166,0.15)]'
    : 'bg-[rgba(255,255,255,0.92)] text-[#0F172A] border-[rgba(13,148,136,0.15)]';

  const activeCls = isDark
    ? 'bg-[#14B8A6] text-white shadow-[0_0_16px_rgba(20,184,166,0.5)] font-semibold'
    : 'bg-[#0D9488] text-white shadow-[0_0_12px_rgba(13,148,136,0.35)] font-semibold';

  const defaultCls = isDark
    ? 'text-[#99F6E4] hover:bg-[#14B8A6]/15 hover:text-[#E6FFFA]'
    : 'text-[#334155] hover:bg-[#0D9488]/10 hover:text-[#0F172A]';

  const enrollCls = isDark
    ? 'bg-[#14B8A6] text-white hover:bg-[#0D9488] shadow-[0_0_16px_rgba(20,184,166,0.5)] border-0'
    : 'bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-[0_0_14px_rgba(13,148,136,0.35)] border-0';

  const toggleCls = isDark
    ? 'text-[#14B8A6] border border-[rgba(20,184,166,0.25)] hover:bg-[#14B8A6]/15 rounded-full'
    : 'text-[#0D9488] border border-[rgba(13,148,136,0.25)] hover:bg-[#0D9488]/10 rounded-full';

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-sm transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2.5">

          {/* Logo — teal glow in dark, clean in light */}
          <a href="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="EDSEC Innovations"
              className={`h-14 md:h-16 w-auto object-contain transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'drop-shadow-[0_0_12px_rgba(20,184,166,0.6)] brightness-110'
                  : 'brightness-90'
              }`}
            />
          </a>

          {/* Desktop Links - Pill style */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button size="sm" variant="ghost" className={`h-9 px-4 text-sm rounded-full transition-all duration-300 hover:scale-105 ${isActive(link.path) ? activeCls : defaultCls}`}>
                  {t(`nav.${link.key}`)}
                </Button>
              </Link>
            ))}
            <Link to="/enroll" className="ml-1">
              <Button size="sm" className={`h-9 px-5 text-sm font-bold rounded-full transition-all duration-300 hover:scale-105 glow-button ${enrollCls}`}>
                {t('cta.enroll')}
              </Button>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${toggleCls}`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button className="md:hidden p-2 rounded-full border border-current opacity-70" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-[rgba(20,184,166,0.12)] pt-3">
            {[...navLinks, { key: 'enroll', path: '/enroll' }].map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                <Button className={`w-full h-11 text-sm font-medium rounded-2xl ${isActive(link.path) ? activeCls : defaultCls}`}>
                  {link.key === 'enroll' ? t('cta.enroll') : t(`nav.${link.key}`)}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
