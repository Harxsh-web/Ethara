import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { AddUserSheet } from "./AddUserSheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  MoreVertical, 
  Eye, 
  Trash2,
  Plus,
  Search,
  RotateCcw,
  Users,
  ArrowUpDown,
  Loader2,
  Mail,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserData | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc"
  });
  
  // States for actions
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      if (res.success) {
        setUsers(res.data);
      } else {
        toast.error(res.error || "Failed to fetch users");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      const res = await userService.deleteUser(userToDelete._id);
      if (res.success) {
        toast.success(`User ${userToDelete.name} deleted successfully`);
        setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const r = role.toLowerCase();
    if (r === "admin") return <Badge variant="destructive" className="capitalize">{role}</Badge>;
    return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 capitalize">{role}</Badge>;
  };

  const handleSort = (key: keyof UserData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key] || '';
    let bValue = b[sortConfig.key] || '';

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="md:p-4 max-w-[1600px] mx-auto space-y-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">User Management</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {filteredUsers.length} users found • {users.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            onClick={() => setIsAddUserOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-sm flex-1 md:flex-none "
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative w-full md:max-w-md group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search users..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-end gap-2 md:ml-auto">
          <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground hover:bg-gray-100 rounded-lg" onClick={fetchUsers}>
            <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card className="bg-white overflow-hidden border-none shadow-none rounded-none">
        <CardContent className="p-0 pb-2">  
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead 
                  className="font-semibold px-6 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('role')}>
                   <div className="flex items-center justify-center gap-2">
                    Role <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Joined At <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-6"><Skeleton className="h-12 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-28 mx-auto" /></TableCell>
                    <TableCell className="px-6 text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : sortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No users found.</TableCell>
                </TableRow>
              ) : (
                sortedUsers.map((user) => (
                  <TableRow 
                    key={user._id} 
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-100">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">{user.name}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={(e) => { 
                            e.stopPropagation(); 
                            setUserToDelete(user); 
                            setIsDeleteDialogOpen(true); 
                          }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete <b>{userToDelete?.name}</b>? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Sheet */}
      <Sheet open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <AddUserSheet onSuccess={fetchUsers} onClose={() => setIsAddUserOpen(false)} />
      </Sheet>
    </div>
  );
}
