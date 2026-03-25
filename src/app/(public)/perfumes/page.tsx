import { createClient } from "@/lib/supabase/server";
import { Icon } from "@iconify/react";
import ProductCard from "@/components/perfumes/ProductCard";

// Next.js config for searchParams
export const dynamic = 'force-dynamic';

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const supabase = await createClient();
  
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const activeCategory = params?.category || "todos";

  // Fetch products with their brand and main image
  let query = supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      price,
      isNew:featured,
      brands ( name ),
      categories ( slug ),
      product_images ( image_url )
    `)
    .eq('active', true);

  if (activeCategory !== "todos") {
    // Note: Assuming gender column is mapped to 'hombre', 'mujer', 'unisex'
    query = query.eq('gender', activeCategory === 'hombre' ? 'men' : activeCategory === 'mujer' ? 'women' : 'unisex');
  }

  const { data: dbProducts, error } = await query;

  // Map database products to the ProductCard structure
  const products = (dbProducts || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brands?.name || 'AURA Exclusive',
    price: p.price,
    image: p.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80',
    isNew: p.isNew
  }));

  return (
    <div className="bg-[#0f0f0f] text-zinc-100 min-h-screen pt-8 pb-24">
      
      {/* HEADER CATÁLOGO */}
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center py-12 border-b border-zinc-800">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">La Colección</h1>
          <p className="text-zinc-400 font-light max-w-xl mx-auto">Selección exclusiva de fragancias para cada personalidad.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR FILTROS (Desktop) */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-xl font-playfair font-semibold">
              <Icon icon="lucide:sliders-horizontal" />
              <span>Filtros</span>
            </div>

            <div className="mb-8">
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 font-bold mb-4">Categoría</h3>
              <ul className="space-y-3 font-light text-sm max-w-[200px]">
                {["todos", "hombre", "mujer", "unisex"].map(cat => (
                  <li key={cat}>
                    <a 
                      href={`/perfumes?category=${cat}`}
                      className={`flex capitalize items-center justify-between w-full hover:text-[#d4af37] transition-colors ${activeCategory === cat ? "text-[#d4af37] font-medium" : "text-zinc-300"}`}
                    >
                      <span>{cat}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 font-bold mb-4">Nota importante</h3>
              <p className="text-xs text-zinc-400 font-light">
                Para el MVP, la barra de filtros ha sido conectada con los parámetros de la URL para demostración.
              </p>
            </div>
          </div>
        </aside>

        {/* GRID PRODUCTOS */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8 text-sm text-zinc-400 border-b border-zinc-800 pb-4">
            <span>Mostrando {products.length} resultados</span>
          </div>

          {!products.length ? (
            <div className="text-center py-20 text-zinc-500">
              <p className="mb-4">No hay productos disponibles en esta categoría.</p>
              <p className="text-xs">Usa el script seed.sql en Supabase para insertar productos de prueba.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product: any) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
