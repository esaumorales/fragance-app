import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories ( name ),
      product_images ( image_url, is_main )
    `)
    .eq('slug', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  const mainImage = product.product_images?.find((img: any) => img.is_main)?.image_url || product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80';
  const brandName = product.brands?.name || 'Lyon Call Exclusive';

  return (
    <div className="bg-background text-zinc-100 min-h-screen pb-24">
      {/* HEADER BREADCRUMB */}
      <div className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center text-xs font-light text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/perfumes" className="hover:text-white transition-colors">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* FOTOS */}
          <div className="space-y-4">
            <div className="relative aspect-4/5 w-full bg-white overflow-hidden group rounded-sm">
              {product.featured && (
                <div className="absolute top-4 left-4 z-10 bg-primary text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  Featured
                </div>
              )}
              <Image 
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* DETALLES */}
          <div className="flex flex-col justify-center">
            
            <p className="uppercase tracking-[0.2em] font-bold text-xs text-primary mb-4">
              {brandName}
            </p>
            
            <h1 className="font-playfair text-4xl lg:text-6xl mb-6">{product.name}</h1>
            
            <div className="text-2xl font-light mb-8">${Number(product.price).toFixed(2)}</div>
            
            <p className="text-zinc-400 font-light leading-relaxed mb-10 text-sm">
              {product.description}
            </p>

            <div className="space-y-8 mb-12">
              <div className="py-6 border-y border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Familia Olfativa</span>
                  <span className="text-sm font-light capitalize">{product.categories?.name || 'Fragancia'}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Tamaño</span>
                  <span className="text-sm font-light">{product.size_ml} ml</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Stock</span>
                  <span className="text-sm font-light">{product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton product={{...product, image: mainImage}} />
              
              <button className="flex items-center justify-center p-4 border border-zinc-800 hover:border-primary hover:text-primary transition-colors group">
                <Icon icon="lucide:heart" width={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <Icon icon="lucide:truck" width={16} />
                <span className="font-light">Envío premium gratis en pedidos superiores a $200.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <Icon icon="lucide:shield-check" width={16} />
                <span className="font-light">100% original garantizado. Compra segura.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
