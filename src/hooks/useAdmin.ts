import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

/**
 * useAdmin — auth + role state for the admin area.
 *
 * Returns:
 *   loading   – true while determining auth state
 *   session   – Supabase session or null
 *   user      – current user or null
 *   isAdmin   – has the `admin` role
 *   adminCount – number of existing admins (used by bootstrap flow)
 */
export function useAdmin() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Listener first
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Defer the role lookup to avoid deadlocks inside the listener
        setTimeout(() => checkRole(sess.user.id), 0);
      } else {
        setIsAdmin(false);
      }
    });

    // 2. Then get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        checkRole(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    async function checkRole(userId: string) {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!error && !!data);
    }

    return () => sub.subscription.unsubscribe();
  }, []);

  return { loading, session, user, isAdmin };
}
