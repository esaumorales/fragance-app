import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect("/cuenta");

  // Obtener producto existente
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
  
  if (!product) {
    redirect("/admin/productos");
  }

  // Obtener catálogos para los selectboxes
  const { data: brands } = await supabase.from('brands').select('id, name');
  const { data: categories } = await supabase.from('categories').select('id, name');

  return (
    <div className="bg-background text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-playfair text-4xl mb-2">Editar: {product.name}</h1>
            <Link href="/admin/productos" className="text-xs uppercase tracking-widest text-zinc-500 font-bold hover:text-white transition-colors">
              ← Cancelar y Volver
            </Link>
          </div>
        </div>

        <div className="bg-card border border-zinc-800 p-8">
          <ProductForm 
            brands={brands || []} 
            categories={categories || []} 
            initialData={product} 
          />
        </div>
      </div>
    </div>
  );
}
