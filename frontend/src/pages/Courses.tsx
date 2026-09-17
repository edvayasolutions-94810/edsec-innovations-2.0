import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useTheme } from '@/contexts/ThemeContext';

const Courses = () => {
  const { isDark } = useTheme();
  const pageBg = isDark ? 'bg-[#0B0F0F]' : 'bg-white';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg} flex flex-col justify-between`}>
      <Navbar />
      <main className="flex-grow min-h-[60vh]">
        {/* Courses removed and kept blank */}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Courses;
