# Ethara AI Task Management - Codebase Flow Documentation

## 🛠 Technology Stack
- **Framework:** React 19 + Vite 7
- **Language:** TypeScript
- **State Management:** Redux Toolkit (JWT Persistence, Projects & Tasks)
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI)
- **Backend:** Node.js/Express REST API with JWT Auth
- **Routing:** React Router DOM v7
- **Icons:** Lucide React (Themed: FolderKanban, CheckSquare)

## 🏗 Project Structure
```text
src/
├── app/               # Core app setup (router, global providers, session restore)
├── components/        # Reusable UI components
│   ├── ui/            # shadcn/ui base primitives
│   ├── app-sidebar    # Dynamic navigation with Ethara AI branding
│   └── login-form     # Email/Password authentication logic
├── constants/         # App constants (API_ROUTES)
├── services/          # API Service Layer (projectService, taskService, authService)
├── pages/             # Main view components
│   ├── Auth/          # Sign-in & Registration flow
│   ├── Projects/      # Project Management (CRUD with Grid/List views)
│   ├── Tasks/         # Task Management (CRUD with Project filtering)
│   └── Dashboard/     # Admin Overview with live stats
├── store/             # Redux store (userSlice, projectSlice, taskSlice)
├── lib/               # Utilities (apiCall, utils)
└── hooks/             # Custom React hooks
```

## 🔄 Core Flows

### 1. Unified Dashboard Access
- **Auth listener:** The app checks for a stored JWT in Redux/LocalStorage via `ProtectedRoute`.
- **Session Restore:** On app load, `App.tsx` fetches the current user profile to populate Redux state if a token exists.
- **API Security:** All requests use the `apiCall` wrapper which automatically injects the `Bearer` token.
- **Entry Point:** The app defaults to `/` which renders the Admin Overview dashboard.

### 2. Service Layer Architecture
The app uses a 3-tier communication pattern:
1. **Routes**: `apiRoutes.ts` defines endpoints matching the Node.js backend.
2. **Services**: `projectService.ts` / `taskService.ts` provide methods for CRUD operations.
3. **UI**: Components call these services to interact with data and update Redux state.

### 3. Project & Task Management
- **Project CRUD**: Supports creating, viewing, updating, and deleting projects. Includes a toggle between `list` (Table) and `grid` (Cards) views.
- **Task CRUD**: Supports adding tasks to specific projects, with status and priority tracking.
- **Filtering**: Tasks can be filtered by project for better organization.
- **Branding**: Uses `Ethara AI` branding for a consistent professional theme.

## 📝 Configuration & Notes
- **API URL**: Configured in `.env` (VITE_API_URL) pointing to the local Node.js server.
- **Role Handling**: Supports `user` and `admin` roles with restricted access logic in controllers and middleware.
- **Persistence**: Auth state and user profile are persisted using Redux linked to `localStorage`.
- **Navigation**: Sidebar provides quick access to Dashboard, Projects, Tasks, and Profile.
