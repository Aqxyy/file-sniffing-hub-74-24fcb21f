import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Product = () => {
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .single();

        if (error) throw error;
        setProductData(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  if (isLoading) {
    return <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-white mb-4">{productData?.name}</h1>
      <p className="text-gray-400 mb-4">{productData?.description}</p>
      <div className="text-center mt-12 text-gray-400">
        Besoin d'une solution personnalisée ?{" "}
        <a 
          href="https://discord.com/invite/UfnBUHXbDV" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  );
};

export default Product;
