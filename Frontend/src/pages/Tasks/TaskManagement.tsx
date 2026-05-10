import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { taskService } from "@/services/taskService";
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
  CheckSquare,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpDown,
  User,
  Layout,
  CheckCircle2,
  Circle,
  Timer,
  Filter,
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
import { Sheet } from "@/components/ui/sheet";
import { AddTaskSheet } from "@/pages/Tasks/AddTaskSheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

export default function TaskManagement() {
  const { user } = useSelector((state: RootState) => state.user);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Server-Side Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Sheet States
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  
  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  useEffect(() => {
    fetchMetadata();
  }, [isAdmin]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks(currentPage, ITEMS_PER_PAGE);
      if (res.success) {
        setTasks(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.total);
      } else {
        toast.error(res.error || "Failed to fetch tasks");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        projectService.getProjects(1, 100),
        isAdmin ? userService.getAllUsers() : Promise.resolve({ success: true, data: [] })
      ]);
      
      if (projRes.success) setProjects(projRes.data);
      if (isAdmin && userRes.success) setUsers(userRes.data);
    } catch (error) {
      console.error("Failed to fetch metadata", error);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleToggleStatus = async (task: any) => {
    let newStatus = 'todo';
    if (task.status === 'todo') newStatus = 'in-progress';
    else if (task.status === 'in-progress') newStatus = 'done';
    else newStatus = 'todo';

    try {
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
      const res = await taskService.updateTask(task._id, { status: newStatus });
      if (!res.success) {
        setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: task.status } : t));
        toast.error("Failed to update status");
      } else {
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: task.status } : t));
      toast.error("An error occurred");
    }
  };

  const availableProjects = isAdmin && selectedUser !== "all" 
    ? projects.filter(p => p.owner?._id === selectedUser || p.owner === selectedUser)
    : projects;

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
    
    if (isAdmin) {
      const matchesUser = selectedUser === "all" || t.project?.owner === selectedUser || t.project?.owner?._id === selectedUser;
      const matchesProject = selectedProject === "all" || t.project?._id === selectedProject;
      return matchesSearch && matchesUser && matchesProject && matchesStatus;
    }

    const matchesProject = selectedProject === "all" || t.project?._id === selectedProject;
    return matchesSearch && matchesProject && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let valA = a[key];
    let valB = b[key];

    if (key === 'project') {
      valA = a.project?.name || '';
      valB = b.project?.name || '';
    }

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const res = await taskService.deleteTask(taskToDelete._id);
      if (res.success) {
        toast.success("Task deleted successfully");
        fetchTasks();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">Done</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none font-bold">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none font-bold">Todo</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none font-bold">Medium</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-green-600 fill-green-50" />;
      case 'in-progress':
        return <Timer className="h-5 w-5 text-amber-600 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
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
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    if (totalPages > 1) range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
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
            <CheckSquare className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Tasks</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
               Page {currentPage} of {totalPages} • {totalCount} total tasks
            </p>
          </div>
        </div>
        {!isAdmin && (
          <div className="flex w-full sm:w-auto">
            <Button 
              disabled={projects.length === 0}
              onClick={() => { setEditingTask(null); setIsAddTaskOpen(true); }} 
              className="bg-primary hover:bg-primary/90 text-white shadow-sm flex-1 sm:flex-none h-9 md:h-10 text-xs md:text-sm font-semibold"
            >
              <Plus className="mr-1.5 md:mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search Task..." 
            className="pl-10 text-sm h-10 md:h-11 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-32 sm:w-44">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 md:h-11 bg-white border-gray-200 text-sm shadow-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isAdmin && (
              <div className="w-32 sm:w-48">
                <Select value={selectedUser} onValueChange={(val) => {
                  setSelectedUser(val);
                  setSelectedProject("all");
                }}>
                  <SelectTrigger className="h-10 md:h-11 bg-white border-gray-200 text-sm shadow-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="User" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map(u => (
                      <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="w-32 sm:w-48">
              <Select 
                value={selectedProject} 
                onValueChange={setSelectedProject}
                disabled={isAdmin && selectedUser === "all"}
              >
                <SelectTrigger className="h-10 md:h-11 bg-white border-gray-200 text-sm shadow-sm">
                  <div className="flex items-center gap-2">
                     <Layout className="h-3.5 w-3.5 text-muted-foreground" />
                     <SelectValue placeholder="Project" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {availableProjects.map(p => (
                    <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center ml-auto">
            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11 text-muted-foreground hover:bg-gray-100 rounded-lg shadow-sm" onClick={fetchTasks}>
              <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-white overflow-hidden border-none shadow-none rounded-none">
        <CardContent className="p-0 pb-2 overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="font-bold px-6 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-2">
                      Task Title <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('project')}>
                    <div className="flex items-center justify-center gap-2">
                      Project <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center justify-center gap-2">
                      Status <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('priority')}>
                    <div className="flex items-center justify-center gap-2">
                      Priority <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('dueDate')}>
                    <div className="flex items-center justify-center gap-2">
                      Due Date <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell></TableCell>
                      <TableCell className="px-6"><Skeleton className="h-10 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                      <TableCell className="px-6 text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : sortedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">No tasks found on this page.</TableCell>
                  </TableRow>
                ) : (
                  sortedTasks.map((task) => (
                    <TableRow key={task._id} className={`hover:bg-gray-50/50 transition-colors group ${task.status === 'done' ? 'bg-gray-50/30' : ''}`}>
                      <TableCell className="pl-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-primary/5 transition-colors"
                          onClick={() => handleToggleStatus(task)}
                        >
                          {getStatusIcon(task.status)}
                        </Button>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="max-w-[250px]">
                          <p className={`font-bold text-gray-900 group-hover:text-primary transition-all text-sm ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                            {task.title}
                          </p>
                          <p className={`text-xs text-muted-foreground line-clamp-1 ${task.status === 'done' ? 'opacity-50' : ''}`}>
                            {task.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                         <div className="flex flex-col items-center">
                            <span className={`font-bold text-gray-700 text-sm truncate max-w-[150px] ${task.status === 'done' ? 'opacity-50' : ''}`}>
                              {task.project?.name || "N/A"}
                            </span>
                            {isAdmin && task.project?.owner && (
                              <div className="flex items-center gap-1 mt-1">
                                 <User className="h-2.5 w-2.5 text-primary/60" />
                                 <span className="text-[9px] font-bold text-primary uppercase tracking-tight">{task.project.owner.name || task.project.owner}</span>
                              </div>
                            )}
                         </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(task.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getPriorityBadge(task.priority)}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-600 text-sm">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => { setEditingTask(task); setIsAddTaskOpen(true); }} className="cursor-pointer font-medium">
                              <Edit className="mr-2 h-4 w-4" /> Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer font-medium" onClick={() => { setTaskToDelete(task); setIsDeleteDialogOpen(true); }}>
                              <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete Task
                            </DropdownMenuItem>
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
      <Sheet open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <AddTaskSheet 
          task={editingTask} 
          projects={projects}
          onSuccess={fetchTasks} 
          onClose={() => setIsAddTaskOpen(false)} 
        />
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Task?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete <b>{taskToDelete?.title}</b>? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="sm:flex-1 font-semibold rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="sm:flex-1 bg-red-600 hover:bg-red-700 font-semibold rounded-xl">Delete Task</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
