import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PricingFeature {
  text: string;
}

interface PricingPlanProps {
  name?: string;
  price?: string;
  period?: string;
  features?: PricingFeature[];
  onSubscribe?: () => void;
  buttonText?: string;
  variant?: "default" | "popular" | "lifetime";
  className?: string;
  priceId?: string;
}

const PricingPlan = ({
  name = "Plan Standard",
  price = "29.99",
  period = "/mois",
  features = [
    { text: "Recherches illimitées" },
    { text: "Résultats complets visibles" },
    { text: "Support par email" }
  ],
  buttonText = "Commencer",
  variant = "default",
  className = "",
  priceId = "",
}: PricingPlanProps) => {
  const { toast: toastNotification } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("Checking session:", session);
      
      if (!session?.access_token) {
        toast("Erreur", {
          description: "Vous devez être connecté pour souscrire"
        });
        return;
      }

      console.log("Creating checkout session with price ID:", priceId);
      console.log("User ID:", session.user.id);
      console.log("Access Token:", session.access_token);

      const response = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: priceId,
          userId: session.user.id,
        }
      });

      console.log("Checkout response:", response);

      if (response.error) {
        console.error("Checkout error:", response.error);
        throw new Error(response.error.message || "Erreur lors de la création de la session de paiement");
      }

      const data = response.data;
      console.log("Checkout session data:", data);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement manquante");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast("Erreur", {
        description: "Une erreur est survenue lors de la redirection vers le paiement"
      });
    }
  };

  const getBackgroundClass = () => {
    switch (variant) {
      case "popular":
        return "bg-blue-600/10 backdrop-blur-sm border-blue-500/20";
      case "lifetime":
        return "bg-purple-600/10 backdrop-blur-sm border-purple-500/20";
      default:
        return "bg-gray-800/50 backdrop-blur-sm border-gray-700";
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case "popular":
        return "bg-blue-500 hover:bg-blue-600";
      case "lifetime":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className={`rounded-2xl p-8 border relative ${getBackgroundClass()} ${className}`}>
      {variant === "popular" && (
        <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Populaire
        </div>
      )}
      <h3 className="text-2xl font-semibold text-white mb-4">{name}</h3>
      <p className="text-4xl font-bold text-white mb-6">
        {price} <span className="text-lg font-normal text-gray-400">{period}</span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
            {feature.text}
          </li>
        ))}
      </ul>
      <Button
        onClick={handleSubscribe}
        className={`w-full ${getButtonClass()}`}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PricingPlan;