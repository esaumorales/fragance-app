"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-[#0f0f0f] text-zinc-100 min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#141414] border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="font-playfair text-2xl font-bold tracking-wider text-white inline-block mb-6">
            AURA<span className="text-[#d4af37]">.</span>
          </Link>
          <h1 className="font-playfair text-3xl mb-3">Recuperar Acceso</h1>
          <p className="text-zinc-400 font-light text-sm">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 ml-1" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <Icon icon="lucide:mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width={18} />
              <input 
                id="email"
                type="email" 
                placeholder="tu@email.com" 
                className="w-full bg-[#1a1a1a] border border-zinc-800 pl-10 p-3 text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-white" 
              />
            </div>
          </div>

          <button 
            type="button"
            className="w-full bg-white text-black py-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#d4af37] hover:text-white transition-colors mt-8"
          >
            Enviar Enlace
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-400 font-light flex items-center justify-center gap-2">
          <Icon icon="lucide:arrow-left" width={16} />
          <Link href="/auth/login" className="text-white hover:text-[#d4af37] transition-colors">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
