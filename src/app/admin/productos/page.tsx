import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect("/cuenta");

  // Leer productos
  const { data: products } = await supabase
    .from('products')
    .select('*, brands(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="bg-[#0f0f0f] text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-playfair text-4xl mb-2">Gestión de Catálogo</h1>
            <div className="flex gap-2 text-xs uppercase tracking-widest text-zinc-500 font-bold">
              <Link href="/admin" className="hover:text-white transition-colors">Volver al Panel</Link>
            </div>
          </div>
          
          <Link href="/admin/productos/nuevo" className="bg-[#d4af37] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
            + Nuevo Producto
          </Link>
        </div>

        <div className="bg-[#141414] border border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-xs uppercase tracking-widest text-[#d4af37]">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">Producto</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">Marca</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">Precio</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">Stock</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-light">
                    No hay productos en el catálogo.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1a1a1a]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{p.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{p.active ? 'Activo' : 'Desactivado'}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{p.brands?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-playfair tracking-wider">${p.price}</td>
                    <td className="px-6 py-4 text-zinc-300">{p.stock} u.</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link href={`/admin/productos/${p.id}/editar`} className="text-xs uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors">
                          Editar
                        </Link>
                        <DeleteProductButton productId={p.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
