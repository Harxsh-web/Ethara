import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LogOut, User, Loader2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { clearUser } from "@/store/userSlice"
import { apiCall } from "@/lib/api"
import { API_ROUTES } from "@/constants/apiRoutes"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true);
      const res = await apiCall(API_ROUTES.AUTH.LOGOUT, "POST");
      
      // Always clear user in Redux and localStorage
      dispatch(clearUser());
      
      if (res.status) {
        toast.success(res.message || "Logged out successfully");
        navigate("/signin");
      } else {
        toast.error(res.message || "Logout failed");
        navigate("/signin"); // Still redirect even if API status is false
      }
    } catch (error: any) {
      dispatch(clearUser());
      toast.success("Logged out");
      navigate("/signin");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-12 items-center border-b px-4">
          <SidebarTrigger />
          <h1 className="ml-4 font-semibold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            
          
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 border-none bg-transparent shadow-none hover:text-red-600">
                  <LogOut className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the login page and will need to sign in again to access your dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLogoutLoading}>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isLogoutLoading}
                  >
                    {isLogoutLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

        </header>

        {/* Page Content */}
        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
