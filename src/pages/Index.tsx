import { useState } from "react";
import { Search, FileText, Loader2, Database, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un mot-clé",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur de recherche",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Product Button */}
        <div className="absolute top-4 left-4">
          <Link to="/product">
            <Button 
              variant="outline" 
              className="bg-blue-900 text-white hover:bg-blue-800 border-blue-700"
            >
              Product
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Database className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              ZeenBase
            </h1>
          </div>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Recherche ultra-rapide dans vos bases de données
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative mb-8">
            <Input
              type="text"
              placeholder="Entrez votre mot-clé..."
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-primary focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white hover:bg-blue-800 border-blue-700"
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Rechercher"
              )}
            </Button>
          </form>

          <div className="text-center text-gray-300 text-sm">
            <p>Exemples de recherche : "error 404", "login failed", "database connection"</p>
          </div>
        </motion.div>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Résultats</h2>
                  <span className="text-gray-300 text-sm">{results.length} correspondances trouvées</span>
                </div>
                <div className="relative backdrop-blur-sm rounded-lg p-8 text-center">
                  <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Résultats Masqués
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Accédez aux résultats complets avec notre offre Standard
                  </p>
                  <Link to="/product">
                    <Button className="bg-primary hover:bg-primary/90">
                      Voir les offres
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;