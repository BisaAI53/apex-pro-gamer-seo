import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, User, Calendar, Receipt, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { User as AuthUser } from "@supabase/supabase-js";

interface PatientData {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  complaint: string | null;
  status: string;
  therapy_date: string | null;
  patient_code: string | null;
  notes: string | null;
}

interface Transaction {
  id: string;
  amount: number;
  entry_type: string;
  entry_date: string;
  notes: string | null;
  category: {
    name: string;
  } | null;
}

interface Membership {
  id: string;
  membership_type: string;
  started_at: string;
  expires_at: string | null;
  notes: string | null;
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/patient-login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/patient-login");
        return;
      }

      // Check if user is a patient
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (roleData?.role !== "patient") {
        toast.error("Akses ditolak. Anda bukan pasien.");
        navigate("/dashboard");
        return;
      }

      setUser(session.user);
      await fetchPatientData(session.user.id);
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/patient-login");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (userId: string) => {
    try {
      // Get patient account link
      const { data: patientAccount, error: accountError } = await supabase
        .from("patient_accounts")
        .select("patient_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (accountError) throw accountError;
      if (!patientAccount) {
        toast.error("Data pasien tidak ditemukan");
        return;
      }

      // Fetch patient data
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientAccount.patient_id)
        .single();

      if (patientError) throw patientError;
      setPatientData(patient);

      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from("financial_entries")
        .select(`
          id,
          amount,
          entry_type,
          entry_date,
          notes,
          category:financial_categories(name)
        `)
        .eq("patient_id", patientAccount.patient_id)
        .order("entry_date", { ascending: false });

      if (txError) throw txError;
      setTransactions(txData || []);

      // Fetch memberships
      const { data: membershipData, error: membershipError } = await supabase
        .from("memberships")
        .select("*")
        .eq("patient_id", patientAccount.patient_id)
        .order("started_at", { ascending: false });

      if (membershipError) throw membershipError;
      setMemberships(membershipData || []);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Gagal memuat data");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logout berhasil");
      navigate("/patient-login");
    } catch (error: any) {
      toast.error(error.message || "Gagal logout");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      calon: { label: "Calon Pasien", variant: "outline" },
      pasien: { label: "Pasien", variant: "default" },
      member: { label: "Member", variant: "secondary" },
      langganan_nonmember: { label: "Langganan", variant: "secondary" },
    };
    const config = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-islamic-green-dark text-white border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-islamic-gold">
            Dashboard Pasien
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{patientData?.full_name}</p>
              <p className="text-xs text-white/70">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-white hover:bg-white/10"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Saya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                <p className="font-medium">{patientData?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No. Telepon</p>
                <p className="font-medium">{patientData?.phone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kode Pasien</p>
                <p className="font-medium">{patientData?.patient_code || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {patientData && getStatusBadge(patientData.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Terapi Terakhir</p>
                <p className="font-medium">
                  {patientData?.therapy_date 
                    ? format(new Date(patientData.therapy_date), "dd MMMM yyyy", { locale: id })
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">{patientData?.address || "-"}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-muted-foreground">Keluhan</p>
                <p className="font-medium">{patientData?.complaint || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Card */}
        {memberships.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Membership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberships.map((membership) => (
                  <div key={membership.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{membership.membership_type}</p>
                      <p className="text-sm text-muted-foreground">
                        Mulai: {format(new Date(membership.started_at), "dd MMM yyyy", { locale: id })}
                        {membership.expires_at && (
                          <> - Berakhir: {format(new Date(membership.expires_at), "dd MMM yyyy", { locale: id })}</>
                        )}
                      </p>
                    </div>
                    {membership.expires_at && new Date(membership.expires_at) > new Date() ? (
                      <Badge variant="default">Aktif</Badge>
                    ) : membership.expires_at ? (
                      <Badge variant="destructive">Kadaluarsa</Badge>
                    ) : (
                      <Badge variant="secondary">Lifetime</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Riwayat Transaksi
            </CardTitle>
            <CardDescription>
              Riwayat pembayaran dan transaksi Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada transaksi
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          {format(new Date(tx.entry_date), "dd MMM yyyy", { locale: id })}
                        </TableCell>
                        <TableCell>{tx.category?.name || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={tx.entry_type === "income" ? "default" : "secondary"}>
                            {tx.entry_type === "income" ? "Pembayaran" : tx.entry_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {tx.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
