import { useEffect, useState } from "react";
import { auditService } from "@/services/auditService";
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
  ClipboardList, 
  RotateCcw,
  Search,
  ArrowUpDown,
  Calendar,
  User,
  Activity,
  Terminal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AuditLogData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const fetchLogs = async (page: number) => {
    try {
      setLoading(true);
      const res = await auditService.getAllLogs(page);
      if (res.success) {
        setLogs(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalLogs(res.total);
      } else {
        toast.error(res.error || "Failed to fetch audit logs");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while fetching logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const a = action.toUpperCase();
    if (a.includes('CREATE')) return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">CREATE</Badge>;
    if (a.includes('UPDATE')) return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">UPDATE</Badge>;
    if (a.includes('DELETE')) return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">DELETE</Badge>;
    if (a.includes('LOGIN')) return <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">LOGIN</Badge>;
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">{a}</Badge>;
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="md:p-4 max-w-[1600px] mx-auto space-y-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Audit Logs</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Track all administrative and system activities
            </p>
          </div>
        </div>
        <div className="bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
          <span className="text-sm font-semibold text-primary">{totalLogs} Total Activities</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative w-full md:max-w-md group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search activity, user or resource..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-end gap-2 md:ml-auto">
          <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground hover:bg-gray-100 rounded-lg" onClick={() => fetchLogs(currentPage)}>
            <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card className="bg-white overflow-hidden border-none shadow-none rounded-none">
        <CardContent className="p-0 pb-2">  
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="font-semibold px-6 w-[250px]">User</TableHead>
                <TableHead className="font-semibold text-center w-[150px]">Action</TableHead>
                <TableHead className="font-semibold text-center w-[150px]">Resource</TableHead>
                <TableHead className="font-semibold px-6">Details</TableHead>
                <TableHead className="font-semibold text-right px-6 w-[200px]">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-6"><Skeleton className="h-12 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                    <TableCell className="px-6"><Skeleton className="h-6 w-full" /></TableCell>
                    <TableCell className="px-6 text-right"><Skeleton className="h-6 w-32 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">No activities found.</TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow 
                    key={log._id} 
                    className="hover:bg-gray-50/50 transition-colors group cursor-default"
                  >
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-gray-100 shadow-sm">
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                            {log.user?.name?.substring(0, 2) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-900 group-hover:text-primary transition-colors text-sm">{log.user?.name || "System"}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Activity className="h-2.5 w-2.5" /> {log.ipAddress || "0.0.0.0"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getActionBadge(log.action)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded text-gray-700">{log.resource}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{log.resourceId?.substring(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-start gap-2 max-w-[400px]">
                        <Terminal className="h-3.5 w-3.5 mt-1 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-gray-600 font-mono line-clamp-2">
                          {log.details ? JSON.stringify(log.details) : "No extra details"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(log.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4 border-t border-gray-100 bg-gray-50/30 rounded-b-xl">
        <p className="text-xs text-muted-foreground font-medium">
          Showing <span className="text-gray-900 font-bold">{filteredLogs.length}</span> of <span className="text-gray-900 font-bold">{totalLogs}</span> activities
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-4 rounded-lg"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center justify-center min-w-[80px]">
            <span className="text-xs font-bold text-gray-900">Page {currentPage} of {totalPages}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-4 rounded-lg"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
