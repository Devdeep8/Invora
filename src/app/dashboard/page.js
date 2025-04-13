
StatCard

import { Bell } from "lucide-react";
import { requireUser } from "../utils/requireUser";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "./components/StatCard";

const getDashboardStats = async (userId) => {
  const [allInvoices, paidInvoices, pendingCount, invoicesThisMonth] = await Promise.all([
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
      where: {
        userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  return {
    totalInvoiced: allInvoices._sum.total || 0,
    totalPaid: paidInvoices._sum.total || 0,
    pendingCount: pendingCount || 0,
    thisMonthCount: invoicesThisMonth || 0,
  };
};


const Index = async () => {
  const session = await requireUser();
  const stats =await getDashboardStats(session?.user?.id);
  console.log(stats);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome back, [FirstName]</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-6 w-6" />
          </button>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Invoiced" 
          value={stats.totalInvoiced} 
          isCurrency={true} 
        />
        <StatCard 
          title="Total Paid" 
          value={stats.totalPaid} 
          isCurrency={true} 
        />
        <StatCard 
          title="Pending Invoices" 
          value={stats.pendingCount} 
        />
        <StatCard 
          title="Invoices This Month" 
          value={stats.thisMonthCount} 
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Invoices</h2>
              {/* <RecentInvoicesTable invoices={recentInvoices} /> */}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Revenue Trends</h2>
              {/* <RevenueChart data={revenueData} /> */}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Status Breakdown</h2>
              {/* <StatusDonut data={statusData} /> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;