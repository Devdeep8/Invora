import { SidebarProvider } from '@/components/ui/sidebar'
import { requireUser } from '@/utils/requireUser'
import { AppSidebar } from './components/app-sidebar'
import Header from './components/Header'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'

async function getUser(userId) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      FirstName: true,
      LastName: true,
      address: true,
    },
  })

  if (!data?.FirstName || !data?.LastName || !data?.address) {
    redirect('/onboarding')
  }
}

export default async function DashboardLayout({ children }) {
  const session = await requireUser()
  await getUser(session.user.id)

  return (
    <SidebarProvider>
      <div className='min-h-screen w-full flex'>
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className='flex-1 flex flex-col min-h-screen w-full'>
          {/* Header */}
          <Header user={session.user} />

          {/* Main content */}
          <main className='flex-1 w-full overflow-auto'>
            <div className='w-full h-full'>{children}</div>
          </main>
        </div>

        <Toaster position='top-right' expand={false} />
      </div>
    </SidebarProvider>
  )
}
