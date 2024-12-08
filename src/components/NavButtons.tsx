import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavButtons = () => {
  const location = useLocation();
  
  // Hide navigation on product, support and api pages
  if (['/product', '/support', '/api'].includes(location.pathname)) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 flex gap-2">
      <Link to="/product">
        <Button 
          variant="outline" 
          className="bg-blue-900 text-white hover:bg-blue-800 border-blue-700"
        >
          Product
        </Button>
      </Link>
      <Link to="/support">
        <Button 
          variant="outline" 
          className="bg-blue-900 text-white hover:bg-blue-800 border-blue-700"
        >
          Support
        </Button>
      </Link>
      <Link to="/api">
        <Button 
          variant="outline" 
          className="bg-blue-900 text-white hover:bg-blue-800 border-blue-700"
        >
          API
        </Button>
      </Link>
    </div>
  );
};

export default NavButtons;