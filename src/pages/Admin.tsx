import { useEffect, useState } from "react";
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
import UserTable from "@/components/admin/UserTable";
import ApiSettings from "@/components/admin/ApiSettings";

interface UserData {
  id: string;
  email: string;
  plan_type: string;
  status: string;
  api_access: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiEnabled, setApiEnabled] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
    fetchApiStatus();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email || session.user.email !== "williamguerif@gmail.com") {
      toast.error("Accès non autorisé");
      navigate("/");
    }
  };

  const fetchApiStatus = async () => {
    try {
      console.log("Fetching API status...");
      const { data, error } = await supabase
        .from('site_settings')
        .select('api_enabled')
        .single();

      if (error) {
        console.error("API status fetch error:", error);
        throw error;
      }
      console.log("API status data:", data);
      setApiEnabled(data?.api_enabled ?? true);
    } catch (error) {
      console.error("Erreur lors de la récupération du statut API:", error);
      toast.error("Erreur lors de la récupération des paramètres");
    }
  };

  const toggleApiStatus = async () => {
    try {
      const newStatus = !apiEnabled;
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, api_enabled: newStatus });

      if (error) throw error;
      
      setApiEnabled(newStatus);
      toast.success(`API ${newStatus ? 'activée' : 'désactivée'} avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut API:", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          users:user_id (
            email
          )
        `);

      if (subError) {
        console.error("Subscription fetch error:", subError);
        throw subError;
      }

      console.log("Fetched subscriptions:", subscriptions);

      const formattedUsers = subscriptions.map(sub => ({
        id: sub.user_id,
        email: sub.users?.email || 'Email non disponible',
        plan_type: sub.plan_type,
        status: sub.status,
        api_access: sub.api_access || false
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const toggleApiAccess = async (userId: string, currentAccess: boolean) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ api_access: !currentAccess })
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success("Accès API mis à jour");
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const toggleSubscriptionStatus = async (userId: string, currentStatus: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: currentStatus === 'active' ? 'inactive' : 'active' })
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success("Statut de l'abonnement mis à jour");
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

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
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Gestion des Utilisateurs</h2>
            <UserTable 
              users={users}
              onToggleApiAccess={toggleApiAccess}
              onToggleStatus={toggleSubscriptionStatus}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <ApiSettings 
            apiEnabled={apiEnabled}
            onToggleApi={toggleApiStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;