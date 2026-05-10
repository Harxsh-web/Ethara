*******************************************************************************
*                                                                             *
*                 ETHARA AI - FULL-STACK TASK MANAGEMENT SYSTEM               *
*                                                                             *
*******************************************************************************

1. PROJECT OVERVIEW
------------------
Ethara AI is a comprehensive, full-stack project and task management platform 
designed for modern teams. It features a robust RBAC (Role-Based Access Control) 
system, interactive data visualization, and a premium user interface with 
responsive design optimized for both desktop and mobile.

2. CORE FEATURES
---------------
- **Unified Dashboard**: Live metrics and platform trends for both Admins and Users.
- **Data Visualization**: Interactive 7-day task aggregation trends using Recharts.
- **Project Management**: Full CRUD operations with Grid and List view toggles.
- **Task Lifecycle**: Detailed task tracking (Todo, In-Progress, Done) with priority 
  management (Low, Medium, High).
- **Advanced Filtering**: Real-time search and multi-layer filtering (by Status, 
  Owner, or Project).
- **Pagination**: High-performance server-side pagination for projects and users.
- **RBAC Security**: Distinction between 'Admin' (global view) and 'User' (owned view).
- **Authentication**: Secure JWT-based auth with session persistence.

3. TECHNOLOGY STACK
------------------
FRONTEND:
- Framework: React 19 + Vite 7
- Language: TypeScript
- State Management: Redux Toolkit (with persistence)
- Styling: Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- Icons: Lucide React & Tabler Icons
- Charts: Recharts (Dynamic Area Charts with Gradient fills)

BACKEND:
- Framework: Node.js + Express 5
- Database: MongoDB (with Mongoose ODM)
- Security: Bcryptjs (Hashing), JWT (Tokenization)
- Middleware: CORS, Cookie-Parser, Custom Error Handling
- Aggregation: MongoDB Aggregation Pipelines for dashboard trends

4. PROJECT STRUCTURE
-------------------
Ethara/
├── Frontend/           # React application source code
│   ├── src/pages/      # Main views (Auth, Dashboard, Projects, Tasks, Users)
│   ├── src/services/   # API communication layer (Service Pattern)
│   ├── src/store/      # Redux global state logic
│   └── src/components/ # Reusable UI & shadcn primitives
└── Backend/            # Node.js REST API
    ├── controllers/    # Request handling logic (Aggregation logic)
    ├── models/         # MongoDB Schemas
    ├── routes/         # Express API endpoints (v1 Namespace)
    └── config/         # Database connection setup (Mongoose)

5. SETUP & INSTALLATION
----------------------
BACKEND SETUP:
1. Open terminal in the /Backend directory.
2. Run 'npm install' to fetch dependencies.
3. Configure .env:
   - PORT=5000
   - MONGO_URI=<your_mongodb_uri>
   - JWT_SECRET=<your_secret_key>
4. Run 'npm start' or 'npm run dev' to launch the server.

FRONTEND SETUP:
1. Open terminal in the /Frontend directory.
2. Run 'npm install'.
3. Configure .env:
   - VITE_API_URL=http://localhost:5000/api/v1
4. Run 'npm run dev' to start the development environment.

6. API ENDPOINTS SUMMARY
-----------------------
AUTH:
- POST /api/v1/auth/register    - User onboarding
- POST /api/v1/auth/login       - Secure session entry
- GET  /api/v1/auth/me          - Identity verification

PROJECTS:
- GET    /api/v1/projects       - List projects (paginated)
- POST   /api/v1/projects       - Initialize new project
- PUT/DELETE /api/v1/projects/:id

TASKS:
- GET    /api/v1/tasks          - Fetch tasks with project/status filters
- POST   /api/v1/tasks          - Add task to project
- PUT    /api/v1/tasks/:id      - Update status/priority

DASHBOARD:
- GET    /api/v1/dashboard/stats - Real-time statistics and 7-day trend data

7. SYSTEM HIGHLIGHTS
-------------------
- **Responsiveness**: Entire UI dynamically adjusts, including complex filter rows 
  and grid layouts.
- **Premium Aesthetics**: Curated color palette and modern typography (Inter/Outfit) 
  for a high-end feel.
- **Performance**: Optimized data fetching with server-side pagination and 
  memoized Redux selectors.

*******************************************************************************
*             Developed for Ethara Full-Stack Assessment 2026                 *
*******************************************************************************
