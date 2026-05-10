import { HomePage } from "@/pages/HomePage/HomePage";
import { Outlet, Navigate, type RouteObject } from "react-router-dom";
import Layout from "./layout/Layout";
import Signin from "@/pages/Auth/Signin";
import { UserDashboard } from "@/pages/Dashboard/UserDashboard";
import UserManagement from "@/pages/Users/UserManagement";
import UserDetail from "@/pages/Users/UserDetail";
import ProtectedRoute from "@/components/ProtectedRoute";

import GuestRoute from "@/components/GuestRoute";
import NotFound from "@/pages/NotFound";
import UserProfile from "@/pages/UserProfile/UserProfile";
import ProjectManagement from "@/pages/Projects/ProjectManagement";
import TaskManagement from "@/pages/Tasks/TaskManagement";

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export const appRoutes: RouteObject[] = [
  {
    path: "signin",
    element: (
      <GuestRoute>
        <Signin />
      </GuestRoute>
    ),
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <LayoutWrapper />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "projects",
        element: <ProjectManagement />,
      },
      {
        path: "tasks",
        element: <TaskManagement />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "users/:id",
        element: <UserDetail />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
