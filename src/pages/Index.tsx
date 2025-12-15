import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationSection from "@/components/LocationSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import LoginButton from "@/components/LoginButton";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen">
      <LoginButton />
      {/* Patient registration button */}
      <Link to="/patient-register" className="fixed top-4 right-32 z-50">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-islamic-green hover:bg-islamic-green-dark text-white shadow-lg"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Daftar Pasien
        </Button>
      </Link>
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <ProcessSection />
      <TestimonialsSection />
      <LocationSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
