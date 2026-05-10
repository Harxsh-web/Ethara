import { ChevronRight, type LucideIcon } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()
  const { setOpenMobile, isMobile } = useSidebar()

  const isItemActive = (url: string) => {
    if (url === "/" && location.pathname !== "/") return false
    return location.pathname.startsWith(url)
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item.url)
          
          return item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={active}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    isActive={active}
                    className={active ? "!bg-primary !text-white hover:!bg-primary/90 data-[state=open]:!bg-primary transition-colors shadow-sm shadow-primary/20" : ""}
                  >
                    {item.icon && <item.icon />}
                    <span className={active ? "font-bold" : ""}>{item.title}</span>
                    <ChevronRight className={cn("ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90", active && "text-white")} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={location.pathname === subItem.url}
                          className={location.pathname === subItem.url ? "!bg-primary !text-white hover:!bg-primary/90 transition-colors font-bold shadow-sm shadow-primary/20" : ""}
                          onClick={handleLinkClick}
                        >
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={active} 
                tooltip={item.title}
                className={active ? "!bg-primary !text-white hover:!bg-primary/90  " : ""}
                onClick={handleLinkClick}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span className={active ? "" : ""}>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
