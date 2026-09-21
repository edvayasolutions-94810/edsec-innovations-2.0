import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseComparison from "./pages/CourseComparison";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Enroll from "./pages/Enroll";
import NotFound from "./pages/NotFound";
import ProgramDetail from "./pages/ProgramDetail";
import FloatingContact from "./components/FloatingContact";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent_70%)] z-[-1]" />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/programs/:programId" element={<ProgramDetail />} />
          <Route path="/compare" element={<CourseComparison />} />
          <Route path="/internship" element={<Navigate to="/courses" replace />} />
          <Route path="/course/:courseId" element={<Navigate to="/courses" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/enroll" element={<Enroll />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <FloatingContact />
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
