import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
  });
  const [incomeByCategory, setIncomeByCategory] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [savingsTrend, setSavingsTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch patients count
      const { count: patientsCount } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });

      // Fetch financial entries for current month
      const { data: entries } = await supabase
        .from("financial_entries")
        .select("*, financial_categories(name, is_fixed)")
        .gte("entry_date", firstDay.toISOString())
        .lte("entry_date", lastDay.toISOString());

      // Calculate stats
      const income = entries?.filter(e => e.entry_type === "income").reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const expense = entries?.filter(e => e.entry_type === "expense").reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Income by category
      const incomeData = entries
        ?.filter(e => e.entry_type === "income")
        .reduce((acc: any, e) => {
          const category = e.financial_categories?.name || "Lainnya";
          acc[category] = (acc[category] || 0) + Number(e.amount);
          return acc;
        }, {});

      const incomeChart = Object.entries(incomeData || {}).map(([name, value]) => ({
        name,
        value,
      }));

      // Expense breakdown (fixed vs variable)
      const fixedExpense = entries?.filter(e => e.entry_type === "expense" && e.financial_categories?.is_fixed).reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const variableExpense = entries?.filter(e => e.entry_type === "expense" && !e.financial_categories?.is_fixed).reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Savings trend (last 6 months)
      const savingsData = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const { data: monthEntries } = await supabase
          .from("financial_entries")
          .select("amount, entry_type")
          .eq("entry_type", "saving")
          .gte("entry_date", monthStart.toISOString())
          .lte("entry_date", monthEnd.toISOString());

        const savings = monthEntries?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
        
        savingsData.push({
          month: monthStart.toLocaleDateString("id-ID", { month: "short" }),
          savings,
        });
      }

      setStats({
        totalPatients: patientsCount || 0,
        totalIncome: income,
        totalExpense: expense,
        netAmount: income - expense,
      });

      setIncomeByCategory(incomeChart);
      setExpenseBreakdown([
        { name: "Tetap", value: fixedExpense },
        { name: "Variabel", value: variableExpense },
      ]);
      setSavingsTrend(savingsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan bulan ini</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rp {stats.totalIncome.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              Rp {stats.totalExpense.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
              Rp {stats.netAmount.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
                <Bar dataKey="value" fill="hsl(var(--islamic-green))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran (Tetap vs Variabel)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: Rp ${entry.value.toLocaleString("id-ID")}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tren Tabungan (6 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="hsl(var(--islamic-green))" name="Tabungan" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
