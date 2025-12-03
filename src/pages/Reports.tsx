import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

const Reports = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const { data: entries = [] } = useQuery({
    queryKey: ["financial_entries_report", selectedYear, selectedMonth],
    queryFn: async () => {
      const startDate = `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`;
      const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0)
        .toISOString()
        .split("T")[0];

      const { data, error } = await supabase
        .from("financial_entries")
        .select("*")
        .gte("entry_date", startDate)
        .lte("entry_date", endDate);
      if (error) throw error;
      return data;
    },
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ["daily_expenses_report", selectedYear, selectedMonth],
    queryFn: async () => {
      const startDate = `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`;
      const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0)
        .toISOString()
        .split("T")[0];

      const { data, error } = await supabase
        .from("daily_expenses")
        .select("*")
        .gte("expense_date", startDate)
        .lte("expense_date", endDate);
      if (error) throw error;
      return data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["financial_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_categories")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: monthlyTrend = [] } = useQuery({
    queryKey: ["monthly_trend", selectedYear],
    queryFn: async () => {
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;

      const { data, error } = await supabase
        .from("financial_entries")
        .select("*")
        .gte("entry_date", startDate)
        .lte("entry_date", endDate);
      if (error) throw error;
      return data;
    },
  });

  // Calculate summaries
  const totalIncome = entries
    .filter((e) => e.entry_type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries
    .filter((e) => e.entry_type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalSaving = entries
    .filter((e) => e.entry_type === "saving")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalDailyExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netAmount = totalIncome - totalExpense - totalDailyExpense;

  // Income by category data
  const incomeByCategory = categories
    .filter((c) => c.is_income)
    .map((cat) => ({
      name: cat.name,
      value: entries
        .filter((e) => e.category_id === cat.id && e.entry_type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((item) => item.value > 0);

  // Expense breakdown (fixed vs variable)
  const fixedExpense = categories
    .filter((c) => !c.is_income && c.is_fixed)
    .reduce((sum, cat) => {
      const catTotal = entries
        .filter((e) => e.category_id === cat.id && e.entry_type === "expense")
        .reduce((s, e) => s + e.amount, 0);
      return sum + catTotal;
    }, 0);

  const variableExpense = totalExpense + totalDailyExpense - fixedExpense;

  const expenseBreakdown = [
    { name: "Tetap", value: fixedExpense },
    { name: "Variabel", value: variableExpense },
  ].filter((item) => item.value > 0);

  // Monthly trend data
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];

  const trendData = monthNames.map((month, index) => {
    const monthNum = index + 1;
    const monthEntries = monthlyTrend.filter((e) => {
      const entryMonth = new Date(e.entry_date).getMonth() + 1;
      return entryMonth === monthNum;
    });

    return {
      name: month,
      pemasukan: monthEntries
        .filter((e) => e.entry_type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
      pengeluaran: monthEntries
        .filter((e) => e.entry_type === "expense")
        .reduce((sum, e) => sum + e.amount, 0),
      tabungan: monthEntries
        .filter((e) => e.entry_type === "saving")
        .reduce((sum, e) => sum + e.amount, 0),
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportToCSV = () => {
    const headers = ["Tanggal", "Tipe", "Kategori", "Jumlah", "Catatan"];
    const rows = entries.map((e) => [
      e.entry_date,
      e.entry_type,
      categories.find((c) => c.id === e.category_id)?.name || "",
      e.amount,
      e.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-${selectedYear}-${selectedMonth}.csv`;
    link.click();
    toast.success("Laporan berhasil diunduh");
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Laporan Keuangan</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
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
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(totalExpense + totalDailyExpense)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tabungan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(totalSaving)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengeluaran Harian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-orange-600">
              {formatCurrency(totalDailyExpense)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Bersih
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-bold ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(netAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {incomeByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Tidak ada data pemasukan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Tidak ada data pengeluaran
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Bulanan {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="pemasukan"
                stroke="#10b981"
                strokeWidth={2}
                name="Pemasukan"
              />
              <Line
                type="monotone"
                dataKey="pengeluaran"
                stroke="#ef4444"
                strokeWidth={2}
                name="Pengeluaran"
              />
              <Line
                type="monotone"
                dataKey="tabungan"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Tabungan"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
