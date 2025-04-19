import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Command,
  User,
  HomeIcon,
  LifeBuoy,
  PlusCircle,
  Edit,
  Folder,
  type LucideIcon,
  AlignEndHorizontal,
  Car,
  MessageCircle,
  ReceiptIndianRupeeIcon,
  UserSearchIcon,
  ContactRoundIcon,
  MailQuestion,
  LogIn,
  UserPlus,
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
import { selectUser } from "@/slices/authSlice"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"

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
  const userInfo = useSelector(selectUser)
  
  // Check if user is authenticated and has admin role
  const isAuthenticated = !!userInfo
  const isAdmin = isAuthenticated && userInfo.role === "admin"

  React.useEffect(() => {
    if (location.pathname.startsWith("/u/")) {
      setExpandedMenus((prev) => ({ ...prev, Profile: true }))
    }
  }, [location])

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }))
  }

  // Prepare navigation data with conditional items
  const navMainItems = [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
      isActive: true,
    }
  ]
  
  // Only add Profile section if user is authenticated
  if (isAuthenticated) {
    navMainItems.push({
      title: "Profile",
      url: "/u/profile",
      icon: User,
      items: [
        {
          title: "View Profile",
          url: "/u/profile",
        },
        {
          title: "Booking History",
          url: "/u/booking-history",
        },
      ],
    })
  }
  
  // Dashboard items that will only be shown to admin users
  const dashboardItems = isAdmin ? [
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
          label: "Add New Model",
          icon: PlusCircle,
          onClick: () => navigate("/dashboard/vehicle-model")
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
      name: "Contact Management",
      url: "/dashboard/contact-us/query",
      icon: ContactRoundIcon,
      dropdownItems: [
        {
          label: "Query Management",
          icon: MailQuestion,
          onClick: () => navigate("/dashboard/contact-us/query")
        },
        {
          label: "Contact Details Update",
          icon: Edit,
          onClick: () => navigate("/dashboard/contact-us/edit")
        },
      ]
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
  ] : []

  const navSecondaryItems = [
    {
      title: "Support",
      url: "/contact-us",
      icon: LifeBuoy,
    },
  ]

  const AuthButtons = () => {
    if (isAuthenticated) return null;
    
    return (
      <div className="px-2 py-4 space-y-2">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate("/accounts/sign-in")}
        >
          <LogIn className="size-4" />
          Sign In
        </Button>
        <Button 
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate("/accounts/sign-up")}
        >
          <UserPlus className="size-4" />
          Sign Up
        </Button>
      </div>
    );
  };

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
        <NavMain items={navMainItems} expandedMenus={expandedMenus} onToggle={toggleMenu} />
        {isAdmin && <NavProjects projects={dashboardItems} />}
        {!isAuthenticated && <AuthButtons />}
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondaryItems} />
        {isAuthenticated ? (
          <NavUser user={userInfo} />
        ) : (
          <div className="px-2 py-2 text-xs text-muted-foreground text-center">
            Sign in to access all features
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}