import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Navigate } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
  const { token, loading } = useSelector((state: RootState) => state.user);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}


