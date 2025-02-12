'use client'
import { ChevronUp } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'

export function SidebarUserNav({
  user
}: {
  user: {
    email: string
    image: string
  }
}) {
  const { setTheme, theme } = useTheme()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className='data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10'>
              <Image
                src={user.image}
                alt={user.email ?? 'User Avatar'}
                width={24}
                height={24}
                className='rounded-full'
              />
              <span className='truncate'>{user.email}</span>
              <ChevronUp className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side='top'
            className='w-[--radix-popper-anchor-width]'
          >
            <DropdownMenuItem
              className='cursor-pointer'
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Trocar Tema: ${theme === 'light' ? 'Escuro' : 'Claro'}`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='w-full cursor-pointer' asChild>
              <Link href={'/profile'}>Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='w-full cursor-pointer' asChild>
              <SignOutButton>Sair</SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
