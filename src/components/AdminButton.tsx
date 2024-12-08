import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const AdminButton = () => {
  const { user } = useAuth();
  
  // Only show for admin user
  if (user?.email !== "williamguerif@gmail.com") {
    return null;
  }

  return (
    <div className="absolute top-4 right-4">
      <Link to="/admin">
        <Button 
          variant="outline" 
          className="bg-red-900 text-white hover:bg-red-800 border-red-700 flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Panel Admin
        </Button>
      </Link>
    </div>
  );
};

export default AdminButton;