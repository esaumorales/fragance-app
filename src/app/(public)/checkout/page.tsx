"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="bg-background text-zinc-100 min-h-screen">
      
      {/* HEADER SIMPLE (Sin navbar para evitar fuga) */}
      <header className="border-b border-zinc-800 bg-background py-6 text-center">
        <Link href="/" className="font-playfair text-xl font-bold tracking-wider text-white">
          LYON CALL
        </Link>
      </header>
      
      <div className="container mx-auto px-4 max-w-6xl py-12 flex flex-col-reverse lg:flex-row gap-16">
        
        {/* FORMULARIO DE CHECKOUT (Single Page Checkout) */}
        <div className="flex-1">
          <h1 className="font-playfair text-3xl font-bold mb-10">Finalizar Compra</h1>
          
          <form className="space-y-12">
            
            {/* PASO 1: DATOS */}
            <section>
              <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-xs flex items-center justify-center">1</span>
                Datos de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input type="email" placeholder="Correo electrónico *" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <input type="text" placeholder="Nombre *" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <input type="text" placeholder="Apellido *" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <input type="tel" placeholder="Teléfono" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* PASO 2: DIRECCIÓN */}
            <section>
              <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-xs flex items-center justify-center">2</span>
                Dirección de Envío
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input type="text" placeholder="Calle y número *" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <input type="text" placeholder="Ciudad *" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <input type="text" placeholder="Código Postal *" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* PASO 3: PAGO */}
            <section>
              <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-xs flex items-center justify-center">3</span>
                Método de Pago
              </h2>
              <div className="bg-muted border border-zinc-800 p-4 mb-4 flex items-center justify-between cursor-pointer border-primary">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-primary bg-black"></div>
                  <span className="text-sm">Tarjeta de Crédito / Débito</span>
                </div>
                <div className="flex gap-2">
                   <Icon icon="logos:visa" width={32} />
                   <Icon icon="logos:mastercard" width={24} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 border border-t-0 border-zinc-800 bg-card -mt-4 mb-4 pt-8">
                <div className="col-span-2">
                  <input type="text" placeholder="Número de Tarjeta" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                   <input type="text" placeholder="MM/YY" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                   <input type="text" placeholder="CVC" className="w-full bg-muted border border-zinc-800 p-3 text-sm focus:border-primary focus:outline-none transition-colors" />
                </div>
              </div>
              
              <button 
                type="button"
                className="w-full bg-white text-black py-4 uppercase tracking-widest text-sm font-bold mt-8 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); alert('¡Simulación de compra exitosa!'); }}
              >
                <Icon icon="lucide:lock" />
                Pagar $310.00
              </button>
            </section>
          </form>
        </div>

        {/* RESUMEN DE LA ORDEN */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-card border border-zinc-800 p-6 sticky top-8">
            <h2 className="font-playfair text-xl font-bold mb-6">En tu carrito</h2>
            
            <div className="flex flex-col gap-4 mb-6 border-b border-zinc-800 pb-6">
              {[
                { name: "Noir Absolu", size: "100ml", price: 120, qty: 1, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80" },
                { name: "Velvet Rose", size: "50ml", price: 95, qty: 2, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-muted shrink-0">
                    <img src={item.img} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-playfair text-sm">{item.name}</h3>
                    <p className="text-zinc-500 text-xs">Cant: {item.qty} | {item.size}</p>
                  </div>
                  <div className="font-medium text-sm">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm font-light text-zinc-300 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$310.00</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-primary">Gratis</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t border-zinc-800 pt-4">
              <span className="text-base font-medium">Total a pagar</span>
              <span className="text-2xl font-bold font-playfair text-white">$310.00</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
