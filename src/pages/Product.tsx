import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PricingPlan from "@/components/pricing/PricingPlan";

const Product = () => {
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch(
        "https://dihvcgtshzhuwnfxhfnu.supabase.co/functions/v1/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
    }
  };

  const plans = [
    {
      name: "Standard",
      price: "19€",
      period: "/mois",
      features: [
        { text: "Fonctionnalité standard 1" },
        { text: "Fonctionnalité standard 2" },
      ],
      priceId: "price_1QTZHIEeS2EtyeTMIobx6y3O",
    },
    {
      name: "Pro",
      price: "49€",
      period: "/mois",
      features: [
        { text: "Toutes les fonctionnalités Standard" },
        { text: "Accès API" },
        { text: "Support prioritaire" },
      ],
      priceId: "price_1QTZHvEeS2EtyeTMNWeSozYu",
      variant: "popular" as const,
    },
    {
      name: "API Lifetime",
      price: "119€",
      period: "une fois",
      features: [
        { text: "Accès API à vie" },
        { text: "Support technique" },
        { text: "Mises à jour incluses" },
      ],
      priceId: "price_1QTZwZEeS2EtyeTMcYOFcClK",
      variant: "lifetime" as const,
      buttonText: "Acheter",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Nos offres</h2>
          <p className="mt-4 text-lg text-gray-400">
            Choisissez l'offre qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              onSubscribe={() => handleSubscribe(plan.priceId)}
              variant={plan.variant}
              buttonText={plan.buttonText}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;