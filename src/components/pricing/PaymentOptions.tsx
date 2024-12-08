import { Button } from "@/components/ui/button";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

interface PaymentOptionsProps {
  priceNumber: number;
  planName: string;
  onCancel: () => void;
  isProcessing: boolean;
}

const PaymentOptions = ({ priceNumber, planName, onCancel, isProcessing }: PaymentOptionsProps) => {
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

  return (
    <div className="w-full space-y-4">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-white"
        onClick={onCancel}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <PayPalScriptProvider options={{ 
        clientId: "AQSK9-m4vRwgDgQwhSipOw56fmMZJPSTWdBeUllYIFIqVSVLUDec_aGnaqnOC-6bKpYRaS68DPaZGnts",
        currency: "EUR",
        intent: "CAPTURE"
      }}>
        <PayPalButtons
          style={{ 
            layout: "vertical",
            shape: "rect",
            label: "pay"
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
          }}
          onCancel={() => {
            onCancel();
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaymentOptions;