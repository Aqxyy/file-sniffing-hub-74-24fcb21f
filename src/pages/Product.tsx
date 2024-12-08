import { ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Product = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      features: [
        "10 recherches par jour",
        "Résultats limités",
        "Support basique",
      ],
      popular: false,
    },
    {
      name: "Standard",
      price: "19€",
      period: "/mois",
      features: [
        "Recherches illimitées",
        "Accès complet aux résultats",
        "Support prioritaire",
        "Accès aux bases premium",
      ],
      buttonText: "S'abonner maintenant",
      popular: true,
      priceId: "VOTRE_PRICE_ID_STANDARD"
    },
    {
      name: "Pro",
      price: "49€",
      period: "/mois",
      features: [
        "Tout le plan Standard",
        "API Access",
        "Support dédié 24/7",
        "Exports illimités",
        "Personnalisation avancée"
      ],
      buttonText: "Souscrire au plan Pro",
      popular: false,
      priceId: "VOTRE_PRICE_ID_PRO"
    }
  ];

  const handlePlanClick = async (plan: string, priceId?: string) => {
    if (!priceId) return;
    
    try {
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (response.error) throw response.error;

      const { url } = response.data;
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="absolute top-4 left-4">
          <Link to="/">
            <Button 
              variant="default"
              className="bg-blue-900 hover:bg-blue-800 text-white flex items-center gap-2"
            >
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
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Accédez à la plus grande base de données de recherche avec des fonctionnalités avancées et un support premium
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border-2 ${
                plan.popular ? "border-blue-500" : "border-gray-700"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Plus populaire
                </span>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  )}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-gray-300">
                    <Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {plan.buttonText && (
                <Button 
                  onClick={() => handlePlanClick(plan.name, plan.priceId)}
                  className={`w-full ${
                    plan.popular 
                      ? "bg-blue-500 hover:bg-blue-600" 
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  {plan.buttonText}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 text-gray-400"
        >
          <p>Besoin d'une solution personnalisée ? <button onClick={() => toast.info("Cette fonctionnalité sera bientôt disponible")} className="text-blue-500 hover:underline">Contactez-nous</button></p>
        </motion.div>
      </div>
    </div>
  );
};

export default Product;