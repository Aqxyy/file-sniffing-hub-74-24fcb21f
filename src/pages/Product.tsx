import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import NavButtons from "@/components/NavButtons";
import { PricingPlan } from "@/components/pricing/PricingPlan";

const Product = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavButtons />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Nos Offres</h1>
        <PricingPlan />
      </div>
    </div>
  );
};

export default Product;
