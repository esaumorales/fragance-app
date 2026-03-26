"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string | number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew?: boolean;
}

export default function ProductCard({ id, slug, name, brand, price, image, isNew, stock = 10 }: ProductCardProps & { stock?: number }) {
  const { addItem } = useCart();
  
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: String(id), name, price: Number(price), size: "100ml", qty: 1, stock, image });
  };
  return (
    <div className="group cursor-pointer flex flex-col w-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6">
        {isNew && (
          <div className="absolute top-3 left-3 z-20 bg-primary text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1">
            Nuevo
          </div>
        )}
        <Link href={`/perfumes/${slug}`} className="absolute inset-0 z-10" aria-label={`Ver detalle de ${name}`} />
        <img 
          src={image} 
          alt={name}
          className="object-contain p-4 w-full h-full opacity-90 transition-opacity duration-300 group-hover:opacity-100" 
        />
        
        {/* Quick Add Button */}
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button 
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-white text-black uppercase text-xs tracking-widest font-bold py-3 hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Icon icon="lucide:shopping-bag" width={16} />
            Añadir
          </button>
        </div>
      </div>
      
      <div className="text-center relative">
        <p className="text-primary text-xs uppercase tracking-widest mb-1">{brand}</p>
        <Link href={`/perfumes/${slug}`}>
          <h3 className="font-playfair text-lg mb-1 hover:text-primary transition-colors">{name}</h3>
        </Link>
        <p className="text-zinc-400 font-light text-sm">S/ {price.toFixed(2)}</p>
      </div>
    </div>
  );
}
