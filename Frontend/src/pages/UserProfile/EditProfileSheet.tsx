import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userService } from "@/services/userService";
import { useDispatch } from "react-redux";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setUser } from "@/store/userSlice";
import { IconUserEdit } from "@tabler/icons-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileSheetProps {
  user: {
    name: string;
    email: string;
  };
  onSuccess: (updatedUser: any) => void;
  onClose: () => void;
}

export function EditProfileSheet({ user, onSuccess, onClose }: EditProfileSheetProps) {
  const dispatch = useDispatch();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const res = await userService.updateProfile(values);
      if (res.success) {
        toast.success("Profile updated successfully");
        // Update local state and global store
        dispatch(setUser(res.data));
        onSuccess(res.data);
        onClose();
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <SheetContent className="sm:max-w-[500px]">
      <SheetHeader className="space-y-3">
        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <IconUserEdit className="h-6 w-6 text-primary" />
        </div>
        <div>
          <SheetTitle className="text-2xl font-bold">Edit Profile</SheetTitle>
          <SheetDescription>
            Update your personal information. Changes will be reflected across your account.
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
                  <Input placeholder="Enter your name" {...field} />
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
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
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
                  Updating...
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


