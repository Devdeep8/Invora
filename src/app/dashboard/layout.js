import { SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "../utils/requireUser";
import { AppSidebar } from "./components/app-sidebar";
import Header from "./components/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";



async function getUser(userId) {
  const data =  await prisma.user.findUnique({
    where:{
      id : userId,
    },
    select : {
      FirstName : true,
      LastName : true,
      address : true,
    }
  })
  if(!data.FirstName  || !data.LastName || !data.address){
    redirect("/onboarding")
  }
}

export default async function DashboardLayout({ children }) {
  const session = await requireUser();
  const data = await getUser(session?.user?.id)
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen overflow-x-hidden">
        {/* Header at the top */}
        <Header />

        {/* Main content area with sidebar on the left */}
        <div className="flex flex-1">
          <div className="w-64">
            <AppSidebar />
          </div>
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>
      <Toaster position="top-right"  expand={false} />
      </SidebarProvider>
  );
}
