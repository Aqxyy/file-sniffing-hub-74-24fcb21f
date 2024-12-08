import { CheckIcon } from "lucide-react";

interface PricingFeature {
  text: string;
}

interface PricingFeaturesProps {
  features: PricingFeature[];
}

const PricingFeatures = ({ features }: PricingFeaturesProps) => {
  return (
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-300">
          <CheckIcon className="w-5 h-5 text-blue-500 mr-2" />
          {feature.text}
        </li>
      ))}
    </ul>
  );
};

export default PricingFeatures;