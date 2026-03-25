import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DireccionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Obtener direcciones del usuario
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div className="bg-[#0f0f0f] text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-playfair text-4xl">Mis Direcciones</h1>
          <Link href="/cuenta" className="border border-zinc-700 px-6 py-2 text-xs uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
            Volver
          </Link>
        </div>

        <div className="bg-[#141414] border border-zinc-800 p-8">
          {(!addresses || addresses.length === 0) ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 font-light mb-6">No tienes ninguna dirección de envío registrada.</p>
              <button className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-white transition-colors">
                Añadir Dirección
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-zinc-800 p-6 flex flex-col justify-between hover:border-[#d4af37]/50 transition-colors">
                  <div>
                    {addr.is_default && (
                      <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                        Predeterminada
                      </span>
                    )}
                    <p className="text-white font-medium mb-1">{addr.recipient_name}</p>
                    <p className="text-zinc-400 text-sm font-light leading-relaxed">
                      {addr.line1} <br/>
                      {addr.line2 && <>{addr.line2}<br/></>}
                      {addr.city}, {addr.region} {addr.postal_code}<br/>
                      {addr.country}
                    </p>
                    <p className="text-zinc-500 text-xs mt-4">Tel: {addr.phone}</p>
                  </div>
                  <div className="flex gap-4 mt-6 pt-4 border-t border-zinc-800">
                    <button className="text-xs uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors">Editar</button>
                    <button className="text-xs uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">Eliminar</button>
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
