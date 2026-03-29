import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '@/assets/edsec-logo-new.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isActive = (path: string) => location.pathname === path;
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => i18n.changeLanguage(e.target.value);

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'courses', path: '/courses' },
    { key: 'internship', path: '/internship' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' },
  ];

  const navBg = isDark
    ? 'bg-[rgba(11,15,15,0.88)] text-[#E6FFFA] border-[rgba(20,184,166,0.15)]'
    : 'bg-[rgba(255,255,255,0.92)] text-[#0F172A] border-[rgba(13,148,136,0.15)]';

  const activeCls = isDark
    ? 'bg-[#14B8A6] text-white shadow-[0_0_14px_rgba(20,184,166,0.5)]'
    : 'bg-[#0D9488] text-white shadow-[0_0_12px_rgba(13,148,136,0.4)]';

  const defaultCls = isDark
    ? 'text-[#99F6E4] border border-[rgba(20,184,166,0.18)] hover:bg-[#14B8A6] hover:text-white hover:border-[#14B8A6]'
    : 'text-[#374151] border border-[rgba(13,148,136,0.18)] hover:bg-[#0D9488] hover:text-white hover:border-[#0D9488]';

  const enrollCls = isDark
    ? 'bg-[#14B8A6] text-white hover:bg-[#0D9488] shadow-[0_0_14px_rgba(20,184,166,0.45)] border-0'
    : 'bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-[0_0_12px_rgba(13,148,136,0.4)] border-0';

  const toggleCls = isDark
    ? 'text-[#14B8A6] border border-[rgba(20,184,166,0.22)] hover:bg-[#14B8A6]/15'
    : 'text-[#0D9488] border border-[rgba(13,148,136,0.22)] hover:bg-[#0D9488]/10';

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-sm transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2">

          {/* Logo — teal glow in dark, clean in light */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="EDSEC Innovations"
              className={`h-14 md:h-16 w-auto object-contain transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'drop-shadow-[0_0_12px_rgba(20,184,166,0.6)] brightness-110'
                  : 'brightness-90'
              }`}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button size="sm" className={`h-8 px-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${isActive(link.path) ? activeCls : defaultCls}`}>
                  {t(`nav.${link.key}`)}
                </Button>
              </Link>
            ))}
            <Link to="/enroll">
              <Button size="sm" className={`h-8 px-4 text-sm font-semibold rounded-lg ml-1 transition-all duration-300 hover:scale-105 glow-button ${enrollCls}`}>
                {t('cta.enroll')}
              </Button>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${toggleCls}`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className={`hidden md:flex items-center gap-1 border rounded-lg px-2.5 py-1.5 text-xs ${isDark ? 'border-[rgba(20,184,166,0.18)] text-[#99F6E4]' : 'border-[rgba(13,148,136,0.18)] text-[#374151]'}`}>
              <Globe className="h-3.5 w-3.5 opacity-60" />
              <select value={i18n.language} onChange={handleLanguageChange} className="bg-transparent focus:outline-none cursor-pointer">
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="kn">KN</option>
              </select>
            </div>

            <button className="md:hidden p-2 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-[rgba(20,184,166,0.1)] pt-3">
            {[...navLinks, { key: 'enroll', path: '/enroll' }].map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                <Button className={`w-full h-10 text-sm font-medium rounded-lg ${isActive(link.path) ? activeCls : defaultCls}`}>
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
