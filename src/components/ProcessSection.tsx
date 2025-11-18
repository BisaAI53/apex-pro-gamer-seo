import { Card } from "@/components/ui/card";
import { MessageSquare, Stethoscope, HeartPulse } from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Konsultasi Ringan",
      description: "Kami mendengarkan keluhan dan kondisi kesehatan Anda sebelum memulai terapi"
    },
    {
      number: "02",
      icon: Stethoscope,
      title: "Proses Bekam Profesional",
      description: "Terapi bekam dilakukan dengan alat steril sekali pakai oleh terapis bersertifikat"
    },
    {
      number: "03",
      icon: HeartPulse,
      title: "Pemulihan & Panduan",
      description: "Panduan pasca terapi untuk hasil optimal dan pemulihan yang baik"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-islamic-green font-semibold text-sm uppercase tracking-wider">
              Proses Terapi
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Proses Terapi di{" "}
            <span className="text-islamic-green">Al-Fatih</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tiga langkah sederhana untuk kesehatan yang lebih baik
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-islamic-green to-islamic-gold/30 z-0" 
                  style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 1rem)' }}
                />
              )}
              
              <Card className="p-8 space-y-6 text-center relative z-10 border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card">
                {/* Step Number */}
                <div className="relative">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-islamic-green to-islamic-green-dark flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-islamic-gold rounded-full flex items-center justify-center font-bold text-islamic-green-dark shadow-md">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
