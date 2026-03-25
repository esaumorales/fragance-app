"use client"
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  variant?: "text" | "outline";
}

export default function LogoutButton({ className = "", variant = "text" }: Props) {
  const router = useRouter();
  const supabase = createClient();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  const baseStyles = "transition-colors text-left";
  const textStyles = "text-red-500 hover:text-red-400 text-sm";
  const outlineStyles = "border border-red-900/50 text-red-500 uppercase tracking-widest text-xs px-6 py-3 hover:bg-red-950/30 font-bold";

  return (
    <button onClick={handleLogout} className={`${baseStyles} ${variant === "outline" ? outlineStyles : textStyles} ${className}`}>
      Cerrar Sesión
    </button>
  );
}
