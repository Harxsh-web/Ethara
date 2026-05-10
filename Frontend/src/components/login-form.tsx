import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import type { AppDispatch } from "@/store";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";

// Single unified schema
const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => {
  // We'll handle custom registration validation inside the submit handler 
  // or use a more complex refinement if needed.
  return true;
}, {});

type AuthFormValues = z.infer<typeof authSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    // Manual check for name when registering
    if (isRegister && (!values.name || values.name.length < 2)) {
      form.setError("name", { message: "Name must be at least 2 characters" });
      return;
    }

    setLoading(true);
    try {
      const res = isRegister 
        ? await authService.register({ name: values.name!, email: values.email, password: values.password })
        : await authService.login({ email: values.email, password: values.password });

      if (res.success) {
        toast.success(isRegister ? "Registration successful!" : "Login successful!");
        
        if (res.token) {
          localStorage.setItem("token", res.token);
          const profileRes = await authService.getMe();
          if (profileRes.success) {
            dispatch(setUser({
              user: profileRes.data,
              token: res.token
            }));
            navigate("/");
          }
        }
      } else {
        toast.error(res.error || "Authentication failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isRegister ? "Fill in your details to get started" : "Enter your credentials to access your account"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="John Doe" className="pl-10 h-11" {...field} disabled={loading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="name@example.com" type="email" className="pl-10 h-11" {...field} disabled={loading} />
                  </div>
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"} 
                      className="pl-10 pr-10 h-11" 
                      {...field} 
                      disabled={loading} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              isRegister ? "Sign Up" : "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            type="button" 
            onClick={() => {
              setIsRegister(!isRegister);
              form.reset();
            }}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
