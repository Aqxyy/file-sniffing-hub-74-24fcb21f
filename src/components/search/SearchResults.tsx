import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SearchResult {
  email: string;
  source: string;
  date: string;
  password: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults = ({ results }: SearchResultsProps) => {
  console.log("Received results:", results); // Debug log

  if (!Array.isArray(results)) {
    console.error("Results is not an array:", results);
    return null;
  }

  if (results.length === 0) {
    console.log("No results found");
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-12 max-w-6xl mx-auto"
      >
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Résultats</h2>
            <span className="text-gray-300 text-sm">
              {results.length} correspondances trouvées
            </span>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Source</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Password</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index} className="border-gray-700">
                    <TableCell className="text-gray-300">
                      {result.email || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {result.source || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {result.date || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {result.password || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults;