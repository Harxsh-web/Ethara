import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { 
  Mail, 
  ShieldCheck, 
  Clock, 
  Calendar,
  User,
  Shield,
  Fingerprint,
  Edit3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet } from "@/components/ui/sheet";
import { EditProfileSheet } from "./EditProfileSheet";

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      
      if (res.success && res.data) {
        setProfile(res.data);
      } else {
        toast.error(res.error || "Failed to fetch profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedUser: ProfileData) => {
    setProfile(updatedUser);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-10 w-48 md:w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] md:col-span-2 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;
  
  return (
    <div className="p-4 md:p-6 mx-auto space-y-6 max-w-[1200px]">
      {/* Header - Stackable */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
            <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">My Profile</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Manage your personal information</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsEditSheetOpen(true)}
          className="bg-primary text-white shadow-sm hover:bg-primary/90 font-semibold w-full sm:w-auto h-9 md:h-10 text-xs md:text-sm"
        >
          <Edit3 className="mr-1.5 md:mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 mb-4 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl md:text-2xl font-bold">
                {profile.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate max-w-full px-4">{profile.name}</h2>
            <div className="mt-2 flex flex-col items-center gap-2">
              <Badge variant="secondary" className="px-3 py-0.5 text-[10px] md:text-xs font-bold bg-primary/10 text-primary border-none uppercase tracking-wide">
                {profile.role}
              </Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold border bg-green-50 text-green-700 border-green-200">
                <ShieldCheck className="h-3 w-3" />
                ACTIVE ACCOUNT
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="w-full space-y-5 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Mail className="h-4 w-4 text-primary/70" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Primary Email</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{profile.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Info Card */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="border-b bg-gray-50/30">
            <CardTitle className="text-base md:text-lg font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Security & Account Meta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100/50">
                  <div className="flex items-center gap-2 text-gray-400 mb-1.5">
                    <Fingerprint className="h-3.5 w-3.5" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Internal User ID</span>
                  </div>
                  <p className="text-xs md:text-sm font-mono font-bold text-primary truncate">#{profile._id}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Access Privilege</span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold capitalize text-gray-900">{profile.role} Level Access</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Registration Date</span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Profile Status</span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-green-600">Verified & Secure</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <EditProfileSheet 
          user={profile}
          onSuccess={handleUpdateSuccess}
          onClose={() => setIsEditSheetOpen(false)}
        />
      </Sheet>
    </div>
  );
}