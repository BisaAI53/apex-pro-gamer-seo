import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Bapak Hendra",
      age: "38 tahun",
      rating: 5,
      text: "Badan terasa enteng, tidur lebih nyenyak. Pelayanannya sopan dan menenangkan. Alhamdulillah sangat memuaskan.",
      avatar: "BH"
    },
    {
      name: "Ibu Fatimah",
      age: "42 tahun",
      rating: 5,
      text: "Tempatnya bersih, terapisnya profesional, benar-benar terasa sunnahnya. Akan kembali lagi insyaAllah.",
      avatar: "IF"
    },
    {
      name: "Bapak Ahmad",
      age: "35 tahun",
      rating: 5,
      text: "Nyeri punggung yang sudah lama akhirnya berkurang setelah bekam di sini. Terapis sangat berpengalaman.",
      avatar: "BA"
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-islamic-green font-semibold text-sm uppercase tracking-wider">
              Testimoni
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Kata <span className="text-islamic-green">Mereka</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Kepercayaan dan kepuasan pasien adalah prioritas kami
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 space-y-6 border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-20 h-20 text-islamic-green" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-islamic-gold text-islamic-gold" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground italic leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-green to-islamic-green-dark flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.age}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
