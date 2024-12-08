import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email || session.user.email !== "williamguerif@gmail.com") {
      toast.error("Accès non autorisé");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Panel Administrateur</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="text-white"
        >
          Retour
        </Button>
      </div>
      
      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="settings">
          <SiteSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;