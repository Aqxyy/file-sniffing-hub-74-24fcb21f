import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import UserTable from "./UserTable";

interface UserData {
  id: string;
  email: string;
  plan_type: string;
  status: string;
  api_access: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          user_id,
          plan_type,
          status,
          api_access,
          profiles!subscriptions_user_id_fkey (
            email
          )
        `);

      if (subError) {
        console.error("Subscription fetch error:", subError);
        throw subError;
      }

      console.log("Fetched subscriptions:", subscriptions);

      const formattedUsers = subscriptions?.map(sub => ({
        id: sub.user_id,
        email: sub.profiles?.email || 'Email non disponible',
        plan_type: sub.plan_type,
        status: sub.status,
        api_access: sub.api_access || false
      })) || [];

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

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Gestion des Utilisateurs</h2>
      <UserTable 
        users={users}
        onToggleApiAccess={toggleApiAccess}
        onToggleStatus={toggleSubscriptionStatus}
      />
    </div>
  );
};