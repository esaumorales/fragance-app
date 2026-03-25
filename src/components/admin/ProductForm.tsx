"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProductForm({ brands, categories, initialData }: { brands: any[], categories: any[], initialData?: any }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const size = parseInt(formData.get("size") as string);
    const desc = formData.get("description") as string;
    const gender = formData.get("gender") as string;
    const brandId = formData.get("brand_id") as string;
    const catId = formData.get("category_id") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    let productId = initialData?.id;

    if (initialData) {
      // Editar existente
      const { error: updateError } = await supabase
        .from("products")
        .update({ name, slug, description: desc, price, stock, size_ml: size, gender, brand_id: brandId, category_id: catId })
        .eq('id', initialData.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      // Insertar nuevo
      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert({ name, slug, description: desc, price, stock, size_ml: size, gender, brand_id: brandId, category_id: catId, active: true, featured: false })
        .select("id")
        .single();
        
      if (insertError || !newProduct) {
        setError(insertError?.message || "Error al crear producto");
        setLoading(false);
        return;
      }
      productId = newProduct.id;
    }

    // Subir imagen si se añade una nueva (tanto en crear como en editar)
    if (imageFile && productId) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${productId}-${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        // Opcional: Desmarcar otras imágenes como principales
        if (initialData) {
          await supabase.from("product_images").update({ is_main: false }).eq('product_id', productId);
        }

        await supabase.from("product_images").insert({
          product_id: productId,
          image_url: publicUrl,
          is_main: true
        });
      }
    }

    router.refresh();
    router.push("/admin/productos");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-950/40 text-red-500 border border-red-900/50 p-4 text-sm">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nombre del Perfume</label>
          <input required defaultValue={initialData?.name} name="name" type="text" className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" placeholder="Ej: Noir Absolu" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Marca</label>
          <select required defaultValue={initialData?.brand_id} name="brand_id" className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50">
            <option value="">Selecciona una marca</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Precio ($)</label>
          <input required defaultValue={initialData?.price} name="price" type="number" step="0.01" className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Stock Disp.</label>
          <input required defaultValue={initialData?.stock ?? 10} name="stock" type="number" className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Tamaño (ml)</label>
          <input required defaultValue={initialData?.size_ml ?? 100} name="size" type="number" className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Género</label>
          <select required defaultValue={initialData?.gender ?? "men"} name="gender" className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50">
            <option value="men">Hombre</option>
            <option value="women">Mujer</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Familia Olfativa</label>
          <select required defaultValue={initialData?.category_id} name="category_id" className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50">
            <option value="">Selecciona una categoría</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Descripción</label>
        <textarea required defaultValue={initialData?.description} name="description" rows={4} className="w-full bg-[#0f0f0f] border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50 resize-none" placeholder="Escribe las notas olfativas y detalles..."></textarea>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">
          {initialData ? "Sustituir Imagen Principal (Opcional)" : "Imagen del Producto"}
        </label>
        <div className="border border-dashed border-zinc-700 bg-[#0f0f0f] p-8 text-center hover:border-[#d4af37]/50 transition-colors">
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files ? setImageFile(e.target.files[0]) : null}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#d4af37] file:text-black hover:file:bg-[#eade9f]"
          />
        </div>
      </div>

      <button disabled={loading} type="submit" className="w-full bg-[#d4af37] text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">
        {loading ? "Guardando..." : (initialData ? "Actualizar Producto" : "Guardar Producto en Supabase")}
      </button>
    </form>
  );
}
