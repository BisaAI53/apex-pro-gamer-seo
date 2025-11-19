import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";

const LocationSection = () => {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=6287854179686&text=Assalamualaikum,%20saya%20ingin%20booking%20terapi%20bekam%20di%20Rumah%20Sehat%20Al-Fatih";
  const mapsUrl = "https://share.google/4pWbyv6nZofVgRNCb";

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-islamic-green font-semibold text-sm uppercase tracking-wider">
              Lokasi & Kontak
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Temui <span className="text-islamic-green">Kami</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Kami siap melayani Anda dengan sepenuh hati
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map */}
          <div className="animate-slide-in">
            <Card className="overflow-hidden h-full border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.9905273284436!2d106.6719!3d-6.2754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTYnMzEuNCJTIDEwNsKwNDAnMTguOCJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Rumah Sehat Al-Fatih di Google Maps"
              />
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 space-y-4 border-border hover:shadow-soft transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-islamic-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Alamat Lengkap</h3>
                  <p className="text-muted-foreground">
                    Jl. Sunan Giri No.8D, RT.001/RW.002<br />
                    Pd. Pucung, Kec. Karang Tengah<br />
                    Kota Tangerang, Banten 15159
                  </p>
                  <Button 
                    asChild
                    variant="link" 
                    className="text-islamic-green p-0 h-auto mt-2"
                  >
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      Lihat di Google Maps →
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-border hover:shadow-soft transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-islamic-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Jam Operasional</h3>
                  <p className="text-muted-foreground">
                    Buka Setiap Hari<br />
                    <span className="text-islamic-green font-semibold">08.00 – 21.00 WIB</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-border hover:shadow-soft transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-islamic-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Hubungi Kami</h3>
                  <p className="text-muted-foreground mb-4">
                    +62 878-5417-9686
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-islamic-green hover:bg-islamic-green/90 text-white"
                  >
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
