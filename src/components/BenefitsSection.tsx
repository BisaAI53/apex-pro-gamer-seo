import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Activity, Brain, Moon, Sparkles, MessageCircle } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Droplets,
      title: "Mengeluarkan Racun",
      description: "Membuang racun dan darah kotor dari tubuh"
    },
    {
      icon: Activity,
      title: "Meredakan Nyeri",
      description: "Mengurangi nyeri otot, sendi, dan pegal-pegal"
    },
    {
      icon: Brain,
      title: "Menjernihkan Pikiran",
      description: "Meningkatkan fokus dan konsentrasi"
    },
    {
      icon: Moon,
      title: "Kualitas Tidur",
      description: "Meningkatkan kualitas tidur yang lebih nyenyak"
    },
    {
      icon: Sparkles,
      title: "Keseimbangan Energi",
      description: "Menyeimbangkan energi dan sistem tubuh"
    }
  ];

  const whatsappUrl = "https://api.whatsapp.com/send?phone=6287854179686&text=Assalamualaikum,%20saya%20ingin%20konsultasi%20tentang%20terapi%20bekam";

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-islamic-green font-semibold text-sm uppercase tracking-wider">
              Manfaat Bekam Sunnah
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Manfaat yang Dirasakan{" "}
            <span className="text-islamic-green">Tubuh dan Jiwa</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Bekam telah dipraktikkan selama berabad-abad sebagai metode penyembuhan alami
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="p-8 space-y-4 hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-border bg-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-islamic-green/10 flex items-center justify-center">
                <benefit.icon className="w-8 h-8 text-islamic-green" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </Card>
          ))}

          {/* CTA Card */}
          <Card className="p-8 bg-gradient-to-br from-islamic-green to-islamic-green-dark text-white space-y-4 flex flex-col justify-center items-center text-center hover:shadow-elegant transition-all duration-300 hover:scale-105">
            <div className="space-y-3">
              <h3 className="text-xl font-bold">
                Ingin tahu bekam cocok untuk kondisi Anda?
              </h3>
              <Button 
                asChild
                variant="secondary"
                size="lg"
                className="bg-white text-islamic-green hover:bg-white/90 font-semibold"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Konsultasi Gratis
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
