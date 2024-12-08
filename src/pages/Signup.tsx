import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DOMPurify from 'dompurify';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    setIsLoading(true);
    try {
      const sanitizedEmail = DOMPurify.sanitize(email);
      console.log("Tentative d'inscription avec:", { email: sanitizedEmail });
      await signUp(sanitizedEmail, password);
      toast.success("Compte créé avec succès ! Veuillez vérifier votre email.");
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(DOMPurify.sanitize(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Database className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">ZeenBase</h1>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Inscription</h2>
          <p className="text-gray-400">Créez votre compte ZeenBase</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className="w-full bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            <p>
              Déjà un compte ?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;