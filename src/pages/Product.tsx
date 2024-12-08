import { useAuth } from "@/contexts/AuthContext";
import NavButtons from "@/components/NavButtons";
import PricingPlan from "@/components/pricing/PricingPlan";

const Product = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavButtons />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Nos Offres</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingPlan 
            name="Plan Starter" 
            price="9.99" 
            variant="default" 
          />
          <PricingPlan 
            name="Plan Pro" 
            price="29.99" 
            variant="popular" 
          />
          <PricingPlan 
            name="Plan Entreprise" 
            price="99.99" 
            variant="lifetime" 
          />
        </div>
      </div>
    </div>
  );
};

export default Product;