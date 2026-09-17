import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const pageBg = isDark ? "bg-[#0B0F0F]" : "bg-white";
  const titleClr = isDark ? "text-[#E6FFFA]" : "text-[#0F172A]";
  const mutedClr = isDark ? "text-[#94A3B8]" : "text-[#64748B]";
  const cardBg = isDark ? "bg-[#121818] border-[rgba(20,184,166,0.18)]" : "bg-white border-[rgba(13,148,136,0.15)]";
  const btnPrimary = isDark
    ? "bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-[0_0_18px_rgba(20,184,166,0.45)]"
    : "bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[0_0_14px_rgba(13,148,136,0.4)]";

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${pageBg}`}>
      <div className={`max-w-md w-full p-8 md:p-10 rounded-3xl border text-center shadow-xl ${cardBg}`}>
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-teal-500/10 text-teal-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className={`text-6xl font-black mb-3 ${titleClr}`}>404</h1>
        <h2 className={`text-xl font-bold mb-2 ${titleClr}`}>Page Not Found</h2>
        <p className={`text-sm mb-8 ${mutedClr}`}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className={`h-12 px-8 rounded-full font-bold inline-flex items-center gap-2 ${btnPrimary}`}>
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
