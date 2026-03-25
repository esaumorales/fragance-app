import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-zinc-100">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
