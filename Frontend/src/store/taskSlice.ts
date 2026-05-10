import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project: string | any;
  assignedTo?: string | any;
  dueDate?: string;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    updateTaskInState(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    setTaskLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTaskError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setTasks, 
  addTask, 
  updateTaskInState, 
  removeTask, 
  setTaskLoading, 
  setTaskError 
} = taskSlice.actions;
export default taskSlice.reducer;
