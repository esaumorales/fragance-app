"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas borrar este producto permanentemente?")) return;
    setLoading(true);
    
    // El borrado en cascada configurado en Supabase borrará también sus imágenes relacionadas.
    const { error } = await supabase.from('products').delete().eq('id', productId);
    
    setLoading(false);
    if (!error) {
      router.refresh();
    } else {
      alert("Error borrando el producto.");
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="text-xs uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Borrar"}
    </button>
  );
}
