"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function CarritoPage() {
  const { items, updateQty, removeItem, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-background text-zinc-100 min-h-screen py-16 flex items-center justify-center">
        <Icon icon="lucide:loader" className="animate-spin text-zinc-500" width={40} />
      </div>
    );
  }

  return (
    <div className="bg-background text-zinc-100 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-playfair text-4xl font-bold mb-10 text-center">Tu Carrito</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-24 bg-card border border-zinc-800 flex flex-col items-center">
            <Icon icon="lucide:shopping-bag" width={64} className="text-zinc-600 mb-6" />
            <h2 className="text-3xl font-playfair mb-4">Tu carrito está vacío</h2>
            <p className="text-zinc-400 font-light mb-10 max-w-md mx-auto">Parece que aún no has descubierto tu firma personal. Explora nuestra exquisita colección de fragancias y encuentra el aroma que te define.</p>
            <Link 
              href="/perfumes" 
              className="bg-primary text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* LISTA DE PRODUCTOS */}
            <div className="flex-1">
              <div className="border-b border-zinc-800 pb-4 mb-6 hidden sm:grid grid-cols-12 text-xs uppercase tracking-widest text-zinc-500 font-bold font-sans">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Precio</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="flex flex-col gap-8">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b border-zinc-800/50 pb-8">
                    <div className="col-span-12 sm:col-span-6 flex gap-6 items-center">
                      <div className="w-24 h-32 bg-white shrink-0 p-2 rounded-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain opacity-80" />
                      </div>
                      <div>
                        <h3 className="font-playfair text-xl mb-1">{item.name}</h3>
                        <p className="text-zinc-500 text-sm font-light mb-2">Tamaño: {item.size}</p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-zinc-400 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                          <Icon icon="lucide:trash-2" width={14} /> Eliminar
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-4 sm:col-span-2 text-left sm:text-center text-zinc-300 font-light hidden sm:block">
                      S/ {item.price.toFixed(2)}
                    </div>
                    
                    <div className="col-span-12 sm:col-span-2 flex justify-start sm:justify-center">
                      <div className="flex items-center border border-zinc-700 px-3 py-1">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400"
                        >
                          <Icon icon="lucide:minus" width={14} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className="text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400"
                        >
                          <Icon icon="lucide:plus" width={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-12 sm:col-span-2 text-right font-medium text-lg hidden sm:block">
                      S/ {(item.price * item.qty).toFixed(2)}
                    </div>
                    
                    {/* Resumen Móvil */}
                    <div className="col-span-12 flex justify-between items-center sm:hidden mt-2">
                      <span className="text-zinc-400 font-light">S/ {item.price.toFixed(2)} c/u</span>
                      <span className="font-medium text-lg">S/ {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RESUMEN DE PAGO */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-card border border-zinc-800 p-8">
                <h2 className="font-playfair text-2xl font-bold mb-6">Resumen</h2>
                
                <div className="space-y-4 text-sm font-light text-zinc-300 mb-8 border-b border-zinc-800 pb-8">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>S/ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-primary">Gratis</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold font-playfair">S/ {cartTotal.toFixed(2)}</span>
                </div>
                
                <Link 
                  href="/checkout"
                  className="w-full bg-white text-black py-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  Proceder al Checkout
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 text-xs">
                  <Icon icon="lucide:lock" width={14} />
                  <span>Pago Seguro y Encriptado</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
