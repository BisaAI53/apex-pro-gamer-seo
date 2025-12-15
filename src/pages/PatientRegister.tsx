import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, UserPlus } from "lucide-react";

const PatientRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"account" | "profile">("account");
  
  // Account data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Patient data
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [complaint, setComplaint] = useState("");

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    
    setStep("profile");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/patient-dashboard`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Gagal membuat akun");

      // 2. Create patient record
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .insert({
          full_name: fullName,
          phone,
          address,
          complaint,
          status: "calon",
          email,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // 3. Link patient to user account
      const { error: linkError } = await supabase
        .from("patient_accounts")
        .insert({
          user_id: authData.user.id,
          patient_id: patientData.id,
        });

      if (linkError) throw linkError;

      // 4. Set user role as patient
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({ role: "patient" })
        .eq("user_id", authData.user.id);

      if (roleError) {
        console.error("Role update error:", roleError);
      }

      toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.");
      navigate("/patient-dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Gagal registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green/10 via-background to-islamic-gold/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-islamic-green-dark flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            Daftar Pasien Baru
          </CardTitle>
          <CardDescription>
            {step === "account" 
              ? "Langkah 1: Buat akun Anda" 
              : "Langkah 2: Lengkapi data diri"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "account" ? (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-islamic-green hover:bg-islamic-green-dark">
                Lanjutkan
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Rumah</Label>
                <Textarea
                  id="address"
                  placeholder="Alamat lengkap"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complaint">Keluhan</Label>
                <Textarea
                  id="complaint"
                  placeholder="Jelaskan keluhan Anda"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep("account")}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-islamic-green hover:bg-islamic-green-dark"
                  disabled={loading}
                >
                  {loading ? "Mendaftar..." : "Daftar"}
                </Button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/patient-login" className="text-islamic-green hover:underline">
                Login di sini
              </Link>
            </p>
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali ke Beranda
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegister;
