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
import { Loader2, UserCog } from "lucide-react";

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["user", "admin"]),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserSheetProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  onSuccess: (updatedUser: any) => void;
  onClose: () => void;
}

export function EditUserSheet({ user, onSuccess, onClose }: EditUserSheetProps) {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role as any,
    },
  });

  const onSubmit = async (values: EditUserFormValues) => {
    try {
      const res = await userService.updateUser(user._id, values);
      if (res.success) {
        toast.success("User updated successfully");
        onSuccess(res.data);
        onClose();
      } else {
        toast.error(res.error || "Failed to update user");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <SheetContent className="sm:max-w-[500px]">
      <SheetHeader className="space-y-3">
        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <UserCog className="h-6 w-6 text-primary" />
        </div>
        <div>
          <SheetTitle className="text-2xl font-bold">Edit User</SheetTitle>
          <SheetDescription>
            Modify user profile information and system permissions.
          </SheetDescription>
        </div>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  );
}
