import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AverageRating = () => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const fetchAverageRating = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('rating');

      if (error) {
        console.error("Error fetching ratings:", error);
        return;
      }

      if (data && data.length > 0) {
        const total = data.reduce((acc, curr) => acc + curr.rating, 0);
        const average = total / data.length;
        setAverageRating(average);
        setTotalRatings(data.length);
      }
    };

    fetchAverageRating();
  }, []);

  if (averageRating === null) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-2 mb-6">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= Math.round(averageRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-200 text-sm">
        Moyenne: {averageRating.toFixed(1)} / 5 ({totalRatings} avis)
      </p>
    </div>
  );
};

export default AverageRating;