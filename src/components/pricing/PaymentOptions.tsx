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
  const [isPaypalReady, setIsPaypalReady] = useState(true);
  const [paypalError, setPaypalError] = useState(false);

  useEffect(() => {
    // Reset PayPal state when component mounts
    setIsPaypalReady(true);
    setPaypalError(false);

    // Cleanup function to handle unmounting
    return () => {
      setIsPaypalReady(false);
    };
  }, []);

  const resetPayPal = () => {
    setIsPaypalReady(false);
    setPaypalError(true);
    // Give more time for PayPal to clean up
    setTimeout(() => {
      setPaypalError(false);
      setIsPaypalReady(true);
    }, 2000);
  };

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
      resetPayPal();
    }
  };

  return (
    <div className="w-full space-y-4">
      <PayPalScriptProvider 
        options={{ 
          clientId: "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R",
          currency: "EUR",
          intent: "capture",
          components: "buttons"
        }}
      >
        <div className="min-h-[150px]">
          {isPaypalReady && !paypalError && (
            <PayPalButtons
              style={{ 
                layout: "vertical",
                shape: "rect",
                color: "gold"
              }}
              disabled={isProcessing}
              createOrder={(data, actions) => {
                console.log("Creating PayPal order...");
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
              onError={(err) => {
                console.error("PayPal Error:", err);
                toast.error("Une erreur est survenue avec PayPal");
                resetPayPal();
              }}
              onCancel={() => {
                console.log("Payment cancelled");
                toast.info("Paiement annulé");
                onCancel();
              }}
            />
          )}
          {paypalError && (
            <div className="text-center text-sm text-gray-500">
              Rechargement du module de paiement...
            </div>
          )}
        </div>
        <Button 
          variant="outline"
          className="w-full mt-4"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Retour
        </Button>
      </PayPalScriptProvider>
    </div>
  );
};

export default PaymentOptions;