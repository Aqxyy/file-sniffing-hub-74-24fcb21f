import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import DOMPurify from 'dompurify';

interface SearchFormProps {
  onSearchResults: (results: any[]) => void;
}

const SearchForm = ({ onSearchResults }: SearchFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedQuery = DOMPurify.sanitize(searchQuery.trim());
    if (!sanitizedQuery) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un mot-clé",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      console.log("Sending request to API...");
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: sanitizedQuery }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Search results:", data);
      
      if (data && Array.isArray(data.results)) {
        onSearchResults(data.results);
        toast({
          title: "Succès",
          description: `${data.results.length} résultats trouvés`,
        });
      } else {
        onSearchResults([]);
        console.warn("No results array in response:", data);
        toast({
          title: "Information",
          description: "Aucun résultat trouvé",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      onSearchResults([]);
      
      // More specific error message for connection issues
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de contacter le serveur de recherche. Assurez-vous que l'API est en cours d'exécution sur le port 5000.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur est survenue lors de la recherche",
          variant: "destructive",
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
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
          onChange={(e) => setSearchQuery(DOMPurify.sanitize(e.target.value))}
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
    </motion.div>
  );
};

export default SearchForm;