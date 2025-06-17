import { SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "@/utils/requireUser";
import { AppSidebar } from "./components/app-sidebar";
import Header from "./components/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

async function getUser(userId) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      FirstName: true,
      LastName: true,
      address: true,
    },
  });

  if (!data?.FirstName || !data?.LastName || !data?.address) {
    redirect("/onboarding");
  }
}

export default async function DashboardLayout({ children }) {
  const session = await requireUser();
  await getUser(session.user.id);

  return (
    <SidebarProvider>
      <div className="min-h-screen  relative">
        {/* Background glow effects */}

        {/* Main layout */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <Header user={session.user} />

          {/* Sidebar and main content */}
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1 w-full p-6 overflow-auto transition-all duration-300">
              {children}
            </main>
          </div>
        </div>

        <Toaster position="top-right" expand={false} />
      </div>
    </SidebarProvider>
  );
}
