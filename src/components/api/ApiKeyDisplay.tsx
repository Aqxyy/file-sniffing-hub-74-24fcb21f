import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyDisplayProps {
  apiKey: string;
}

const ApiKeyDisplay = ({ apiKey }: ApiKeyDisplayProps) => {
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
      <div className="flex items-center justify-between">
        <code className="text-blue-400 break-all">{apiKey}</code>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="ml-2 shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyDisplay;