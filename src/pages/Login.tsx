import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-2">
          <Link className="font-semibold" to="/">
            File Sniffing Hub
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/product">
            <Button variant="ghost">Product</Button>
          </Link>
          <Link to="/help">
            <Button variant="ghost">
              <MessageSquare className="mr-2 h-4 w-4" />
              Support
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-60px)]">
          <div className="w-full max-w-[350px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Connexion</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Entrez vos identifiants pour vous connecter
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder="Email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  placeholder="Mot de passe"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            <div className="text-center text-sm">
              Pas encore de compte ?{" "}
              <Link className="underline" to="/signup">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}