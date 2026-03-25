import Link from "next/link";

export default function AdminUsuariosPage() {
  return (
    <div className="bg-background text-zinc-100 min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h1 className="font-playfair text-4xl mb-4">Gestión de Usuarios</h1>
        <p className="text-zinc-500 font-light mt-8">Próximamente podrás ver detalles avanzados de tus clientes aquí.</p>
        <div className="mt-8">
          <Link href="/admin" className="text-xs uppercase tracking-widest text-primary font-bold hover:text-white transition-colors">
            ← Volver al Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
