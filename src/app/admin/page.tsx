import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect("/cuenta"); // unauthorized
  }

  // Fetch some summary data for admin (estadísticas básicas)
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

  return (
    <div className="bg-[#0f0f0f] text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-playfair text-4xl mb-2">Panel de Administración</h1>
            <p className="text-zinc-500 text-sm font-light">Control total sobre tu catálogo y ventas.</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/cuenta" className="border border-zinc-700 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
              Volver a Tienda
            </Link>
            <LogoutButton variant="outline" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tarjeta 1 */}
          <div className="bg-[#141414] border border-zinc-800 p-6 hover:border-[#d4af37]/30 transition-colors cursor-default">
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 font-bold mb-2">Total Usuarios</h3>
            <p className="font-playfair text-4xl text-[#d4af37]">{usersCount || 0}</p>
          </div>
          {/* Tarjeta 2 */}
          <div className="bg-[#141414] border border-zinc-800 p-6 hover:border-[#d4af37]/30 transition-colors cursor-default">
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 font-bold mb-2">Total Productos</h3>
            <p className="font-playfair text-4xl text-[#d4af37]">{productsCount || 0}</p>
          </div>
          {/* Tarjeta 3 */}
          <div className="bg-[#141414] border border-zinc-800 p-6 hover:border-[#d4af37]/30 transition-colors cursor-default">
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 font-bold mb-2">Total Pedidos</h3>
            <p className="font-playfair text-4xl text-[#d4af37]">{ordersCount || 0}</p>
          </div>
        </div>

        <div className="bg-[#141414] border border-zinc-800 p-12 text-center text-zinc-400">
          <Icon icon="lucide:layout-dashboard" width={48} className="mx-auto mb-6 opacity-20" />
          <h2 className="font-playfair text-2xl mb-4 text-white">¿Qué deseas gestionar hoy?</h2>
          <p className="font-light max-w-lg mx-auto mb-8">Selecciona una de las herramientas de administración para agregar nuevos productos, cambiar estados de envío de pedidos o editar contenido.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/admin/productos" className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-white transition-colors">
              Gestionar Catálogo
            </Link>
            <Link href="/admin/pedidos" className="border border-zinc-700 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
              Gestionar Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Para usar el iconify icon en server component
function Icon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.width} viewBox="0 0 24 24" className={props.className}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></g>
    </svg>
  );
}
