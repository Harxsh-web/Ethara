import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { taskService } from "@/services/taskService";
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
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  project: z.string().min(1, "Please select a project"),
  dueDate: z.date().optional(),
});

interface AddTaskSheetProps {
  task?: any | null;
  projects: any[];
  onSuccess: () => void;
  onClose: () => void;
}

export function AddTaskSheet({ task, projects, onSuccess, onClose }: AddTaskSheetProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      project: "",
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        project: task.project?._id || task.project,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        project: projects.length > 0 ? projects[0]._id : "",
        dueDate: undefined,
      });
    }
  }, [task, projects, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let res;
      if (task) {
        res = await taskService.updateTask(task._id, values);
      } else {
        res = await taskService.createTask(values);
      }

      if (res.success) {
        toast.success(task ? "Task updated" : "Task created");
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
        <SheetTitle>{task ? "Edit Task" : "Add New Task"}</SheetTitle>
        <SheetDescription>
          {task ? "Update task details below." : "Fill in the details to create a new task."}
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!!task}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
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
                    placeholder="Enter task description" 
                    className="resize-none h-24" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
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
                task ? "Update Task" : "Create Task"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  );
}
