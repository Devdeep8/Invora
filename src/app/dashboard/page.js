import { RevenueChart } from "./components/RevenueChart";
import { StatusDonut } from "./components/StatusDonut";
import { requireUser } from "@/utils/requireUser";
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

  const [stats, revenueData, statusData, invoices] = await Promise.all([
    getDashboardStats(userId),
    getRevenueData(userId),
    getInvoiceStatusDonutData(userId),
    getInvoices(userId),
  ]);

  return (  
    <div className=" bg-background">
      {/* Header with theme-aware styling */}
      <div className="bg-primary text-primary-foreground">
        <div className=" mx-auto p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Welcome back, {session?.user?.FirstName} {session?.user?.LastName}
              </h1>
              <p className="text-primary-foreground/80">
                Here's an overview of your business performance
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-sm text-primary-foreground/80">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards with theme-aware styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="transform transition-all duration-300 hover:scale-105">
            <StatCard 
              title="Total Invoiced" 
              value={stats.totalInvoiced} 
              isCurrency 
              type="invoiced"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <StatCard 
              title="Total Paid" 
              value={stats.totalPaid} 
              isCurrency 
              type="paid"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <StatCard 
              title="Pending Invoices" 
              value={stats.pendingCount}
              type="pending" 
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <StatCard 
              title="Invoices This Month" 
              value={stats.thisMonthCount}
              type="month" 
            />
          </div>
        </div>

        {/* Charts Section with theme-aware styling */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trends Card */}
          <Card className="lg:col-span-2 overflow-hidden shadow-md">
            <div className="bg-muted px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Revenue Trends</h2>
              <p className="text-sm text-muted-foreground">Monthly revenue analysis</p>
            </div>
            <CardContent className="p-6">
              <RevenueChart data={revenueData} />
            </CardContent>
          </Card>

          {/* Status Breakdown Card */}
          <Card className="overflow-hidden shadow-md">
            <div className="bg-muted px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Status Breakdown</h2>
              <p className="text-sm text-muted-foreground">Invoice status distribution</p>
            </div>
            <CardContent className="p-6">
              <StatusDonut data={statusData} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices Section */}
        <Card className="overflow-hidden shadow-md mb-8">
          <div className="bg-muted px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent Invoices</h2>
            <p className="text-sm text-muted-foreground">Your latest invoice activity</p>
          </div>
          <CardContent className="p-6">
            <InvoiceTable invoices={invoices} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;