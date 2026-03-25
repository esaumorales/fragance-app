import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Obtener pedidos del usuario
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-background text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-playfair text-4xl">Mis Pedidos</h1>
          <Link href="/cuenta" className="border border-zinc-700 px-6 py-2 text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">
            Volver
          </Link>
        </div>

        <div className="bg-card border border-zinc-800 p-8">
          {(!orders || orders.length === 0) ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 font-light mb-6">Aún no has realizado ninguna compra.</p>
              <Link href="/perfumes" className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-zinc-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/50 transition-colors">
                  <div>
                    <span className="block text-primary text-xs font-bold uppercase tracking-widest mb-1">
                      Pedido #{order.id.slice(0,8)}
                    </span>
                    <p className="text-zinc-400 text-sm font-light">
                      Fechado el {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <span className="text-white text-lg font-playfair">${order.total}</span>
                    <span className="bg-muted px-3 py-1 text-xs uppercase tracking-widest text-zinc-400">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
