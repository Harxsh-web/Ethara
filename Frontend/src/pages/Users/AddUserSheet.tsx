import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userService } from "@/services/userService";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface AddUserSheetProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AddUserSheet({ onSuccess, onClose }: AddUserSheetProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    try {
      const res = await userService.createUser(values);
      if (res.success) {
        toast.success("User created successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Failed to create user");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <SheetContent className="sm:max-w-[500px]">
      <SheetHeader className="space-y-3">
        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <SheetTitle className="text-2xl font-bold">Add New User</SheetTitle>
          <SheetDescription>
            Create a new user account and assign their access role.
          </SheetDescription>
        </div>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-8 px-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  );
}
