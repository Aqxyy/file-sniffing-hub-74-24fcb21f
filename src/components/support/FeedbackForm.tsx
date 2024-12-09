import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkExistingFeedback = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error checking feedback:", error);
          return;
        }

        setHasSubmittedFeedback(!!data);
      } catch (error) {
        console.error("Error checking feedback:", error);
      }
    };

    checkExistingFeedback();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }

    if (hasSubmittedFeedback) {
      toast.error("Vous avez déjà soumis un feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Attempting to submit feedback...");
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: user?.id,
            rating,
            comment: feedback,
          }
        ]);

      if (error) {
        console.error("Supabase error:", error);
        if (error.code === '23505') { // Unique violation
          toast.error("Vous avez déjà soumis un feedback");
          setHasSubmittedFeedback(true);
        } else if (error.code === "404" || error.message.includes("404")) {
          toast.error("Le système de feedback n'est pas encore disponible. Veuillez réessayer plus tard.");
        } else {
          toast.error("Une erreur est survenue lors de l'envoi du feedback");
        }
        return;
      }

      toast.success("Merci pour votre feedback !");
      setRating(0);
      setFeedback("");
      setHasSubmittedFeedback(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Une erreur est survenue lors de l'envoi du feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmittedFeedback) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-4">Merci pour votre feedback !</h2>
        <p className="text-gray-300">Vous avez déjà soumis votre avis. Nous vous remercions de votre participation.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6">Donnez-nous votre avis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Note
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Commentaire
          </label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Partagez votre expérience..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer le feedback"}
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;