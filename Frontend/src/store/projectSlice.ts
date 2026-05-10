import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  owner: string | any;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
    updateProjectInState(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter(p => p._id !== action.payload);
    },
    setProjectLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProjectError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setProjects, 
  addProject, 
  updateProjectInState, 
  removeProject, 
  setProjectLoading, 
  setProjectError 
} = projectSlice.actions;
export default projectSlice.reducer;
