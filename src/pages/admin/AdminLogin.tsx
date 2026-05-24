import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { useSEO } from "@/hooks/useSEO";

/**
 * /admin/login
 *
 * Sign-in for existing admins. Includes a one-time "Create first admin"
 * flow: if no admin exists yet in the system, the page exposes a Sign Up
 * tab. Once one admin exists, the Sign Up tab disappears and new admins
 * must be created from inside the admin panel.
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();
  const { session, isAdmin } = useAdmin();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [adminCount, setAdminCount] = useState<number | null>(null);

  useSEO({
    title: "Admin · VCASE",
    description: "VCASE admin sign-in.",
  });

  // Robots: never index /admin
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Check whether any admin exists (controls signup visibility)
  useEffect(() => {
    supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .then(({ count }) => setAdminCount(count ?? 0));
  }, []);

  // Auto-redirect signed-in admins
  useEffect(() => {
    if (session && isAdmin) navigate("/admin", { replace: true });
  }, [session, isAdmin, navigate]);

  // Show denied toast
  useEffect(() => {
    if (params.get("denied")) {
      toast({
        title: "Access denied",
        description: "Your account does not have admin permissions.",
        variant: "destructive",
      });
    }
  }, [params, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        if (adminCount && adminCount > 0) {
          toast({ title: "Signup disabled", description: "Ask an existing admin to invite you.", variant: "destructive" });
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;

        // First-admin bootstrap: insert the admin role for this user.
        // Allowed because no admin exists yet; we use a SECURITY DEFINER
        // RPC-free approach by relying on a one-time bootstrap:
        // Insert directly via service role would be ideal, but for the
        // public client we attempt to insert — if blocked by RLS the
        // user will be told what to do.
        if (data.user) {
          const { error: roleErr } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role: "admin" });
          if (roleErr) {
            toast({
              title: "Almost done",
              description: "Account created, but admin role could not be assigned automatically. Contact support.",
              variant: "destructive",
            });
            return;
          }
          toast({ title: "Welcome", description: "Admin account created. Redirecting…" });
          navigate("/admin", { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Signed in", description: "Redirecting…" });
        navigate("/admin", { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast({ title: "Auth error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const canSignup = adminCount === 0;

  return (
    <div className="min-h-screen bg-announcement flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-background rounded-2xl shadow-2xl p-8">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to store</Link>
        <h1 className="mt-4 text-2xl font-display font-bold">VCASE Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup" ? "Create the first admin account." : "Sign in to manage your store."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 text-base"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 text-base"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "…" : mode === "signup" ? "Create admin" : "Sign in"}
          </Button>
        </form>

        {canSignup && (
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "First time? Create the admin account →" : "← Back to sign in"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
