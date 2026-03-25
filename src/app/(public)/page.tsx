"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          brands ( name ),
          product_images ( image_url, is_main )
        `)
        .eq('featured', true)
        .eq('active', true)
        .limit(4);

      if (data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brands?.name || 'AURA Exclusive',
          price: p.price,
          image: p.product_images?.find((img: any) => img.is_main)?.image_url || p.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80'
        }));
        setFeaturedProducts(mapped);
      }
    };
    
    fetchFeatured();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#0f0f0f] text-zinc-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] flex items-center justify-center">
        {/* Usamos un div con background en lugar de next/image para mayor simpleza en el snippet, 
            pero idealmente con next/image y objectFit cover. */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1615486511484-92e172fc34ea?auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-0" />
        
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl"
          {...fadeIn}
        >
          <span className="text-[#d4af37] text-sm uppercase tracking-[0.3em] font-semibold mb-6">Colección 2026</span>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold leading-tight mb-6">
            Encuentra tu <br/><span className="italic font-light">aroma ideal</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl font-light mb-10 max-w-xl">
            Descubre fragancias exclusivas diseñadas para evocar emociones, estilo y confianza.
          </p>
          <Link 
            href="/perfumes" 
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black text-sm uppercase tracking-widest font-semibold overflow-hidden transition-all hover:bg-[#d4af37] hover:text-white"
          >
            Explorar Perfumes
          </Link>
        </motion.div>
      </section>

      {/* 2. CATEGORÍAS */}
      <section className="py-24 px-4 bg-[#141414]">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6 w-full h-full"
          >
            {[
              { title: "Hombre", image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80" },
              { title: "Mujer", image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80" },
              { title: "Unisex", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80" }
            ].map((cat, idx) => (
              <Link href={`/perfumes?category=${cat.title.toLowerCase()}`} key={idx} className="relative group overflow-hidden h-96 flex-1 flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <h3 className="relative z-10 font-playfair text-3xl font-bold tracking-widest uppercase text-white">{cat.title}</h3>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. DESTACADOS */}
      <section className="py-24 px-4 container mx-auto" id="featured">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-playfair text-4xl font-bold mb-4">Favoritos del Mes</h2>
          <div className="w-12 h-0.5 bg-[#d4af37]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <Link href={`/perfumes/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] mb-6 block">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-black uppercase text-xs tracking-widest font-bold py-3 hover:bg-[#d4af37] hover:text-white transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </Link>
              <div className="text-center">
                <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">{product.brand}</p>
                <h3 className="font-playfair text-xl mb-2">{product.name}</h3>
                <p className="text-zinc-400 font-light">${product.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
          
          {featuredProducts.length === 0 && (
            <div className="col-span-full text-center text-zinc-500 py-10">
              <p>Cargando fragancias exclusivas...</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-16">
          <Link href="/perfumes" className="border border-zinc-700 px-8 py-3 text-sm uppercase tracking-widest font-medium hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
            Ver Colección Completa
          </Link>
        </div>
      </section>

      {/* 4. BENEFICIOS */}
      <section className="py-20 border-t border-zinc-800 bg-[#0f0f0f]">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: "lucide:award", title: "100% Originales", desc: "Garantizamos la autenticidad de cada frasco que llega a tus manos." },
            { icon: "lucide:truck", title: "Envío Rápido", desc: "Entrega express gratuita en pedidos superiores a $100." },
            { icon: "lucide:refresh-ccw", title: "Garantía de Autor", desc: "Devoluciones sin costo si el aroma no conecta contigo." }
          ].map((benefit, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 border border-zinc-800/50 hover:border-[#d4af37]/50 transition-colors"
            >
              <Icon icon={benefit.icon} className="text-[#d4af37] mb-6" width={32} />
              <h3 className="font-playfair text-xl mb-3">{benefit.title}</h3>
              <p className="text-zinc-400 font-light text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
