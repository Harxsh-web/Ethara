import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar,
  ChevronLeft,
  UserCheck,
  Shield,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet } from "@/components/ui/sheet";
import { EditUserSheet } from "./EditUserSheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  
  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchUserDetails(id);
  }, [id]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      const res = await userService.getUser(userId);
      if (res.success) {
        setUser(res.data);
      } else {
        toast.error(res.error || "User not found");
        navigate("/users");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user details");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      setIsDeleting(true);
      const res = await userService.deleteUser(user._id);
      if (res.success) {
        toast.success(`User ${user.name} deleted successfully`);
        navigate("/users");
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditSuccess = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-4 md:p-6 mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/users">User Management</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{user.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/users")} className="-ml-2 text-muted-foreground hover:text-primary p-0 h-auto sm:h-9 sm:px-4 sm:py-2">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Users
        </Button>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
          </Button>
          <Button 
            className="bg-primary text-white flex-1 sm:flex-none"
            onClick={() => setIsEditSheetOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 ">
          <CardContent className=" pt-8 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <div className="mt-2 flex flex-col items-center gap-2">
              <Badge variant="secondary" className="px-3 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-none uppercase">
                {user.role}
              </Badge>
            </div>
            
            <Separator className="my-6" />
            
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg"><Mail className="h-4 w-4 text-muted-foreground" /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg"><Shield className="h-4 w-4 text-muted-foreground" /></div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Access Role</p>
                  <p className="text-sm font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b bg-gray-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">General Information</h4>
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="font-mono font-bold text-primary">#{user._id}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">System Role</span>
                      <Badge className={user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500 capitalize'}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Timeline</h4>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Account Created</p>
                      <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <EditUserSheet 
          user={user} 
          onSuccess={handleEditSuccess} 
          onClose={() => setIsEditSheetOpen(false)} 
        />
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account of <b>{user.name}</b> and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
