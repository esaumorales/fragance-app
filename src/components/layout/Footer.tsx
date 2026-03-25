import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-background py-12 text-zinc-400">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src="/images/logo-leon.png" alt="Lyon Call" className="h-20 w-auto mb-4 mix-blend-screen" />
          <p className="text-sm leading-relaxed mb-6 max-w-xs">
            Descubre tu firma personal. Perfumes exclusivos diseñados para resaltar tu esencia y estilo con notas inolvidables.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors"><Icon icon="lucide:instagram" width={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Icon icon="lucide:facebook" width={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Icon icon="lucide:twitter" width={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4 uppercase tracking-widest text-xs">LYON CALL</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/perfumes" className="hover:text-primary transition-colors">Todos los Perfumes</Link></li>
            <li><Link href="/perfumes?category=hombre" className="hover:text-primary transition-colors">Hombre</Link></li>
            <li><Link href="/perfumes?category=mujer" className="hover:text-primary transition-colors">Mujer</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4 uppercase tracking-widest text-xs">Ayuda</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:text-primary transition-colors">Envíos y Devoluciones</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Guía de Tallas y Notas</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4 uppercase tracking-widest text-xs">Beneficios</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3 items-start">
              <Icon icon="lucide:shield-check" className="text-primary shrink-0 mt-0.5" width={18} />
              <span>Garantía de Autenticidad 100% Originales.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Icon icon="lucide:truck" className="text-primary shrink-0 mt-0.5" width={18} />
              <span>Envío Gratis en compras mayores a $100.</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-800 text-xs text-center">
        &copy; {new Date().getFullYear()} LYON CALL Fragances. Todos los derechos reservados.
      </div>
    </footer>
  );
}
