import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
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
      const { data: users, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles:user_id (
            email
          )
        `);

      if (error) throw error;
      setUsers(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status })
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
      
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Gestion des Utilisateurs</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-white">{user.profiles?.email}</p>
                <p className="text-sm text-gray-300">Plan: {user.plan_type}</p>
                <p className="text-sm text-gray-300">Status: {user.status}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant={user.status === 'active' ? 'destructive' : 'default'}
                  onClick={() => updateSubscription(user.user_id, user.status === 'active' ? 'inactive' : 'active')}
                >
                  {user.status === 'active' ? 'Désactiver' : 'Activer'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;