import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
  buttonText = "S'abonner",
  variant = "default",
  className = "",
  priceId = "",
}: PricingPlanProps) => {
  const { toast: toastNotification } = useToast();

  const handlePaypalApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();
      console.log("PayPal order completed:", order);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("Erreur d'authentification");
        return;
      }

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.user.id,
          plan_type: name.toLowerCase(),
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (error) {
        console.error("Erreur lors de la mise à jour de l'abonnement:", error);
        toast.error("Erreur lors de la mise à jour de l'abonnement");
        return;
      }

      toast.success("Paiement réussi ! Votre abonnement est maintenant actif.");
      window.location.href = '/';
    } catch (error) {
      console.error("Erreur PayPal:", error);
      toast.error("Une erreur est survenue lors du paiement");
    }
  };

  const getBackgroundClass = () => {
    switch (variant) {
      case "popular":
        return "bg-gray-800/50 border-blue-500 border-2";
      case "lifetime":
        return "bg-gray-800/50 border-purple-500/20";
      default:
        return "bg-gray-800/50 border-gray-700";
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case "popular":
        return "bg-blue-500 hover:bg-blue-600";
      case "lifetime":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const priceNumber = parseFloat(price.replace(',', '.'));

  return (
    <div className={`rounded-2xl p-8 border relative ${getBackgroundClass()} ${className}`}>
      {variant === "popular" && (
        <div className="absolute -top-3 right-8 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Plus populaire
        </div>
      )}
      <h3 className="text-2xl font-semibold text-white mb-4">{name}</h3>
      <p className="text-4xl font-bold text-white mb-6">
        {price}{period}
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <CheckIcon className="w-5 h-5 text-blue-500 mr-2" />
            {feature.text}
          </li>
        ))}
      </ul>
      {buttonText && name !== "Gratuit" && (
        <PayPalScriptProvider options={{ 
          clientId: "AQSK9-m4vRwgDgQwhSipOw56fmMZJPSTWdBeUllYIFIqVSVLUDec_aGnaqnOC-6bKpYRaS68DPaZGnts",
          currency: "EUR" 
        }}>
          <div className={`w-full ${getButtonClass()} rounded-md text-white font-medium`}>
            <Button 
              className="w-full"
              onClick={() => {
                const paypalButtons = document.querySelector('[data-paypal-button="true"]');
                if (paypalButtons) {
                  (paypalButtons as HTMLElement).click();
                }
              }}
            >
              S'abonner
            </Button>
            <div className="hidden">
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          value: priceNumber.toString(),
                          currency_code: "EUR"
                        },
                        description: `Abonnement ${name}`
                      }
                    ]
                  });
                }}
                onApprove={handlePaypalApprove}
                onError={(err) => {
                  console.error("PayPal Error:", err);
                  toast.error("Une erreur est survenue avec PayPal");
                }}
              />
            </div>
          </div>
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PricingPlan;