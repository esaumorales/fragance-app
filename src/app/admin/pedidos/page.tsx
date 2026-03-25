import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect("/cuenta");

  // Leer todos los pedidos, incluyendo datos de la dirección
  const { data: orders } = await supabase
    .from('orders')
    .select('*, addresses(recipient_name, city)')
    .order('created_at', { ascending: false });

  return (
    <div className="bg-background text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-playfair text-4xl mb-2">Gestión de Pedidos</h1>
            <div className="flex gap-2 text-xs uppercase tracking-widest text-zinc-500 font-bold">
              <Link href="/admin" className="hover:text-white transition-colors">Volver al Panel</Link>
            </div>
          </div>
        </div>

        <div className="bg-card border border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-widest text-primary">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">ID Pedido / Fecha</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">Cliente / Destino</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">Total</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800">Estado</th>
                <th className="px-6 py-4 font-bold border-b border-zinc-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {!orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-light">
                    No hay pedidos registrados en el sistema.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 uppercase text-xs">
                      <p className="text-primary font-medium tracking-widest">#{o.id.slice(0,8)}</p>
                      <p className="text-zinc-500 mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{o.addresses?.recipient_name || 'N/A'}</p>
                      <p className="text-zinc-500 text-xs mt-1">{o.addresses?.city}</p>
                    </td>
                    <td className="px-6 py-4 font-playfair text-lg text-primary tracking-wider">${o.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest ${
                        o.status === 'delivered' ? 'bg-green-950/40 text-green-500 border border-green-900/50' :
                        o.status === 'cancelled' ? 'bg-red-950/40 text-red-500 border border-red-900/50' :
                        'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors">Ver Detalle</button>
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
