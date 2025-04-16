import { RevenueChart } from "./components/RevenueChart";
import { StatusDonut } from "./components/StatusDonut";
import { requireUser } from "../utils/requireUser";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "./components/StatCard";
import { addMonths, format, startOfMonth } from "date-fns";
import { getInvoices, getRevenueData } from "../action";
import { InvoiceTable } from "./invoice/components/InvoiceTable";
// 🧠 Fetch Stats: Total Invoiced, Paid, Pending, This Month
const getDashboardStats = async (userId) => {
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);

  const [all, paid, pending, thisMonth] = await Promise.all([
    prisma.invoice.aggregate({
      _sum: { total: true },
      where: { userId },
    }),
    prisma.invoice.aggregate({
      _sum: { total: true },
      where: { userId, status: "PAID" },
    }),
    prisma.invoice.count({
      where: { userId, status: "PENDING" },
    }),
    prisma.invoice.count({
      where: { userId, date: { gte: startOfThisMonth } },
    }),
  ]);

  return {
    totalInvoiced: all._sum.total || 0,
    totalPaid: paid._sum.total || 0,
    pendingCount: pending || 0,
    thisMonthCount: thisMonth || 0,
  };
};

// 📊 Revenue Monthly Data (Apr-Mar fiscal year)

// 🍩 Invoice Status Donut
const getInvoiceStatusDonutData = async (userId) => {
  const statuses = ["PAID", "PENDING", "DUE", "DRAFT"];

  const invoices = await prisma.invoice.groupBy({
    by: ["status"],
    where: { userId },
    _count: true,
  });

  const statusMap = Object.fromEntries(invoices.map(i => [i.status, i._count]));

  return statuses.map(status => ({
    name: status.charAt(0) + status.slice(1).toLowerCase(),
    value: statusMap[status] || 0,
  }));
};

const Index = async () => {
  const session = await requireUser();
  const userId = session?.user?.id;

  const [stats, revenueData, statusData , invoices] = await Promise.all([
    getDashboardStats(userId),
    getRevenueData(userId),
    getInvoiceStatusDonutData(userId),
    getInvoices(userId),
  ]);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.FirstName} {session?.user?.LastName}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Invoiced" value={stats.totalInvoiced} isCurrency />
        <StatCard title="Total Paid" value={stats.totalPaid} isCurrency />
        <StatCard title="Pending Invoices" value={stats.pendingCount} />
        <StatCard title="Invoices This Month" value={stats.thisMonthCount} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Invoices</h2>
              {/* You can add RecentInvoicesTable here */}
              <InvoiceTable invoices={invoices} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Revenue Trends</h2>
              <RevenueChart data={revenueData} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Status Breakdown</h2>
              <StatusDonut data={statusData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
