import { Zap, Database, Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Product = () => {
  const features = [
    {
      icon: Zap,
      title: "Ultra Rapide",
      description: "Analyse plus d'1 Go de données par seconde",
    },
    {
      icon: Database,
      title: "Multi-Format",
      description: "Compatible avec tous types de logs et bases de données",
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Analyse locale, vos données restent sur votre machine",
    },
  ];

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      features: [
        "Recherche illimitée",
        "Aperçu des résultats limité",
        "Support communautaire",
      ],
      buttonText: "Commencer",
      popular: false,
    },
    {
      name: "Standard",
      price: "49€",
      period: "/mois",
      features: [
        "Accès complet aux résultats",
        "Support prioritaire",
        "Export des données",
        "API Access",
      ],
      buttonText: "Acheter",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4" />
              Retour à la recherche
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Accédez à la puissance de ZeenBase
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl"
            >
              <feature.icon className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              className={`relative bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border-2 ${
                plan.popular ? "border-blue-500" : "border-transparent"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Populaire
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-300 ml-1">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white">
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;