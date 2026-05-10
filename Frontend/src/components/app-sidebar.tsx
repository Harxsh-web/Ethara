"use client"

import * as React from "react"
import {
  LayoutDashboard,
  User,
  Users,
  FolderKanban,
  CheckSquare,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const { user } = useSelector((state: RootState) => state.user)

  // Dynamic Navigation based on Role
  const navigation = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderKanban,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
    },
    // Only show Users tab for Admin role
    ...(user?.role === 'admin' ? [{
      title: "Users",
      url: "/users",
      icon: Users,
    }] : []),
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group flex items-center gap-2.5 rounded-lg p-1 -ml-1 cursor-pointer"
        >
          <div className="relative">
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <FolderKanban className="h-7 w-7 text-white transition-transform sm:h-8 sm:w-8 bg-primary p-1.5 rounded-lg" />
            </motion.div>
          </div>
          {state !== "collapsed" && (
            <span className="text-xl font-bold sm:text-2xl">
              <span className="text-gray-900">Ethara</span>
              <span className="text-primary">AI</span>
            </span>
          )}
        </motion.div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name || "User",
          email: user?.email || "",
          avatar: "" // Can be updated if avatar is implemented
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
