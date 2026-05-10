import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users as UsersIcon,
  TrendingUp,
  Plus,
  User as UserIcon,
  ShieldCheck,
  Activity,
  Timer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/services/dashboardService";
import { useNavigate } from "react-router-dom";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export function UserDashboard() {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48 md:w-64" />
          <Skeleton className="h-10 w-24 md:w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-[300px] md:h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const trendData = stats?.trendData || [];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-primary">
            {isAdmin ? <Activity className="h-5 w-5 md:h-6 md:w-6" /> : <LayoutDashboard className="h-5 w-5 md:h-6 md:w-6" />}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {isAdmin ? "Admin Overview" : `Welcome, ${user?.name?.split(' ')[0]}`}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium truncate max-w-[200px] md:max-w-none">
              {isAdmin ? "Platform performance metrics." : "Your personal productivity summary."}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => navigate("/tasks")} variant="outline" className="shadow-sm font-semibold flex-1 sm:flex-none h-9 md:h-10 text-xs md:text-sm">
            Tasks
          </Button>
          <Button onClick={() => navigate("/projects")} className="bg-primary text-white shadow-sm font-semibold flex-1 sm:flex-none h-9 md:h-10 text-xs md:text-sm">
            <Plus className="mr-1.5 md:mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      {/* 4-Column Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title={isAdmin ? "Total Projects" : "My Projects"} 
          value={stats?.totalProjects} 
          icon={FolderKanban} 
          color="text-blue-600" 
          bg="bg-blue-100" 
          desc="Overall project count"
          onClick={() => navigate("/projects")}
        />
        <StatCard 
          title="Todo Tasks" 
          value={stats?.pendingTasks} 
          icon={CheckSquare} 
          color="text-gray-600" 
          bg="bg-gray-100" 
          desc="Tasks not started"
          onClick={() => navigate("/tasks")}
        />
        <StatCard 
          title="In Progress" 
          value={stats?.inProgressTasks} 
          icon={Timer} 
          color="text-amber-600" 
          bg="bg-amber-100" 
          desc="Currently active tasks"
          onClick={() => navigate("/tasks")}
        />
        <StatCard 
          title="Completed" 
          value={stats?.completedTasks} 
          icon={TrendingUp} 
          color="text-green-600" 
          bg="bg-green-100" 
          desc="Success stories"
          onClick={() => navigate("/tasks")}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
         <Card className="lg:col-span-2  min-h-[350px] md:h-[400px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" /> {isAdmin ? "Platform Trends" : "Activity Trends"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[300px] px-2 md:px-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorPrimary)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
         </Card>
         <Card className=" flex flex-col">
            <CardHeader><CardTitle className="text-base md:text-lg font-bold">{isAdmin ? "Admin Controls" : "Workspace"}</CardTitle></CardHeader>
            <CardContent className="space-y-3 md:space-y-4 flex-1">
              {isAdmin ? (
                <>
                  <QuickActionButton icon={UsersIcon} label="Manage Users" onClick={() => navigate("/users")} />
                  <QuickActionButton icon={FolderKanban} label="Manage Projects" onClick={() => navigate("/projects")} />
                </>
              ) : (
                <>
                  <QuickActionButton icon={UserIcon} label="My Profile" onClick={() => navigate("/profile")} />
                  <QuickActionButton icon={CheckSquare} label="My Worklist" onClick={() => navigate("/tasks")} />
                  <QuickActionButton icon={FolderKanban} label="All Projects" onClick={() => navigate("/projects")} />
                </>
              )}
              
              <div className="pt-4 mt-auto border-t">
                <div className="flex items-center gap-3 p-3 md:p-4 bg-primary/5 rounded-xl text-primary border border-primary/10">
                  <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase truncate">{user?.role} Level Access</p>
                    <p className="text-[9px] md:text-[10px] opacity-80 font-bold uppercase tracking-tight">Authenticated</p>
                  </div>
                </div>
              </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, desc, onClick }: any) {
  return (
    <Card className=" transition-all cursor-pointer overflow-hidden group hover:-translate-y-1 active:scale-[0.98]" onClick={onClick}>
      <CardContent className="px-4 md:px-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1 md:space-y-2">
            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value || 0}</h3>
          </div>
          <div className={`p-2.5 md:p-3 rounded-xl ${bg} ${color} group-hover:rotate-6 transition-transform`}>
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
        <p className="text-[9px] md:text-[10px] text-muted-foreground mt-3 md:mt-4 font-bold uppercase tracking-tight flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> {desc}
        </p>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }: any) {
  return (
    <Button 
      variant="outline" 
      className="w-full justify-start h-10 md:h-12 text-xs md:text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all border-dashed group" 
      onClick={onClick}
    >
      <Icon className="mr-2 md:mr-3 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground group-hover:text-primary transition-colors" /> 
      {label}
    </Button>
  );
}
