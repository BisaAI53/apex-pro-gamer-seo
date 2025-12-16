import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationSection from "@/components/LocationSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import LoginButton from "@/components/LoginButton";

const Index = () => {
  return (
    <main className="min-h-screen">
      <LoginButton />
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
