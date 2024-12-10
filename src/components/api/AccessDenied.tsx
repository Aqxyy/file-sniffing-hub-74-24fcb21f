import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AccessDeniedProps {
  message: string;
}

const AccessDenied = ({ message }: AccessDeniedProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <Button 
        variant="ghost" 
        className="text-white mb-8"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <h1 className="text-4xl font-bold text-white mb-4">Accès API requis</h1>
      <p className="text-gray-300 mb-4">{message}</p>
      <Link to="/product">
        <Button className="bg-blue-500 hover:bg-blue-600">
          Voir les offres
        </Button>
      </Link>
    </div>
  );
};

export default AccessDenied;