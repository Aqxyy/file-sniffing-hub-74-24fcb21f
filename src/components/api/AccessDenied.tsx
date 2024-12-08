import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AccessDeniedProps {
  message: string;
}

const AccessDenied = ({ message }: AccessDeniedProps) => {
  return (
    <div className="container mx-auto px-4 py-16">
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