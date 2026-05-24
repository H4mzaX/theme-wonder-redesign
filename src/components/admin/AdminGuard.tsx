import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";

/**
 * AdminGuard — gates /admin/* routes.
 * - Unauthenticated → /admin/login
 * - Authenticated but not admin → /admin/login with ?denied=1
 * - Admin → renders children
 */
export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { loading, session, isAdmin } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login?denied=1" replace />;
  }

  return <>{children}</>;
};
