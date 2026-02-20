import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-bekam.jpg";

const HeroSection = () => {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=6287854179686&text=Assalamualaikum,%20saya%20ingin%20booking%20terapi%20bekam%20di%20Rumah%20Sehat%20Al-Fatih";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroImage})` }}>

        <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/80 via-islamic-green-dark/85 to-islamic-green-dark/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-islamic-gold/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-islamic-gold/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Arabic Quote */}
          <div className="mb-6">
            <div className="inline-block px-6 py-3 bg-background/10 backdrop-blur-sm rounded-full border border-islamic-gold/30">
              <p className="text-islamic-gold text-sm font-medium"> Terapi Bekam Sunnah</p>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            "Sebaik-baik pengobatan yang kalian lakukan adalah{" "}
            <span className="text-islamic-gold">Al Hijamah</span>"
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 italic">
            (HR. Bukhari & Muslim)
          </p>

          {/* Subheadline */}
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl md:text-3xl text-white font-semibold">
              Rumah Sehat Al-Fatih
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Sehat Dengan Metode Terapi Bekam Sunnah Rasulullah ﷺ
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              asChild
              size="lg"
              className="bg-islamic-gold hover:bg-islamic-gold/90 text-islamic-green-dark font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300">

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-6 w-6" />
                Konsultasi & Booking via WhatsApp
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-12 text-white/90">
            <div className="flex items-center gap-2">
              <span className="text-islamic-gold text-2xl">✓</span>
              <span className="text-sm md:text-base">Terapis Bersertifikat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-islamic-gold text-2xl">✓</span>
              <span className="text-sm md:text-base">Alat Steril Sekali Pakai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-islamic-gold text-2xl">✓</span>
              <span className="text-sm md:text-base">Sesuai Tuntunan Sunnah</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
        </div>
      </div>
    </section>);

};

export default HeroSection;