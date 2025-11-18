import { Card } from "@/components/ui/card";
import { Award, Shield, Heart } from "lucide-react";
import therapistImage from "@/assets/therapist.jpg";

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Terapis Bersertifikat",
      description: "Terapis profesional dengan sertifikasi resmi"
    },
    {
      icon: Shield,
      title: "Alat Steril Sekali Pakai",
      description: "Jaminan kebersihan dan keamanan maksimal"
    },
    {
      icon: Heart,
      title: "Terapi Sesuai Sunnah",
      description: "Mengikuti tuntunan Rasulullah ﷺ"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="animate-slide-in">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-islamic-green/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-islamic-gold/10 rounded-full blur-2xl" />
              <img 
                src={therapistImage}
                alt="Terapis profesional Rumah Sehat Al-Fatih sedang melakukan terapi bekam dengan alat steril"
                className="rounded-2xl shadow-elegant w-full h-auto relative z-10"
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-islamic-green font-semibold text-sm uppercase tracking-wider">
                  Tentang Kami
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Menyehatkan Tubuh,{" "}
                <span className="text-islamic-green">Menenangkan Hati</span>
              </h2>
            </div>

            <div className="prose prose-lg">
              <p className="text-muted-foreground leading-relaxed">
                Kami adalah pusat terapi bekam sunnah yang mengutamakan kenyamanan, 
                kebersihan, dan ketenangan jiwa. Dengan peralatan steril sekali pakai 
                dan terapis bersertifikat, kami menghadirkan pengalaman bekam yang 
                aman, nyaman, dan penuh keberkahan.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="p-6 text-center space-y-3 border-border hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-islamic-green/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-islamic-green" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">
                    {feature.title}
                  </h3>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
