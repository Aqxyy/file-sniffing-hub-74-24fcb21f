import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SearchResultsProps {
  results: any[];
}

const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-12 max-w-4xl mx-auto"
      >
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Résultats</h2>
            <span className="text-gray-300 text-sm">
              {results.length} correspondances trouvées
            </span>
          </div>
          
          {/* Free preview with limited results */}
          <div className="overflow-hidden rounded-lg border border-gray-700 mb-6">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Source</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.slice(0, 3).map((result, index) => (
                  <TableRow key={index} className="border-gray-700">
                    <TableCell className="text-gray-300">{result.email || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">{result.source || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">{result.date || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Upgrade prompt */}
          <div className="relative backdrop-blur-sm rounded-lg p-8 text-center">
            <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Résultats Complets Masqués
            </h3>
            <p className="text-gray-300 mb-6">
              Accédez aux {results.length - 3} résultats supplémentaires avec notre offre Standard
            </p>
            <Link to="/product">
              <Button className="bg-primary hover:bg-primary/90">
                Voir les offres
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults;