import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 px-4">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm md:text-base">
        <Sparkles className="h-5 w-5 flex-shrink-0 animate-pulse" />
        <span className="font-semibold">
          🎓 Level up your career with EDSEC!
        </span>
        <Link to="/enroll">
          <Button size="sm" variant="secondary" className="text-xs md:text-sm bg-background text-foreground hover:bg-background/90">
            Enroll Now
          </Button>
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
