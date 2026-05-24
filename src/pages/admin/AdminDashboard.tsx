import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Image as ImageIcon, Layout, Tag, Package } from "lucide-react";

/**
 * /admin — main dashboard with tabs.
 * Editors for each tab will be filled in next.
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAdmin();
  const [tab, setTab] = useState("hero");

  useSEO({
    title: "Admin Dashboard · VCASE",
    description: "VCASE admin dashboard.",
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-announcement">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold">VCASE Admin</Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="hero"><ImageIcon className="w-4 h-4 mr-2" />Hero</TabsTrigger>
            <TabsTrigger value="sections"><Layout className="w-4 h-4 mr-2" />Sections</TabsTrigger>
            <TabsTrigger value="products"><Package className="w-4 h-4 mr-2" />Products</TabsTrigger>
            <TabsTrigger value="offers"><Tag className="w-4 h-4 mr-2" />Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="mt-6">
            <Placeholder title="Hero slider" desc="Upload images & videos, reorder slides, edit text. Coming in the next step." />
          </TabsContent>
          <TabsContent value="sections" className="mt-6">
            <Placeholder title="Homepage sections" desc="Edit banners, marquee, announcement bar, manifesto." />
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <Placeholder title="Products" desc="Search Shopify products, edit prices, set badges, hide items." />
          </TabsContent>
          <TabsContent value="offers" className="mt-6">
            <Placeholder title="Offers & discounts" desc="Create discount codes & manage the announcement bar." />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Placeholder = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-background rounded-xl p-8 border">
    <h2 className="text-xl font-display font-bold">{title}</h2>
    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
  </div>
);

export default AdminDashboard;
