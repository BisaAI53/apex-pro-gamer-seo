import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";

const CTASection = () => {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=6287854179686&text=Assalamualaikum,%20saya%20ingin%20booking%20terapi%20bekam%20di%20Rumah%20Sehat%20Al-Fatih";

  return (
    <section className="py-20 bg-gradient-to-br from-islamic-green via-islamic-green to-islamic-green-dark relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-islamic-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-islamic-gold animate-glow" />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Hidup Sehat, Dekat dengan Sunnah
            </h2>
            <p className="text-xl md:text-2xl text-white/90">
              Mulailah perjalanan sehat Anda bersama Rumah Sehat Al-Fatih
            </p>
          </div>

          {/* Decorative Quote */}
          <div className="py-6">
            <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <p className="text-white/90 italic text-lg">
                "Kesehatan adalah mahkota di kepala orang yang sehat,<br />
                yang hanya dapat dilihat oleh orang yang sakit"
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              asChild
              size="lg"
              className="bg-islamic-gold hover:bg-islamic-gold/90 text-islamic-green-dark font-bold text-lg px-12 py-7 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-6 w-6" />
                Booking Sekarang via WhatsApp
              </a>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 text-white/80 text-sm">
            <p>Konsultasi gratis • Respon cepat • Pelayanan profesional</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
