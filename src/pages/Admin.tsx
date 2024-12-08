import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

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

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email || session.user.email !== "williamguerif@gmail.com") {
      toast.error("Accès non autorisé");
      navigate("/");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user:user_id (
            email
          )
        `);

      if (subError) throw subError;

      const formattedUsers = subscriptions.map(sub => ({
        id: sub.user_id,
        email: sub.user.email,
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
      <h1 className="text-3xl font-bold text-white mb-8">Panel Administrateur</h1>
      
      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Gestion des Utilisateurs</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Plan</TableHead>
                  <TableHead className="text-white">Statut</TableHead>
                  <TableHead className="text-white">Accès API</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-white">{user.email}</TableCell>
                    <TableCell className="text-white">{user.plan_type}</TableCell>
                    <TableCell className="text-white">{user.status}</TableCell>
                    <TableCell>
                      <Switch
                        checked={user.api_access}
                        onCheckedChange={() => toggleApiAccess(user.id, user.api_access)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={user.status === 'active' ? 'destructive' : 'default'}
                        onClick={() => toggleSubscriptionStatus(user.id, user.status)}
                        size="sm"
                      >
                        {user.status === 'active' ? 'Désactiver' : 'Activer'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Paramètres du site</h2>
            <p className="text-gray-300">Fonctionnalités à venir...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;