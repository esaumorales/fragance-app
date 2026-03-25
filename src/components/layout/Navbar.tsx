"use client"

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu Button - Left */}
        <button className="md:hidden p-2 text-zinc-300 hover:text-primary transition-colors">
          <Icon icon="lucide:menu" width={24} />
        </button>

        {/* Logo - Center (Mobile) / Left (Desktop) */}
        <Link href="/" className="flex-1 md:flex-none flex justify-center md:justify-start">
          <img src="/images/logo-leon.png" alt="Lyon Call" className="h-[3.25rem] w-auto mix-blend-screen" />
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center gap-8 mx-6">
          <Link href="/perfumes" className="text-sm uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Catálogo</Link>
          <Link href="/perfumes?category=hombre" className="text-sm uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Hombre</Link>
          <Link href="/perfumes?category=mujer" className="text-sm uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Mujer</Link>
        </nav>

        {/* Icons - Right */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="p-2 text-zinc-300 hover:text-primary transition-colors hidden sm:block">
            <Icon icon="lucide:user" width={20} />
          </Link>
          <Link href="/carrito" className="p-2 text-zinc-300 hover:text-primary transition-colors relative">
            <Icon icon="lucide:shopping-bag" width={20} />
            <span className="absolute top-1 right-1 bg-primary text-background text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
