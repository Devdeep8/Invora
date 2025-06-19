'use client'

import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

export function NavMain({ items }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          // Determine if the main item or any of its sub-items is active
          const isActive =
            pathname === item.url ||
            (item.items && item.items.some(sub => pathname === sub.url))

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive || item.isActive}
            >
              <SidebarMenuItem
                className={`${isActive ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
              >
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a
                    href={item.url}
                    className={`flex items-center gap-2 ${
                      isActive ? 'font-bold' : ''
                    }`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className='data-[state=open]:rotate-90'>
                        <ChevronRight />
                        <span className='sr-only'>Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map(subItem => {
                          const subActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className={`${
                                subActive
                                  ? 'bg-primary text-primary-foreground'
                                  : ''
                              }`}
                            >
                              <SidebarMenuSubButton asChild>
                                <a
                                  href={subItem.url}
                                  className={`flex items-center gap-2 ${
                                    subActive ? 'font-bold' : ''
                                  }`}
                                >
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
