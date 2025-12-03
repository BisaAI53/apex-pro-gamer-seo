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

interface DailyExpense {
  id: string;
  expense_date: string;
  amount: number;
  note: string | null;
  category_id: string | null;
  created_at: string;
}

interface FormData {
  expense_date: string;
  amount: string;
  note: string;
  category_id: string;
}

const Expenses = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<DailyExpense | null>(null);
  const [formData, setFormData] = useState<FormData>({
    expense_date: new Date().toISOString().split("T")[0],
    amount: "",
    note: "",
    category_id: "",
  });

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["daily_expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_expenses")
        .select("*")
        .order("expense_date", { ascending: false });
      if (error) throw error;
      return data as DailyExpense[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["expense_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_categories")
        .select("*")
        .eq("is_income", false)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<DailyExpense, "id" | "created_at" | "created_by">) => {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.from("daily_expenses").insert({
        ...data,
        created_by: session.session?.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_expenses"] });
      toast.success("Pengeluaran berhasil ditambahkan");
      resetForm();
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Gagal menambahkan pengeluaran");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<DailyExpense> & { id: string }) => {
      const { error } = await supabase
        .from("daily_expenses")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_expenses"] });
      toast.success("Pengeluaran berhasil diperbarui");
      resetForm();
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Gagal memperbarui pengeluaran");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("daily_expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_expenses"] });
      toast.success("Pengeluaran berhasil dihapus");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Gagal menghapus pengeluaran");
    },
  });

  const resetForm = () => {
    setFormData({
      expense_date: new Date().toISOString().split("T")[0],
      amount: "",
      note: "",
      category_id: "",
    });
    setEditingExpense(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      expense_date: formData.expense_date,
      amount: parseFloat(formData.amount),
      note: formData.note || null,
      category_id: formData.category_id || null,
    };

    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (expense: DailyExpense) => {
    setEditingExpense(expense);
    setFormData({
      expense_date: expense.expense_date,
      amount: expense.amount.toString(),
      note: expense.note || "",
      category_id: expense.category_id || "",
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

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const todayExpenses = expenses
    .filter((exp) => exp.expense_date === new Date().toISOString().split("T")[0])
    .reduce((sum, exp) => sum + exp.amount, 0);

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
        <h1 className="text-2xl font-bold text-foreground">Pengeluaran Harian</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengeluaran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Pengeluaran" : "Tambah Pengeluaran Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expense_date">Tanggal</Label>
                <Input
                  id="expense_date"
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  required
                />
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
                <Label htmlFor="note">Catatan</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Catatan pengeluaran..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingExpense ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengeluaran Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(todayExpenses)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(totalExpenses)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Belum ada pengeluaran
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {new Date(expense.expense_date).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-destructive font-medium">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === expense.category_id)?.name || "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {expense.note || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(expense)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(expense.id)}
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

export default Expenses;
