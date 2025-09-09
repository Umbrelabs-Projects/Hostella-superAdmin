import { Sidebar } from 'lucide-react'
import React from 'react'
import { SidebarHeader } from '../ui/sidebar'
import Image from 'next/image'

export default function AppSidebar() {
  return (
   <Sidebar>
    <SidebarHeader className='px-8 p-5 h-15 bg-white'>
         <Image src={"/assets/svgs/logo.svg"} width={80} height={25} alt="Hostella" />
    </SidebarHeader>
   </Sidebar>
  )
}
