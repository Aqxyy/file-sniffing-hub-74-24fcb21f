import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

interface PricingFeature {
  text: string;
}

interface PricingPlanProps {
  name: string;
  price: string;
  period: string;
  features: PricingFeature[];
  onSubscribe: () => void;
  buttonText?: string;
  variant?: "default" | "popular" | "lifetime";
  className?: string;
}

const PricingPlan = ({
  name,
  price,
  period,
  features,
  onSubscribe,
  buttonText = "Commencer",
  variant = "default",
  className = "",
}: PricingPlanProps) => {
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
        onClick={onSubscribe}
        className={`w-full ${getButtonClass()}`}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PricingPlan;