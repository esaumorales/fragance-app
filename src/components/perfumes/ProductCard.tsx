import Link from "next/link";
import { Icon } from "@iconify/react";

interface ProductCardProps {
  id: string | number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew?: boolean;
}

export default function ProductCard({ id, slug, name, brand, price, image, isNew }: ProductCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col w-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] mb-6">
        {isNew && (
          <div className="absolute top-3 left-3 z-20 bg-[#d4af37] text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1">
            Nuevo
          </div>
        )}
        <Link href={`/perfumes/${slug}`} className="absolute inset-0 z-10" aria-label={`Ver detalle de ${name}`} />
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
        />
        
        {/* Quick Add Button */}
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button className="w-full bg-white text-black uppercase text-xs tracking-widest font-bold py-3 hover:bg-[#d4af37] hover:text-white transition-colors flex items-center justify-center gap-2">
            <Icon icon="lucide:shopping-bag" width={16} />
            Añadir
          </button>
        </div>
      </div>
      
      <div className="text-center relative">
        <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">{brand}</p>
        <Link href={`/perfumes/${slug}`}>
          <h3 className="font-playfair text-lg mb-1 hover:text-[#d4af37] transition-colors">{name}</h3>
        </Link>
        <p className="text-zinc-400 font-light text-sm">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
