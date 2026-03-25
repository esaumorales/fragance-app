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

  // States for dynamic creation
  const [isNewBrand, setIsNewBrand] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

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
    
    let brandId = formData.get("brand_id") as string;
    let catId = formData.get("category_id") as string;

    // Handle new brand creation on-the-fly
    if (isNewBrand) {
      const newBrandName = formData.get("new_brand_name") as string;
      const brandSlug = newBrandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const { data: b, error: bError } = await supabase.from('brands').insert({ name: newBrandName, slug: brandSlug }).select('id').single();
      if (bError) { setError("Error creando la nueva marca: " + bError.message); setLoading(false); return; }
      brandId = b.id;
    }

    // Handle new category creation on-the-fly
    if (isNewCategory) {
      const newCatName = formData.get("new_category_name") as string;
      const catSlug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const { data: c, error: cError } = await supabase.from('categories').insert({ name: newCatName, slug: catSlug }).select('id').single();
      if (cError) { setError("Error creando nueva categoría: " + cError.message); setLoading(false); return; }
      catId = c.id;
    }

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
        .from('products')
        .upload(fileName, imageFile);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

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
          <input required defaultValue={initialData?.name} name="name" type="text" className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50" placeholder="Ej: Noir Absolu" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Marca</label>
          {!isNewBrand ? (
            <select required defaultValue={initialData?.brand_id} name="brand_id" onChange={(e) => {
              if (e.target.value === "NEW") setIsNewBrand(true);
            }} className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option value="">Selecciona una marca</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              <option value="NEW" className="text-primary font-bold bg-zinc-900">+ Agregar nueva marca...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input required autoFocus type="text" name="new_brand_name" placeholder="Escribe la nueva marca..." className="w-full bg-background border border-primary/50 px-4 py-3 text-sm text-white focus:outline-none" />
              <button type="button" onClick={() => setIsNewBrand(false)} className="px-4 bg-zinc-800 text-white hover:bg-zinc-700 transition">X</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Precio ($)</label>
          <input required defaultValue={initialData?.price} name="price" type="number" step="0.01" className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Stock Disp.</label>
          <input required defaultValue={initialData?.stock ?? 10} name="stock" type="number" className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Tamaño (ml)</label>
          <input required defaultValue={initialData?.size_ml ?? 100} name="size" type="number" className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Género</label>
          <select required defaultValue={initialData?.gender ?? "men"} name="gender" className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50">
            <option value="men">Hombre</option>
            <option value="women">Mujer</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Familia Olfativa</label>
          {!isNewCategory ? (
            <select required defaultValue={initialData?.category_id} name="category_id" onChange={(e) => {
              if (e.target.value === "NEW") setIsNewCategory(true);
            }} className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option value="">Selecciona una categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value="NEW" className="text-primary font-bold bg-zinc-900">+ Agregar nueva familia...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input required autoFocus type="text" name="new_category_name" placeholder="Ej: Amaderado, Cítrico..." className="w-full bg-background border border-primary/50 px-4 py-3 text-sm text-white focus:outline-none" />
              <button type="button" onClick={() => setIsNewCategory(false)} className="px-4 bg-zinc-800 text-white hover:bg-zinc-700 transition">X</button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Descripción</label>
        <textarea required defaultValue={initialData?.description} name="description" rows={4} className="w-full bg-background border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 resize-none" placeholder="Escribe las notas olfativas y detalles..."></textarea>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">
          {initialData ? "Sustituir Imagen Principal (Opcional)" : "Imagen del Producto"}
        </label>
        <div className="border border-dashed border-zinc-700 bg-background p-8 text-center hover:border-primary/50 transition-colors">
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files ? setImageFile(e.target.files[0]) : null}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-[#eade9f]"
          />
        </div>
      </div>

      <button disabled={loading} type="submit" className="w-full bg-primary text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 mt-4">
        {loading ? "Guardando..." : (initialData ? "Actualizar Producto" : "Guardar Producto en Supabase")}
      </button>
    </form>
  );
}
