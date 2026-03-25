"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();
  
  return (
    <button 
      onClick={() => addItem({
        id: product.id, 
        name: product.name, 
        price: Number(product.price), 
        size: product.size_ml + "ml", 
        qty: 1, 
        stock: product.stock, 
        image: product.image
      })}
      className="flex-1 bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={product.stock <= 0}
    >
      {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
    </button>
  );
}
