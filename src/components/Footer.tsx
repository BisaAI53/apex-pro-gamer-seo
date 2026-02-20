import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = "https://api.whatsapp.com/send?phone=6287854179686&text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Rumah%20Sehat%20Al-Fatih";

  return (
    <footer className="bg-islamic-green-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Rumah Sehat Al-Fatih" className="w-14 h-14 object-contain rounded-lg bg-white p-1" />
              <h3 className="text-2xl font-bold text-islamic-gold">
                Rumah Sehat Al-Fatih
              </h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Pusat terapi bekam sunnah yang mengutamakan kenyamanan, 
              kebersihan, dan ketenangan jiwa.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4">Kontak Kami</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-islamic-gold flex-shrink-0 mt-0.5" />
                <p className="text-white/80">
                  Jl. Sunan Giri No.8D, RT.001/RW.002<br />
                  Pd. Pucung, Kec. Karang Tengah<br />
                  Kota Tangerang, Banten 15159
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-islamic-gold flex-shrink-0" />
                <a
                  href="tel:+6287854179686"
                  className="text-white/80 hover:text-white transition-colors">

                  +62 878-5417-9686
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-islamic-gold flex-shrink-0" />
                <p className="text-white/80">Buka Setiap Hari: 08.00 – 23.00 WIB

                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4">Layanan Kami</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Terapi Bekam Basah</li>
              <li>• Terapi Bekam Kering</li>
              <li>• Konsultasi Kesehatan</li>
              <li>• Bekam untuk Anak-anak</li>
            </ul>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-islamic-gold hover:bg-islamic-gold/90 text-islamic-green-dark font-semibold rounded-lg transition-all duration-300 hover:scale-105">

              <MessageCircle className="w-5 h-5" />
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center text-sm text-white/60">
          <p>
            © {currentYear} Rumah Sehat Al-Fatih. Semua hak dilindungi undang-undang.
          </p>
          <p className="mt-2 text-islamic-gold/80"> Sehat dengan Sunnah Rasulullah ﷺ

          </p>
        </div>
      </div>
    </footer>);

};

export default Footer;