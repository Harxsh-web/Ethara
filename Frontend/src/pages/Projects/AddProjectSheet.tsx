import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { projectService } from "@/services/projectService";
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
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["planned", "in-progress", "completed"]),
});

interface AddProjectSheetProps {
  project?: any | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function AddProjectSheet({ project, onSuccess, onClose }: AddProjectSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "planned",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description,
        status: project.status,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        status: "planned",
      });
    }
  }, [project, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let res;
      if (project) {
        res = await projectService.updateProject(project._id, values);
      } else {
        res = await projectService.createProject(values);
      }

      if (res.success) {
        toast.success(project ? "Project updated" : "Project created");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  }

  return (
    <SheetContent className="sm:max-w-[500px]">
      <SheetHeader className="mb-6">
        <SheetTitle>{project ? "Edit Project" : "Add New Project"}</SheetTitle>
        <SheetDescription>
          {project ? "Update project details below." : "Fill in the details to create a new project."}
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter project description" 
                    className="resize-none h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
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
                project ? "Update Project" : "Create Project"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  );
}
