import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Product = () => {
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch(
        "https://dihvcgtshzhuwnfxhfnu.supabase.co/functions/v1/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Nos offres</h2>
          <p className="mt-4 text-lg text-gray-400">
            Choisissez l'offre qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Standard Plan */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-4">Standard</h3>
            <p className="text-4xl font-bold text-white mb-6">
              19€ <span className="text-lg font-normal text-gray-400">/mois</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Fonctionnalité standard 1
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Fonctionnalité standard 2
              </li>
            </ul>
            <Button
              onClick={() => handleSubscribe("price_1QTZHIEeS2EtyeTMIobx6y3O")}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Commencer
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Populaire
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Pro</h3>
            <p className="text-4xl font-bold text-white mb-6">
              49€ <span className="text-lg font-normal text-gray-400">/mois</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Toutes les fonctionnalités Standard
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Fonctionnalité pro exclusive
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Support prioritaire
              </li>
            </ul>
            <Button
              onClick={() => handleSubscribe("price_1QTZHvEeS2EtyeTMNWeSozYu")}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Commencer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;