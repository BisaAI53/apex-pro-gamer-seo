import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Patient {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  patient_code: string | null;
  therapy_date: string | null;
  complaint: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState<{
    full_name: string;
    phone: string;
    address: string;
    patient_code: string;
    therapy_date: string;
    complaint: string;
    status: "calon" | "pasien" | "member" | "langganan_nonmember";
    notes: string;
  }>({
    full_name: "",
    phone: "",
    address: "",
    patient_code: "",
    therapy_date: "",
    complaint: "",
    status: "calon",
    notes: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data pasien");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      full_name: formData.full_name,
      phone: formData.phone || null,
      address: formData.address || null,
      patient_code: formData.patient_code || null,
      therapy_date: formData.therapy_date || null,
      complaint: formData.complaint || null,
      status: formData.status,
      notes: formData.notes || null,
    };

    try {
      if (editingPatient) {
        const { error } = await supabase
          .from("patients")
          .update(submitData)
          .eq("id", editingPatient.id);

        if (error) throw error;
        toast.success("Data pasien berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("patients")
          .insert([submitData]);

        if (error) throw error;
        toast.success("Pasien berhasil ditambahkan");
      }

      setDialogOpen(false);
      resetForm();
      fetchPatients();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
      console.error(error);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      full_name: patient.full_name,
      phone: patient.phone || "",
      address: patient.address || "",
      patient_code: patient.patient_code || "",
      therapy_date: patient.therapy_date || "",
      complaint: patient.complaint || "",
      status: patient.status as "calon" | "pasien" | "member" | "langganan_nonmember",
      notes: patient.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pasien ini?")) return;

    try {
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Pasien berhasil dihapus");
      fetchPatients();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus pasien");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      address: "",
      patient_code: "",
      therapy_date: "",
      complaint: "",
      status: "calon",
      notes: "",
    });
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.patient_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusLabels: Record<string, string> = {
    calon: "Calon",
    pasien: "Pasien",
    member: "Member",
    langganan_nonmember: "Langganan Non-Member",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Pasien</h1>
          <p className="text-muted-foreground">Kelola data pasien Rumah Sehat Al-Fatih</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-islamic-green hover:bg-islamic-green/90">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPatient ? "Edit Pasien" : "Tambah Pasien Baru"}</DialogTitle>
              <DialogDescription>
                Isi data pasien dengan lengkap
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patient_code">Kode Pasien</Label>
                    <Input
                      id="patient_code"
                      placeholder="Contoh: P001"
                      value={formData.patient_code}
                      onChange={(e) => setFormData({ ...formData, patient_code: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Nama Lengkap *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Alamat Rumah</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="therapy_date">Tanggal Terapi</Label>
                    <Input
                      id="therapy_date"
                      type="date"
                      value={formData.therapy_date}
                      onChange={(e) => setFormData({ ...formData, therapy_date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: "calon" | "pasien" | "member" | "langganan_nonmember") => 
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calon">Calon</SelectItem>
                        <SelectItem value="pasien">Pasien</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="langganan_nonmember">Langganan Non-Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="complaint">Keluhan</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Tuliskan keluhan pasien..."
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    placeholder="Catatan tambahan..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-islamic-green hover:bg-islamic-green/90">
                  {editingPatient ? "Simpan Perubahan" : "Tambah Pasien"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Tgl Terapi</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-sm">{patient.patient_code || "-"}</TableCell>
                    <TableCell className="font-medium">{patient.full_name}</TableCell>
                    <TableCell>{patient.phone || "-"}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{patient.address || "-"}</TableCell>
                    <TableCell>
                      {patient.therapy_date 
                        ? format(new Date(patient.therapy_date), "dd/MM/yyyy") 
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{patient.complaint || "-"}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-islamic-green/10 text-islamic-green">
                        {statusLabels[patient.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(patient)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(patient.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;