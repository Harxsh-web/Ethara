import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { projectService } from "@/services/projectService";
import { userService } from "@/services/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  RotateCcw, 
  FolderKanban,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpDown,
  List,
  LayoutGrid,
  User,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { AddProjectSheet } from "@/pages/Projects/AddProjectSheet";

const ITEMS_PER_PAGE = 8;

export default function ProjectManagement() {
  const { user } = useSelector((state: RootState) => state.user);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [userFilter, setUserFilter] = useState<string>("all");
  
  // Server-Side Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Sheet States
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  
  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects(currentPage, ITEMS_PER_PAGE);
      if (res.success) {
        setProjects(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.total);
      } else {
        toast.error(res.error || "Failed to fetch projects");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch users for filter", error);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUser = userFilter === "all" || p.owner?._id === userFilter || p.owner === userFilter;
    return matchesSearch && matchesUser;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let valA = a[key];
    let valB = b[key];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      const res = await projectService.deleteProject(projectToDelete._id);
      if (res.success) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none font-bold">Planned</Badge>;
    }
  };

  // Pagination Range Logic
  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;
    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) range.push(i);
    }
    if (totalPages > 1) range.push(totalPages);
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
            <FolderKanban className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Projects</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Page {currentPage} of {totalPages} • {totalCount} total projects
            </p>
          </div>
        </div>
        {!isAdmin && (
          <div className="flex w-full sm:w-auto">
            <Button onClick={() => { setEditingProject(null); setIsAddProjectOpen(true); }} className="bg-primary hover:bg-primary/90 text-white shadow-sm flex-1 sm:flex-none h-9 md:h-10 text-xs md:text-sm font-semibold">
              <Plus className="mr-1.5 md:mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search Project..." 
            className="pl-10 text-sm h-10 md:h-11 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-1">
          {isAdmin && (
            <div className="w-40 sm:w-56">
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="h-10 md:h-11 bg-white border-gray-200 text-sm shadow-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {users.map(u => (
                    <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Button 
                variant="ghost" size="icon" 
                className={`h-8 w-8 md:h-9 md:w-9 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" size="icon" 
                className={`h-8 w-8 md:h-9 md:w-9 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11 text-muted-foreground hover:bg-gray-100 rounded-lg shadow-sm" onClick={fetchProjects}>
              <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'list' ? (
        <Card className="bg-white overflow-hidden border-none shadow-none rounded-none">
          <CardContent className="p-0 pb-2 overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="font-bold px-6 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">
                        Project Name <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('status')}>
                      <div className="flex items-center justify-center gap-2">
                        Status <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('createdAt')}>
                      <div className="flex items-center justify-center gap-2">
                        Created At <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-right px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="px-6"><Skeleton className="h-10 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32 mx-auto" /></TableCell>
                        <TableCell className="px-6 text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : sortedProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No projects found on this page.</TableCell>
                    </TableRow>
                  ) : (
                    sortedProjects.map((project) => (
                      <TableRow key={project._id} className="hover:bg-gray-50/50 transition-colors group">
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col max-w-[300px]">
                            <p className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate">{project.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                            {isAdmin && project.owner && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <User className="h-3 w-3 text-primary/60" />
                                <span className="text-[10px] font-bold text-primary uppercase tracking-tight">{project.owner.name || 'Unknown'}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(project.status)}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-gray-600 text-sm">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => { setEditingProject(project); setIsAddProjectOpen(true); }} className="cursor-pointer font-medium"><Edit className="mr-2 h-4 w-4" /> Edit Project</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 cursor-pointer font-medium" onClick={() => { setProjectToDelete(project); setIsDeleteDialogOpen(true); }}><Trash2 className="mr-2 h-4 w-4" /> Delete Project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
             Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border border-gray-100 shadow-sm"><CardContent className="p-6 space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-4 w-24" /></CardContent></Card>
            ))
          ) : sortedProjects.length === 0 ? (
            <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl font-medium">No projects found.</div>
          ) : (
            sortedProjects.map((project) => (
              <Card key={project._id} className="group border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden cursor-pointer flex flex-col" onClick={() => { setEditingProject(project); setIsAddProjectOpen(true); }}>
                <CardContent className="p-4 md:p-5 space-y-4 flex-1">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate text-sm md:text-base">{project.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 h-8">{project.description}</p>
                  </div>
                  {isAdmin && project.owner && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg border border-gray-100">
                      <User className="h-3.5 w-3.5 text-primary/70" />
                      <span className="text-[10px] font-bold text-gray-600 uppercase truncate">Owner: {project.owner.name}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t mt-auto flex justify-between items-center">
                    {getStatusBadge(project.status)}
                    <span className="text-[10px] md:text-[11px] font-semibold text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Premium Truncated Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 md:gap-2 pt-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border-gray-100 shadow-sm hover:bg-primary/5 hover:text-primary transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 md:gap-1.5">
            {getPaginationRange().map((page, index) => (
              page === '...' ? (
                <div key={`dots-${index}`} className="w-8 md:w-10 flex justify-center items-center text-muted-foreground">
                   <MoreHorizontal className="h-4 w-4" />
                </div>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`h-8 w-8 md:h-10 md:w-10 rounded-full font-bold transition-all border-gray-100 shadow-sm ${
                    currentPage === page 
                    ? 'bg-[#00966d] hover:bg-[#007a58] text-white shadow-md shadow-emerald-200 border-none' 
                    : 'bg-white hover:border-emerald-200 hover:bg-emerald-50 text-gray-600'
                  }`}
                >
                  {page}
                </Button>
              )
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border-gray-100 shadow-sm hover:bg-primary/5 hover:text-primary transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Sheets & Dialogs */}
      <Sheet open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <AddProjectSheet project={editingProject} onSuccess={fetchProjects} onClose={() => setIsAddProjectOpen(false)} />
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete <b>{projectToDelete?.name}</b>? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="sm:flex-1 font-semibold rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="sm:flex-1 bg-red-600 hover:bg-red-700 font-semibold rounded-xl">Delete Project</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
