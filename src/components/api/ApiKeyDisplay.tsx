import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyDisplayProps {
  apiKey: string;
  onRegenerateKey: () => void;
  isRegenerating?: boolean;
}

const ApiKeyDisplay = ({ apiKey, onRegenerateKey, isRegenerating = false }: ApiKeyDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success("Clé API copiée dans le presse-papier");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erreur lors de la copie de la clé API");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8">
      <div className="flex items-center justify-between mb-4">
        <code className="text-blue-400 break-all">{apiKey}</code>
        <div className="flex gap-2 ml-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRegenerateKey}
            disabled={isRegenerating}
          >
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-400">
        Pour régénérer votre clé API, cliquez sur le bouton de rafraîchissement. Attention : l'ancienne clé sera invalidée.
      </p>
    </div>
  );
};

export default ApiKeyDisplay;