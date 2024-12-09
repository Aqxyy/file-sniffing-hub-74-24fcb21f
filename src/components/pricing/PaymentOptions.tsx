import { Button } from "@/components/ui/button";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface PaymentOptionsProps {
  priceNumber: number;
  planName: string;
  onCancel: () => void;
  isProcessing: boolean;
}

const PaymentOptions = ({ priceNumber, planName, onCancel, isProcessing }: PaymentOptionsProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  useEffect(() => {
    setScriptError(null);
    setScriptLoaded(false);
  }, []);

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
          plan_type: planName.toLowerCase(),
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

  const paypalConfig = {
    "client-id": "VOTRE_CLIENT_ID_PRODUCTION", // Remplacez par votre vrai Client ID de production PayPal
    currency: "EUR",
    intent: "capture",
    components: "buttons",
    "enable-funding": "paylater",
    "disable-funding": "credit,card"
  };

  return (
    <div className="w-full space-y-4">
      <PayPalScriptProvider options={paypalConfig}>
        <div className="relative space-y-4">
          {scriptError ? (
            <div className="text-red-500 text-center p-4">
              Une erreur est survenue lors du chargement de PayPal. Veuillez réessayer.
            </div>
          ) : (
            <>
              <PayPalButtons
                forceReRender={[priceNumber]}
                style={{ 
                  layout: "horizontal",
                  shape: "rect",
                  color: "gold",
                  height: 45
                }}
                disabled={isProcessing}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          value: priceNumber.toString(),
                          currency_code: "EUR"
                        },
                        description: `Abonnement ${planName}`
                      }
                    ]
                  });
                }}
                onApprove={handlePaypalApprove}
                onError={(err: Record<string, unknown>) => {
                  console.error("PayPal Error:", err);
                  const errorMessage = err.message 
                    ? String(err.message)
                    : "Une erreur inconnue est survenue";
                  setScriptError(errorMessage);
                  toast.error("Une erreur est survenue avec PayPal");
                }}
                onCancel={() => {
                  console.log("Payment cancelled");
                  toast.info("Paiement annulé");
                  onCancel();
                }}
              />
            </>
          )}
        </div>
      </PayPalScriptProvider>

      <Button 
        variant="secondary"
        className="w-full bg-gray-700 hover:bg-gray-600 text-white"
        onClick={onCancel}
        disabled={isProcessing}
      >
        Retour
      </Button>
    </div>
  );
};

export default PaymentOptions;