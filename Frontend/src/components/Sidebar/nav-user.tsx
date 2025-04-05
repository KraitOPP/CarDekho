"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useDispatch } from "react-redux"
import { logout } from "@/slices/authSlice"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"
import { Button } from "../ui/button"

type User = {
  name: string
  email: string
  avatar: string
}

export function NavUser({
  user,
}: {
  user?: User
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile } = useSidebar()

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/");
  }

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-4">
            <Link to="/accounts/sign-in" replace={true}>
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/accounts/sign-up" replace={true}>
              <Button>Register</Button>
            </Link>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {user.name.toUpperCase().charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.name.toUpperCase().charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={'/u/profile'}>
              <DropdownMenuItem>
                <BadgeCheck />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Button className="bg-white hover:bg-white text-black" onClick={handleLogout}>
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
