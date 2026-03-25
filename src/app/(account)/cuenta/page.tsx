import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function CuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="bg-background text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-playfair text-4xl mb-8">Mi Cuenta</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="bg-card border border-zinc-800 p-6 flex flex-col gap-4">
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 font-bold mb-4">Navegación</h3>
            <Link href="/cuenta" className="text-primary text-sm hover:text-white transition-colors">Mi Perfil</Link>
            <Link href="/cuenta/pedidos" className="text-zinc-400 text-sm hover:text-white transition-colors">Mis Pedidos</Link>
            <Link href="/cuenta/direcciones" className="text-zinc-400 text-sm hover:text-white transition-colors">Mis Direcciones</Link>
            
            {profile?.role === 'admin' && (
              <Link href="/admin" className="text-emerald-500 text-sm hover:text-emerald-400 transition-colors mt-4 bg-emerald-950/20 p-3 border border-emerald-900/50 rounded-sm">
                Panel de Administración
              </Link>
            )}

            <LogoutButton className="mt-4 pt-4 border-t border-zinc-800" />
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 bg-card border border-zinc-800 p-8">
            <h2 className="font-playfair text-2xl mb-6 flex items-center gap-3">
              Datos Personales
              {profile?.role === 'admin' && (
                <span className="bg-primary text-black text-[10px] uppercase tracking-widest px-2 py-1 font-bold">Admin</span>
              )}
            </h2>
            
            <div className="space-y-6 font-light text-sm text-zinc-300">
              <div>
                <span className="block uppercase text-[10px] tracking-widest text-zinc-500 font-bold mb-1">Nombre Completo</span>
                <p className="text-lg">{profile?.full_name || 'No especificado'}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="block uppercase text-[10px] tracking-widest text-zinc-500 font-bold mb-1">Correo Electrónico</span>
                  <p>{user.email}</p>
                </div>
                <div>
                  <span className="block uppercase text-[10px] tracking-widest text-zinc-500 font-bold mb-1">Teléfono</span>
                  <p>{profile?.phone || 'Aún no registrado'}</p>
                </div>
              </div>
            </div>
            
            <button className="mt-10 border border-zinc-700 px-6 py-3 text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">
              Editar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
