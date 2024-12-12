import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

const AdminButton = () => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // If no user, don't show anything
  if (!user) {
    return null;
  }

  // For admin user, show both admin panel and logout buttons
  if (user.email === "williamguerif@gmail.com") {
    return (
      <div className="absolute top-4 right-4 flex gap-2">
        <Link to="/admin">
          <Button 
            variant="outline" 
            className="bg-red-900 text-white hover:bg-red-800 border-red-700 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Panel Admin
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="bg-gray-900 text-white hover:bg-gray-800 border-gray-700 flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </Button>
      </div>
    );
  }

  // For non-admin users, show only logout button
  return (
    <div className="absolute top-4 right-4">
      <Button 
        variant="outline" 
        className="bg-gray-900 text-white hover:bg-gray-800 border-gray-700 flex items-center gap-2"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Se déconnecter
      </Button>
    </div>
  );
};

export default AdminButton;