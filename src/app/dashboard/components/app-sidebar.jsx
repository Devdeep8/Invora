'use client'

import * as React from 'react'
import { Bot, Command, SquareTerminal } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { NavUser } from './user-nav'
import { NavMain } from './nav-main'
import { useSession } from 'next-auth/react'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: SquareTerminal,
      isActive: true,
      items: [],
    },
    {
      title: 'Inovice',
      url: '/dashboard/invoice',
      icon: Bot,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const { data: session } = useSession()

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        // Use session.user.image if available; fallback to static avatar.
      }
    : data.user

  return (
    // <SidebarProvider>

    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Invora Inc</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
    // </SidebarProvider>
  )
}
