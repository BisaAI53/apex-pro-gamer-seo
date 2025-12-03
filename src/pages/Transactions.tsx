import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type EntryType = Database["public"]["Enums"]["entry_type"];

interface FinancialEntry {
  id: string;
  entry_date: string;
  entry_type: EntryType;
  amount: number;
  notes: string | null;
  category_id: string | null;
  patient_id: string | null;
  created_at: string;
}

interface FormData {
  entry_date: string;
  entry_type: EntryType;
  amount: string;
  notes: string;
  category_id: string;
  patient_id: string;
}

const Transactions = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [formData, setFormData] = useState<FormData>({
    entry_date: new Date().toISOString().split("T")[0],
    entry_type: "income",
    amount: "",
    notes: "",
    category_id: "",
    patient_id: "",
  });

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["financial_entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_entries")
        .select("*")
        .order("entry_date", { ascending: false });
      if (error) throw error;
      return data as FinancialEntry[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["financial_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<FinancialEntry, "id" | "created_at" | "created_by">) => {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.from("financial_entries").insert({
        ...data,
        created_by: session.session?.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_entries"] });
      toast.success("Transaksi berhasil ditambahkan");
      resetForm();
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Gagal menambahkan transaksi");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<FinancialEntry> & { id: string }) => {
      const { error } = await supabase
        .from("financial_entries")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_entries"] });
      toast.success("Transaksi berhasil diperbarui");
      resetForm();
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Gagal memperbarui transaksi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("financial_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_entries"] });
      toast.success("Transaksi berhasil dihapus");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Gagal menghapus transaksi");
    },
  });

  const resetForm = () => {
    setFormData({
      entry_date: new Date().toISOString().split("T")[0],
      entry_type: "income",
      amount: "",
      notes: "",
      category_id: "",
      patient_id: "",
    });
    setEditingEntry(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      entry_date: formData.entry_date,
      entry_type: formData.entry_type,
      amount: parseFloat(formData.amount),
      notes: formData.notes || null,
      category_id: formData.category_id || null,
      patient_id: formData.patient_id || null,
    };

    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setFormData({
      entry_date: entry.entry_date,
      entry_type: entry.entry_type,
      amount: entry.amount.toString(),
      notes: entry.notes || "",
      category_id: entry.category_id || "",
      patient_id: entry.patient_id || "",
    });
    setIsOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getEntryTypeLabel = (type: EntryType) => {
    const labels: Record<EntryType, string> = {
      income: "Pemasukan",
      expense: "Pengeluaran",
      saving: "Tabungan",
    };
    return labels[type];
  };

  const getEntryTypeColor = (type: EntryType) => {
    const colors: Record<EntryType, string> = {
      income: "text-green-600",
      expense: "text-red-600",
      saving: "text-blue-600",
    };
    return colors[type];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Transaksi Keuangan</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Transaksi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? "Edit Transaksi" : "Tambah Transaksi Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entry_date">Tanggal</Label>
                <Input
                  id="entry_date"
                  type="date"
                  value={formData.entry_date}
                  onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entry_type">Tipe Transaksi</Label>
                <Select
                  value={formData.entry_type}
                  onValueChange={(value: EntryType) =>
                    setFormData({ ...formData, entry_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                    <SelectItem value="saving">Tabungan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient">Pasien (Opsional)</Label>
                <Select
                  value={formData.patient_id}
                  onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pasien" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan transaksi..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingEntry ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Belum ada transaksi
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.entry_date).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <span className={getEntryTypeColor(entry.entry_type)}>
                        {getEntryTypeLabel(entry.entry_type)}
                      </span>
                    </TableCell>
                    <TableCell className={getEntryTypeColor(entry.entry_type)}>
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === entry.category_id)?.name || "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {entry.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
