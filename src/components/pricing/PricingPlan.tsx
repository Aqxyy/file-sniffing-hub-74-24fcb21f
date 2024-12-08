import { Button } from "@/components/ui/button";
import { useState } from "react";
import PricingFeatures from "./PricingFeatures";
import PaymentOptions from "./PaymentOptions";

interface PricingFeature {
  text: string;
}

interface PricingPlanProps {
  name?: string;
  price?: string;
  period?: string;
  features?: PricingFeature[];
  buttonText?: string;
  variant?: "default" | "popular" | "lifetime";
  className?: string;
  priceId?: string;
  currentPlan?: boolean;
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
  currentPlan = false,
}: PricingPlanProps) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getBackgroundClass = () => {
    if (currentPlan) {
      return "bg-gray-800/50 border-green-500 border-2";
    }
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
      {currentPlan && (
        <div className="absolute -top-3 left-8 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Plan actuel
        </div>
      )}
      <h3 className="text-2xl font-semibold text-white mb-4">{name}</h3>
      <p className="text-4xl font-bold text-white mb-6">
        {price}{period}
      </p>
      
      <PricingFeatures features={features} />
      
      {buttonText && name !== "Gratuit" && !currentPlan && (
        <>
          {!showPaymentOptions ? (
            <Button 
              className={`w-full ${getButtonClass()} text-white`}
              onClick={() => setShowPaymentOptions(true)}
              disabled={isProcessing}
            >
              {buttonText}
            </Button>
          ) : (
            <PaymentOptions
              priceNumber={priceNumber}
              planName={name}
              onCancel={() => setShowPaymentOptions(false)}
              isProcessing={isProcessing}
            />
          )}
        </>
      )}
      {currentPlan && (
        <div className="text-center text-green-500 font-medium">
          Plan actif
        </div>
      )}
    </div>
  );
};

export default PricingPlan;