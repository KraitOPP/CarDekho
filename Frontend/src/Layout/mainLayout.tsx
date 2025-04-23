import { Outlet, useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { toast, Toaster } from "sonner"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/slices/authSlice"

export default function MainLayout(){
  const navigate = useNavigate();
  const userInfo = useSelector(selectUser);
  const pathUrl = window.location.pathname;
  useEffect(() => {
      if ((pathUrl.startsWith('/dashboard') && (!userInfo || userInfo.role !== "admin")) || (pathUrl.startsWith('/u') && !userInfo)){
          toast.warning("Unauthorized Access");
          navigate('/', { replace: true });
      }
  }, [userInfo, navigate]);

  return (
   <>
    <Toaster />
     <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
   </>
  )
}
