"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Correo o contraseña incorrectos");
        setIsLoading(false);
        return;
      }

      // Refresh data so Next.js middleware gets the new session cookie
      router.refresh();
      // Redirect to catalog or account
      router.push("/perfumes");
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error inesperado al iniciar sesión.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-zinc-100 min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-card border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="font-playfair text-2xl font-bold tracking-wider text-white inline-block mb-6">
            LYON CALL
          </Link>
          <h1 className="font-playfair text-3xl mb-3">Bienvenido</h1>
          <p className="text-zinc-400 font-light text-sm">
            Ingresa a tu cuenta para continuar tu experiencia.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm p-3 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 ml-1" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <Icon icon="lucide:mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width={18} />
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com" 
                className="w-full bg-muted border border-zinc-800 pl-10 p-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2 ml-1">
              <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold" htmlFor="password">
                Contraseña
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-zinc-500 hover:text-primary transition-colors">
                ¿La olvidaste?
              </Link>
            </div>
            <div className="relative">
              <Icon icon="lucide:lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width={18} />
              <input 
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-muted border border-zinc-800 pl-10 p-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-400 font-light">
          ¿Aún no tienes una firma olfativa?{" "}
          <Link href="/auth/register" className="text-white hover:text-primary font-medium transition-colors">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
