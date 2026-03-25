"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Registrar usuario con datos extras
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Si se requiere comprobación de email en Supabase, la sesión puede ser nula temporalmente
      if (data?.user && data.session === null) {
        setSuccess(true);
      } else if (data?.session) {
        router.refresh();
        router.push("/perfumes");
      }
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al registrarte.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#0f0f0f] text-zinc-100 min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#141414] border border-zinc-800 p-12 text-center">
          <Icon icon="lucide:mail-check" className="mx-auto text-[#d4af37] mb-6" width={48} />
          <h2 className="font-playfair text-2xl font-bold mb-4">Revisa tu correo</h2>
          <p className="text-zinc-400 text-sm font-light mb-8">
            Te hemos enviado un enlace a <strong>{email}</strong> para confirmar tu cuenta. Por favor haz clic en él para activar tu acceso a AURA.
          </p>
          <Link href="/" className="text-sm uppercase tracking-widest border border-zinc-700 px-6 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] text-zinc-100 min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#141414] border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="font-playfair text-2xl font-bold tracking-wider text-white inline-block mb-6">
            AURA<span className="text-[#d4af37]">.</span>
          </Link>
          <h1 className="font-playfair text-3xl mb-3">Únete a la Exclusividad</h1>
          <p className="text-zinc-400 font-light text-sm">
            Crea tu cuenta y descubre un mundo de aromas diseñados solo para ti.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm p-3 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 ml-1" htmlFor="firstName">
                Nombre
              </label>
              <input 
                id="firstName"
                type="text" 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-zinc-800 p-3 text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-white" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 ml-1" htmlFor="lastName">
                Apellido
              </label>
              <input 
                id="lastName"
                type="text" 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-zinc-800 p-3 text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-white" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 ml-1" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <Icon icon="lucide:mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width={16} />
              <input 
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" 
                className="w-full bg-[#1a1a1a] border border-zinc-800 pl-10 p-3 text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-white" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 ml-1" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <Icon icon="lucide:lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width={16} />
              <input 
                id="password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres" 
                className="w-full bg-[#1a1a1a] border border-zinc-800 pl-10 p-3 text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-white" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#d4af37] hover:text-white transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-400 font-light">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="text-white hover:text-[#d4af37] font-medium transition-colors">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
