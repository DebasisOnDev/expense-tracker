import { useAuth } from "@/context/auth";
import { AuthProviderProps } from "@/lib/interfaces";
import { Loader } from "lucide-react";
import { Navigate, useLocation } from "react-router";

export default function AuthGuard({ children }: AuthProviderProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center">
        <Loader className="animate-spin size-10 text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  if (user) {
    if (location.pathname === "/login" || location.pathname === "/register") {
      return <Navigate to={"/"} state={{ from: location }} replace />;
    } else {
      return <>{children}</>;
    }
  }
}
