import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Command,
  Frame,
  Map,
  PieChart,
  User,
  HomeIcon,
  LifeBuoy,
  PlusCircle,
  Edit,
  Folder,
  MoreHorizontal,
  type LucideIcon,
  AlignEndHorizontal,
  Car,
  MessageCircle,
  ReceiptIndianRupeeIcon,
  UserSearchIcon,
} from "lucide-react"

import { NavMain } from "@/components/Sidebar/nav-main"
import { NavProjects } from "@/components/Sidebar/nav-projects"
import { NavUser } from "@/components/Sidebar/nav-user"
import { NavSecondary } from "@/components/Sidebar/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type DropdownItem = {
  label: string
  icon: LucideIcon
  onClick?: () => void
}

type ProjectItem = {
  name: string
  url: string
  icon: LucideIcon
  dropdownItems?: DropdownItem[]
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const [expandedMenus, setExpandedMenus] = React.useState<{ [key: string]: boolean }>({})
  const location = useLocation()

  React.useEffect(() => {
    if (location.pathname.startsWith("/u/profile")) {
      setExpandedMenus((prev) => ({ ...prev, Profile: true }))
    }
  }, [location])

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }))
  }

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: HomeIcon,
        isActive: true,
      },
      {
        title: "Profile",
        url: "/u/profile",
        icon: User,
        items: [
          {
            title: "View Profile",
            url: "/u/profile",
          },
          {
            title: "Settings",
            url: "/u/settings",
          },
        ],
      },
    ],
    Dashboard: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: AlignEndHorizontal,
      },
      {
        name: "Vehicle Management",
        url: "/dashboard/vehicle",
        icon: Car,
        dropdownItems: [
          {
            label: "Add Vehicle",
            icon: PlusCircle,
            onClick: () => navigate("/dashboard/vehicle")
          },
          {
            label: "Manage Brands",
            icon: Edit,
            onClick: () => navigate("/dashboard/vehicle/brands")
          },
          {
            label: "View All Vehicles",
            icon: Folder,
            onClick: () => navigate("/")
          }
        ]
      },
      {
        name: "Booking Management",
        url: "/dashboard/booking",
        icon: ReceiptIndianRupeeIcon
      },
      {
        name: "User Management",
        url: "/dashboard/users",
        icon: UserSearchIcon
      },
      {
        name: "Testimonial Management",
        url: "/dashboard/testimonial",
        icon: MessageCircle
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "/contact-us",
        icon: LifeBuoy,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CarDekho</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} expandedMenus={expandedMenus} onToggle={toggleMenu} />
        <NavProjects projects={data.Dashboard} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}